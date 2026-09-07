# RULES.md — Borrower Copilot

## Financial Rules, Thresholds & Assumptions

This document describes all financial rules, thresholds, rate bands, and product assumptions used by the Borrower Copilot application. Each rule is categorized by its source to be transparent about what is regulatory, common lender practice, or product judgement.

---

## 📋 Table of Contents

1. [Affordability Rules](#1-affordability-rules)
2. [Interest Rate Rules](#2-interest-rate-rules)
3. [Product Configuration Rules](#3-product-configuration-rules)
4. [Lender Eligibility Rules](#4-lender-eligibility-rules)
5. [Stress Test Rules](#5-stress-test-rules)
6. [Confidence Scoring Rules](#6-confidence-scoring-rules)
7. [Unknown Data Handling](#7-unknown-data-handling)
8. [Summary](#8-summary)

---

## 1. Affordability Rules

Rules that determine what a borrower can safely afford.

### 1.1 FOIR (Fixed Obligation to Income Ratio) Caps

| Rule | Value | Category | Source | Rationale |
|------|-------|----------|--------|-----------|
| Maximum FOIR | 50% | PRODUCT_JUDGEMENT | Conservative estimate | Total obligations (EMIs + essential expenses) should not exceed 50% of monthly income. This ensures the borrower has enough buffer for savings and emergencies. |
| Safe FOIR Target | 35% | PRODUCT_JUDGEMENT | Conservative estimate | Ideal target for healthy finances. Borrowers below this threshold are considered low-risk. |
| New EMI Surplus Cap | 45% | PRODUCT_JUDGEMENT | Conservative estimate | New EMI should not exceed 45% of monthly surplus after essential expenses and existing EMIs. |

**Source Files:** `src/rules/affordability.js`, `src/domain/engines/affordabilityEngine.js`

---

### 1.2 Income Stability Adjustments

| Rule | Value | Category | Source | Rationale |
|------|-------|----------|--------|-----------|
| High Stability Factor | 1.0 | PRODUCT_JUDGEMENT | Conservative estimate | Salaried employees with long tenure get full capacity. |
| Medium Stability Factor | 0.9 | PRODUCT_JUDGEMENT | Conservative estimate | Self-employed with some history get moderate adjustment. |
| Low Stability Factor | 0.8 | PRODUCT_JUDGEMENT | Conservative estimate | Gig workers or new businesses get conservative adjustment. |
| Unknown Stability Factor | 0.85 | PRODUCT_JUDGEMENT | Conservative estimate | When stability is unknown, use a conservative default. |

**Source Files:** `src/rules/affordability.js`, `src/domain/calculations/normalization.js`

---

### 1.3 Safe Amount Caps

| Rule | Value | Category | Source | Rationale |
|------|-------|----------|--------|-----------|
| Maximum Safe Amount | 1.5× requested | PRODUCT_JUDGEMENT | Conservative estimate | Prevent over-borrowing by capping safe amount at 1.5x the requested amount. |
| Minimum Safe Amount | 0.5× requested | PRODUCT_JUDGEMENT | Conservative estimate | Ensure a reasonable minimum even if calculations produce very low numbers. |
| Default Tenure | 60 months | PRODUCT_JUDGEMENT | Conservative estimate | Default loan tenure if user doesn't specify. |

**Source Files:** `src/domain/engines/affordabilityEngine.js`, `src/domain/decision/decisionEngine.js`

---

## 2. Interest Rate Rules

Rules that determine fair interest rates for different loan types.

### 2.1 Product Base Rates

| Product | Min Rate | Max Rate | Category | Source | Rationale |
|---------|----------|----------|----------|--------|-----------|
| Personal Loan | 12% | 18% | LENDER_PRACTICE | Market research | Unsecured loans have higher rates due to risk. |
| Home Loan | 8% | 10% | LENDER_PRACTICE | Market research | Secured loans with collateral have lower rates. |
| Loan Against Property | 9% | 12% | LENDER_PRACTICE | Market research | Secured by property, moderate risk. |
| Gold Loan | 9% | 12% | LENDER_PRACTICE | Market research | Secured by gold, relatively safe. |
| Vehicle Loan | 10% | 14% | LENDER_PRACTICE | Market research | Secured by vehicle, moderate risk. |
| Business Loan | 12% | 18% | LENDER_PRACTICE | Market research | Higher risk, similar to personal loans. |

**Source Files:** `src/rules/rates.js`, `src/domain/engines/rateEngine.js`

---

### 2.2 Credit Score Adjustments

| Credit Score Range | Rate Adjustment | Category | Source | Rationale |
|--------------------|-----------------|----------|--------|-----------|
| 750+ | -1.0% | LENDER_PRACTICE | Common lender practice | Excellent credit gets best rates. |
| 700 – 749 | 0% | LENDER_PRACTICE | Common lender practice | Good credit, standard rates. |
| 650 – 699 | +1.0% | LENDER_PRACTICE | Common lender practice | Fair credit, slightly higher rates. |
| Below 650 | +2.0% | LENDER_PRACTICE | Common lender practice | Poor credit, significantly higher rates. |
| Unknown | 0% (wider range) | LENDER_PRACTICE | Common lender practice | Unknown credit leads to wider rate bands. |

**Source Files:** `src/rules/rates.js`, `src/domain/engines/rateEngine.js`

---

### 2.3 Processing Fees

| Product | Processing Fee | Category | Source | Rationale |
|---------|-----------------|----------|--------|-----------|
| Personal Loan | 2.0% | LENDER_PRACTICE | Common lender practice | Standard processing fee for unsecured loans. |
| Home Loan | 1.0% | LENDER_PRACTICE | Common lender practice | Lower fee for secured loans. |
| Loan Against Property | 1.5% | LENDER_PRACTICE | Common lender practice | Moderate fee for LAP. |
| Gold Loan | 1.0% | LENDER_PRACTICE | Common lender practice | Low processing fee for gold loans. |
| Vehicle Loan | 1.5% | LENDER_PRACTICE | Common lender practice | Standard fee for vehicle loans. |
| Business Loan | 2.0% | LENDER_PRACTICE | Common lender practice | Higher fee for business loans. |

**Source Files:** `src/rules/rates.js`, `src/domain/engines/rateEngine.js`

---

### 2.4 GST on Fees

| Rule | Value | Category | Source | Rationale |
|------|-------|----------|--------|-----------|
| GST Rate | 18% | REGULATORY | GST Act | GST is mandatory on processing fees and other charges as per Indian tax law. |

**Source Files:** `src/domain/engines/rateEngine.js`

---

## 3. Product Configuration Rules

Rules that define product characteristics and lender eligibility.

### 3.1 Income Multiples for Eligibility

| Product | Min Multiple | Max Multiple | Category | Source | Rationale |
|---------|--------------|--------------|----------|--------|-----------|
| Personal Loan | 2× | 4× | LENDER_PRACTICE | Common lender practice | Lenders typically sanction 2-4× annual income. |
| Home Loan | 4× | 6× | LENDER_PRACTICE | Common lender practice | Home loans have higher multiples due to collateral. |
| Loan Against Property | 3× | 5× | LENDER_PRACTICE | Common lender practice | LAP sanctioned based on property value and income. |
| Gold Loan | 2× | 3× | LENDER_PRACTICE | Common lender practice | Based on gold value, income less relevant. |
| Vehicle Loan | 2× | 4× | LENDER_PRACTICE | Common lender practice | Vehicle loans have moderate multiples. |
| Business Loan | 2× | 4× | LENDER_PRACTICE | Common lender practice | Similar to personal loans. |

**Source Files:** `src/rules/products.js`, `src/domain/engines/eligibilityEngine.js`

---

### 3.2 Tenure Ranges

| Product | Min Tenure | Max Tenure | Category | Source | Rationale |
|---------|------------|------------|----------|--------|-----------|
| Personal Loan | 12 months | 60 months | LENDER_PRACTICE | Common lender practice | Short to medium tenure. |
| Home Loan | 60 months | 360 months | LENDER_PRACTICE | Common lender practice | Longest tenure due to large amounts. |
| Loan Against Property | 24 months | 180 months | LENDER_PRACTICE | Common lender practice | Medium to long tenure. |
| Gold Loan | 3 months | 12 months | LENDER_PRACTICE | Common lender practice | Very short tenure. |
| Vehicle Loan | 12 months | 84 months | LENDER_PRACTICE | Common lender practice | Medium tenure. |
| Business Loan | 12 months | 60 months | LENDER_PRACTICE | Common lender practice | Short to medium tenure. |

**Source Files:** `src/rules/products.js`

---

### 3.3 Lender Amount Caps

| Product | Cap Multiple | Category | Source | Rationale |
|---------|--------------|----------|--------|-----------|
| Personal Loan | 2× requested | PRODUCT_JUDGEMENT | Conservative estimate | Prevent showing unrealistic lender amounts for personal loans. |
| Home Loan | 3× requested | PRODUCT_JUDGEMENT | Conservative estimate | Allow higher multiples for home loans due to collateral. |
| Loan Against Property | 3× requested | PRODUCT_JUDGEMENT | Conservative estimate | Allow higher multiples for secured loans. |
| Gold Loan | 2× requested | PRODUCT_JUDGEMENT | Conservative estimate | Based on gold value. |
| Vehicle Loan | 2.5× requested | PRODUCT_JUDGEMENT | Conservative estimate | Moderate cap for vehicles. |
| Business Loan | 2.5× requested | PRODUCT_JUDGEMENT | Conservative estimate | Moderate cap for business loans. |

**Source Files:** `src/domain/engines/eligibilityEngine.js`

---

## 4. Lender Eligibility Rules

Rules that estimate what a lender may potentially sanction.

### 4.1 Credit Quality Factors

| Credit Quality | Credit Factor | Category | Source | Rationale |
|----------------|---------------|----------|--------|-----------|
| Good (750+) | 1.1× | LENDER_PRACTICE | Common lender practice | Excellent credit gets higher sanction amounts. |
| Fair (650-749) | 1.0× | LENDER_PRACTICE | Common lender practice | Standard credit, standard sanction. |
| Poor (<650) | 0.7× | LENDER_PRACTICE | Common lender practice | Poor credit gets lower sanction amounts. |
| Unknown | 0.85× | PRODUCT_JUDGEMENT | Conservative estimate | When credit is unknown, be conservative. |

**Source Files:** `src/domain/engines/eligibilityEngine.js`, `src/domain/calculations/normalization.js`

---

### 4.2 Product Suitability

| Product Type | Suitability | Category | Source | Rationale |
|--------------|-------------|----------|--------|-----------|
| Personal Loan | Unsecured | LENDER_PRACTICE | Common lender practice | No collateral required. |
| Home Loan | Secured | LENDER_PRACTICE | Common lender practice | Collateral: Property. |
| Loan Against Property | Secured | LENDER_PRACTICE | Common lender practice | Collateral: Property. |
| Gold Loan | Secured | LENDER_PRACTICE | Common lender practice | Collateral: Gold. |
| Vehicle Loan | Secured | LENDER_PRACTICE | Common lender practice | Collateral: Vehicle. |
| Business Loan | Unsecured | LENDER_PRACTICE | Common lender practice | Often unsecured for small businesses. |

**Source Files:** `src/rules/products.js`

---

## 5. Stress Test Rules

Rules that test loan affordability under adverse scenarios.

### 5.1 Stress Scenarios

| Scenario | Income Change | Rate Change | Category | Source | Rationale |
|----------|---------------|-------------|----------|--------|-----------|
| Income -20% | -20% | 0% | PRODUCT_JUDGEMENT | Conservative estimate | Test if EMI is still affordable if income drops 20%. |
| Income -30% | -30% | 0% | PRODUCT_JUDGEMENT | Conservative estimate | Severe income reduction scenario. |
| Rate +2% | 0% | +2% | PRODUCT_JUDGEMENT | Conservative estimate | Test if EMI is still affordable if interest rates rise 2%. |
| Combined | -20% | +2% | PRODUCT_JUDGEMENT | Conservative estimate | Worst-case scenario: income drops and rates rise. |

**Source Files:** `src/domain/engines/stressEngine.js`

---

### 5.2 Stress Test Status Definitions

| Status | Condition | Meaning |
|--------|-----------|---------|
| Pass | Buffer > ₹500 | EMI is comfortable even under stress. |
| Tight | Buffer ₹0 – ₹500 | EMI is manageable but tight. |
| Fail | Buffer < ₹0 | EMI is not affordable under stress. |

**Source Files:** `src/domain/engines/stressEngine.js`

---

## 6. Confidence Scoring Rules

Rules that determine confidence levels for recommendations.

### 6.1 Confidence Levels

| Level | Score Range | Meaning |
|-------|-------------|---------|
| High | 80% – 100% | All essential data provided, reliable estimates. |
| Medium | 50% – 79% | Some data missing, reasonable estimates. |
| Low | 30% – 49% | Significant data missing, wide ranges. |
| Very Low | 0% – 29% | Minimal data provided, very wide ranges. |

**Source Files:** `src/domain/engine/confidence.js`

---

### 6.2 Confidence Factors

| Factor | Weight | Impact |
|--------|--------|--------|
| Income Known | +20% | Exact income increases confidence. |
| Expenses Known | +20% | Known expenses improve affordability accuracy. |
| Credit Score Known | +15% | Credit score improves rate accuracy. |
| Income Stability Known | +15% | Stability improves lender estimate. |
| Employment Tenure Known | +10% | Tenure improves stability assessment. |
| Purpose Provided | +10% | Purpose helps with verdict. |
| Savings Known | +10% | Savings helps with emergency buffer assessment. |

**Source Files:** `src/domain/engine/confidence.js`

---

## 7. Unknown Data Handling

Rules that define how missing or unknown data is handled.

### 7.1 Unknown Data Handling Rules

| Unknown Data | Handling | Impact | Source | Rationale |
|--------------|----------|--------|--------|-----------|
| Credit Score | Wider rate band (2-3% range) | Lower confidence | PRODUCT_JUDGEMENT | Unknown credit → wider uncertainty. |
| Expenses | Default = 35% of income | Lower confidence, added assumption | PRODUCT_JUDGEMENT | Use reasonable default when unknown. |
| Income Stability | Default = 0.85 factor | Lower confidence | PRODUCT_JUDGEMENT | Use conservative default. |
| Savings | Default = 0 | Warning added | PRODUCT_JUDGEMENT | Assume no savings when unknown. |
| Purpose | No impact on calculation | Neutral | PRODUCT_JUDGEMENT | Purpose affects verdict only. |

**Source Files:** `src/domain/calculations/normalization.js`, `src/domain/decision/decisionEngine.js`

---

### 7.2 Unknown Credit Score Scenarios

| Scenario | Rate Range | Confidence | Reason |
|----------|------------|------------|--------|
| Credit Score Known (750+) | 11% – 12% | High | Accurate rate based on good credit. |
| Credit Score Known (700-749) | 12% – 13% | High | Accurate rate based on fair credit. |
| Credit Score Unknown | 11% – 14% | Medium | Wider range to account for uncertainty. |
| Credit Score Unknown + No History | 12% – 16% | Low | Very wide range for complete unknown. |

**Source Files:** `src/domain/engines/rateEngine.js`, `src/domain/engines/eligibilityEngine.js`

---

## 8. Summary

### 8.1 Rule Categories

| Category | Description | Examples |
|----------|-------------|----------|
| REGULATORY | Required by law or regulation | GST Rate (18%) |
| LENDER_PRACTICE | Common industry practice | Income multiples, rate bands, processing fees |
| PRODUCT_JUDGEMENT | Conservative product decisions | FOIR caps, stability factors, amount caps |

### 8.2 Key Design Decisions

1. **Separate Borrower and Lender Views:** The product explicitly distinguishes between what a borrower can safely afford and what a lender may sanction. This is the core differentiator.

2. **Conservative Defaults:** When data is unknown, the system uses conservative estimates (e.g., 35% for expenses, 0.85 for stability) to protect the borrower from over-borrowing.

3. **Unknown ≠ Zero:** Missing data does not default to zero; it widens ranges and reduces confidence.

4. **Explainability First:** Every output includes reasons, assumptions, and confidence levels so the borrower understands the recommendation.

5. **Realistic Caps:** Safe amount is capped at 1.5× requested to prevent over-borrowing. Lender amount is capped at 2× requested for personal loans to show realistic expectations.

---

**Last Updated:** September 2026
**Version:** 1.0
**Status:** ✅ Live