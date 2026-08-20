# منطق Next Best Action — Nafis Copilot
## MVP Decision Logic Spec — نسخه نهایی برای پیاده‌سازی

> هدف این سند: تعریف منطق **شفاف، Rule-Based، Explainable و قابل دفاع** برای تولید Next Best Action در MVP هکاتون.
>
> این نسخه عمداً روی **۳ Recommendation اصلی و کامل** تمرکز دارد:
>
> 1. **GROW** — توسعه فروش به مشتری مناسب
> 2. **PROTECT / FIX** — رفع ریسک/مسئله قبل از فروش بیشتر
> 3. **REDUCE FOCUS** — کاهش تمرکز روی حسابی که شواهد کافی برای جذاب نبودن آن وجود دارد
>
> هر چیزی خارج از این سه مورد، در این نسخه **Post-MVP / Future Enrichment** محسوب می‌شود.

---

# 0) اصول ثابت و غیرقابل‌تخطی

## 0.1 Point-in-Time / جلوگیری از Lookahead Bias

برای هر تحلیل با `as_of_date` فقط داده‌ای مجاز است که تا آن تاریخ واقعاً در دسترس بوده:

```text
Available_At <= as_of_date
```

برای eventهای زمانی نیز علاوه بر `Available_At`، خود event نباید در آینده باشد.

نمونه برای وصول:

```text
Available_At <= as_of_date
AND
(تاریخ رویداد وصول IS NULL OR تاریخ رویداد وصول <= as_of_date)
```

برای هزینه تحقق:

```text
Available_At <= as_of_date
AND
(Cost_Close_Date IS NULL OR Cost_Close_Date <= as_of_date)
```

### MVP as_of_date

```text
2026-07-23
```

این تاریخ باید به‌صورت مشترک در Feature Layer و Decision Layer استفاده شود.

---

## 0.2 Fact ≠ Interpretation ≠ Action

ساختار تصمیم باید همیشه این ترتیب را حفظ کند:

```text
DATA
→ FACT / METRIC
→ SIGNAL
→ INTERPRETATION
→ RECOMMENDATION
→ NEXT BEST ACTION
→ EVIDENCE
```

هیچ Recommendation نباید بدون Evidence تولید شود.

---

## 0.3 Missing Data ≠ Zero

اگر داده وجود ندارد:

```text
Unknown / Insufficient Data
```

و نه:

```text
0
```

به‌خصوص برای Profitability.

---

## 0.4 Complaint ≠ Quality Failure

وجود شکایت به‌تنهایی به معنی مشکل کیفی تاییدشده نیست.

سه حالت مجاز:

```text
Complaint exists + Lab Result = قبول
Complaint exists + Lab Result = رد
Complaint exists + Quality evidence unavailable
```

---

## 0.5 Actual Cost را تخمین نمی‌زنیم

در MVP:

```text
Actual Cost موجود → Margin محاسبه می‌شود
Actual Cost موجود نیست → Profitability = Insufficient / Partial
```

این موارد در MVP ممنوع‌اند:

```text
Lot-based cost imputation
Monthly estimated cost as replacement for missing actual cost
Invented profitability values
```

---

# 1) محدودیت زمانی داده فروش

داده فروش پیوستگی زمانی کامل ندارد.

توزیع مشاهده‌شده:

```text
2019: sparse
2020–2022: dense historical period
2023–2024: no sales records in provided dataset
2025–2026: sparse recent observations
```

بنابراین:

## 1.1 Historical Behaviour Baseline

```text
2020-01-01 → 2022-12-31
```

برای:

- Historical Revenue
- Historical Invoice Count
- Historical Average Deal Size
- Historical Purchase Gap / Cadence
- Historical behavioural patterns

## 1.2 Data Coverage Gap

```text
2023–2024
```

نباید به‌صورت «عدم خرید مشتری» تفسیر شود.

## 1.3 Recent Observed Evidence

```text
2025-01-01 → as_of_date
```

فقط به‌عنوان **recent observed evidence** استفاده می‌شود.

## 1.4 ممنوع در MVP

این سیگنال حذف شده است:

```text
3-month sales trend
90-day sales change
90-day deal-size change
```

چون برای اکثریت مشتری‌ها داده کافی ندارد و گمراه‌کننده است.

---

# 2) Feature Layer معتبر برای NBA

Decision Engine فقط باید از Featureهایی استفاده کند که در
`customer_master_features.csv`
ساخته و اعتبارسنجی شده‌اند.

---

## 2.1 Sales / Activity

```text
historical_total_revenue
historical_invoice_count
historical_avg_deal_size
historical_last_purchase_date
historical_median_purchase_gap_days
historical_avg_purchase_gap_days

recent_observed_revenue
recent_observed_invoice_count
recent_observed_avg_deal_size
recent_observed_last_purchase_date
```

### نکته

Recent activity به‌تنهایی برای تشخیص رشد/افت کافی نیست؛ فقط Evidence است.

---

## 2.2 Payment / Collections

Featureهای معتبر:

```text
collection_event_count
median_payment_delay_days
avg_payment_delay_days
returned_check_count
has_returned_check
```

### یافته داده‌ای مهم

تقریباً اکثر eventهای وصول دارای مقداری تأخیر هستند، بنابراین:

```text
Any late payment = Risk
```

ممنوع است.

### Strong Payment Signal

```text
has_returned_check = True
```

یک Evidence قوی‌تر و تمایزبخش‌تر است.

### Delay

Delay باید context باشد، نه حکم قطعی.

مثال قابل توضیح:

```text
Customer median delay = 37 days
Portfolio median ≈ 23 days
```

اما threshold ثابت مثل:

```text
delay > 30 = bad customer
```

در MVP نباید hard-code شود مگر با تصمیم آگاهانه تیم.

---

# 3) Profitability

Featureهای معتبر:

```text
actual_cost_coverage_pct

known_revenue
known_cost
known_margin_amount
known_margin_pct

negative_margin_lines

returned_amount
returned_lines

profitability_status
```

## 3.1 Profitability Status

```text
insufficient
→ actual-cost coverage = 0 / unavailable

partial
→ 0 < actual-cost coverage < 100

actual
→ actual-cost coverage = 100
```

## 3.2 قانون استفاده در Recommendation

Margin تنها باید همراه Coverage تفسیر شود.

مثال:

```text
Known-cost margin: 7.4%
Actual-cost coverage: 32%
Evidence status: Partial
```

نه:

```text
Customer margin = 7.4%
```

## 3.3 REDUCE FOCUS و Profitability

اگر coverage ضعیف باشد، سیستم نباید فقط بر اساس `known_margin_pct`
یک مشتری را REDUCE کند.

---

# 4) Complaints / Quality

Featureهای معتبر:

```text
complaint_count
open_complaint_count
high_severity_count
last_complaint_date

quality_evidence_count
quality_evidence_available
lab_pass_count
lab_reject_count
```

## 4.1 Open Complaint Definition

فقط:

```text
درحال بررسی
نیازمند بررسی
```

Open محسوب می‌شوند.

این Statusها Open محسوب نمی‌شوند:

```text
بسته‌شده
ردشده
پذیرفته‌شده
```

چون در داده دارای `Resolved_At` هستند.

## 4.2 High Severity

```text
زیاد
بحرانی
```

## 4.3 Quality Evidence

`lab_reject_count > 0`:
Evidence مستقیم برای وجود حداقل یک Quality failure مرتبط.

`quality_evidence_available = False`:
یعنی Evidence آزمایشگاهی کافی نداریم، نه اینکه Quality OK بوده.

## 4.4 repeated_quality_issue

در MVP فعلاً **به‌عنوان Signal مستقل استفاده نشود** مگر بعداً تعریف دقیق و validation جداگانه داشته باشد.

---

# 5) Historical Share of Wallet

Featureهای معتبر:

```text
historical_wallet_share_pct
historical_estimated_total_purchase
historical_nafis_purchase

wallet_period_start
wallet_period_end

main_competitor
wallet_estimate_source
wallet_data_available
```

## 5.1 Period

داده موجود:

```text
2021-07 → 2022-06
```

بنابراین این Feature:

```text
Historical Share of Wallet
```

است، نه:

```text
Current Share of Wallet
```

## 5.2 Formula

```text
SUM(Nafis_Purchase)
/
SUM(Estimated_Total_Purchase)
* 100
```

## 5.3 Trust

NBA باید در Evidence دوره زمانی را مشخص کند.

مثال:

```text
آخرین شواهد تاریخی سهم سبد در دوره 2021-07 تا 2022-06 نشان می‌دهد...
```

نباید بگوید:

```text
در حال حاضر سهم نفیس از سبد مشتری X٪ است.
```

---

# 6) معماری MVP Recommendation Engine

```text
Customer Master Feature Record
        ↓
Signal Extraction
        ↓
Candidate Recommendations
        ↓
Risk Gating
        ↓
Priority Tiering
        ↓
Top Recommendation(s)
        ↓
Evidence
```

---

# 7) سه Recommendation اصلی

# 7.1 GROW

## سؤال تجاری

```text
کدام مشتری شواهد قابل دفاعی برای توسعه فروش دارد؟
```

## Evidenceهای قابل استفاده

- Historical commercial value
- Historical wallet opportunity
- Main competitor
- No blocking open complaint
- No strong blocking financial risk
- Profitability evidence اگر موجود باشد

## Candidate Condition

GROW می‌تواند Candidate شود اگر:

```text
wallet_data_available = True
AND historical_wallet_share_pct indicates room for growth
AND no blocking risk exists
```

### مهم

در MVP threshold ثابت مثل:

```text
wallet_share_pct < 40%
```

نباید به‌عنوان «قانون رسمی کسب‌وکار» hard-code شود مگر پس از calibration.

اگر برای MVP threshold لازم شد:
- به‌صورت configurable constant باشد
- در Evidence با برچسب `MVP heuristic` معرفی شود
- نه «قانون قطعی شرکت»

## NBA Example

```text
Recommendation: GROW

Action:
بررسی فرصت افزایش سهم نفیس از خرید این مشتری.

Evidence:
- Historical wallet share: X%
- Wallet period: 2021-07 → 2022-06
- Main competitor: ...
- Historical revenue: ...
- No blocking open complaint detected

Trust:
Historical opportunity evidence; current wallet position is not known.
```

---

# 7.2 PROTECT / FIX

## سؤال تجاری

```text
کدام مشتری قبل از هر تلاش برای فروش بیشتر نیاز به رفع مشکل دارد؟
```

## Blocking Risk Evidence

مهم‌ترین Signals:

```text
open_complaint_count > 0
high_severity_count > 0
has_returned_check = True
lab_reject_count > 0
```

### Strong Candidate

PROTECT / FIX می‌تواند Candidate شود اگر:

```text
Open complaint exists
OR returned check exists
OR complaint-linked lab rejection exists
```

شدت Recommendation با Evidence توضیح داده می‌شود، نه Risk Score ساختگی.

## NBA Example

```text
Recommendation: PROTECT / FIX

Action:
پیش از هر پیشنهاد فروش جدید، شکایت باز مشتری را پیگیری و تعیین تکلیف کنید.

Evidence:
- Open complaints: 1
- High-severity complaints: 1
- Quality evidence: available
- Lab reject records: 1
- Historical commercial value: ...

Reason:
A blocking customer issue exists.

Suspended opportunity:
Historical wallet opportunity exists but should be revisited after risk resolution.
```

---

# 7.3 REDUCE FOCUS

## سؤال تجاری

```text
کدام حساب شواهد کافی دارد که در حال حاضر زمان و منابع فروش کمتری دریافت کند؟
```

این Recommendation باید **Conservative** باشد.

## Evidenceهای ممکن

ترکیبی از:

```text
weak known-cost economics
negative_margin_lines
has_returned_check
weak / unavailable commercial opportunity evidence
low historical commercial value
```

## Guardrail

هیچ مشتری نباید فقط با یکی از این موارد REDUCE شود:

```text
low margin with low cost coverage
old sales activity across data coverage gap
one complaint
payment delay alone
missing wallet data
```

## Insufficient Evidence

اگر شواهد کافی نیست:

```text
recommendation_type = null
status = "insufficient_evidence"
```

یا:

```text
No recommendation to reduce focus due to insufficient evidence.
```

این خروجی کاملاً معتبر و مطلوب است.

---

# 8) Risk Gating — قانون اصلی

اگر Blocking Risk فعال باشد:

```text
GROW
→ حذف نمی‌شود
→ suspended / secondary می‌شود

PROTECT / FIX
→ Primary Recommendation
```

نمونه:

```text
Primary:
Resolve open critical complaint.

Secondary / After Risk Resolution:
Review historical wallet growth opportunity.
```

سیستم نباید همزمان بگوید:

```text
شکایت را حل کن
و همین الان پیشنهاد فروش بده
```

---

# 9) Priority Tiering

در MVP از Score عددی جعبه‌سیاه استفاده نمی‌کنیم.

Tierهای مجاز:

```text
Critical
High
Medium
Low
```

## Critical

Strong blocking risk with multiple aligned evidence signals.

مثال:

```text
Open high-severity complaint
+
lab rejection
```

یا:

```text
returned check
+
meaningful commercial exposure
```

## High

یک Blocking Risk مهم و قابل اقدام.

## Medium

Commercial opportunity بدون Blocking Risk.

## Low

No urgent action / monitoring.

### ممنوع

```text
Risk Score = 87
Opportunity Score = 73
```

مگر بعداً validate شود.

---

# 10) Evidence Object

هر Recommendation باید Evidence structured داشته باشد.

فرمت پیشنهادی:

```json
{
  "metric": "open_complaint_count",
  "value": 1,
  "source": "شکایات",
  "evidence_type": "FACT",
  "note": "Complaint status is open as of 2026-07-23"
}
```

برای استنتاج:

```json
{
  "metric": "historical_wallet_share_pct",
  "value": 24.5,
  "source": "سهم_سبد",
  "evidence_type": "INFERENCE",
  "note": "Historical evidence suggests room for account growth; current wallet share is unknown."
}
```

---

# 11) Output Contract

خروجی Recommendation Engine:

```json
{
  "customer_id": "CUST-XXX",

  "recommendation_type": "GROW | PROTECT_FIX | REDUCE_FOCUS | null",

  "priority": "Critical | High | Medium | Low | null",

  "summary": "...",

  "next_best_action": "...",

  "evidence": [],

  "blocking_risks": [],

  "suspended_opportunities": [],

  "confidence": "high | medium | limited",

  "status": "ready | insufficient_evidence"
}
```

---

# 12) Confidence

Confidence باید بر اساس Evidence coverage باشد، نه احساس مدل.

## High

چند Evidence مستقل و سازگار.

## Medium

حداقل یک Evidence قابل اتکا ولی coverage محدود.

## Limited

داده ناقص / قدیمی / متناقض.

مثال:

```text
Historical wallet data exists
but current wallet data is unavailable
→ confidence cannot be "high" for a current commercial-state claim.
```

---

# 13) نقش LLM

LLM نباید:

- محاسبه Margin انجام دهد
- Threshold تعیین کند
- Customer را score کند
- Evidence بسازد
- Fact اختراع کند

LLM فقط می‌تواند:

```text
Structured signals
→ concise business explanation
→ human-readable recommendation summary
```

مثال:

```text
Code:
open_complaint_count = 1
high_severity_count = 1
lab_reject_count = 1

LLM:
"پیش از هر پیشنهاد فروش جدید، شکایت باز و تاییدشده کیفی این مشتری را تعیین تکلیف کنید."
```

Arithmetic و Rule Evaluation باید در Python انجام شود.

---

# 14) پیاده‌سازی پیشنهادی

## File

```text
backend/analytics/recommendation_engine.py
```

توابع پیشنهادی:

```python
def extract_signals(customer_features: dict) -> dict:
    ...

def generate_candidate_recommendations(signals: dict) -> list[dict]:
    ...

def apply_risk_gating(candidates: list[dict]) -> list[dict]:
    ...

def assign_priority(candidate: dict) -> str:
    ...

def select_best_recommendation(candidates: list[dict]) -> dict:
    ...

def build_recommendation(customer_features: dict) -> dict:
    ...
```

---

# 15) قوانین پیاده‌سازی برای Codex

Codex باید:

1. فقط از ستون‌های موجود در `customer_master_features.csv` استفاده کند.
2. قبل از کدنویسی schema واقعی CSV را inspect کند.
3. هیچ feature جدیدی داخل Recommendation Engine محاسبه نکند مگر derived boolean ساده از featureهای موجود.
4. هیچ داده خام Excel را مستقیم داخل `recommendation_engine.py` نخواند.
5. هیچ threshold جدیدی اختراع نکند.
6. thresholdهای MVP اگر لازم شدند، در constants جدا و واضح قرار گیرند.
7. هر heuristic با comment مشخص شود:

```text
MVP heuristic — not an official business rule
```

8. Missing data را explicit مدیریت کند.
9. Evidence object برای هر تصمیم تولید کند.
10. Risk Gating را قبل از final selection اجرا کند.
11. Testهای حداقلی برای GROW / PROTECT_FIX / REDUCE_FOCUS / insufficient_evidence بسازد.
12. هیچ LLM/API خارجی در Recommendation Engine استفاده نکند.

---

# 16) چیزهایی که فعلاً پیاده‌سازی نمی‌شوند

موارد زیر از MVP Decision Engine خارج‌اند:

```text
3-month sales trend
90-day revenue change
90-day deal-size change

repeated_quality_issue بدون validation جدید

market signal recommendation
CRM interaction recommendation
offer follow-up recommendation
development-request recommendation

automatic product-level recommendation
automatic discount percentage
automatic offer type
automatic payment terms
automatic credit decision

complaint text topic extraction
LLM root-cause analysis
complaint satisfaction scoring

numeric risk score
numeric opportunity score
ML churn prediction
forecasting
clustering
```

---

# 17) Post-MVP / Future Enrichment

این موارد حذف نشده‌اند؛ فقط برای جلوگیری از Scope Explosion از MVP خارج شده‌اند:

## Opportunity Enrichment
- product recommendation
- competitor-specific product targeting
- historical accepted-offer pattern
- discount recommendation
- market trend
- development request conversion
- CRM context

## Complaint Enrichment
- Complaint text topic extraction
- operational impact extraction
- repeated quality pattern
- resolution quality
- complaint handling duration
- complaint-sales impact inference

## Advanced Decisioning
- dynamic thresholds
- supervised ranking
- causal uplift
- churn prediction
- profitability estimation with validated cost model

---

# 18) سه سناریوی اصلی Demo

## Scenario A — GROW

```text
Customer has:
- meaningful historical value
- historical wallet opportunity
- competitor evidence
- no blocking risk

System:
GROW
→ review account expansion opportunity
```

## Scenario B — PROTECT / FIX

```text
Customer has:
- open high-severity complaint
- quality evidence / financial risk

System:
PROTECT / FIX
→ resolve issue first

Historical growth opportunity:
suspended until risk resolution
```

## Scenario C — REDUCE FOCUS

```text
Customer has:
- sufficiently supported weak economics
- financial burden / negative-margin evidence
- limited commercial upside evidence

System:
REDUCE FOCUS

If evidence coverage is insufficient:
do NOT issue REDUCE FOCUS.
```

---

# 19) اصل نهایی MVP

هدف سیستم:

```text
WHO should I focus on?
WHY?
WHAT should I do next?
WHAT evidence supports that decision?
```

نه:

```text
How many dashboards, scores, models, and recommendations can we generate?
```

سه Recommendation کامل، قابل دفاع و Evidence-Based
بهتر از ده Recommendation ناقص است.
