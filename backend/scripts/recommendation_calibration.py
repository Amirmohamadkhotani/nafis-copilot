"""Read-only calibration analysis for MVP recommendation boundaries."""

from pathlib import Path
import sys

import pandas as pd

PROJECT_ROOT = Path(__file__).resolve().parents[2]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from backend.analytics.recommendation_engine import build_recommendation


DATA_PATH = PROJECT_ROOT / "backend" / "data" / "customer_master_features.csv"
PERCENTILES = [0.10, 0.25, 0.50, 0.75, 0.90]


def describe(series: pd.Series, percentiles: list[float] = PERCENTILES) -> pd.Series:
    return pd.to_numeric(series, errors="coerce").describe(percentiles=percentiles)


def print_section(title: str) -> None:
    print(f"\n{'=' * 88}\n{title}\n{'=' * 88}")


def no_blocking_risk(frame: pd.DataFrame) -> pd.Series:
    return (
        frame["open_complaint_count"].eq(0)
        & ~frame["has_returned_check"].fillna(False)
        & frame["lab_reject_count"].eq(0)
    )


def main() -> None:
    customers = pd.read_csv(DATA_PATH, encoding="utf-8-sig")
    wallet = pd.to_numeric(customers["historical_wallet_share_pct"], errors="coerce")
    revenue = pd.to_numeric(customers["historical_total_revenue"], errors="coerce")
    wallet_available = customers["wallet_data_available"].eq(True) & wallet.notna()
    meaningful_activity = customers["historical_invoice_count"].gt(0) & revenue.notna()
    wallet_values = wallet[wallet_available]
    revenue_values = revenue[meaningful_activity]

    wallet_q = wallet_values.quantile([0.10, 0.25, 0.50, 0.75, 0.90])
    revenue_q = revenue_values.quantile([0.25, 0.50, 0.75, 0.90])

    print_section("1. HISTORICAL WALLET SHARE — CUSTOMER LEVEL")
    wallet_summary = describe(wallet_values)
    print(wallet_summary[["count", "min", "10%", "25%", "50%", "75%", "90%", "max"]].to_string())
    print(f"count == 0: {(wallet_values == 0).sum():,}")
    print(f"count > 0:  {(wallet_values > 0).sum():,}")
    print(f"count < 25: {(wallet_values < 25).sum():,}")
    print(f"count < 50: {(wallet_values < 50).sum():,}")
    print(f"count < 75: {(wallet_values < 75).sum():,}")

    print_section("2. HISTORICAL COMMERCIAL VALUE — MEANINGFUL ACTIVITY")
    print("Meaningful historical activity definition: historical_invoice_count > 0 and revenue observed.")
    revenue_summary = describe(revenue_values, [0.25, 0.50, 0.75, 0.90])
    print(revenue_summary[["count", "25%", "50%", "75%", "90%", "max"]].to_string())

    print_section("3. WALLET-SHARE QUARTILE × HISTORICAL-REVENUE QUARTILE")
    cross = customers.loc[wallet_available & meaningful_activity, [
        "Customer_ID", "historical_wallet_share_pct", "historical_total_revenue"
    ]].copy()
    cross["wallet_share_quartile"] = pd.cut(
        cross["historical_wallet_share_pct"],
        bins=[float("-inf"), wallet_q.loc[0.25], wallet_q.loc[0.50], wallet_q.loc[0.75], float("inf")],
        labels=["Q1", "Q2", "Q3", "Q4"],
        include_lowest=True,
    )
    cross["historical_revenue_quartile"] = pd.qcut(
        cross["historical_total_revenue"], 4, labels=["Q1", "Q2", "Q3", "Q4"], duplicates="drop"
    )
    print(pd.crosstab(cross["wallet_share_quartile"], cross["historical_revenue_quartile"]).to_string())
    print("Wallet quartile boundaries:", wallet_values.quantile([0, .25, .5, .75, 1]).to_dict())
    print("Revenue quartile boundaries:", revenue_values.quantile([0, .25, .5, .75, 1]).to_dict())

    print_section("4. CUSTOMERS WITH COMPLETE ACTUAL-COST COVERAGE")
    actual = customers.loc[customers["profitability_status"].eq("actual"), [
        "Customer_ID", "historical_total_revenue", "historical_wallet_share_pct",
        "known_margin_amount", "known_margin_pct", "negative_margin_lines",
        "returned_check_count", "complaint_count", "open_complaint_count",
        "wallet_data_available", "has_returned_check", "lab_reject_count",
    ]].copy()
    print(actual.drop(columns=["wallet_data_available", "has_returned_check", "lab_reject_count"]).to_string(index=False))
    negative_economics = actual["known_margin_amount"].lt(0)
    print(f"\nActual-status customers: {len(actual):,}")
    print(f"negative known_margin_amount: {negative_economics.sum():,}")
    print(f"known_margin_pct < 0: {actual['known_margin_pct'].lt(0).sum():,}")
    print(f"negative_margin_lines > 0: {actual['negative_margin_lines'].gt(0).sum():,}")
    print(f"wallet data available: {actual['wallet_data_available'].eq(True).sum():,}")
    print("Wallet-share distribution for negative-economics customers:")
    negative_wallet = pd.to_numeric(
        actual.loc[negative_economics & actual["wallet_data_available"].eq(True), "historical_wallet_share_pct"],
        errors="coerce",
    ).dropna()
    print(describe(negative_wallet).to_string() if len(negative_wallet) else "No observed wallet values")

    print_section("5. REAL-DATA REDUCE_FOCUS FEASIBILITY")
    actual_negative = (
        customers["profitability_status"].eq("actual")
        & customers["actual_cost_coverage_pct"].eq(100)
        & customers["known_margin_amount"].lt(0)
        & customers["negative_margin_lines"].gt(0)
    )
    low_value_p25 = meaningful_activity & revenue.le(revenue_q.loc[0.25])
    low_value_median = meaningful_activity & revenue.le(revenue_q.loc[0.50])
    weak_wallet_p75 = ~wallet_available | wallet.ge(wallet_q.loc[0.75])
    weak_wallet_median = ~wallet_available | wallet.ge(wallet_q.loc[0.50])
    clean_for_primary = no_blocking_risk(customers)
    reduce_designs = {
        "R1 conservative: actual negative + revenue <= P25 + wallet unavailable/or >= P75": (
            actual_negative & low_value_p25 & weak_wallet_p75
        ),
        "R2 broader: actual negative + revenue <= median + wallet unavailable/or >= median": (
            actual_negative & low_value_median & weak_wallet_median
        ),
        "R3 evidence-first: actual negative + revenue <= P25 + wallet unavailable": (
            actual_negative & low_value_p25 & ~wallet_available
        ),
    }
    print(f"Complete-cost, negative-overall-margin, negative-line customers: {actual_negative.sum():,}")
    for name, mask in reduce_designs.items():
        print(f"{name}: raw={mask.sum():,}, primary-eligible-after-risk-gating={(mask & clean_for_primary).sum():,}")
        matches = customers.loc[mask, "Customer_ID"].tolist()
        print("  Customer_IDs:", matches if matches else "none")
    print(
        "Conclusion: no customer satisfies the conservative R1/R3 combinations. "
        "C_860828 appears only under the broader relative-median R2 design; this is a calibration "
        "candidate, not yet strong enough to claim a defensible REDUCE_FOCUS business rule."
    )

    print_section("6. CURRENT GROW POPULATION")
    recommendations = customers.apply(
        lambda row: build_recommendation(row.where(row.notna(), None).to_dict())["recommendation_type"],
        axis=1,
    )
    grow = customers.loc[recommendations.eq("GROW")].copy()
    grow_revenue = pd.to_numeric(grow["historical_total_revenue"], errors="coerce")
    grow_wallet = pd.to_numeric(grow["historical_wallet_share_pct"], errors="coerce")
    print(f"Current GROW customers: {len(grow):,}")
    print("Historical revenue distribution:")
    print(describe(grow_revenue).to_string())
    print("Historical wallet-share distribution:")
    print(describe(grow_wallet).to_string())
    print(f"historical_invoice_count == 0: {grow['historical_invoice_count'].eq(0).sum():,}")
    print(f"historical revenue missing or 0: {(grow_revenue.isna() | grow_revenue.eq(0)).sum():,}")
    print(f"wallet share == 0: {grow_wallet.eq(0).sum():,}")
    print(f"in portfolio top 25% historical revenue (>= P75): {grow_revenue.ge(revenue_q.loc[0.75]).sum():,}")
    print(f"in portfolio top 10% historical revenue (>= P90): {grow_revenue.ge(revenue_q.loc[0.90]).sum():,}")

    print_section("7. IS historical_wallet_share_pct < 100 TOO BROAD?")
    below_100 = wallet_available & wallet.lt(100)
    print(f"Wallet-observed customers below 100%: {below_100.sum():,} / {wallet_available.sum():,}")
    print(f"Share of wallet-observed customers: {below_100.sum() / wallet_available.sum() * 100:.2f}%")
    print(
        "Conclusion: YES. It selects nearly every customer with wallet data and does not distinguish "
        "relative wallet opportunity or historical commercial value."
    )

    print_section("8. DATA-DRIVEN MVP HEURISTIC DESIGNS — NOT IMPLEMENTED")
    grow_designs = {
        "G1 balanced: wallet <= P25 and revenue >= median": (
            wallet_available & wallet.le(wallet_q.loc[0.25])
            & meaningful_activity & revenue.ge(revenue_q.loc[0.50]) & clean_for_primary
        ),
        "G2 high-value: wallet <= median and revenue >= P75": (
            wallet_available & wallet.le(wallet_q.loc[0.50])
            & meaningful_activity & revenue.ge(revenue_q.loc[0.75]) & clean_for_primary
        ),
        "G3 selective: wallet <= P25 and revenue >= P75": (
            wallet_available & wallet.le(wallet_q.loc[0.25])
            & meaningful_activity & revenue.ge(revenue_q.loc[0.75]) & clean_for_primary
        ),
    }
    print(
        f"Observed boundaries: wallet P25={wallet_q.loc[0.25]:.6g}, median={wallet_q.loc[0.50]:.6g}, "
        f"P75={wallet_q.loc[0.75]:.6g}; revenue P25={revenue_q.loc[0.25]:.6g}, "
        f"median={revenue_q.loc[0.50]:.6g}, P75={revenue_q.loc[0.75]:.6g}, P90={revenue_q.loc[0.90]:.6g}."
    )
    for name, mask in grow_designs.items():
        print(f"MVP heuristic — not an official business rule — {name}: {mask.sum():,} candidates")
    for name, mask in reduce_designs.items():
        print(
            f"MVP heuristic — not an official business rule — {name}: "
            f"{(mask & clean_for_primary).sum():,} primary candidates"
        )
    print("Tradeoffs:")
    print("- G1 balances low historical share with at least median historical value; it may miss large accounts just above wallet P25.")
    print("- G2 favors top-quartile value with a wider wallet band; it admits less pronounced wallet opportunity.")
    print("- G3 is most selective and easiest to explain, but may leave useful expansion accounts unprioritized.")
    print("- R1/R3 are highly conservative; R2 improves coverage but weakens the definition of low value and weak wallet upside.")
    print("- Returned-check cases remain PROTECT_FIX primary under risk gating, even if they satisfy a REDUCE candidate design.")
    print("Recommendation implication: replace the non-discriminative <100 GROW boundary only after choosing a calibrated design.")
    print("Recommendation implication: retain zero real REDUCE_FOCUS outcomes unless the team explicitly accepts broader R2 evidence.")


if __name__ == "__main__":
    main()
