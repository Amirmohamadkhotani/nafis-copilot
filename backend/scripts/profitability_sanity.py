from pathlib import Path
import pandas as pd


DATASET_PATH = (
    Path(__file__).resolve().parents[1]
    / "data"
    / "DATASET.xlsx"
)

AS_OF_DATE = pd.Timestamp("2026-07-23")


sales = pd.read_excel(
    DATASET_PATH,
    sheet_name="فروش"
)

costs = pd.read_excel(
    DATASET_PATH,
    sheet_name="اجزای_هزینه_تحقق"
)


# -----------------------------
# Parse dates
# -----------------------------

sales["Available_At"] = pd.to_datetime(
    sales["Available_At"],
    errors="coerce"
)

costs["Available_At"] = pd.to_datetime(
    costs["Available_At"],
    errors="coerce"
)

costs["Cost_Close_Date"] = pd.to_datetime(
    costs["Cost_Close_Date"],
    errors="coerce"
)


# -----------------------------
# Point-in-time filter
# -----------------------------

sales_valid = sales[
    sales["Available_At"] <= AS_OF_DATE
].copy()

costs_valid = costs[
    (costs["Available_At"] <= AS_OF_DATE)
    & (
        costs["Cost_Close_Date"].isna()
        | (costs["Cost_Close_Date"] <= AS_OF_DATE)
    )
].copy()


print("\n" + "=" * 70)
print("PROFITABILITY / ACTUAL COST SANITY CHECK")
print("=" * 70)

print("\n--- POINT-IN-TIME COVERAGE ---")

print("Sales rows:", len(sales_valid))
print("Actual cost rows:", len(costs_valid))

print(
    "Sales lines with actual cost:",
    costs_valid["Sales_Line_ID"].nunique()
)

print(
    "Unique sales lines:",
    sales_valid["Sales_Line_ID"].nunique()
)

coverage = (
    costs_valid["Sales_Line_ID"].nunique()
    / sales_valid["Sales_Line_ID"].nunique()
    * 100
)

print(f"Actual cost coverage: {coverage:.2f}%")


# -----------------------------
# Join sales to actual cost
# -----------------------------

merged = sales_valid.merge(
    costs_valid[
        [
            "Sales_Line_ID",
            "هزینه کل به ازای واحد",
            "مقدار برگشتی",
            "مبلغ برگشتی",
        ]
    ],
    on="Sales_Line_ID",
    how="left",
    validate="1:1",
)


print("\n--- JOIN CHECK ---")

print("Merged rows:", len(merged))

print(
    "Rows with actual cost:",
    merged["هزینه کل به ازای واحد"].notna().sum()
)

print(
    "Rows without actual cost:",
    merged["هزینه کل به ازای واحد"].isna().sum()
)


# -----------------------------
# Margin calculation
# only where actual cost exists
# -----------------------------

known = merged[
    merged["هزینه کل به ازای واحد"].notna()
].copy()

known["gross_sales"] = pd.to_numeric(
    known["مبلغ کل"],
    errors="coerce"
)

known["quantity"] = pd.to_numeric(
    known["مقدار"],
    errors="coerce"
)

known["unit_cost"] = pd.to_numeric(
    known["هزینه کل به ازای واحد"],
    errors="coerce"
)

known["actual_cost_total"] = (
    known["unit_cost"]
    * known["quantity"]
)

known["gross_margin_amount"] = (
    known["gross_sales"]
    - known["actual_cost_total"]
)

known["gross_margin_pct"] = (
    known["gross_margin_amount"]
    / known["gross_sales"]
    * 100
)


print("\n--- MARGIN DISTRIBUTION ---")

print(
    known["gross_margin_pct"]
    .describe(
        percentiles=[
            0.10,
            0.25,
            0.50,
            0.75,
            0.90,
        ]
    )
    .to_string()
)

print(
    "\nNegative-margin sales lines:",
    (known["gross_margin_pct"] < 0).sum()
)

print(
    "Zero-margin sales lines:",
    (known["gross_margin_pct"] == 0).sum()
)

print(
    "Positive-margin sales lines:",
    (known["gross_margin_pct"] > 0).sum()
)


# -----------------------------
# Customer-level coverage
# -----------------------------

customer_coverage = (
    merged
    .assign(
        has_actual_cost=
        merged["هزینه کل به ازای واحد"].notna()
    )
    .groupby("Customer_ID")
    .agg(
        sales_lines=("Sales_Line_ID", "count"),
        cost_known_lines=("has_actual_cost", "sum"),
    )
)

customer_coverage["cost_coverage_pct"] = (
    customer_coverage["cost_known_lines"]
    / customer_coverage["sales_lines"]
    * 100
)


print("\n--- CUSTOMER COST COVERAGE ---")

print(
    customer_coverage["cost_coverage_pct"]
    .describe(
        percentiles=[
            0.25,
            0.50,
            0.75,
            0.90,
        ]
    )
    .to_string()
)

print(
    "\nCustomers with zero actual-cost coverage:",
    (customer_coverage["cost_coverage_pct"] == 0).sum()
)

print(
    "Customers with partial actual-cost coverage:",
    (
        (customer_coverage["cost_coverage_pct"] > 0)
        & (customer_coverage["cost_coverage_pct"] < 100)
    ).sum()
)

print(
    "Customers with full actual-cost coverage:",
    (customer_coverage["cost_coverage_pct"] == 100).sum()
)


# -----------------------------
# Customer profitability
# only based on known-cost lines
# -----------------------------

customer_profitability = (
    known
    .groupby("Customer_ID")
    .agg(
        known_revenue=("gross_sales", "sum"),
        known_cost=("actual_cost_total", "sum"),
        known_margin_amount=("gross_margin_amount", "sum"),
        known_sales_lines=("Sales_Line_ID", "count"),
    )
)

customer_profitability["known_margin_pct"] = (
    customer_profitability["known_margin_amount"]
    / customer_profitability["known_revenue"]
    * 100
)


print("\n--- CUSTOMER KNOWN-COST MARGIN ---")

print(
    customer_profitability["known_margin_pct"]
    .describe(
        percentiles=[
            0.10,
            0.25,
            0.50,
            0.75,
            0.90,
        ]
    )
    .to_string()
)

print("=" * 70)


print("\n--- LOT-BASED COST IMPUTATION CHECK ---")

# Merge lot identifiers into known-cost lines
lot_costs = merged[
    merged["هزینه کل به ازای واحد"].notna()
][[
    "Sales_Line_ID",
    "Lot_ID",
    "Hembaft_Lot_Key",
    "هزینه کل به ازای واحد",
]].copy()

# 1) Lot_ID based evidence
lot_id_stats = (
    lot_costs
    .dropna(subset=["Lot_ID"])
    .groupby("Lot_ID")
    .agg(
        observed_lines=("Sales_Line_ID", "count"),
        unit_cost_mean=("هزینه کل به ازای واحد", "mean"),
        unit_cost_std=("هزینه کل به ازای واحد", "std"),
        unit_cost_min=("هزینه کل به ازای واحد", "min"),
        unit_cost_max=("هزینه کل به ازای واحد", "max"),
    )
)

lot_id_stats["unit_cost_range_pct"] = (
    (lot_id_stats["unit_cost_max"] - lot_id_stats["unit_cost_min"])
    / lot_id_stats["unit_cost_mean"]
    * 100
)

print("\nLot_ID groups with observed actual cost:", len(lot_id_stats))

print(
    "Lot_ID groups with multiple observed cost lines:",
    (lot_id_stats["observed_lines"] > 1).sum()
)

multi_lot_id = lot_id_stats[
    lot_id_stats["observed_lines"] > 1
]

if len(multi_lot_id) > 0:
    print("\nLot_ID unit-cost variation:")
    print(
        multi_lot_id["unit_cost_range_pct"]
        .describe(
            percentiles=[0.25, 0.5, 0.75, 0.9]
        )
        .to_string()
    )


# 2) Hembaft_Lot_Key based evidence
hembaft_stats = (
    lot_costs
    .dropna(subset=["Hembaft_Lot_Key"])
    .groupby("Hembaft_Lot_Key")
    .agg(
        observed_lines=("Sales_Line_ID", "count"),
        unit_cost_mean=("هزینه کل به ازای واحد", "mean"),
        unit_cost_std=("هزینه کل به ازای واحد", "std"),
        unit_cost_min=("هزینه کل به ازای واحد", "min"),
        unit_cost_max=("هزینه کل به ازای واحد", "max"),
    )
)

hembaft_stats["unit_cost_range_pct"] = (
    (hembaft_stats["unit_cost_max"] - hembaft_stats["unit_cost_min"])
    / hembaft_stats["unit_cost_mean"]
    * 100
)

print("\nHembaft_Lot_Key groups with observed actual cost:", len(hembaft_stats))

print(
    "Hembaft_Lot_Key groups with multiple observed cost lines:",
    (hembaft_stats["observed_lines"] > 1).sum()
)

multi_hembaft = hembaft_stats[
    hembaft_stats["observed_lines"] > 1
]

if len(multi_hembaft) > 0:
    print("\nHembaft_Lot_Key unit-cost variation:")
    print(
        multi_hembaft["unit_cost_range_pct"]
        .describe(
            percentiles=[0.25, 0.5, 0.75, 0.9]
        )
        .to_string()
    )


# 3) Coverage gain for missing-cost sales lines
missing_cost = merged[
    merged["هزینه کل به ازای واحد"].isna()
].copy()

known_lot_ids = set(
    lot_costs["Lot_ID"].dropna().unique()
)

known_hembaft_keys = set(
    lot_costs["Hembaft_Lot_Key"].dropna().unique()
)

missing_cost["can_impute_by_lot_id"] = (
    missing_cost["Lot_ID"].isin(known_lot_ids)
)

missing_cost["can_impute_by_hembaft"] = (
    missing_cost["Hembaft_Lot_Key"].isin(known_hembaft_keys)
)

missing_cost["can_impute_any_lot"] = (
    missing_cost["can_impute_by_lot_id"]
    | missing_cost["can_impute_by_hembaft"]
)

print("\nMissing-cost sales lines:", len(missing_cost))

print(
    "Recoverable via Lot_ID:",
    missing_cost["can_impute_by_lot_id"].sum()
)

print(
    "Recoverable via Hembaft_Lot_Key:",
    missing_cost["can_impute_by_hembaft"].sum()
)

print(
    "Recoverable via either lot key:",
    missing_cost["can_impute_any_lot"].sum()
)

if len(missing_cost) > 0:
    print(
        "Potential coverage gain:",
        f"{missing_cost['can_impute_any_lot'].mean() * 100:.2f}% of missing-cost lines"
    )

    print("\n--- RETURNS SANITY CHECK ---")

return_amount = pd.to_numeric(
    known["مبلغ برگشتی"],
    errors="coerce"
).fillna(0)

return_quantity = pd.to_numeric(
    known["مقدار برگشتی"],
    errors="coerce"
).fillna(0)

returned_rows = known[
    (return_amount > 0) | (return_quantity > 0)
]

print("Known-cost sales lines:", len(known))
print("Sales lines with return:", len(returned_rows))

print(
    "Customers with at least one return:",
    returned_rows["Customer_ID"].nunique()
)

print(
    "Total return amount:",
    return_amount.sum()
)

print(
    "Known gross sales:",
    known["gross_sales"].sum()
)

if known["gross_sales"].sum() > 0:
    print(
        "Return amount / known gross sales:",
        f"{return_amount.sum() / known['gross_sales'].sum() * 100:.2f}%"
    )

print("\nReturn amount distribution (returned lines only):")

print(
    return_amount[return_amount > 0]
    .describe(
        percentiles=[0.25, 0.50, 0.75, 0.90]
    )
    .to_string()
)