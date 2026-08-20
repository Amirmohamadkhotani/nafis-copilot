"""Read-only access to the validated customer master feature table."""

from pathlib import Path
from typing import Any

import numpy as np
import pandas as pd


CUSTOMER_MASTER_PATH = (
    Path(__file__).resolve().parents[2] / "data" / "customer_master_features.csv"
)

LIST_COLUMNS = {
    "Customer_ID": "customer_id",
    "historical_total_revenue": "historical_total_revenue",
    "historical_invoice_count": "historical_invoice_count",
    "historical_wallet_share_pct": "historical_wallet_share_pct",
    "complaint_count": "complaint_count",
    "open_complaint_count": "open_complaint_count",
    "median_payment_delay_days": "median_payment_delay_days",
    "returned_check_count": "returned_check_count",
    "known_margin_pct": "known_margin_pct",
    "actual_cost_coverage_pct": "actual_cost_coverage_pct",
    "profitability_status": "profitability_status",
    "wallet_data_available": "wallet_data_available",
}

CUSTOMER_NAME_COLUMNS = (
    "Customer_Name",
    "customer_name",
    "نام مشتری",
)


def _load_customers() -> pd.DataFrame:
    return pd.read_csv(CUSTOMER_MASTER_PATH, encoding="utf-8-sig")


_customers = _load_customers()


def _json_safe_value(value: Any) -> Any:
    if value is None or pd.isna(value):
        return None
    if isinstance(value, pd.Timestamp):
        return value.isoformat()
    if isinstance(value, np.generic):
        return value.item()
    return value


def _json_safe_record(record: dict[str, Any]) -> dict[str, Any]:
    return {key: _json_safe_value(value) for key, value in record.items()}


def get_all_customers() -> list[dict[str, Any]]:
    """Return the lightweight customer list used by the API."""
    selected_columns = dict(LIST_COLUMNS)
    for name_column in CUSTOMER_NAME_COLUMNS:
        if name_column in _customers.columns:
            selected_columns[name_column] = "customer_name"
            break

    records = (
        _customers[list(selected_columns)]
        .rename(columns=selected_columns)
        .to_dict(orient="records")
    )
    return [_json_safe_record(record) for record in records]


def get_customer_by_id(customer_id: str) -> dict[str, Any] | None:
    """Return a customer's complete master record, or None when absent."""
    matches = _customers.loc[_customers["Customer_ID"] == customer_id]
    if matches.empty:
        return None
    return _json_safe_record(matches.iloc[0].to_dict())
