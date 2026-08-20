"""Service layer for customer recommendations."""

from typing import Any

from ...analytics.recommendation_engine import build_recommendation
from .customer_service import get_customer_by_id


def get_customer_recommendation(customer_id: str) -> dict[str, Any] | None:
    """Build a recommendation response for an existing customer."""
    customer = get_customer_by_id(customer_id)
    if customer is None:
        return None

    return {
        "customer_id": customer_id,
        **build_recommendation(customer),
    }
