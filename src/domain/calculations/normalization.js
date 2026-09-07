import { STABILITY_ADJUSTMENT } from '../../rules/affordability.js'

export function normalizeProfile(profile) {
  // Better income extraction - check all possible places
  let monthlyIncome = profile.income?.monthlyNet || 
                      profile.monthlyIncome || 
                      profile.income?.monthly || 
                      0

  // If still 0, try to use the loan amount as a proxy (product judgement)
  if (!monthlyIncome && profile.loan?.amount > 0) {
    monthlyIncome = profile.loan.amount / 2 // Conservative estimate
  }

  // Handle range-based income
  if (!monthlyIncome && profile.income?.minMonthly && profile.income?.maxMonthly) {
    monthlyIncome = (profile.income.minMonthly + profile.income.maxMonthly) / 2
  }

  // If still no income, use a default (product judgement)
  if (!monthlyIncome) {
    monthlyIncome = 30000 // Default conservative estimate for prototype
  }

  let conservativeIncome = monthlyIncome
  if (profile.income?.stability === 'low' || profile.borrower?.incomeSource === 'gig') {
    conservativeIncome = monthlyIncome * 0.7
  }

  let essentialExpenses = (profile.expenses?.household || 0) + (profile.expenses?.rent || 0)
  if (!essentialExpenses && monthlyIncome > 0) {
    essentialExpenses = monthlyIncome * 0.3 // Default 30% for expenses
  }

  const existingEMI = profile.debt?.totalEMI || 0
  const surplus = monthlyIncome - essentialExpenses - existingEMI

  const stabilityFactor = STABILITY_ADJUSTMENT[profile.income?.stability] || 0.85

  let creditQuality = 'unknown'
  if (profile.credit?.score >= 750) creditQuality = 'good'
  else if (profile.credit?.score >= 650) creditQuality = 'fair'
  else if (profile.credit?.score > 0) creditQuality = 'poor'

  return {
    monthlyIncome,
    conservativeIncome,
    essentialExpenses,
    existingEMI,
    surplus: Math.max(0, surplus),
    stabilityFactor,
    creditQuality,
    requestedAmount: profile.loan?.amount || 0,
    loanType: profile.loan?.type || 'personal',
    liquidSavings: profile.savings?.liquidSavings || 0,
    dependents: profile.borrower?.dependents || 0,
    collateralValue: profile.savings?.collateralValue || 0,
  }
}