"""Read-only access to generated customer RFM features."""

from pathlib import Path
from typing import Any

import numpy as np
import pandas as pd


RFM_PATH = Path(__file__).resolve().parents[2] / "data" / "rfm_features.csv"


def _load_rfm() -> pd.DataFrame:
    return pd.read_csv(RFM_PATH, encoding="utf-8-sig", dtype={"RFM_Segment": "string"})


_rfm = _load_rfm()


def _native(value: Any) -> Any:
    if value is None or pd.isna(value):
        return None
    if isinstance(value, np.generic):
        return value.item()
    return value


def get_customer_rfm(customer_id: str) -> dict[str, Any] | None:
    """Return an existing customer's generated RFM record."""
    matches = _rfm.loc[_rfm["Customer_ID"] == customer_id]
    if matches.empty:
        return None

    record = matches.iloc[0]
    return {
        "available": True,
        "recency": _native(record["Recency"]),
        "frequency": _native(record["Frequency"]),
        "monetary": _native(record["Monetary"]),
        "r_score": _native(record["R_score"]),
        "f_score": _native(record["F_score"]),
        "m_score": _native(record["M_score"]),
        "segment": _native(record["RFM_Segment"]),
    }
