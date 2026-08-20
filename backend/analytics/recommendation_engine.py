"""Explainable, rule-based Next Best Action decisions for the MVP."""

from numbers import Real
from typing import Any


AS_OF_DATE = "2026-07-23"

# MVP heuristic — data-derived from the hackathon dataset, not an official business rule.
GROW_MAX_HISTORICAL_WALLET_SHARE_PCT = 7.82
GROW_MIN_HISTORICAL_REVENUE = 3495373.44

# MVP heuristic — data-derived from the hackathon dataset, not an official business rule.
REDUCE_MAX_HISTORICAL_REVENUE = 597852.27


def _number(value: Any) -> float | None:
    if isinstance(value, bool) or not isinstance(value, Real):
        return None
    numeric = float(value)
    return numeric if numeric == numeric else None


def _positive_count(features: dict[str, Any], name: str) -> bool:
    value = _number(features.get(name))
    return value is not None and value > 0


def _evidence(metric: str, value: Any, source: str, evidence_type: str, note: str) -> dict[str, Any]:
    return {
        "metric": metric,
        "value": value,
        "source": source,
        "evidence_type": evidence_type,
        "note": note,
    }


def extract_signals(customer_features: dict[str, Any]) -> dict[str, Any]:
    """Extract simple booleans from validated master features."""
    wallet_share = _number(customer_features.get("historical_wallet_share_pct"))
    wallet_available = customer_features.get("wallet_data_available") is True
    actual_cost_coverage = _number(customer_features.get("actual_cost_coverage_pct"))
    known_margin_amount = _number(customer_features.get("known_margin_amount"))
    historical_revenue = _number(customer_features.get("historical_total_revenue"))
    open_complaint = _positive_count(customer_features, "open_complaint_count")
    high_severity = _positive_count(customer_features, "high_severity_count")
    returned_check = customer_features.get("has_returned_check") is True
    lab_rejection = _positive_count(customer_features, "lab_reject_count")

    blocking_risks = []
    if open_complaint:
        blocking_risks.append("open_complaint")
    if returned_check:
        blocking_risks.append("returned_check")
    if lab_rejection:
        blocking_risks.append("complaint_linked_lab_rejection")

    return {
        "features": customer_features,
        "open_complaint": open_complaint,
        "high_severity": high_severity,
        "returned_check": returned_check,
        "lab_rejection": lab_rejection,
        "blocking_risks": blocking_risks,
        # Historical wallet opportunity calibrated from the observed MVP distribution.
        "historical_wallet_room": (
            wallet_available
            and wallet_share is not None
            and wallet_share <= GROW_MAX_HISTORICAL_WALLET_SHARE_PCT
            and historical_revenue is not None
            and historical_revenue >= GROW_MIN_HISTORICAL_REVENUE
            and _positive_count(customer_features, "historical_invoice_count")
        ),
        # REDUCE requires complete actual-cost evidence and negative economics.
        "fully_supported_weak_economics": (
            customer_features.get("profitability_status") == "actual"
            and actual_cost_coverage == 100
            and known_margin_amount is not None
            and known_margin_amount < 0
            and _positive_count(customer_features, "negative_margin_lines")
            and historical_revenue is not None
            and historical_revenue <= REDUCE_MAX_HISTORICAL_REVENUE
        ),
    }


def _protect_evidence(signals: dict[str, Any]) -> list[dict[str, Any]]:
    features = signals["features"]
    evidence = []
    if signals["open_complaint"]:
        evidence.append(_evidence(
            "open_complaint_count", features.get("open_complaint_count"), "شکایات", "FACT",
            f"Open complaint evidence as of {AS_OF_DATE}.",
        ))
    if signals["high_severity"]:
        evidence.append(_evidence(
            "high_severity_count", features.get("high_severity_count"), "شکایات", "FACT",
            f"High-severity complaint evidence as of {AS_OF_DATE}.",
        ))
    if signals["returned_check"]:
        evidence.append(_evidence(
            "returned_check_count", features.get("returned_check_count"), "وصول", "FACT",
            f"At least one returned check is observable as of {AS_OF_DATE}.",
        ))
    if signals["lab_rejection"]:
        evidence.append(_evidence(
            "lab_reject_count", features.get("lab_reject_count"), "کیفیت_لات", "FACT",
            "Complaint-linked laboratory rejection evidence is available.",
        ))
    return evidence


def _wallet_evidence(signals: dict[str, Any]) -> list[dict[str, Any]]:
    features = signals["features"]
    evidence = [_evidence(
        "historical_wallet_share_pct", features.get("historical_wallet_share_pct"), "سهم_سبد",
        "INFERENCE", "Historical evidence indicates wallet room; current wallet share is unknown.",
    )]
    for metric in ("wallet_period_start", "wallet_period_end", "main_competitor"):
        value = features.get(metric)
        if value is not None:
            evidence.append(_evidence(
                metric, value, "سهم_سبد", "FACT",
                "Historical wallet context from the available period.",
            ))
    historical_revenue = features.get("historical_total_revenue")
    if _number(historical_revenue) is not None:
        evidence.append(_evidence(
            "historical_total_revenue", historical_revenue, "فروش", "FACT",
            "Historical commercial value from 2020-01-01 through 2022-12-31.",
        ))
    return evidence


def generate_candidate_recommendations(signals: dict[str, Any]) -> list[dict[str, Any]]:
    """Generate candidates only where the specification provides sufficient evidence."""
    features = signals["features"]
    candidates = []

    if signals["blocking_risks"]:
        candidates.append({
            "recommendation_type": "PROTECT_FIX",
            "summary": "A blocking customer issue should be resolved before further sales activity.",
            "next_best_action": "Review and resolve the blocking issue before making a new sales proposal.",
            "evidence": _protect_evidence(signals),
            "blocking_risks": list(signals["blocking_risks"]),
            "suspended_opportunities": [],
            "confidence": "high" if len(signals["blocking_risks"]) > 1 else "medium",
        })

    if signals["historical_wallet_room"]:
        candidates.append({
            "recommendation_type": "GROW",
            "summary": "Historical wallet evidence supports reviewing an account expansion opportunity.",
            "next_best_action": "Review the opportunity to increase Nafis share of this customer's purchases.",
            "evidence": _wallet_evidence(signals),
            "blocking_risks": [],
            "suspended_opportunities": [],
            "confidence": "limited",
        })

    if signals["fully_supported_weak_economics"] and not signals["blocking_risks"]:
        candidates.append({
            "recommendation_type": "REDUCE_FOCUS",
            "summary": "Fully covered actual-cost evidence indicates negative account economics relative to its historical commercial value.",
            "next_best_action": "Reduce proactive expansion effort for this account and review its economics before allocating additional sales resources.",
            "evidence": [
                _evidence(
                    "known_margin_amount", features.get("known_margin_amount"), "اجزای_هزینه_تحقق", "FACT",
                    "Known margin is negative with 100% actual-cost coverage.",
                ),
                *([
                    _evidence(
                        "known_margin_pct", features.get("known_margin_pct"),
                        "اجزای_هزینه_تحقق", "FACT",
                        "Known margin percentage is based on fully covered actual costs.",
                    )
                ] if _number(features.get("known_margin_pct")) is not None else []),
                _evidence(
                    "actual_cost_coverage_pct", features.get("actual_cost_coverage_pct"),
                    "اجزای_هزینه_تحقق", "FACT", "Actual-cost coverage is complete.",
                ),
                _evidence(
                    "negative_margin_lines", features.get("negative_margin_lines"),
                    "اجزای_هزینه_تحقق", "FACT",
                    "At least one known-cost sales line has negative margin.",
                ),
                _evidence(
                    "historical_total_revenue", features.get("historical_total_revenue"),
                    "فروش", "FACT",
                    "Historical commercial value is from 2020-01-01 through 2022-12-31.",
                ),
            ],
            "blocking_risks": [],
            "suspended_opportunities": [],
            "confidence": "medium",
        })

    return candidates


def apply_risk_gating(candidates: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Make PROTECT/FIX primary and suspend growth while blocking risk exists."""
    protect = next(
        (item for item in candidates if item["recommendation_type"] == "PROTECT_FIX"), None
    )
    if protect is None:
        return candidates

    gated = dict(protect)
    if any(item["recommendation_type"] == "GROW" for item in candidates):
        gated["suspended_opportunities"] = [{
            "recommendation_type": "GROW",
            "status": "suspended_until_risk_resolution",
            "note": "Historical wallet opportunity should be revisited after blocking risk resolution.",
        }]
    return [gated]


def assign_priority(candidate: dict[str, Any]) -> str:
    """Assign the specification's non-numeric priority tier."""
    if candidate["recommendation_type"] == "PROTECT_FIX":
        return "Critical" if len(candidate["blocking_risks"]) > 1 else "High"
    if candidate["recommendation_type"] == "GROW":
        return "Medium"
    return "Low"


def select_best_recommendation(candidates: list[dict[str, Any]]) -> dict[str, Any] | None:
    """Select the highest permitted tier without producing a numeric score."""
    if not candidates:
        return None
    priority_order = {"Critical": 0, "High": 1, "Medium": 2, "Low": 3}
    with_priorities = [dict(candidate, priority=assign_priority(candidate)) for candidate in candidates]
    return min(with_priorities, key=lambda item: priority_order[item["priority"]])


def build_recommendation(customer_features: dict[str, Any]) -> dict[str, Any]:
    """Build one evidence-backed MVP recommendation from validated features."""
    signals = extract_signals(customer_features)
    candidates = generate_candidate_recommendations(signals)
    recommendation = select_best_recommendation(apply_risk_gating(candidates))

    if recommendation is None:
        return {
            "recommendation_type": None,
            "priority": None,
            "summary": "No recommendation is issued because the available evidence is insufficient.",
            "next_best_action": None,
            "evidence": [],
            "blocking_risks": [],
            "suspended_opportunities": [],
            "confidence": "limited",
            "status": "insufficient_evidence",
        }

    return {**recommendation, "status": "ready"}
