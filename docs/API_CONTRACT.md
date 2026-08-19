# Nafis Copilot API Contract

Base URL:

http://localhost:8000

## Health

GET /api/health

Response:

{
  "status": "ok",
  "service": "nafis-copilot-api"
}

---

## Customer List

GET /api/customers

Response:

[
  {
    "customer_id": "CUST-003",
    "segment": "B",
    "status": "active"
  }
]

---

## Customer 360

GET /api/customers/{customer_id}

Response:

{
  "customer_id": "CUST-003",

  "overview": {
    "total_revenue": 7203837.4,
    "invoice_count": 8,
    "avg_deal_size": 900479.67,
    "days_since_last_purchase": 43
  },

  "sales": {
    "revenue_last_90d": 770944,
    "revenue_prev_90d": 0,
    "revenue_change_pct": null,
    "deal_size_change_pct": null
  },

  "financial": {
    "margin_pct": null,
    "average_payment_delay": null,
    "returned_checks": null
  },

  "complaints": {
    "total": null,
    "open": null,
    "high_severity": null
  },

  "wallet": {
    "share_pct": null,
    "main_competitor": null
  },

  "intelligence": {
    "summary": null,
    "risks": [],
    "opportunities": [],
    "next_best_action": null
  }
}

---

## Copilot

POST /api/copilot/chat

Request:

{
  "customer_id": "CUST-003",
  "message": "Why is this customer important right now?"
}

Response:

{
  "answer": "Mock response until AI backend is ready.",
  "evidence": []
}