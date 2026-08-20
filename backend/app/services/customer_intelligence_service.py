"""Unified read-only customer intelligence view for the API."""

from typing import Any

from .customer_service import get_customer_by_id
from .recommendation_service import get_customer_recommendation
from .rfm_service import get_customer_rfm
from .signal_service import get_categorized_customer_signals


PROFILE_FIELDS = (
    "Customer_ID",
    "Location_ID",
    "Customer_Segment",
    "Relationship_Start_Date",
    "Credit_Limit",
    "Payment_Terms_Days",
    "Customer_Status",
    "Source_System",
    "Sales_Rep_ID",
)


def get_customer_intelligence(customer_id: str) -> dict[str, Any] | None:
    """Aggregate the existing customer and recommendation service outputs."""
    customer = get_customer_by_id(customer_id)
    if customer is None:
        return None

    recommendation = get_customer_recommendation(customer_id)
    if recommendation is None:
        return None
    signals = get_categorized_customer_signals(customer_id)
    if signals is None:
        return None
    rfm = get_customer_rfm(customer_id)

    return {
        "customer_id": customer_id,
        "profile": {
            field: customer[field]
            for field in PROFILE_FIELDS
            if field in customer
        },
        "commercial_summary": {
            "historical_total_revenue": customer.get("historical_total_revenue"),
            "historical_invoice_count": customer.get("historical_invoice_count"),
        },
        "rfm": rfm if rfm is not None else {"available": False},
        "recommendation": recommendation,
        "signals": signals,
        "evidence": recommendation["evidence"],
    }
