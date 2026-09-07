# 🏦 Borrower Copilot

### Know what you can afford, what lenders may offer, and what rate is fair — before you step into a bank.



## 📋 Table of Contents

1. [Problem Statement](#-problem-statement)
2. [Our Solution](#-our-solution)
3. [Core Features](#-core-features)
4. [Technical Approach](#-technical-approach)
5. [Architecture](#-architecture)
6. [Tech Stack](#-tech-stack)
7. [Project Structure](#-project-structure)
8. [Getting Started](#-getting-started)
9. [Testing](#-testing)
10. [Persona Validation](#-persona-validation)
11. [Deployment](#-deployment)
12. [RULES.md](#-rulesmd)
13. [License](#-license)

---

## 🔴 Problem Statement

Every lender has a model that decides what a borrower gets. The borrower has **nothing**.

When an Indian borrower walks into a bank, they:

- ❌ Don't know if they can actually afford the loan
- ❌ Don't know what a fair interest rate is
- ❌ Don't know how much they should borrow
- ❌ Don't know what EMI they should agree to
- ❌ Walk in blind, accept the first offer, and regret it later

**The result:** Borrowers overpay by 3-4% and stretch to 65% of their income — only to realize years later they made a mistake.

---

## 💡 Our Solution

**Borrower Copilot** is a personal assistant that helps Indian borrowers answer **four critical questions** before they walk into a lender:

| # | Question | Output |
|---|----------|--------|
| 1 | **Should I borrow at all?** | Verdict: Borrow ✓ / Don't Borrow ✗ / Borrow Less ⚠️ |
| 2 | **How much am I really eligible for?** | Two numbers: What a lender will sanction vs. What the borrower can safely carry |
| 3 | **What is a fair rate for me?** | A rate band with all-in APR, not just a single number |
| 4 | **What EMI should I agree to?** | A monthly ceiling with tenure trade-off and stress testing |

The borrower answers **8-10 simple questions** about their income, expenses, and goals — and gets a **one-page Negotiation Card** they can show to any lender.

**🔑 The Core Insight:** The borrower's safe amount and the lender's likely amount are **never the same**. We show both, and tell the borrower which one to use.

---

## ✨ Core Features

### 1. Adaptive Questionnaire
- **8-10 must-answer questions** + optional questions that tighten ranges
- Questions adapt based on borrower type (Salaried / Self-employed / Gig)
- Unknown = wider range + lower confidence (**never zero**)

### 2. Four Key Outputs

| Output | What It Is |
|--------|------------|
| **Borrow / Don't Borrow / Borrow Less** | A verdict with a clear reason why |
| **Maximum Amount** | Two numbers: Lender-likely vs. Borrower-safe |
| **Fair Interest Rate** | A band (not a point) with all-in APR including fees |
| **EMI / Monthly Outflow** | A monthly ceiling with stress testing (income drop + rate rise) |

### 3. Negotiation Card
One screen the borrower can **hold up to a lender**:
- Recommended amount and EMI
- Fair rate band
- All-in APR breakdown
- Questions to ask the lender (APR, fees, total repayment, etc.)
- Warnings and key factors

### 4. Explainability First
Every number has a **"Why?"** explanation:
- Why is this EMI safe for you?
- Why is this rate fair for your profile?
- What assumptions were made?
- What are the limitations?

### 5. Honest Confidence Scoring
- **High** = All data provided, reliable estimates
- **Medium** = Some data missing, reasonable estimates
- **Low** = Significant data missing, wide ranges
- **Very Low** = Minimal data, very wide ranges

### 6. Stress Testing
What happens if:
- Your income drops 20%?
- Your income drops 30%?
- Interest rates rise 2%?
- Both income drops AND rates rise?

---

## 🧠 Technical Approach

### Architecture Style: Functional Core + Configuration-Driven Product

```text
                 ┌─────────────────────┐
                 │      React UI       │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │ Questionnaire       │
                 │ Configuration       │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │ Borrower Profile    │
                 └──────────┬──────────┘
                            │
                            ▼
              ┌────────────────────────────┐
              │   Financial Snapshot       │
              │ normalize + derive metrics │
              └─────────────┬──────────────┘
                            │
                 ┌──────────┴──────────┐
                 ▼                     ▼
        ┌─────────────────┐   ┌─────────────────┐
        │ Affordability   │   │ Lender View     │
        │ Engine          │   │ Engine          │
        └────────┬────────┘   └────────┬────────┘
                 │                     │
                 └──────────┬──────────┘
                            ▼
                 ┌─────────────────────┐
                 │   Decision Engine   │
                 └──────────┬──────────┘
                            ▼
                 ┌─────────────────────┐
                 │ Recommendation      │
                 │ + Reasons           │
                 │ + Confidence        │
                 │ + Assumptions       │
                 └──────────┬──────────┘
                            │
                 ┌──────────┴───────────┐
                 ▼                      ▼
          Results Screen         Negotiation Card
```


## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/manjunath9446/borrower-copilot.git

# 2. Navigate to the project
cd borrower-copilot

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

### 5.LIVE
https://borrower-copilot-kohl-phi.vercel.app/
