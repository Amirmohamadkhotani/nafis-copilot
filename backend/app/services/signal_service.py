"""Read-only extraction of explainable customer signals from validated features."""

from typing import Any

from .customer_service import get_customer_by_id


def _metric(name: str, value: Any, source: str) -> dict[str, Any]:
    return {
        "name": name,
        "value": value,
        "source": source,
    }


def _positive(value: Any) -> bool:
    return isinstance(value, (int, float)) and not isinstance(value, bool) and value > 0


def _quality_signal(customer: dict[str, Any]) -> dict[str, Any] | None:
    metrics = []
    if _positive(customer.get("open_complaint_count")):
        metrics.append(_metric("open_complaints", customer["open_complaint_count"], "شکایات"))
    if _positive(customer.get("high_severity_count")):
        metrics.append(_metric(
            "high_severity_complaints", customer["high_severity_count"], "شکایات"
        ))
    if customer.get("quality_evidence_available") is True and _positive(
        customer.get("lab_reject_count")
    ):
        metrics.append(_metric(
            "complaint_linked_lab_rejections", customer["lab_reject_count"], "کیفیت_لات"
        ))
    if not metrics:
        return None
    return {
        "type": "QUALITY_RISK",
        "severity": "HIGH",
        "title": "Quality issues detected",
        "metrics": metrics,
    }


def _payment_signal(customer: dict[str, Any]) -> dict[str, Any] | None:
    if not _positive(customer.get("returned_check_count")):
        return None

    metrics = [_metric("returned_checks", customer["returned_check_count"], "وصول")]
    return {
        "type": "PAYMENT_RISK",
        "severity": "HIGH",
        "title": "Payment risk detected",
        "metrics": metrics,
    }


def _growth_signal(customer: dict[str, Any]) -> dict[str, Any] | None:
    if customer.get("wallet_data_available") is not True:
        return None
    if customer.get("historical_wallet_share_pct") is None:
        return None

    metrics = [_metric(
        "historical_wallet_share_pct",
        customer["historical_wallet_share_pct"],
        "سهم_سبد",
    )]
    if customer.get("main_competitor") is not None:
        metrics.append(_metric("main_competitor", customer["main_competitor"], "سهم_سبد"))
    if customer.get("historical_total_revenue") is not None:
        metrics.append(_metric(
            "historical_total_revenue", customer["historical_total_revenue"], "فروش"
        ))

    return {
        "type": "GROWTH_SIGNAL",
        "severity": "MEDIUM",
        "title": "Historical expansion opportunity",
        "metrics": metrics,
    }


def _profitability_signal(customer: dict[str, Any]) -> dict[str, Any] | None:
    status = customer.get("profitability_status")
    coverage = customer.get("actual_cost_coverage_pct")
    margin_amount = customer.get("known_margin_amount")
    margin_pct = customer.get("known_margin_pct")
    reliable_coverage = status == "actual" and coverage == 100
    negative_economics = (
        isinstance(margin_amount, (int, float))
        and not isinstance(margin_amount, bool)
        and margin_amount < 0
    ) or (
        isinstance(margin_pct, (int, float))
        and not isinstance(margin_pct, bool)
        and margin_pct < 0
    )
    if not reliable_coverage or not negative_economics:
        return None

    metrics = []
    if margin_amount is not None:
        metrics.append(_metric("known_margin_amount", margin_amount, "اجزای_هزینه_تحقق"))
    if margin_pct is not None:
        metrics.append(_metric("known_margin_pct", margin_pct, "اجزای_هزینه_تحقق"))
    metrics.extend([
        _metric("actual_cost_coverage_pct", coverage, "اجزای_هزینه_تحقق"),
        _metric("profitability_status", status, "اجزای_هزینه_تحقق"),
    ])
    return {
        "type": "PROFITABILITY_SIGNAL",
        "severity": "HIGH",
        "title": "Account economics concern",
        "metrics": metrics,
    }


def get_customer_signals(customer_id: str) -> list[dict[str, Any]] | None:
    """Return observable signals for a customer, or None when absent."""
    customer = get_customer_by_id(customer_id)
    if customer is None:
        return None

    signals = [
        _quality_signal(customer),
        _payment_signal(customer),
        _growth_signal(customer),
        _profitability_signal(customer),
    ]
    return [signal for signal in signals if signal is not None]


def get_categorized_customer_signals(
    customer_id: str,
) -> dict[str, list[dict[str, Any]]] | None:
    """Return the same signals grouped for customer intelligence presentation."""
    signals = get_customer_signals(customer_id)
    if signals is None:
        return None

    categories = {
        "risk_signals": [],
        "opportunity_signals": [],
        "economic_signals": [],
    }
    category_by_type = {
        "QUALITY_RISK": "risk_signals",
        "PAYMENT_RISK": "risk_signals",
        "GROWTH_SIGNAL": "opportunity_signals",
        "PROFITABILITY_SIGNAL": "economic_signals",
    }
    for signal in signals:
        categories[category_by_type[signal["type"]]].append(signal)
    return categories
