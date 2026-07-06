from fastapi import APIRouter, HTTPException, Request
from app.schemas.triage import TriageRequestSchema, TriageResponseSchema
from app.services.triage import perform_triage
from app.services.rate_limit import check_rate_limit

router = APIRouter()


@router.post("/triage", response_model=TriageResponseSchema)
async def triage_patient(request: TriageRequestSchema, req: Request):
    """
    Submit patient symptoms and vitals for AI-powered triage assessment.
    Returns urgency level, differential diagnoses, and recommended actions
    grounded in WHO IMCI and Kenya Clinical Guidelines.
    """
    # Rate limiting by IP address
    client_ip = req.client.host
    allowed, remaining = check_rate_limit(client_ip)

    if not allowed:
        raise HTTPException(
            status_code=429,
            detail="Rate limit exceeded. Maximum 10 requests per minute."
        )

    try:
        response = await perform_triage(request)
        return response
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))