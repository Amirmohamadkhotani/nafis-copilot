from pathlib import Path
import pandas as pd


DATASET_PATH = (
    Path(__file__).resolve().parents[1]
    / "data"
    / "DATASET.xlsx"
)

AS_OF_DATE = pd.Timestamp("2026-07-23")


complaints = pd.read_excel(
    DATASET_PATH,
    sheet_name="شکایات"
)

bridge = pd.read_excel(
    DATASET_PATH,
    sheet_name="اتصال_شکایت"
)

sales = pd.read_excel(
    DATASET_PATH,
    sheet_name="فروش"
)

quality = pd.read_excel(
    DATASET_PATH,
    sheet_name="کیفیت_لات"
)


# -----------------------------
# Parse dates
# -----------------------------

for df, cols in [
    (complaints, ["Created_At", "Available_At", "Resolved_At", "Resolution_Available_At"]),
    (sales, ["تاریخ", "Available_At"]),
    (quality, ["Production_Date", "Available_At"]),
]:
    for col in cols:
        if col in df.columns:
            df[col] = pd.to_datetime(
                df[col],
                errors="coerce"
            )


# -----------------------------
# Point-in-time filtering
# -----------------------------

complaints_valid = complaints[
    complaints["Available_At"] <= AS_OF_DATE
].copy()

sales_valid = sales[
    sales["Available_At"] <= AS_OF_DATE
].copy()

quality_valid = quality[
    quality["Available_At"] <= AS_OF_DATE
].copy()


print("\n" + "=" * 70)
print("COMPLAINT / QUALITY SANITY CHECK")
print("=" * 70)


print("\n--- BASIC COVERAGE ---")

print("Complaints:", len(complaints_valid))
print(
    "Customers with complaints:",
    complaints_valid["Customer_ID"].nunique()
)

print("Complaint-sales links:", len(bridge))

print(
    "Quality records:",
    len(quality_valid)
)


# -----------------------------
# Complaint severity/status
# -----------------------------

print("\n--- SEVERITY DISTRIBUTION ---")

print(
    complaints_valid["Severity"]
    .value_counts(dropna=False)
    .to_string()
)


print("\n--- COMPLAINT STATUS DISTRIBUTION ---")

print(
    complaints_valid["Complaint_Status"]
    .value_counts(dropna=False)
    .to_string()
)


# -----------------------------
# Complaint -> Sales coverage
# -----------------------------

complaint_links = bridge.merge(
    complaints_valid[["Complaint_ID", "Customer_ID"]],
    on="Complaint_ID",
    how="inner"
)

print("\n--- COMPLAINT -> SALES LINKAGE ---")

print(
    "Unique complaints with sales link:",
    complaint_links["Complaint_ID"].nunique()
)

print(
    "Total valid complaints:",
    complaints_valid["Complaint_ID"].nunique()
)

link_coverage = (
    complaint_links["Complaint_ID"].nunique()
    / complaints_valid["Complaint_ID"].nunique()
    * 100
)

print(
    f"Complaint-to-sales coverage: {link_coverage:.2f}%"
)


# -----------------------------
# Complaint -> Quality evidence
# -----------------------------

complaint_sales_quality = (
    complaint_links
    .merge(
        sales_valid[
            [
                "Sales_Line_ID",
                "Customer_ID",
                "Product_ID",
                "Lot_ID",
            ]
        ],
        on="Sales_Line_ID",
        how="left",
        suffixes=("_complaint", "_sales")
    )
    .merge(
        quality_valid[
            [
                "Sales_Line_ID",
                "Quality_Record_ID",
                "Lab_Result",
                "Lot_ID",
            ]
        ],
        on="Sales_Line_ID",
        how="left",
        suffixes=("_sales", "_quality")
    )
)

has_quality = (
    complaint_sales_quality["Quality_Record_ID"]
    .notna()
)

print("\n--- COMPLAINT -> QUALITY EVIDENCE ---")

print(
    "Complaint-sales links:",
    len(complaint_sales_quality)
)

print(
    "Links with direct quality evidence:",
    has_quality.sum()
)

print(
    "Unique complaints with quality evidence:",
    complaint_sales_quality.loc[
        has_quality,
        "Complaint_ID"
    ].nunique()
)

quality_coverage = (
    complaint_sales_quality.loc[
        has_quality,
        "Complaint_ID"
    ].nunique()
    / complaints_valid["Complaint_ID"].nunique()
    * 100
)

print(
    f"Complaint quality evidence coverage: {quality_coverage:.2f}%"
)


# -----------------------------
# Lab result distribution
# -----------------------------

print("\n--- LAB RESULT FOR COMPLAINT-LINKED QUALITY ---")

print(
    complaint_sales_quality.loc[
        has_quality,
        "Lab_Result"
    ]
    .value_counts(dropna=False)
    .to_string()
)


# -----------------------------
# Customer-level complaint features
# -----------------------------

customer_complaints = (
    complaints_valid
    .groupby("Customer_ID")
    .agg(
        complaint_count=("Complaint_ID", "count"),
        last_complaint_date=("Created_At", "max"),
    )
)

high_severity_mask = complaints_valid["Severity"].isin([
    "بحرانی",
    "زیاد",
])

open_status_mask = complaints_valid["Complaint_Status"].isin([
    "درحال بررسی",
    "نیازمند بررسی",
])

high_counts = (
    complaints_valid[high_severity_mask]
    .groupby("Customer_ID")
    .size()
)

open_counts = (
    complaints_valid[open_status_mask]
    .groupby("Customer_ID")
    .size()
)

customer_complaints["high_severity_count"] = (
    high_counts
    .reindex(customer_complaints.index)
    .fillna(0)
    .astype(int)
)

customer_complaints["open_complaint_count"] = (
    open_counts
    .reindex(customer_complaints.index)
    .fillna(0)
    .astype(int)
)


print("\n--- CUSTOMER COMPLAINT COVERAGE ---")

print(
    customer_complaints[
        [
            "complaint_count",
            "high_severity_count",
            "open_complaint_count",
        ]
    ]
    .describe(
        percentiles=[0.25, 0.5, 0.75, 0.9]
    )
    .to_string()
)

print("=" * 70)


print("\n--- STATUS VS RESOLUTION CHECK ---")

status_resolution = (
    complaints_valid
    .groupby("Complaint_Status")
    .agg(
        complaints=("Complaint_ID", "count"),
        with_resolved_at=("Resolved_At", lambda x: x.notna().sum()),
        with_resolution_text=("Resolution_Text", lambda x: x.notna().sum()),
    )
)

status_resolution["resolved_at_pct"] = (
    status_resolution["with_resolved_at"]
    / status_resolution["complaints"]
    * 100
)

print(status_resolution.to_string())