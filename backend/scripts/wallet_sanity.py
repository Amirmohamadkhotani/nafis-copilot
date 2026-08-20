from pathlib import Path
import pandas as pd


DATASET_PATH = (
    Path(__file__).resolve().parents[1]
    / "data"
    / "DATASET.xlsx"
)

AS_OF_DATE = pd.Timestamp("2026-07-23")


wallet = pd.read_excel(
    DATASET_PATH,
    sheet_name="سهم_سبد"
)


for col in ["Month_Key", "Available_At"]:
    wallet[col] = pd.to_datetime(
        wallet[col],
        errors="coerce"
    )


wallet_valid = wallet[
    wallet["Available_At"] <= AS_OF_DATE
].copy()


print("\n" + "=" * 70)
print("SHARE OF WALLET SANITY CHECK")
print("=" * 70)


print("\n--- BASIC COVERAGE ---")

print("Rows:", len(wallet_valid))
print(
    "Customers:",
    wallet_valid["Customer_ID"].nunique()
)

print(
    "First Month_Key:",
    wallet_valid["Month_Key"].min()
)

print(
    "Last Month_Key:",
    wallet_valid["Month_Key"].max()
)

print(
    "Max Available_At:",
    wallet_valid["Available_At"].max()
)


print("\n--- ROWS PER CUSTOMER ---")

rows_per_customer = (
    wallet_valid
    .groupby("Customer_ID")
    .size()
)

print(
    rows_per_customer
    .describe(
        percentiles=[0.25, 0.5, 0.75, 0.9]
    )
    .to_string()
)


print("\n--- PURCHASE VALUES ---")

estimated_total = pd.to_numeric(
    wallet_valid["Estimated_Total_Purchase"],
    errors="coerce"
)

nafis_purchase = pd.to_numeric(
    wallet_valid["Nafis_Purchase"],
    errors="coerce"
)

print("Estimated total purchase:")
print(estimated_total.describe().to_string())

print("\nNafis purchase:")
print(nafis_purchase.describe().to_string())


print("\n--- CONSISTENCY CHECK ---")

print(
    "Rows where Nafis_Purchase > Estimated_Total_Purchase:",
    (
        nafis_purchase > estimated_total
    ).sum()
)

print(
    "Rows with zero/negative estimated total:",
    (
        estimated_total <= 0
    ).sum()
)

print(
    "Rows with missing estimated total:",
    estimated_total.isna().sum()
)

print(
    "Rows with missing Nafis purchase:",
    nafis_purchase.isna().sum()
)


valid_denominator = estimated_total > 0

wallet_valid["share_of_wallet_pct"] = None

wallet_valid.loc[
    valid_denominator,
    "share_of_wallet_pct"
] = (
    nafis_purchase[valid_denominator]
    / estimated_total[valid_denominator]
    * 100
)


print("\n--- SHARE OF WALLET DISTRIBUTION ---")

share = pd.to_numeric(
    wallet_valid["share_of_wallet_pct"],
    errors="coerce"
)

print(
    share.describe(
        percentiles=[
            0.10,
            0.25,
            0.50,
            0.75,
            0.90,
        ]
    ).to_string()
)


print("\n--- ESTIMATE SOURCE ---")

print(
    wallet_valid["Estimate_Source"]
    .value_counts(dropna=False)
    .to_string()
)


print("\n--- MAIN COMPETITOR ---")

print(
    wallet_valid["Main_Competitor"]
    .value_counts(dropna=False)
    .head(15)
    .to_string()
)


print("=" * 70)