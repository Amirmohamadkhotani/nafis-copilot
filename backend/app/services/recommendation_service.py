"""Service layer for customer recommendations."""

from typing import Any

from ...analytics.recommendation_engine import build_recommendation
from .customer_service import get_all_customers, get_customer_by_id


ACTIONABLE_RECOMMENDATION_TYPES = ("GROW", "PROTECT_FIX", "REDUCE_FOCUS")
PRIORITY_ORDER = {"Critical": 0, "High": 1, "Medium": 2, "Low": 3}
LIST_FIELDS = (
    "customer_id",
    "recommendation_type",
    "priority",
    "summary",
    "next_best_action",
    "confidence",
    "blocking_risks",
    "suspended_opportunities",
)


def get_customer_recommendation(customer_id: str) -> dict[str, Any] | None:
    """Build a recommendation response for an existing customer."""
    customer = get_customer_by_id(customer_id)
    if customer is None:
        return None

    return {
        "customer_id": customer_id,
        **build_recommendation(customer),
    }


def get_all_recommendations(
    recommendation_type: str | None = None,
) -> dict[str, Any]:
    """Return the full-population summary and lightweight actionable focus list."""
    recommendations = []
    counts = {
        "GROW": 0,
        "PROTECT_FIX": 0,
        "REDUCE_FOCUS": 0,
        "insufficient_evidence": 0,
    }

    customers = get_all_customers()
    for customer in customers:
        recommendation = get_customer_recommendation(customer["customer_id"])
        if recommendation is None:
            continue

        result_type = recommendation["recommendation_type"]
        count_key = result_type or "insufficient_evidence"
        counts[count_key] += 1

        if result_type in ACTIONABLE_RECOMMENDATION_TYPES:
            recommendations.append({field: recommendation[field] for field in LIST_FIELDS})

    recommendations.sort(key=lambda item: (
        PRIORITY_ORDER[item["priority"]],
        item["recommendation_type"],
        item["customer_id"],
    ))

    if recommendation_type is not None:
        recommendations = [
            item for item in recommendations
            if item["recommendation_type"] == recommendation_type
        ]

    actionable = sum(counts[name] for name in ACTIONABLE_RECOMMENDATION_TYPES)
    return {
        "summary": {
            "total_customers": len(customers),
            "grow": counts["GROW"],
            "protect_fix": counts["PROTECT_FIX"],
            "reduce_focus": counts["REDUCE_FOCUS"],
            "insufficient_evidence": counts["insufficient_evidence"],
            "actionable": actionable,
        },
        "recommendations": recommendations,
    }
