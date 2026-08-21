"""Real-data Customer360 aggregation from the source workbook."""

from functools import lru_cache
from pathlib import Path
from typing import Any

import numpy as np
import pandas as pd

from .recommendation_service import get_customer_recommendation
from .rfm_service import get_customer_rfm


DATASET_PATH = Path(__file__).resolve().parents[2] / "data" / "DATASET.xlsx"

SHEET_COLUMNS = {
    "مشتریان": [
        "Customer_ID", "Location_ID", "Customer_Segment", "Credit_Limit",
        "Payment_Terms_Days", "Customer_Status", "Sales_Rep_ID", "Source_System",
    ],
    "فاکتورها": ["شماره فاکتور", "تاریخ", "Customer_ID", "Available_At", "Source_System"],
    "فروش": [
        "Customer_ID", "Product_ID", "مقدار", "مبلغ کل", "شماره فاکتور",
        "تاریخ", "Source_System",
    ],
    "وصول": [
        "Collection_ID", "Customer_ID", "شماره فاکتور", "تاریخ فاکتور",
        "تاریخ سررسید", "تاریخ رویداد وصول", "مبلغ وصول", "روز تأخیر",
        "چک برگشتی", "Source_System",
    ],
    "شکایات": [
        "Complaint_ID", "Customer_ID", "Product_ID", "گروه کالا",
        "Complaint_Title", "Complaint_Text", "Severity", "Created_At",
        "Complaint_Status", "Resolved_At", "Resolution_Text", "Source_System",
    ],
    "تعاملات_CRM": [
        "Interaction_ID", "Record_Version", "Customer_ID", "Product_ID",
        "Event_Time", "Updated_At", "Interaction_Type", "Summary_Text",
        "Next_Action", "Record_Status", "Source_System", "Sales_Rep_ID",
    ],
    "آفرها": [
        "Offer_ID", "Customer_ID", "Offer_Date", "Product_ID", "گروه کالا",
        "Base_Price_per_unit", "Offered_Price_per_unit", "Offer_Discount_Pct",
        "Offer_Type", "Validity_Days", "Offer_Reason", "Result", "Decision_At",
        "Source_System",
    ],
    "محصولات": [
        "Product_ID", "شرح کالا", "Quality_Class_ID", "گروه کالا",
        "گروه رنگ", "زیرگروه کالا", "Source_System",
    ],
}


@lru_cache(maxsize=1)
def _load_sheets() -> dict[str, pd.DataFrame]:
    """Load only Customer360 source columns once per API process."""
    return {
        sheet: pd.read_excel(DATASET_PATH, sheet_name=sheet, usecols=columns)
        for sheet, columns in SHEET_COLUMNS.items()
    }


def _value(value: Any) -> Any:
    if value is None or pd.isna(value):
        return None
    if isinstance(value, pd.Timestamp):
        return value.date().isoformat() if value.time() == pd.Timestamp(0).time() else value.isoformat()
    if isinstance(value, np.generic):
        return value.item()
    return value


def _amount(value: Any) -> float | None:
    native = _value(value)
    return round(float(native), 2) if native is not None else None


def _records(frame: pd.DataFrame, rename: dict[str, str]) -> list[dict[str, Any]]:
    selected = frame[list(rename)].rename(columns=rename)
    return [
        {key: _value(value) for key, value in record.items()}
        for record in selected.to_dict(orient="records")
    ]


def _customer_rows(frame: pd.DataFrame, customer_id: str) -> pd.DataFrame:
    return frame.loc[frame["Customer_ID"].astype(str) == customer_id].copy()


def get_customer_360(customer_id: str) -> dict[str, Any] | None:
    """Return a clean Customer360 contract composed only from real source data."""
    sheets = _load_sheets()
    customer_rows = _customer_rows(sheets["مشتریان"], customer_id)
    if customer_rows.empty:
        return None

    customer = customer_rows.iloc[0]
    invoices = _customer_rows(sheets["فاکتورها"], customer_id)
    sales = _customer_rows(sheets["فروش"], customer_id)
    collections = _customer_rows(sheets["وصول"], customer_id)
    complaints = _customer_rows(sheets["شکایات"], customer_id)
    interactions = _customer_rows(sheets["تعاملات_CRM"], customer_id)
    offers = _customer_rows(sheets["آفرها"], customer_id)

    invoice_dates = pd.to_datetime(invoices["تاریخ"], errors="coerce")
    last_invoice = None
    if invoice_dates.notna().any():
        last_index = invoice_dates.idxmax()
        last_invoice_row = invoices.loc[last_index]
        invoice_sales = sales.loc[sales["شماره فاکتور"] == last_invoice_row["شماره فاکتور"]]
        last_invoice = {
            "invoice_number": _value(last_invoice_row["شماره فاکتور"]),
            "invoice_date": _value(pd.to_datetime(last_invoice_row["تاریخ"])),
            "amount": _amount(pd.to_numeric(invoice_sales["مبلغ کل"], errors="coerce").sum(min_count=1)),
            "source": _value(last_invoice_row["Source_System"]),
        }

    lifetime_revenue = pd.to_numeric(sales["مبلغ کل"], errors="coerce").sum(min_count=1)
    total_collected = pd.to_numeric(collections["مبلغ وصول"], errors="coerce").sum(min_count=1)
    payment_delays = pd.to_numeric(collections["روز تأخیر"], errors="coerce")
    returned_checks = collections["چک برگشتی"].astype(str).str.strip().eq("بله")

    latest_collections = collections.assign(
        _event_date=pd.to_datetime(collections["تاریخ رویداد وصول"], errors="coerce")
    ).sort_values("_event_date", ascending=False).head(20)

    interactions = interactions.sort_values(
        ["Interaction_ID", "Record_Version"], ascending=[True, False]
    ).drop_duplicates("Interaction_ID").sort_values("Event_Time", ascending=False)
    complaints = complaints.sort_values("Created_At", ascending=False)
    offers = offers.sort_values("Offer_Date", ascending=False)

    product_totals = (
        sales.groupby("Product_ID", dropna=False)
        .agg(
            purchased_quantity=("مقدار", "sum"),
            revenue=("مبلغ کل", "sum"),
            invoice_count=("شماره فاکتور", "nunique"),
            last_purchase=("تاریخ", "max"),
        )
        .reset_index()
        .sort_values("revenue", ascending=False)
        .head(10)
        .merge(sheets["محصولات"], on="Product_ID", how="left")
    )

    outstanding_amount = None
    if pd.notna(lifetime_revenue) and pd.notna(total_collected):
        outstanding_amount = lifetime_revenue - total_collected

    return {
        "customer_id": customer_id,
        "profile": {
            "customer_name": None,
            "customer_id": customer_id,
            "segment": _value(customer["Customer_Segment"]),
            "location": _value(customer["Location_ID"]),
            "sales_rep": _value(customer["Sales_Rep_ID"]),
            "status": _value(customer["Customer_Status"]),
            "source": _value(customer["Source_System"]),
        },
        "commercial": {
            "lifetime_revenue": _amount(lifetime_revenue),
            "invoice_count": int(invoices["شماره فاکتور"].nunique()),
            "last_invoice": last_invoice,
            "source": "فروش + فاکتورها",
        },
        "financial": {
            "credit_limit": _value(customer["Credit_Limit"]),
            "payment_terms_days": _value(customer["Payment_Terms_Days"]),
            "median_payment_delay_days": _value(payment_delays.median()),
            "returned_check_count": int(returned_checks.sum()),
            "collection_count": int(len(collections)),
            "total_collected": _amount(total_collected),
            "outstanding_amount": _amount(outstanding_amount),
            "outstanding_method": "lifetime_revenue_minus_total_collected",
            "recent_collections": _records(latest_collections, {
                "Collection_ID": "collection_id", "شماره فاکتور": "invoice_number",
                "تاریخ سررسید": "due_date", "تاریخ رویداد وصول": "collection_date",
                "مبلغ وصول": "amount", "روز تأخیر": "delay_days",
                "چک برگشتی": "returned_check", "Source_System": "source",
            }),
        },
        "complaints": _records(complaints, {
            "Complaint_ID": "complaint_id", "Product_ID": "product_id",
            "گروه کالا": "product_group", "Complaint_Title": "title",
            "Complaint_Text": "text", "Severity": "severity", "Created_At": "created_at",
            "Complaint_Status": "status", "Resolved_At": "resolved_at",
            "Resolution_Text": "resolution", "Source_System": "source",
        }),
        "interactions": _records(interactions, {
            "Interaction_ID": "interaction_id", "Record_Version": "record_version",
            "Product_ID": "product_id", "Event_Time": "event_time",
            "Interaction_Type": "interaction_type", "Summary_Text": "summary",
            "Next_Action": "next_action", "Record_Status": "status",
            "Sales_Rep_ID": "sales_rep", "Source_System": "source",
        }),
        "offers": _records(offers, {
            "Offer_ID": "offer_id", "Offer_Date": "offer_date", "Product_ID": "product_id",
            "گروه کالا": "product_group", "Base_Price_per_unit": "base_price_per_unit",
            "Offered_Price_per_unit": "offered_price_per_unit",
            "Offer_Discount_Pct": "discount_pct", "Offer_Type": "offer_type",
            "Validity_Days": "validity_days", "Offer_Reason": "reason", "Result": "result",
            "Decision_At": "decision_at", "Source_System": "source",
        }),
        "products": _records(product_totals, {
            "Product_ID": "product_id", "شرح کالا": "description",
            "گروه کالا": "product_group", "گروه رنگ": "color_group",
            "زیرگروه کالا": "product_subgroup", "Quality_Class_ID": "quality_class_id",
            "purchased_quantity": "purchased_quantity", "revenue": "revenue",
            "invoice_count": "invoice_count", "last_purchase": "last_purchase",
        }),
        "rfm": get_customer_rfm(customer_id) or {"available": False},
        "recommendation": get_customer_recommendation(customer_id),
    }
