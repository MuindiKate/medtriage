from fastapi import APIRouter, HTTPException
from app.schemas.triage import TriageRequestSchema, TriageResponseSchema
from app.services.triage import perform_triage

router = APIRouter()


@router.post("/triage", response_model=TriageResponseSchema)
async def triage_patient(request: TriageRequestSchema):
    """
    Submit patient symptoms and vitals for AI-powered triage assessment.
    Returns urgency level, differential diagnoses, and recommended actions
    grounded in WHO IMCI and Kenya Clinical Guidelines.
    """
    try:
        response = await perform_triage(request)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))