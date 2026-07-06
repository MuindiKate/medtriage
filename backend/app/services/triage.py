import os
import json
import uuid
from datetime import datetime
from anthropic import Anthropic
from app.services.retrieval import retrieve_relevant_knowledge
from app.services.guardrails import (
    validate_input,
    compute_uncertainty_flags,
    check_emergency_override,
    compute_confidence_adjustment,
)
from app.services.audit import log_triage_request
from app.schemas.triage import TriageRequestSchema, TriageResponseSchema
from fastapi import HTTPException

client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

DISCLAIMER = (
    "This assessment is decision support only. "
    "Clinical judgment and professional review are required before any action."
)


def build_prompt(request: TriageRequestSchema, knowledge_chunks: list[dict]) -> str:
    """Build the grounded prompt from patient data + retrieved knowledge."""

    knowledge_text = "\n\n".join([
        f"[{chunk['source']} - {chunk['section']}]\n{chunk['content']}"
        for chunk in knowledge_chunks
    ])

    symptoms_text = ", ".join(request.symptoms)
    history_text = ", ".join(request.history) if request.history else "None reported"

    vitals_text = "Not provided"
    if request.vitals:
        v = request.vitals
        parts = []
        if v.temperature_c:
            parts.append(f"Temperature: {v.temperature_c}°C")
        if v.heart_rate:
            parts.append(f"Heart rate: {v.heart_rate} bpm")
        if v.respiratory_rate:
            parts.append(f"Respiratory rate: {v.respiratory_rate} breaths/min")
        if v.oxygen_saturation:
            parts.append(f"O2 saturation: {v.oxygen_saturation}%")
        vitals_text = ", ".join(parts)

    return f"""You are a clinical decision support system for community health workers in Kenya.
Your role is to assist with triage decisions based on WHO IMCI guidelines and Kenya Clinical Guidelines.
You must always recommend professional review. Never replace clinical judgment.

MEDICAL KNOWLEDGE BASE (retrieved relevant guidelines):
{knowledge_text}

PATIENT PRESENTATION:
- Age: {request.patient.age} years
- Gender: {request.patient.gender}
- Weight: {request.patient.weight_kg or 'Not provided'} kg
- Symptoms: {symptoms_text}
- Duration: {request.duration_days or 'Not specified'} days
- Vitals: {vitals_text}
- Medical history: {history_text}

Based strictly on the medical knowledge provided above, assess this patient and respond with a JSON object:
{{
    "triage_level": "EMERGENCY" | "URGENT" | "ROUTINE",
    "confidence": 0.0-1.0,
    "differentials": [
        {{"condition": "condition name", "likelihood": "high|moderate|low", "icd_code": "optional"}}
    ],
    "immediate_actions": ["action 1", "action 2"],
    "reasoning": "plain language explanation grounded in the guidelines above",
    "uncertainty_flags": ["flag any missing info that would change assessment"]
}}

Respond with valid JSON only. No preamble, no explanation outside the JSON."""


async def perform_triage(request: TriageRequestSchema) -> TriageResponseSchema:
    """Full triage pipeline: validate → retrieve → prompt → Claude → guardrails → log → response."""

    # Step 1 — Validate input
    validation_errors = validate_input(request)
    if validation_errors:
        raise HTTPException(
            status_code=422,
            detail={"validation_errors": validation_errors}
        )

    # Step 2 — Compute uncertainty flags BEFORE calling Claude
    uncertainty_flags = compute_uncertainty_flags(request)

    # Step 3 — Check emergency override
    force_emergency = check_emergency_override(request)

    # Step 4 — Build retrieval query
    query = f"patient symptoms: {', '.join(request.symptoms)}"
    if request.vitals and request.vitals.temperature_c:
        query += f" fever {request.vitals.temperature_c}°C"
    if request.patient.age < 5:
        query += " child under 5"

    # Step 5 — Retrieve relevant knowledge
    knowledge_chunks = await retrieve_relevant_knowledge(query, top_k=3)

    # Step 6 — Build grounded prompt
    prompt = build_prompt(request, knowledge_chunks)

    # Step 7 — Call Claude
    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        messages=[{"role": "user", "content": prompt}]
    )

    raw_response = message.content[0].text

    # Step 8 — Parse response
    try:
        parsed = json.loads(raw_response)
    except json.JSONDecodeError:
        parsed = {
            "triage_level": "URGENT",
            "confidence": 0.5,
            "differentials": [],
            "immediate_actions": ["Seek immediate professional medical review"],
            "reasoning": "Unable to parse AI response. Manual review required.",
            "uncertainty_flags": ["AI response parsing failed — do not rely on this assessment"]
        }

    # Step 9 — Apply emergency override if needed
    if force_emergency:
        parsed["triage_level"] = "EMERGENCY"
        uncertainty_flags.append(
            "Emergency override applied — critical symptom detected."
        )

    # Step 10 — Merge uncertainty flags from guardrails + Claude
    all_flags = uncertainty_flags + parsed.get("uncertainty_flags", [])

    # Step 11 — Adjust confidence based on data completeness
    base_confidence = float(parsed.get("confidence", 0.5))
    adjusted_confidence = compute_confidence_adjustment(
        base_confidence, all_flags, request
    )

    # Step 12 — Build final response
    response = TriageResponseSchema(
        id=uuid.uuid4(),
        triage_level=parsed["triage_level"],
        confidence=adjusted_confidence,
        differentials=parsed.get("differentials", []),
        immediate_actions=parsed.get("immediate_actions", []),
        reasoning=parsed.get("reasoning", ""),
        uncertainty_flags=all_flags,
        disclaimer=DISCLAIMER,
        created_at=datetime.utcnow(),
    )

    # Step 13 — Audit log every request
    await log_triage_request(
        request_data=request.model_dump(),
        response_data=response.model_dump(),
        triage_level=response.triage_level,
        confidence=response.confidence,
    )

    return response