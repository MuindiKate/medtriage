from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime


class PatientData(BaseModel):
    age: int
    gender: str
    weight_kg: Optional[float] = None


class Vitals(BaseModel):
    temperature_c: Optional[float] = None
    heart_rate: Optional[int] = None
    respiratory_rate: Optional[int] = None
    oxygen_saturation: Optional[float] = None


class TriageRequestSchema(BaseModel):
    patient: PatientData
    vitals: Optional[Vitals] = None
    symptoms: list[str]
    duration_days: Optional[int] = None
    history: Optional[list[str]] = []


class DifferentialDiagnosis(BaseModel):
    condition: str
    likelihood: str
    icd_code: Optional[str] = None


class TriageResponseSchema(BaseModel):
    id: UUID
    triage_level: str
    confidence: float
    differentials: list[DifferentialDiagnosis]
    immediate_actions: list[str]
    reasoning: str
    uncertainty_flags: list[str]
    disclaimer: str
    created_at: datetime