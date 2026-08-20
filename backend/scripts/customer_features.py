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

print("\n" + "=" * 60)
print("WINDOW SANITY CHECK")
print("=" * 60)

recent_start = AS_OF_DATE - pd.Timedelta(days=90)
previous_start = AS_OF_DATE - pd.Timedelta(days=180)

recent_customers = set(
    invoices.loc[
        invoices["invoice_date"] > recent_start,
        "Customer_ID"
    ]
)

previous_customers = set(
    invoices.loc[
        (invoices["invoice_date"] > previous_start)
        & (invoices["invoice_date"] <= recent_start),
        "Customer_ID"
    ]
)

all_customers = set(invoices["Customer_ID"])

both = recent_customers & previous_customers
recent_only = recent_customers - previous_customers
previous_only = previous_customers - recent_customers
neither = all_customers - (recent_customers | previous_customers)

print(f"Customers total: {len(all_customers)}")
print(f"Customers with sales in last 90d: {len(recent_customers)}")
print(f"Customers with sales in previous 90d: {len(previous_customers)}")
print(f"Customers with sales in BOTH windows: {len(both)}")
print(f"Customers only in last 90d: {len(recent_only)}")
print(f"Customers only in previous 90d: {len(previous_only)}")
print(f"Customers in neither window: {len(neither)}")


print("\n--- DAYS SINCE LAST PURCHASE ---")

days = customer_features["days_since_last_purchase"]

print(days.describe(percentiles=[0.25, 0.5, 0.75, 0.9]).to_string())


print("\n--- INVOICE COUNT PER CUSTOMER ---")

invoice_counts = customer_features["invoice_count"]

print(
    invoice_counts.describe(
        percentiles=[0.25, 0.5, 0.75, 0.9]
    ).to_string()
)


print("\n--- INTER-PURCHASE GAP ---")

sorted_invoices = invoices.sort_values(
    ["Customer_ID", "invoice_date"]
).copy()

sorted_invoices["previous_invoice_date"] = (
    sorted_invoices
    .groupby("Customer_ID")["invoice_date"]
    .shift(1)
)

sorted_invoices["purchase_gap_days"] = (
    sorted_invoices["invoice_date"]
    - sorted_invoices["previous_invoice_date"]
).dt.days

purchase_gaps = sorted_invoices["purchase_gap_days"].dropna()

print(
    purchase_gaps.describe(
        percentiles=[0.25, 0.5, 0.75, 0.9]
    ).to_string()
)

print("=" * 60)

print("\n--- SALES DATE RANGE ---")

print("First invoice date:", invoices["invoice_date"].min())
print("Last invoice date:", invoices["invoice_date"].max())
print("As of date:", AS_OF_DATE)


print("\n--- ACTIVE CUSTOMERS BY LOOKBACK WINDOW ---")

for days_window in [30, 90, 180, 365, 730]:
    start = AS_OF_DATE - pd.Timedelta(days=days_window)

    active = invoices.loc[
        invoices["invoice_date"] > start,
        "Customer_ID"
    ].nunique()

    print(
        f"Active customers in last {days_window:>3} days: "
        f"{active} / {invoices['Customer_ID'].nunique()}"
    )


print("\n--- SALES BY YEAR ---")

yearly = (
    invoices
    .assign(year=invoices["invoice_date"].dt.year)
    .groupby("year")
    .agg(
        invoices=("شماره فاکتور", "nunique"),
        customers=("Customer_ID", "nunique"),
        revenue=("invoice_revenue", "sum"),
    )
)

print(yearly.to_string())