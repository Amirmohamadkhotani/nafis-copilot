# Nafis Copilot — Frontend API Contract

Base URL for local development:

```text
http://localhost:8000
```

All endpoints return JSON. Missing financial or historical values are returned as `null`, not zero.

## 1. Dashboard API

### `GET /api/dashboard/summary`

Purpose: Provide portfolio-level counts for the sales-manager dashboard.

Example response:

```json
{
  "total_customers": 644,
  "recommendation_distribution": {
    "GROW": 20,
    "PROTECT_FIX": 115,
    "REDUCE_FOCUS": 2,
    "insufficient_evidence": 507
  },
  "signal_distribution": {
    "GROWTH_SIGNAL": 624,
    "PAYMENT_RISK": 64,
    "PROFITABILITY_SIGNAL": 4,
    "QUALITY_RISK": 115
  },
  "priority_distribution": {
    "Critical": 28,
    "High": 87,
    "Medium": 20,
    "Low": 2
  }
}
```

Important frontend fields:

- `total_customers`: Total customer population.
- `recommendation_distribution`: Counts across the complete population, including customers without an actionable recommendation.
- `signal_distribution`: Number of customers for whom each observable signal is present.
- `priority_distribution`: Counts for actionable recommendations only.

## 2. Customer List API

### `GET /api/customers`

Purpose: Return a lightweight customer list for tables, search, and navigation. This endpoint intentionally excludes the complete 49-column feature record.

Example response item:

```json
[
  {
    "customer_id": "C_292582",
    "historical_total_revenue": 9018315.27,
    "historical_invoice_count": 17,
    "historical_wallet_share_pct": 7.340675080075257,
    "complaint_count": 0,
    "open_complaint_count": 0,
    "median_payment_delay_days": 36.0,
    "returned_check_count": 0,
    "known_margin_pct": 10.073693420048595,
    "actual_cost_coverage_pct": 36.17021276595745,
    "profitability_status": "partial",
    "wallet_data_available": true
  }
]
```

Important frontend fields:

- `customer_id`: Stable customer key used by all detail endpoints.
- `historical_total_revenue`, `historical_invoice_count`: Historical commercial baseline.
- `historical_wallet_share_pct`: Historical wallet share, not current wallet share.
- `complaint_count`, `open_complaint_count`: Complaint context.
- `median_payment_delay_days`, `returned_check_count`: Collection context. Delay alone is not a blocking risk.
- `known_margin_pct`: Margin for revenue lines with known actual cost; interpret with `actual_cost_coverage_pct` and `profitability_status`.
- `wallet_data_available`: Whether historical wallet evidence exists.

The master dataset does not currently contain a suitable customer-name column, so list items do not include `customer_name`.

## 3. Customer Intelligence API

### `GET /api/customers/{customer_id}/intelligence`

Purpose: Provide the unified customer view for a Customer 360 page.

Example response (abridged evidence values, but with the complete response structure):

```json
{
  "customer_id": "C_117580",
  "profile": {
    "Customer_ID": "C_117580",
    "Location_ID": "LOC-007",
    "Customer_Segment": "B",
    "Relationship_Start_Date": "2020-02-10",
    "Credit_Limit": 604000,
    "Payment_Terms_Days": 0,
    "Customer_Status": "غیرفعال",
    "Source_System": "MDM",
    "Sales_Rep_ID": "REP-001"
  },
  "commercial_summary": {
    "historical_total_revenue": 42262437.16,
    "historical_invoice_count": 622
  },
  "rfm": {
    "available": true,
    "recency": 2145,
    "frequency": 622,
    "monetary": 42262437.16,
    "r_score": 1,
    "f_score": 4,
    "m_score": 4,
    "segment": "144"
  },
  "signals": {
    "risk_signals": [
      {
        "type": "QUALITY_RISK",
        "severity": "HIGH",
        "title": "Quality issues detected",
        "metrics": [
          {
            "name": "open_complaints",
            "value": 4,
            "source": "شکایات"
          },
          {
            "name": "high_severity_complaints",
            "value": 5,
            "source": "شکایات"
          }
        ]
      },
      {
        "type": "PAYMENT_RISK",
        "severity": "HIGH",
        "title": "Payment risk detected",
        "metrics": [
          {
            "name": "returned_checks",
            "value": 3,
            "source": "وصول"
          }
        ]
      }
    ],
    "opportunity_signals": [
      {
        "type": "GROWTH_SIGNAL",
        "severity": "MEDIUM",
        "title": "Historical expansion opportunity",
        "metrics": [
          {
            "name": "historical_wallet_share_pct",
            "value": 0.0,
            "source": "سهم_سبد"
          },
          {
            "name": "main_competitor",
            "value": "تأمین‌کننده محلی",
            "source": "سهم_سبد"
          },
          {
            "name": "historical_total_revenue",
            "value": 42262437.16,
            "source": "فروش"
          }
        ]
      }
    ],
    "economic_signals": []
  },
  "recommendation": {
    "customer_id": "C_117580",
    "recommendation_type": "PROTECT_FIX",
    "summary": "A blocking customer issue should be resolved before further sales activity.",
    "next_best_action": "Review and resolve the blocking issue before making a new sales proposal.",
    "evidence": [
      {
        "metric": "open_complaint_count",
        "value": 4,
        "source": "شکایات",
        "evidence_type": "FACT",
        "note": "Open complaint evidence as of 2026-07-23."
      },
      {
        "metric": "high_severity_count",
        "value": 5,
        "source": "شکایات",
        "evidence_type": "FACT",
        "note": "High-severity complaint evidence as of 2026-07-23."
      },
      {
        "metric": "returned_check_count",
        "value": 3,
        "source": "وصول",
        "evidence_type": "FACT",
        "note": "At least one returned check is observable as of 2026-07-23."
      }
    ],
    "blocking_risks": [
      "open_complaint",
      "returned_check"
    ],
    "suspended_opportunities": [
      {
        "recommendation_type": "GROW",
        "status": "suspended_until_risk_resolution",
        "note": "Historical wallet opportunity should be revisited after blocking risk resolution."
      }
    ],
    "confidence": "high",
    "priority": "Critical",
    "status": "ready"
  },
  "evidence": [
    {
      "metric": "open_complaint_count",
      "value": 4,
      "source": "شکایات",
      "evidence_type": "FACT",
      "note": "Open complaint evidence as of 2026-07-23."
    }
  ]
}
```

Important frontend fields:

- `profile`: Customer master attributes.
- `commercial_summary`: Historical revenue and invoice count.
- `rfm.available`: Check before rendering RFM values.
- `rfm.segment`: Concatenated R/F/M quartile scores. Lower recency days are better; R scoring is reversed so a higher R score represents more recent activity.
- `signals.risk_signals`: Observable complaint/payment risk facts.
- `signals.opportunity_signals`: Historical wallet evidence. A signal is not itself a recommendation.
- `signals.economic_signals`: Emitted only for negative economics with `actual` profitability and 100% actual-cost coverage.
- `recommendation`: Complete frozen recommendation result.
- `evidence`: The same recommendation evidence exposed at the top level for UI convenience; it is not independently generated.

Unknown customer response:

```json
{
  "detail": "Customer not found"
}
```

HTTP status: `404`.

## 4. Customer Recommendation API

### `GET /api/customers/{customer_id}/recommendation`

Purpose: Return one customer's full recommendation, including evidence and risk gating.

Example response:

```json
{
  "customer_id": "C_860828",
  "recommendation_type": "REDUCE_FOCUS",
  "summary": "Fully covered actual-cost evidence indicates negative account economics relative to its historical commercial value.",
  "next_best_action": "Reduce proactive expansion effort for this account and review its economics before allocating additional sales resources.",
  "evidence": [
    {
      "metric": "known_margin_amount",
      "value": -1670.3460999999809,
      "source": "اجزای_هزینه_تحقق",
      "evidence_type": "FACT",
      "note": "Known margin is negative with 100% actual-cost coverage."
    },
    {
      "metric": "known_margin_pct",
      "value": -0.7508670155152186,
      "source": "اجزای_هزینه_تحقق",
      "evidence_type": "FACT",
      "note": "Known margin percentage is based on fully covered actual costs."
    },
    {
      "metric": "actual_cost_coverage_pct",
      "value": 100.0,
      "source": "اجزای_هزینه_تحقق",
      "evidence_type": "FACT",
      "note": "Actual-cost coverage is complete."
    },
    {
      "metric": "negative_margin_lines",
      "value": 1.0,
      "source": "اجزای_هزینه_تحقق",
      "evidence_type": "FACT",
      "note": "At least one known-cost sales line has negative margin."
    },
    {
      "metric": "historical_total_revenue",
      "value": 222455.65,
      "source": "فروش",
      "evidence_type": "FACT",
      "note": "Historical commercial value is from 2020-01-01 through 2022-12-31."
    }
  ],
  "blocking_risks": [],
  "suspended_opportunities": [],
  "confidence": "medium",
  "priority": "Low",
  "status": "ready"
}
```

Important frontend fields:

- `recommendation_type`: `GROW`, `PROTECT_FIX`, `REDUCE_FOCUS`, or `null`.
- `priority`: `Critical`, `High`, `Medium`, `Low`, or `null`.
- `status`: `ready` or `insufficient_evidence`.
- `summary`: Human-readable reason for the recommendation.
- `next_best_action`: Suggested next step; can be `null` when evidence is insufficient.
- `blocking_risks`: Risk categories that caused PROTECT_FIX gating.
- `suspended_opportunities`: Opportunities to revisit after blocking-risk resolution.
- `confidence`: `high`, `medium`, or `limited`; this represents evidence coverage, not model probability.
- `evidence`: Structured facts/inferences supporting the output.

## 5. Recommendation Focus List API

### `GET /api/recommendations`

Optional filters:

```text
GET /api/recommendations?type=GROW
GET /api/recommendations?type=PROTECT_FIX
GET /api/recommendations?type=REDUCE_FOCUS
```

Purpose: Return the sales-manager Focus List. Only actionable recommendations are included in `recommendations`; insufficient-evidence customers remain represented in `summary`.

Example response:

```json
{
  "summary": {
    "total_customers": 644,
    "grow": 20,
    "protect_fix": 115,
    "reduce_focus": 2,
    "insufficient_evidence": 507,
    "actionable": 137
  },
  "recommendations": [
    {
      "customer_id": "CUST-003",
      "recommendation_type": "PROTECT_FIX",
      "priority": "Critical",
      "summary": "A blocking customer issue should be resolved before further sales activity.",
      "next_best_action": "Review and resolve the blocking issue before making a new sales proposal.",
      "confidence": "high",
      "blocking_risks": [
        "open_complaint",
        "complaint_linked_lab_rejection"
      ],
      "suspended_opportunities": []
    }
  ]
}
```

Important frontend fields:

- `summary`: Always describes all 644 customers, even when `type` is supplied.
- `recommendations`: Contains actionable recommendations only and intentionally excludes full evidence.
- List sorting: `Critical`, `High`, `Medium`, `Low`; within a priority, by recommendation type and customer ID.
- Use the customer recommendation or intelligence endpoint to load complete evidence after selection.

Invalid filter response:

```json
{
  "detail": "Invalid recommendation type"
}
```

HTTP status: `400`.

## UI Mapping

| UI area | Endpoint | Recommended use |
|---|---|---|
| Portfolio dashboard | `/api/dashboard/summary` | KPI cards and recommendation/signal/priority charts |
| Customer directory | `/api/customers` | Searchable and sortable lightweight table |
| Focus List | `/api/recommendations` | Action queue with optional recommendation-type tabs |
| Customer 360 | `/api/customers/{id}/intelligence` | Profile, commercial summary, RFM, categorized signals, recommendation, evidence |
| Recommendation detail | `/api/customers/{id}/recommendation` | Full explanation drawer or dedicated decision panel |

Suggested visual treatment:

- `Critical`: strongest urgent styling.
- `High`: prominent risk/action styling.
- `Medium`: opportunity styling.
- `Low`: restrained review styling.
- `insufficient_evidence`: neutral state; do not present it as a negative customer classification.
- Signals should be displayed separately from the recommendation so observable facts are not confused with prescribed action.

## Business Rules

The following boundaries are calibrated MVP heuristics derived from the hackathon dataset, not official Nafis business rules.

### GROW

Requires all of:

- Historical wallet share `<= 7.82%`.
- Historical revenue `>= 3,495,373.44`.
- Historical wallet data available.
- At least one historical invoice.
- No blocking risk.

Meaning: high historical commercial value plus relatively low historical Nafis wallet share. It does not assert the current wallet position.

### PROTECT_FIX

Triggered by any blocking risk:

- Open complaint.
- Returned check.
- Complaint-linked laboratory rejection.

Risk gating takes precedence over GROW. If both are supported, PROTECT_FIX is primary and GROW appears only in `suspended_opportunities`.

Payment delay alone does not create a blocking risk. A complaint alone is not automatically a confirmed quality failure; confirmed quality-failure evidence comes from complaint-linked lab rejections.

### REDUCE_FOCUS

Requires all of:

- `profitability_status == "actual"`.
- `actual_cost_coverage_pct == 100`.
- Negative `known_margin_amount`.
- At least one negative-margin line.
- Historical revenue `<= 597,852.27`.
- No blocking risk.

Meaning: before allocating additional proactive sales resources, review the account economics. It does not mean abandoning or losing the customer.

### Insufficient evidence

Customers satisfying none of the actionable rules return:

```json
{
  "recommendation_type": null,
  "priority": null,
  "status": "insufficient_evidence"
}
```

Do not force these customers into an action category in the UI.

## Explainability and Evidence Principles

1. **Fact, signal, and recommendation are distinct layers.** Metrics describe data; signals organize observable facts; recommendations prescribe an action.
2. **Missing is not zero.** Preserve `null`, especially for financial metrics. Do not render unavailable margin as `0%`.
3. **Profitability requires coverage context.** Always display `known_margin_pct` with `actual_cost_coverage_pct` and `profitability_status`.
4. **Wallet evidence is historical.** The available wallet period is 2021-07 through 2022-06. UI copy must not call it current wallet share.
5. **Complaints are not automatically quality failures.** Use `lab_reject_count` or linked lab-rejection evidence for confirmed quality failure.
6. **Signals are not actions.** A GROWTH_SIGNAL can coexist with a blocking risk; risk gating determines the recommendation.
7. **Evidence is structured.** Render `metric`, `value`, `source`, `evidence_type`, and `note` where space permits.
8. **Confidence is evidence coverage.** It is not a probability or predictive score.
9. **No numeric risk or opportunity score exists.** Do not synthesize one in the frontend.
10. **Use full evidence on demand.** Focus-list items are intentionally lightweight; retrieve recommendation or intelligence detail when a user opens a customer.
