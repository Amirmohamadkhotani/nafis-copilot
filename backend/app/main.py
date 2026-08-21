from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .services.customer_intelligence_service import get_customer_intelligence
from .services.customer_360_service import get_customer_360
from .services.customer_service import get_all_customers, get_customer_by_id
from .services.dashboard_service import get_dashboard_summary
from .services.recommendation_service import (
    ACTIONABLE_RECOMMENDATION_TYPES,
    get_all_recommendations,
    get_customer_recommendation,
)

app = FastAPI(
    title="Nafis Copilot API",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health_check():
    return {
        "status": "ok",
        "service": "nafis-copilot-api"
    }


@app.get("/api/customers")
def list_customers():
    return get_all_customers()


@app.get("/api/customers/{customer_id}")
def customer_detail(customer_id: str):
    customer = get_customer_by_id(customer_id)
    if customer is None:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer


@app.get("/api/customers/{customer_id}/recommendation")
def customer_recommendation(customer_id: str):
    recommendation = get_customer_recommendation(customer_id)
    if recommendation is None:
        raise HTTPException(status_code=404, detail="Customer not found")
    return recommendation


@app.get("/api/customers/{customer_id}/intelligence")
def customer_intelligence(customer_id: str):
    intelligence = get_customer_intelligence(customer_id)
    if intelligence is None:
        raise HTTPException(status_code=404, detail="Customer not found")
    return intelligence


@app.get("/api/customers/{customer_id}/360")
def customer_360(customer_id: str):
    result = get_customer_360(customer_id)
    if result is None:
        raise HTTPException(status_code=404, detail="Customer not found")
    return result


@app.get("/api/recommendations")
def recommendation_focus_list(type: str | None = None):
    if type is not None and type not in ACTIONABLE_RECOMMENDATION_TYPES:
        raise HTTPException(status_code=400, detail="Invalid recommendation type")
    return get_all_recommendations(type)


@app.get("/api/dashboard/summary")
def dashboard_summary():
    return get_dashboard_summary()
