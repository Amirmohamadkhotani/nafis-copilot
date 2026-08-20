"""Dashboard aggregates composed from existing backend services."""

from collections import Counter
from typing import Any

from .customer_service import get_all_customers
from .recommendation_service import PRIORITY_ORDER, get_all_recommendations
from .signal_service import get_customer_signals


def get_dashboard_summary() -> dict[str, Any]:
    """Return explainable portfolio counts for the dashboard."""
    customers = get_all_customers()
    recommendation_results = get_all_recommendations()
    recommendation_summary = recommendation_results["summary"]

    signal_counts: Counter[str] = Counter()
    for customer in customers:
        signals = get_customer_signals(customer["customer_id"])
        if signals is None:
            continue
        signal_counts.update(signal["type"] for signal in signals)

    priority_counts: Counter[str] = Counter(
        recommendation["priority"]
        for recommendation in recommendation_results["recommendations"]
    )

    return {
        "total_customers": len(customers),
        "recommendation_distribution": {
            "GROW": recommendation_summary["grow"],
            "PROTECT_FIX": recommendation_summary["protect_fix"],
            "REDUCE_FOCUS": recommendation_summary["reduce_focus"],
            "insufficient_evidence": recommendation_summary["insufficient_evidence"],
        },
        "signal_distribution": dict(sorted(signal_counts.items())),
        "priority_distribution": {
            priority: priority_counts[priority]
            for priority in PRIORITY_ORDER
        },
    }
