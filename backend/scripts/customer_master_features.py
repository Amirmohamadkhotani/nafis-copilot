"""Build the point-in-time customer master feature table."""

from pathlib import Path

import pandas as pd


DATASET_PATH = Path(__file__).resolve().parents[1] / "data" / "DATASET.xlsx"
OUTPUT_PATH = Path(__file__).resolve().parents[1] / "data" / "customer_master_features.csv"
AS_OF_DATE = pd.Timestamp("2026-07-23")
HISTORICAL_START = pd.Timestamp("2020-01-01")
HISTORICAL_END = pd.Timestamp("2022-12-31")
RECENT_START = pd.Timestamp("2025-01-01")

SHEETS = {
    "customers": "مشتریان",
    "sales": "فروش",
    "collections": "وصول",
    "costs": "اجزای_هزینه_تحقق",
    "complaints": "شکایات",
    "complaint_links": "اتصال_شکایت",
    "quality": "کیفیت_لات",
    "wallet": "سهم_سبد",
}


def parse_dates(frame: pd.DataFrame, columns: list[str]) -> None:
    """Parse date columns in place, coercing invalid values to missing."""
    for column in columns:
        frame[column] = pd.to_datetime(frame[column], errors="coerce")


def invoice_features(
    invoices: pd.DataFrame,
    prefix: str,
    include_purchase_gaps: bool = False,
) -> pd.DataFrame:
    """Aggregate invoice-level observations to customers."""
    features = invoices.groupby("Customer_ID").agg(
        **{
            f"{prefix}_total_revenue" if prefix == "historical" else f"{prefix}_revenue": (
                "invoice_revenue",
                lambda values: values.sum(min_count=1),
            ),
            f"{prefix}_invoice_count": ("شماره فاکتور", "nunique"),
            f"{prefix}_avg_deal_size": ("invoice_revenue", "mean"),
            f"{prefix}_last_purchase_date": ("invoice_date", "max"),
        }
    )

    if include_purchase_gaps:
        ordered = invoices[["Customer_ID", "شماره فاکتور", "invoice_date"]].drop_duplicates()
        ordered = ordered.sort_values(["Customer_ID", "invoice_date", "شماره فاکتور"])
        ordered["purchase_gap_days"] = ordered.groupby("Customer_ID")["invoice_date"].diff().dt.days
        gaps = ordered.groupby("Customer_ID")["purchase_gap_days"].agg(["median", "mean"])
        gaps.columns = [
            "historical_median_purchase_gap_days",
            "historical_avg_purchase_gap_days",
        ]
        features = features.join(gaps)

    return features.reset_index()


def build_customer_master_features() -> pd.DataFrame:
    data = {
        name: pd.read_excel(DATASET_PATH, sheet_name=sheet)
        for name, sheet in SHEETS.items()
    }

    sales = data["sales"]
    collections = data["collections"]
    costs = data["costs"]
    complaints = data["complaints"]
    links = data["complaint_links"]
    quality = data["quality"]
    wallet = data["wallet"]

    parse_dates(sales, ["تاریخ", "Available_At"])
    parse_dates(collections, ["تاریخ رویداد وصول", "Available_At"])
    parse_dates(costs, ["Cost_Close_Date", "Available_At"])
    parse_dates(complaints, ["Created_At", "Available_At"])
    parse_dates(links, ["Link_Available_At"])
    parse_dates(quality, ["Available_At"])
    parse_dates(wallet, ["Month_Key", "Available_At"])

    sales = sales.loc[sales["Available_At"] <= AS_OF_DATE].copy()
    collections = collections.loc[
        (collections["Available_At"] <= AS_OF_DATE)
        & (
            collections["تاریخ رویداد وصول"].isna()
            | (collections["تاریخ رویداد وصول"] <= AS_OF_DATE)
        )
    ].copy()
    costs = costs.loc[
        (costs["Available_At"] <= AS_OF_DATE)
        & (costs["Cost_Close_Date"].isna() | (costs["Cost_Close_Date"] <= AS_OF_DATE))
    ].copy()
    complaints = complaints.loc[complaints["Available_At"] <= AS_OF_DATE].copy()
    links = links.loc[links["Link_Available_At"] <= AS_OF_DATE].copy()
    quality = quality.loc[quality["Available_At"] <= AS_OF_DATE].copy()
    wallet = wallet.loc[wallet["Available_At"] <= AS_OF_DATE].copy()

    # Sales: aggregate lines to invoices before computing deal and purchase-gap features.
    sales["مبلغ کل"] = pd.to_numeric(sales["مبلغ کل"], errors="coerce")
    invoices = sales.groupby(["Customer_ID", "شماره فاکتور"], as_index=False).agg(
        invoice_date=("تاریخ", "max"),
        invoice_revenue=("مبلغ کل", lambda values: values.sum(min_count=1)),
    )
    historical_invoices = invoices.loc[
        invoices["invoice_date"].between(HISTORICAL_START, HISTORICAL_END)
    ]
    recent_invoices = invoices.loc[
        invoices["invoice_date"].between(RECENT_START, AS_OF_DATE)
    ]
    historical_sales = invoice_features(historical_invoices, "historical", True)
    recent_sales = invoice_features(recent_invoices, "recent_observed")

    # Collections: retain only evidence observable by the cutoff.
    collections["payment_delay_days"] = pd.to_numeric(collections["روز تأخیر"], errors="coerce")
    collections["returned_check"] = collections["چک برگشتی"].astype("string").str.strip().eq("بله")
    payment = collections.groupby("Customer_ID").agg(
        collection_event_count=("Collection_ID", "count"),
        median_payment_delay_days=("payment_delay_days", "median"),
        avg_payment_delay_days=("payment_delay_days", "mean"),
        returned_check_count=("returned_check", "sum"),
    ).reset_index()
    payment["has_returned_check"] = payment["returned_check_count"] > 0

    # Profitability: calculate amounts only for sales lines with realized actual cost.
    cost_columns = [
        "Sales_Line_ID",
        "هزینه کل به ازای واحد",
        "مبلغ برگشتی",
        "مقدار برگشتی",
    ]
    profitability_lines = sales.merge(costs[cost_columns], on="Sales_Line_ID", how="left", validate="1:1")
    profitability_lines["unit_actual_cost"] = pd.to_numeric(
        profitability_lines["هزینه کل به ازای واحد"], errors="coerce"
    )
    profitability_lines["quantity"] = pd.to_numeric(profitability_lines["مقدار"], errors="coerce")
    profitability_lines["line_revenue"] = pd.to_numeric(profitability_lines["مبلغ کل"], errors="coerce")
    profitability_lines["line_returned_amount"] = pd.to_numeric(
        profitability_lines["مبلغ برگشتی"], errors="coerce"
    )
    profitability_lines["returned_quantity"] = pd.to_numeric(
        profitability_lines["مقدار برگشتی"], errors="coerce"
    )
    profitability_lines["has_actual_cost"] = profitability_lines["unit_actual_cost"].notna()

    coverage = profitability_lines.groupby("Customer_ID").agg(
        sales_line_count=("Sales_Line_ID", "count"),
        actual_cost_line_count=("has_actual_cost", "sum"),
    )
    coverage["actual_cost_coverage_pct"] = (
        coverage["actual_cost_line_count"] / coverage["sales_line_count"] * 100
    )

    known = profitability_lines.loc[profitability_lines["has_actual_cost"]].copy()
    known["line_actual_cost"] = known["quantity"] * known["unit_actual_cost"]
    known["line_margin"] = known["line_revenue"] - known["line_actual_cost"]
    known["negative_margin"] = known["line_margin"] < 0
    known["returned_line"] = (known["returned_quantity"] > 0) | (known["line_returned_amount"] > 0)
    known_profit = known.groupby("Customer_ID").agg(
        known_revenue=("line_revenue", lambda values: values.sum(min_count=1)),
        known_cost=("line_actual_cost", lambda values: values.sum(min_count=1)),
        known_margin_amount=("line_margin", lambda values: values.sum(min_count=1)),
        negative_margin_lines=("negative_margin", "sum"),
        returned_amount=("line_returned_amount", lambda values: values.sum(min_count=1)),
        returned_lines=("returned_line", "sum"),
    )
    known_profit["known_margin_pct"] = (
        known_profit["known_margin_amount"] / known_profit["known_revenue"] * 100
    ).where(known_profit["known_revenue"] != 0)
    profitability = coverage[["actual_cost_coverage_pct"]].join(known_profit).reset_index()
    profitability["profitability_status"] = "partial"
    profitability.loc[
        profitability["actual_cost_coverage_pct"].isna()
        | profitability["actual_cost_coverage_pct"].eq(0),
        "profitability_status",
    ] = "insufficient"
    profitability.loc[
        profitability["actual_cost_coverage_pct"].eq(100), "profitability_status"
    ] = "actual"

    # Complaints and complaint-linked lab evidence are separate concepts.
    complaints["is_open"] = complaints["Complaint_Status"].isin(["درحال بررسی", "نیازمند بررسی"])
    complaints["is_high_severity"] = complaints["Severity"].isin(["زیاد", "بحرانی"])
    complaint_features = complaints.groupby("Customer_ID").agg(
        complaint_count=("Complaint_ID", "nunique"),
        open_complaint_count=("is_open", "sum"),
        high_severity_count=("is_high_severity", "sum"),
        last_complaint_date=("Created_At", "max"),
    ).reset_index()

    valid_links = links.merge(
        complaints[["Complaint_ID", "Customer_ID"]],
        on="Complaint_ID",
        how="inner",
        suffixes=("_link", "_complaint"),
        validate="many_to_one",
    )
    linked_quality = valid_links.merge(
        quality[["Quality_Record_ID", "Sales_Line_ID", "Lab_Result"]],
        on="Sales_Line_ID",
        how="inner",
        validate="many_to_one",
    )
    linked_quality["lab_pass"] = linked_quality["Lab_Result"].eq("قبول")
    linked_quality["lab_reject"] = linked_quality["Lab_Result"].eq("رد")
    quality_features = linked_quality.groupby("Customer_ID_complaint").agg(
        quality_evidence_count=("Quality_Record_ID", "nunique"),
        lab_pass_count=("lab_pass", "sum"),
        lab_reject_count=("lab_reject", "sum"),
    ).rename_axis("Customer_ID").reset_index()
    quality_features["quality_evidence_available"] = quality_features["quality_evidence_count"] > 0

    # Wallet figures use the complete available period; labels come from its latest row.
    wallet["Estimated_Total_Purchase"] = pd.to_numeric(
        wallet["Estimated_Total_Purchase"], errors="coerce"
    )
    wallet["Nafis_Purchase"] = pd.to_numeric(wallet["Nafis_Purchase"], errors="coerce")
    wallet_totals = wallet.groupby("Customer_ID").agg(
        historical_estimated_total_purchase=(
            "Estimated_Total_Purchase", lambda values: values.sum(min_count=1)
        ),
        historical_nafis_purchase=("Nafis_Purchase", lambda values: values.sum(min_count=1)),
        wallet_period_start=("Month_Key", "min"),
        wallet_period_end=("Month_Key", "max"),
    )
    wallet_totals["historical_wallet_share_pct"] = (
        wallet_totals["historical_nafis_purchase"]
        / wallet_totals["historical_estimated_total_purchase"]
        * 100
    ).where(wallet_totals["historical_estimated_total_purchase"] > 0)
    latest_wallet = (
        wallet.sort_values(["Customer_ID", "Month_Key", "Available_At"])
        .groupby("Customer_ID", as_index=False)
        .tail(1)
        .set_index("Customer_ID")[["Main_Competitor", "Estimate_Source"]]
        .rename(columns={
            "Main_Competitor": "main_competitor",
            "Estimate_Source": "wallet_estimate_source",
        })
    )
    wallet_features = wallet_totals.join(latest_wallet).reset_index()
    wallet_features["wallet_data_available"] = True

    master = data["customers"].copy()
    for features in [
        historical_sales,
        recent_sales,
        payment,
        profitability,
        complaint_features,
        quality_features,
        wallet_features,
    ]:
        master = master.merge(features, on="Customer_ID", how="left", validate="1:1")

    zero_count_columns = [
        "historical_invoice_count",
        "recent_observed_invoice_count",
        "collection_event_count",
        "returned_check_count",
        "complaint_count",
        "open_complaint_count",
        "high_severity_count",
        "quality_evidence_count",
        "lab_pass_count",
        "lab_reject_count",
    ]
    master[zero_count_columns] = master[zero_count_columns].fillna(0).astype("int64")
    master["has_returned_check"] = master["has_returned_check"].fillna(False).astype(bool)
    master["quality_evidence_available"] = (
        master["quality_evidence_available"].fillna(False).astype(bool)
    )
    master["wallet_data_available"] = master["wallet_data_available"].fillna(False).astype(bool)
    master["profitability_status"] = master["profitability_status"].fillna("insufficient")

    if not master["Customer_ID"].is_unique:
        raise ValueError("Output is not one row per Customer_ID")
    if len(master) != 644:
        raise ValueError(f"Expected 644 customers, found {len(master)}")

    return master


def main() -> None:
    customer_master = build_customer_master_features()
    customer_master.to_csv(OUTPUT_PATH, index=False, encoding="utf-8-sig")

    print(f"Total customer count: {len(customer_master):,}")
    print(f"Total column count: {len(customer_master.columns):,}")
    print("\nFirst 10 rows:")
    print(customer_master.head(10).to_string(index=False))
    print("\nMissing value summary:")
    print(customer_master.isna().sum().to_string())
    print(f"\nSaved: {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
