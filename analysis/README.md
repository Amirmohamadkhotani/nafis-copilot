# Analytics Workspace

This folder is for experimental analytics and feature engineering.

## Structure

- experiments/
  - RFM
  - sales trends
  - payment behaviour
  - profitability
  - risk signals
  - other experiments

- outputs/
  - temporary derived datasets
  - sample CSV outputs
  - validation results

- docs/
  - metric definitions
  - assumptions
  - findings
  - experiment notes

## Rules

1. Do not modify raw DATASET.xlsx or METADATA.xlsx.
2. Derived features must be reproducible by code.
3. Experimental logic stays here until validated.
4. Validated reusable logic can later be moved to backend/analytics.
5. Do not define business decision thresholds without team agreement.
6. Do not commit large generated datasets.
7. Always work on the analytics branch.