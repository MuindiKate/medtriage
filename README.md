# MedTriage API 🏥

> AI-powered medical symptom triage for community health workers in sub-Saharan Africa.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Python](https://img.shields.io/badge/python-3.12-green)
![FastAPI](https://img.shields.io/badge/FastAPI-latest-teal)
![License](https://img.shields.io/badge/license-MIT-orange)

---

## The Problem

Kenya has **1 doctor per 10,000 people** — 10x below the WHO recommended ratio. The gap is filled by Community Health Workers (CHWs): minimally trained, working in rural health posts, making triage decisions with no decision support tools.

The downstream effects are brutal. Serious conditions like sepsis and severe pneumonia get sent home. Minor conditions occupy scarce hospital beds. Both outcomes cost lives.

Existing tools fail this context:

| Tool | Why it fails |
|---|---|
| WebMD / Ada Health | Built for Western markets, requires reliable internet, not designed for CHW workflows |
| eCHIS (Kenya's system) | Data collection only — no clinical decision support |
| IBM Watson Health | Black box, enterprise pricing, no explainability |
| Generic LLM prompting | Hallucination risk, no grounding in clinical guidelines |

**The gap:** no affordable, explainable, API-first triage tool built for CHW workflows in low-resource settings.

---

## The Solution

A **production-grade REST API** that CHW-facing applications integrate into. The CHW enters what they observe. The API returns what to do — and critically, *why*.

### Sample Request
```json
{
  "patient": {
    "age": 4,
    "gender": "female",
    "weight_kg": 14
  },
  "vitals": {
    "temperature_c": 39.8,
    "heart_rate": 128,
    "respiratory_rate": 34,
    "oxygen_saturation": 94
  },
  "symptoms": ["fever", "difficulty breathing", "chest indrawing", "poor feeding"],
  "duration_days": 2,
  "history": ["no prior illness", "no vaccinations recorded"]
}
```

### Sample Response
```json
{
  "triage_level": "EMERGENCY",
  "confidence": 0.87,
  "differentials": [
    { "condition": "Severe Pneumonia", "likelihood": "high", "icd_code": "J18.9" },
    { "condition": "Sepsis", "likelihood": "moderate", "icd_code": "A41.9" }
  ],
  "immediate_actions": [
    "Do not send home",
    "Administer oxygen if available",
    "Refer to hospital within 1 hour"
  ],
  "reasoning": "Child presents with high fever, tachycardia, tachypnea, and chest indrawing. Oxygen saturation below 95% with respiratory distress in a child under 5 meets WHO criteria for severe pneumonia. Immediate referral required.",
  "uncertainty_flags": [],
  "disclaimer": "This assessment is decision support only. Clinical judgment and professional review are required before any action."
}
```

---

## What Makes This Different

**1. Explainability as a first-class feature**
Every response includes the full reasoning chain. In a clinical context, *why* matters as much as *what*. A CHW who can explain their referral decision is more likely to act on it.

**2. RAG over hallucination**
Responses are grounded in a curated medical knowledge base — WHO IMCI guidelines, Kenya Clinical Guidelines, standard triage protocols. The model retrieves relevant knowledge *first*, then reasons over it. This is the difference between "AI said so" and "this is grounded in WHO protocol."

**3. Responsible AI guardrails baked in**
Uncertainty flagging is non-negotiable. If the symptom pattern is ambiguous, the API says so explicitly. Confidence scores are surfaced. The disclaimer is enforced on every single response.

**4. Built for the actual context**
Lightweight responses for low-bandwidth environments. Designed for CHW apps, not hospital EHR systems. API-first architecture means any CHW app, NGO tool, or government system can integrate it.

**5. API-first infrastructure**
Not a consumer app — an infrastructure layer. Build the API well, and 10 different front-ends can use it.

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                  CHW Application                     │
└─────────────────────┬───────────────────────────────┘
                      │ HTTPS + JWT
┌─────────────────────▼───────────────────────────────┐
│                   FastAPI Layer                      │
│         (Auth, Rate Limiting, Versioning)            │
└─────────────────────┬───────────────────────────────┘
                      │
          ┌───────────▼────────────┐
          │    Triage Service      │
          │  (orchestrates below)  │
          └───┬───────────────┬────┘
              │               │
┌─────────────▼──┐     ┌──────▼──────────────┐
│ Retrieval Layer │     │   Guardrails Layer   │
│  (pgvector +   │     │ (confidence scoring, │
│   embeddings)  │     │  uncertainty flags,  │
└─────────────┬──┘     │  disclaimer inject)  │
              │        └──────┬───────────────┘
              │               │
┌─────────────▼───────────────▼───────────────────────┐
│                  Claude (Anthropic API)               │
│         Reasons over retrieved knowledge +           │
│              structured patient data                 │
└─────────────────────────────────────────────────────┘
              │
┌─────────────▼───────────────────────────────────────┐
│              Knowledge Base (pgvector)               │
│   WHO IMCI Guidelines · Kenya Clinical Guidelines   │
│   Triage Protocols · ICD-10 Mappings                │
└─────────────────────────────────────────────────────┘
              │
┌─────────────▼───────────────────────────────────────┐
│                PostgreSQL + Redis                    │
│     (request logs, audit trail, response cache)     │
└─────────────────────────────────────────────────────┘
```

### The RAG Flow
```
Patient data arrives
       ↓
Convert symptoms + vitals to embedding query
       ↓
pgvector retrieves top-k relevant knowledge chunks
(e.g. "WHO criteria for severe pneumonia in under-5s")
       ↓
Build prompt: [retrieved knowledge] + [patient data] + [system instructions]
       ↓
Claude reasons and returns structured JSON
       ↓
Guardrails layer validates, scores confidence, injects flags
       ↓
Structured response returned to caller
```

---

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| API Framework | FastAPI | Async, auto-generates OpenAPI docs, perfect for a public API |
| Language | Python 3.12 | Best ecosystem for AI/ML, LangChain support |
| Primary Database | PostgreSQL 16 | Reliable structured storage for requests and audit logs |
| Vector Store | pgvector | Vector search inside PostgreSQL — no separate Pinecone needed |
| LLM | Anthropic Claude | Best-in-class reasoning, strong structured JSON output |
| Orchestration | LangChain | Manages RAG pipeline — retrieval, prompt building, response parsing |
| Caching | Redis | Cache embeddings and frequent patterns, rate limiting |
| Auth | JWT + API Keys | API-key flow for integrators, JWT for session-based access |
| Containerization | Docker + Docker Compose | Reproducible environment, one-command setup |
| Frontend (demo) | Next.js | Clean dashboard showing the API in action |

---

## Project Structure

```
medtriage/
├── backend/
│   ├── app/
│   │   ├── api/          # Route handlers
│   │   ├── core/         # Config, settings
│   │   ├── models/       # Database models
│   │   ├── schemas/      # Pydantic request/response shapes
│   │   └── services/     # Business logic
│   ├── Dockerfile
│   ├── requirements.txt
│   └── main.py
├── frontend/             # Next.js demo dashboard (Phase 6)
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## Getting Started

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Git](https://git-scm.com/)
- An [Anthropic API key](https://console.anthropic.com/)

### Setup

**1. Clone the repository**
```bash
git clone https://github.com/MuindiKate/medtriage.git
cd medtriage
```

**2. Configure environment variables**
```bash
cp .env.example .env
```

Open `.env` and fill in your values:
```env
POSTGRES_USER=medtriage
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=medtriage
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

**3. Start the entire stack**
```bash
docker compose up --build
```

This spins up PostgreSQL + pgvector, Redis, and the FastAPI app — all connected and ready.

**4. Verify it's running**

Open your browser:
- API root: http://localhost:8000
- Health check: http://localhost:8000/health
- Interactive docs: http://localhost:8000/docs

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | API info and version |
| GET | `/health` | Health check |
| POST | `/api/v1/triage` | Submit patient data, receive triage assessment *(Phase 3)* |
| GET | `/api/v1/triage/{id}` | Retrieve a previous assessment *(Phase 3)* |
| POST | `/api/v1/auth/token` | Get JWT token *(Phase 5)* |

Full interactive documentation available at `/docs` (Swagger UI) and `/redoc`.

---

## Build Phases

- [x] **Phase 1** — Project scaffold, Docker setup, FastAPI skeleton, PostgreSQL + Redis
- [ ] **Phase 2** — Medical knowledge base, ingestion pipeline, pgvector embeddings
- [ ] **Phase 3** — Core triage engine: RAG retrieval + Claude integration
- [ ] **Phase 4** — Responsible AI guardrails: confidence scoring, uncertainty flagging
- [ ] **Phase 5** — API hardening: JWT auth, rate limiting, versioning, audit logging
- [ ] **Phase 6** — Next.js demo frontend

---

## Responsible AI

This API is designed for use as **clinical decision support only** — not as a replacement for professional medical judgment. Every response includes:

- A confidence score surfacing model uncertainty
- Explicit uncertainty flags when symptom patterns are ambiguous
- A non-negotiable disclaimer recommending professional review
- Reasoning grounded in WHO and Kenya Clinical Guidelines, not raw model weights

This project takes the position that explainability is not optional in high-stakes AI applications. A black box is not acceptable in a clinical context.

---

## Context

Kenya has approximately 1 doctor per 10,000 people (WHO recommends 1 per 1,000). Community health workers fill this gap with minimal training and no decision support tools. This project is built for that context — not borrowed from Western healthtech and adapted, but designed from the ground up for low-resource, CHW-facing deployment.

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

---

## License

MIT

---

## Author

**Catherine Muindi**
Building at the intersection of AI and African healthcare infrastructure.

[GitHub](https://github.com/MuindiKate) · [LinkedIn](https://linkedin.com/in/katmuindi)

---

> *"Bad triage decisions cost lives. Better tooling changes that."*