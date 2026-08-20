from pathlib import Path
import pandas as pd


DATASET_PATH = (
    Path(__file__).resolve().parents[2]
    / "backend"
    / "data"
    / "DATASET.xlsx"
)

collections = pd.read_excel(
    DATASET_PATH,
    sheet_name="وصول"
)

# Parse dates
for col in [
    "تاریخ فاکتور",
    "تاریخ سررسید",
    "تاریخ رویداد وصول",
    "Available_At",
]:
    collections[col] = pd.to_datetime(
        collections[col],
        errors="coerce"
    )
today = pd.Timestamp("2026-08-20")

future_collection_events = collections[
    collections["تاریخ رویداد وصول"] > today
][[
    "Collection_ID",
    "Customer_ID",
    "شماره فاکتور",
    "تاریخ فاکتور",
    "تاریخ سررسید",
    "تاریخ رویداد وصول",
    "Available_At",
    "مبلغ وصول",
    "روز تأخیر",
    "چک برگشتی",
]]

AS_OF_DATE = pd.Timestamp("2026-07-23")

collections_valid = collections[
    (collections["Available_At"] <= AS_OF_DATE)
    & (
        collections["تاریخ رویداد وصول"].isna()
        | (collections["تاریخ رویداد وصول"] <= AS_OF_DATE)
    )
].copy()

print("\n--- POINT-IN-TIME FILTER ---")
print("Original rows:", len(collections))
print("Valid rows at cutoff:", len(collections_valid))
print("Excluded future rows:", len(collections) - len(collections_valid))
print(
    "Customers retained:",
    collections_valid["Customer_ID"].nunique()
)

collections = collections_valid

print("\n--- FUTURE COLLECTION EVENT SAMPLE ---")
print(future_collection_events.head(20).to_string(index=False))

print("\nFuture rows:", len(future_collection_events))
print("Amount > 0:", (future_collection_events["مبلغ وصول"] > 0).sum())
print("Amount = 0:", (future_collection_events["مبلغ وصول"] == 0).sum())
print("Amount missing:", future_collection_events["مبلغ وصول"].isna().sum())

print("\n--- FUTURE EVENT VS DUE DATE ---")

print(
    future_collection_events[
        [
            "تاریخ سررسید",
            "تاریخ رویداد وصول",
            "مبلغ وصول",
            "روز تأخیر",
        ]
    ].head(20).to_string(index=False)
)

print("\n" + "=" * 65)
print("PAYMENT / COLLECTION SANITY CHECK")
print("=" * 65)

print(f"Collection rows: {len(collections):,}")
print(
    "Customers with collection data:",
    collections["Customer_ID"].nunique()
)

print("\n--- DATE RANGE ---")
print(
    "First invoice date:",
    collections["تاریخ فاکتور"].min()
)
print(
    "Last invoice date:",
    collections["تاریخ فاکتور"].max()
)
print(
    "First collection event:",
    collections["تاریخ رویداد وصول"].min()
)
print(
    "Last collection event:",
    collections["تاریخ رویداد وصول"].max()
)
print(
    "Max Available_At:",
    collections["Available_At"].max()
)


print("\n--- PAYMENT DELAY DISTRIBUTION ---")

delay = pd.to_numeric(
    collections["روز تأخیر"],
    errors="coerce"
)

print(
    delay.describe(
        percentiles=[0.25, 0.5, 0.75, 0.9, 0.95]
    ).to_string()
)

print("\nNegative delay rows:", (delay < 0).sum())
print("Zero delay rows:", (delay == 0).sum())
print("Positive delay rows:", (delay > 0).sum())


print("\n--- LATE PAYMENT RATE ---")

valid_delay = delay.notna()

print(
    "Rows with valid delay:",
    valid_delay.sum()
)

print(
    "Late rows:",
    ((delay > 0) & valid_delay).sum()
)

if valid_delay.sum() > 0:
    late_rate = (
        ((delay > 0) & valid_delay).sum()
        / valid_delay.sum()
        * 100
    )

    print(
        f"Late payment event rate: {late_rate:.2f}%"
    )


print("\n--- RETURNED CHECKS ---")

returned_raw = collections["چک برگشتی"]

print(returned_raw.value_counts(
    dropna=False
).to_string())


# More robust detection for Persian / boolean / numeric values
returned_text = (
    returned_raw
    .astype(str)
    .str.strip()
    .str.lower()
)

returned_mask = returned_text.isin([
    "1",
    "true",
    "yes",
    "بله",
    "برگشتی",
])

print(
    "\nDetected returned-check events:",
    returned_mask.sum()
)

print(
    "Customers with returned check:",
    collections.loc[
        returned_mask,
        "Customer_ID"
    ].nunique()
)


print("\n--- CUSTOMER LEVEL COVERAGE ---")

customer_payment = (
    collections
    .assign(
        delay_days=delay,
        is_late=delay > 0,
        returned_check=returned_mask,
    )
    .groupby("Customer_ID")
    .agg(
        collection_events=("Collection_ID", "count"),

        avg_delay_days=(
            "delay_days",
            "mean"
        ),

        median_delay_days=(
            "delay_days",
            "median"
        ),

        late_payment_rate=(
            "is_late",
            "mean"
        ),

        returned_check_count=(
            "returned_check",
            "sum"
        ),

        last_collection_event=(
            "تاریخ رویداد وصول",
            "max"
        ),
    )
)

customer_payment["late_payment_rate"] *= 100


print(
    customer_payment[
        [
            "collection_events",
            "avg_delay_days",
            "median_delay_days",
            "late_payment_rate",
            "returned_check_count",
        ]
    ]
    .describe(
        percentiles=[0.25, 0.5, 0.75, 0.9]
    )
    .to_string()
)


print("\n--- COLLECTION EVENTS PER CUSTOMER ---")

print(
    customer_payment["collection_events"]
    .describe(
        percentiles=[0.25, 0.5, 0.75, 0.9]
    )
    .to_string()
)


print("=" * 65)