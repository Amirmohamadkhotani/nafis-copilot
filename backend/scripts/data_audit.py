import pandas as pd

DATASET_PATH = "backend/data/DATASET.xlsx"

# فقط شیت‌هایی که الان برای MVP لازم داریم
SHEETS = {
    "customers": "مشتریان",
    "sales": "فروش",
    "complaints": "شکایات",
    "complaint_bridge": "اتصال_شکایت",
    "quality": "کیفیت_لات",
    "costs": "اجزای_هزینه_تحقق",
    "collections": "وصول",
    "wallet": "سهم_سبد",
}

print("Loading required sheets...")

dfs = {
    alias: pd.read_excel(DATASET_PATH, sheet_name=sheet_name)
    for alias, sheet_name in SHEETS.items()
}

print("Done.\n")


def check_key(df, key, table_name):
    """Check missing and duplicate primary keys."""

    if isinstance(key, list):
        missing = df[key].isna().any(axis=1).sum()
        duplicates = df.duplicated(subset=key).sum()
        key_name = " + ".join(key)
    else:
        missing = df[key].isna().sum()
        duplicates = df[key].duplicated().sum()
        key_name = key

    print(f"{table_name}")
    print(f"  rows: {len(df):,}")
    print(f"  key: {key_name}")
    print(f"  missing key: {missing:,}")
    print(f"  duplicate key: {duplicates:,}")
    print()


def relationship_coverage(
    from_df,
    from_col,
    to_df,
    to_col,
    relationship_name
):
    """Check how many foreign keys actually match the target table."""

    values = from_df[from_col].dropna()
    target_values = set(to_df[to_col].dropna())

    matched = values.isin(target_values).sum()
    total = len(values)

    coverage = matched / total * 100 if total else 0

    print(relationship_name)
    print(f"  source rows with key: {total:,}")
    print(f"  matched rows: {matched:,}")
    print(f"  unmatched rows: {total - matched:,}")
    print(f"  coverage: {coverage:.2f}%")
    print()


# --------------------------------------------------
# 1. PRIMARY KEY AUDIT
# --------------------------------------------------

print("=" * 60)
print("PRIMARY KEY AUDIT")
print("=" * 60)

check_key(
    dfs["customers"],
    "Customer_ID",
    "customers"
)

check_key(
    dfs["sales"],
    "Sales_Line_ID",
    "sales"
)

check_key(
    dfs["complaints"],
    "Complaint_ID",
    "complaints"
)

check_key(
    dfs["complaint_bridge"],
    ["Complaint_ID", "Sales_Line_ID"],
    "complaint_bridge"
)

check_key(
    dfs["quality"],
    "Quality_Record_ID",
    "quality"
)

check_key(
    dfs["costs"],
    "Cost_Record_ID",
    "actual_costs"
)

check_key(
    dfs["collections"],
    "Collection_ID",
    "collections"
)


# --------------------------------------------------
# 2. RELATIONSHIP AUDIT
# --------------------------------------------------

print("=" * 60)
print("RELATIONSHIP AUDIT")
print("=" * 60)

relationship_coverage(
    dfs["sales"],
    "Customer_ID",
    dfs["customers"],
    "Customer_ID",
    "sales -> customers"
)

relationship_coverage(
    dfs["complaints"],
    "Customer_ID",
    dfs["customers"],
    "Customer_ID",
    "complaints -> customers"
)

relationship_coverage(
    dfs["complaint_bridge"],
    "Complaint_ID",
    dfs["complaints"],
    "Complaint_ID",
    "complaint_bridge -> complaints"
)

relationship_coverage(
    dfs["complaint_bridge"],
    "Sales_Line_ID",
    dfs["sales"],
    "Sales_Line_ID",
    "complaint_bridge -> sales"
)

relationship_coverage(
    dfs["quality"],
    "Sales_Line_ID",
    dfs["sales"],
    "Sales_Line_ID",
    "quality -> sales"
)

relationship_coverage(
    dfs["costs"],
    "Sales_Line_ID",
    dfs["sales"],
    "Sales_Line_ID",
    "costs -> sales"
)

relationship_coverage(
    dfs["collections"],
    "Customer_ID",
    dfs["customers"],
    "Customer_ID",
    "collections -> customers"
)


# --------------------------------------------------
# 3. COMPLAINT -> QUALITY COVERAGE
# --------------------------------------------------

print("=" * 60)
print("COMPLAINT -> QUALITY COVERAGE")
print("=" * 60)

bridge = dfs["complaint_bridge"]
quality = dfs["quality"]

quality_sales_lines = set(
    quality["Sales_Line_ID"].dropna()
)

bridge_with_quality = bridge[
    bridge["Sales_Line_ID"].isin(quality_sales_lines)
]

complaints_with_quality = (
    bridge_with_quality["Complaint_ID"]
    .nunique()
)

total_complaints = dfs["complaints"]["Complaint_ID"].nunique()

print(f"total complaints: {total_complaints:,}")
print(
    f"complaint-sales links: "
    f"{len(bridge):,}"
)
print(
    f"links with direct quality record: "
    f"{len(bridge_with_quality):,}"
)
print(
    f"unique complaints with quality evidence: "
    f"{complaints_with_quality:,}"
)

if total_complaints:
    pct = complaints_with_quality / total_complaints * 100
    print(
        f"complaint quality coverage: "
        f"{pct:.2f}%"
    )

print()


# --------------------------------------------------
# 4. BASIC MVP COVERAGE
# --------------------------------------------------

print("=" * 60)
print("MVP DATA COVERAGE")
print("=" * 60)

sales_customers = set(
    dfs["sales"]["Customer_ID"].dropna()
)

complaint_customers = set(
    dfs["complaints"]["Customer_ID"].dropna()
)

collection_customers = set(
    dfs["collections"]["Customer_ID"].dropna()
)

wallet_customers = set(
    dfs["wallet"]["Customer_ID"].dropna()
)

all_customers = set(
    dfs["customers"]["Customer_ID"].dropna()
)

print(f"customers total: {len(all_customers):,}")
print(f"customers with sales: {len(sales_customers):,}")
print(f"customers with complaints: {len(complaint_customers):,}")
print(f"customers with collections: {len(collection_customers):,}")
print(f"customers with wallet data: {len(wallet_customers):,}")




print("=" * 60)
print("IMPORTANT COLUMNS")
print("=" * 60)

for table_name in [
    "sales",
    "costs",
    "collections",
    "complaints",
    "wallet",
]:
    print(f"\n[{table_name}]")

    for column in dfs[table_name].columns:
        print(f"  - {column}")