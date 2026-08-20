"""Calculate customer-level RFM features from the sales sheet."""

from pathlib import Path

import pandas as pd


DATASET_PATH = Path(__file__).resolve().parents[1] / "data" / "DATASET.xlsx"
OUTPUT_PATH = Path(__file__).resolve().parents[1] / "data" / "rfm_features.csv"


def calculate_rfm() -> pd.DataFrame:
    sales = pd.read_excel(
        DATASET_PATH,
        sheet_name="فروش",
        usecols=["Customer_ID", "تاریخ", "مبلغ کل", "شماره فاکتور"],
    )
    sales["تاریخ"] = pd.to_datetime(sales["تاریخ"], errors="coerce")
    sales["مبلغ کل"] = pd.to_numeric(sales["مبلغ کل"], errors="coerce")
    sales = sales.dropna(subset=["Customer_ID", "تاریخ"])

    reference_date = sales["تاریخ"].max() + pd.Timedelta(days=1)
    rfm = sales.groupby("Customer_ID", as_index=False).agg(
        last_transaction_date=("تاریخ", "max"),
        Frequency=("شماره فاکتور", "nunique"),
        Monetary=("مبلغ کل", lambda values: values.sum(min_count=1)),
    )
    rfm["Recency"] = (reference_date - rfm["last_transaction_date"]).dt.days

    rfm["R_score"] = pd.qcut(
        rfm["Recency"],
        q=4,
        labels=[4, 3, 2, 1],
    ).astype("int64")
    rfm["F_score"] = pd.qcut(
        rfm["Frequency"].rank(method="first"),
        q=4,
        labels=[1, 2, 3, 4],
    ).astype("int64")
    rfm["M_score"] = pd.qcut(
        rfm["Monetary"].rank(method="first"),
        q=4,
        labels=[1, 2, 3, 4],
    ).astype("int64")
    rfm["RFM_Segment"] = (
        rfm["R_score"].astype(str)
        + rfm["F_score"].astype(str)
        + rfm["M_score"].astype(str)
    )

    return rfm[[
        "Customer_ID",
        "Recency",
        "Frequency",
        "Monetary",
        "R_score",
        "F_score",
        "M_score",
        "RFM_Segment",
    ]]


def main() -> None:
    rfm = calculate_rfm()
    rfm.to_csv(OUTPUT_PATH, index=False, encoding="utf-8-sig")
    transaction_dates = pd.to_datetime(
        pd.read_excel(DATASET_PATH, sheet_name="فروش", usecols=["تاریخ"])["تاریخ"],
        errors="coerce",
    )
    print(f"Reference date: {(transaction_dates.max() + pd.Timedelta(days=1)).date()}")
    print(f"Customers: {len(rfm):,}")
    print(rfm.head(10).to_string(index=False))
    print(f"Saved: {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
