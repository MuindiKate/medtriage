from app.schemas.triage import TriageRequestSchema


# Minimum viable vitals for a confident assessment
CRITICAL_SYMPTOMS = [
    "unconscious", "not breathing", "no pulse", "severe bleeding",
    "convulsions", "seizure", "collapsed", "unresponsive"
]

EMERGENCY_OVERRIDE_SYMPTOMS = [
    "chest pain", "difficulty breathing", "chest indrawing",
    "not feeding", "poor feeding", "stiff neck", "bulging fontanelle"
]


def validate_input(request: TriageRequestSchema) -> list[str]:
    """
    Validate incoming triage request.
    Returns a list of validation errors — empty list means valid.
    """
    errors = []

    if not request.symptoms:
        errors.append("At least one symptom must be provided.")

    if request.patient.age < 0 or request.patient.age > 120:
        errors.append("Patient age must be between 0 and 120.")

    if request.patient.gender.lower() not in ["male", "female", "other", "unknown"]:
        errors.append("Gender must be male, female, other, or unknown.")

    if request.patient.weight_kg and request.patient.weight_kg <= 0:
        errors.append("Weight must be a positive number.")

    if request.vitals:
        v = request.vitals
        if v.temperature_c and not (30.0 <= v.temperature_c <= 45.0):
            errors.append("Temperature out of plausible range (30–45°C).")
        if v.heart_rate and not (20 <= v.heart_rate <= 300):
            errors.append("Heart rate out of plausible range (20–300 bpm).")
        if v.respiratory_rate and not (5 <= v.respiratory_rate <= 100):
            errors.append("Respiratory rate out of plausible range.")
        if v.oxygen_saturation and not (50.0 <= v.oxygen_saturation <= 100.0):
            errors.append("Oxygen saturation out of plausible range (50–100%).")

    return errors


def compute_uncertainty_flags(request: TriageRequestSchema) -> list[str]:
    """
    Identify missing information that would materially change the assessment.
    """
    flags = []

    if not request.vitals:
        flags.append("No vitals provided — assessment confidence is reduced.")
    else:
        v = request.vitals
        if not v.temperature_c:
            flags.append("Temperature not provided — fever assessment limited.")
        if not v.oxygen_saturation:
            flags.append("O2 saturation not provided — respiratory severity uncertain.")
        if not v.heart_rate:
            flags.append("Heart rate not provided — shock assessment limited.")
        if not v.respiratory_rate:
            flags.append("Respiratory rate not provided — breathing severity uncertain.")

    if not request.duration_days:
        flags.append("Symptom duration not provided — chronicity unknown.")

    if not request.history:
        flags.append("No medical history provided — underlying conditions unknown.")

    if request.patient.age < 1 and not request.patient.weight_kg:
        flags.append("Weight critical for neonate dosing — not provided.")

    return flags


def check_emergency_override(request: TriageRequestSchema) -> bool:
    """
    Check if any symptom should force EMERGENCY regardless of AI output.
    Safety net: never downgrade a critical presentation.
    """
    symptoms_lower = [s.lower() for s in request.symptoms]

    for critical in CRITICAL_SYMPTOMS:
        if any(critical in s for s in symptoms_lower):
            return True

    return False


def compute_confidence_adjustment(
    base_confidence: float,
    uncertainty_flags: list[str],
    request: TriageRequestSchema
) -> float:
    """
    Adjust confidence score based on data completeness.
    More missing data = lower confidence.
    """
    adjustment = 0.0

    # Penalize for missing vitals
    if not request.vitals:
        adjustment -= 0.15
    else:
        v = request.vitals
        if not v.temperature_c:
            adjustment -= 0.05
        if not v.oxygen_saturation:
            adjustment -= 0.05
        if not v.heart_rate:
            adjustment -= 0.03
        if not v.respiratory_rate:
            adjustment -= 0.03

    # Penalize for missing history
    if not request.history:
        adjustment -= 0.05

    # Penalize for missing duration
    if not request.duration_days:
        adjustment -= 0.03

    # Apply adjustment, floor at 0.1, ceiling at 1.0
    adjusted = base_confidence + adjustment
    return round(max(0.1, min(1.0, adjusted)), 2)