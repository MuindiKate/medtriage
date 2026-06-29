from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.triage import router as triage_router

app = FastAPI(
    title="MedTriage API",
    description="AI-powered medical symptom triage for community health workers",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(triage_router, prefix="/api/v1")


@app.get("/")
async def root():
    return {
        "name": "MedTriage API",
        "version": "1.0.0",
        "status": "running",
    }


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "message": "MedTriage API is up and running",
    }