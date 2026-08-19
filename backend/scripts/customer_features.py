import pandas as pd
import numpy as np

DATASET_PATH = "backend/data/DATASET.xlsx"

# -----------------------------------------
# LOAD SALES
# -----------------------------------------

sales = pd.read_excel(
    DATASET_PATH,
    sheet_name="فروش"
)

sales["تاریخ"] = pd.to_datetime(sales["تاریخ"])
sales["Available_At"] = pd.to_datetime(sales["Available_At"])

# آخرین تاریخ قابل مشاهده در دیتاست
AS_OF_DATE = sales["Available_At"].max()

sales = sales[
    sales["Available_At"] <= AS_OF_DATE
].copy()

print(f"As of date: {AS_OF_DATE.date()}")
print(f"Sales rows: {len(sales):,}")


# -----------------------------------------
# INVOICE LEVEL
# -----------------------------------------
# چون یک فاکتور ممکن است چند Sales Line داشته باشد.

invoices = (
    sales
    .groupby(
        ["Customer_ID", "شماره فاکتور"],
        as_index=False
    )
    .agg(
        invoice_date=("تاریخ", "max"),
        invoice_revenue=("مبلغ کل", "sum"),
        invoice_quantity=("مقدار", "sum"),
    )
)

print(f"Invoices built: {len(invoices):,}")


# -----------------------------------------
# OVERALL CUSTOMER SALES FEATURES
# -----------------------------------------

customer_sales = (
    invoices
    .groupby("Customer_ID")
    .agg(
        total_revenue=("invoice_revenue", "sum"),
        total_quantity=("invoice_quantity", "sum"),
        invoice_count=("شماره فاکتور", "nunique"),
        avg_deal_size=("invoice_revenue", "mean"),
        last_purchase_date=("invoice_date", "max"),
    )
    .reset_index()
)


# -----------------------------------------
# 90-DAY SALES MOVEMENT
# -----------------------------------------

recent_start = AS_OF_DATE - pd.Timedelta(days=90)
previous_start = AS_OF_DATE - pd.Timedelta(days=180)

recent = invoices[
    (invoices["invoice_date"] > recent_start)
    & (invoices["invoice_date"] <= AS_OF_DATE)
]

previous = invoices[
    (invoices["invoice_date"] > previous_start)
    & (invoices["invoice_date"] <= recent_start)
]


recent_metrics = (
    recent
    .groupby("Customer_ID")
    .agg(
        revenue_last_90d=("invoice_revenue", "sum"),
        deals_last_90d=("شماره فاکتور", "nunique"),
        avg_deal_last_90d=("invoice_revenue", "mean"),
    )
    .reset_index()
)


previous_metrics = (
    previous
    .groupby("Customer_ID")
    .agg(
        revenue_prev_90d=("invoice_revenue", "sum"),
        deals_prev_90d=("شماره فاکتور", "nunique"),
        avg_deal_prev_90d=("invoice_revenue", "mean"),
    )
    .reset_index()
)


# -----------------------------------------
# MERGE
# -----------------------------------------

customer_features = (
    customer_sales
    .merge(
        recent_metrics,
        on="Customer_ID",
        how="left"
    )
    .merge(
        previous_metrics,
        on="Customer_ID",
        how="left"
    )
)

numeric_cols = [
    "revenue_last_90d",
    "deals_last_90d",
    "avg_deal_last_90d",
    "revenue_prev_90d",
    "deals_prev_90d",
    "avg_deal_prev_90d",
]

customer_features[numeric_cols] = (
    customer_features[numeric_cols]
    .fillna(0)
)


# -----------------------------------------
# CHANGE METRICS
# -----------------------------------------

customer_features["revenue_change_pct"] = np.where(
    customer_features["revenue_prev_90d"] > 0,
    (
        customer_features["revenue_last_90d"]
        - customer_features["revenue_prev_90d"]
    )
    / customer_features["revenue_prev_90d"]
    * 100,
    np.nan
)

customer_features["deal_size_change_pct"] = np.where(
    customer_features["avg_deal_prev_90d"] > 0,
    (
        customer_features["avg_deal_last_90d"]
        - customer_features["avg_deal_prev_90d"]
    )
    / customer_features["avg_deal_prev_90d"]
    * 100,
    np.nan
)

customer_features["days_since_last_purchase"] = (
    AS_OF_DATE
    - customer_features["last_purchase_date"]
).dt.days


# -----------------------------------------
# OUTPUT
# -----------------------------------------

print("\n=== CUSTOMER SALES FEATURES ===")

print(
    customer_features[
        [
            "Customer_ID",
            "total_revenue",
            "invoice_count",
            "avg_deal_size",
            "revenue_last_90d",
            "revenue_prev_90d",
            "revenue_change_pct",
            "deal_size_change_pct",
            "days_since_last_purchase",
        ]
    ]
    .head(10)
    .to_string(index=False)
)

print(f"\nCustomers: {len(customer_features):,}")