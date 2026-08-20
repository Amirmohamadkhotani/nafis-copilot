import unittest

from backend.analytics.recommendation_engine import build_recommendation


def base_features(**overrides):
    features = {
        "wallet_data_available": True,
        "historical_wallet_share_pct": 5.0,
        "historical_total_revenue": 5_000_000.0,
        "historical_invoice_count": 10,
        "open_complaint_count": 0,
        "high_severity_count": 0,
        "has_returned_check": False,
        "returned_check_count": 0,
        "lab_reject_count": 0,
        "profitability_status": "partial",
        "actual_cost_coverage_pct": 50.0,
        "known_margin_amount": 100.0,
        "known_margin_pct": 5.0,
        "negative_margin_lines": 0,
    }
    features.update(overrides)
    return features


class RecommendationEngineTests(unittest.TestCase):
    def test_grow_at_calibrated_value_and_wallet_profile(self):
        result = build_recommendation(base_features())
        self.assertEqual(result["recommendation_type"], "GROW")
        self.assertEqual(result["priority"], "Medium")

    def test_not_grow_when_historical_value_is_low(self):
        result = build_recommendation(base_features(historical_total_revenue=500_000.0))
        self.assertIsNone(result["recommendation_type"])
        self.assertEqual(result["status"], "insufficient_evidence")

    def test_not_grow_when_historical_wallet_share_is_above_boundary(self):
        result = build_recommendation(base_features(historical_wallet_share_pct=20.0))
        self.assertIsNone(result["recommendation_type"])
        self.assertEqual(result["status"], "insufficient_evidence")

    def test_protect_fix_gates_otherwise_valid_grow(self):
        result = build_recommendation(base_features(open_complaint_count=1))
        self.assertEqual(result["recommendation_type"], "PROTECT_FIX")
        self.assertEqual(result["priority"], "High")
        self.assertEqual(result["suspended_opportunities"][0]["recommendation_type"], "GROW")

    def test_reduce_focus_for_fully_observed_negative_low_value_economics(self):
        result = build_recommendation(base_features(
            historical_total_revenue=200_000.0,
            profitability_status="actual",
            actual_cost_coverage_pct=100.0,
            known_margin_amount=-500.0,
            known_margin_pct=-2.0,
            negative_margin_lines=2,
        ))
        self.assertEqual(result["recommendation_type"], "REDUCE_FOCUS")
        self.assertEqual(result["priority"], "Low")

    def test_partial_cost_coverage_does_not_reduce_negative_margin_customer(self):
        result = build_recommendation(base_features(
            historical_total_revenue=200_000.0,
            profitability_status="partial",
            actual_cost_coverage_pct=75.0,
            known_margin_amount=-500.0,
            negative_margin_lines=2,
        ))
        self.assertIsNone(result["recommendation_type"])

    def test_full_negative_economics_above_revenue_boundary_does_not_reduce(self):
        result = build_recommendation(base_features(
            historical_wallet_share_pct=20.0,
            historical_total_revenue=700_000.0,
            profitability_status="actual",
            actual_cost_coverage_pct=100.0,
            known_margin_amount=-500.0,
            negative_margin_lines=2,
        ))
        self.assertIsNone(result["recommendation_type"])

    def test_missing_evidence_returns_insufficient_evidence(self):
        result = build_recommendation({
            "wallet_data_available": False,
            "historical_wallet_share_pct": None,
            "historical_total_revenue": None,
            "historical_invoice_count": 0,
            "profitability_status": "insufficient",
            "actual_cost_coverage_pct": 0.0,
            "known_margin_amount": None,
            "negative_margin_lines": None,
        })
        self.assertIsNone(result["recommendation_type"])
        self.assertEqual(result["status"], "insufficient_evidence")


if __name__ == "__main__":
    unittest.main()
