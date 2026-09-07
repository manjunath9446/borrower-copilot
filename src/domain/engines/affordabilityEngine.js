// src/domain/engines/affordabilityEngine.js
import { calculatePrincipal } from '../calculations/emi.js'
import { assessFairRate } from './rateEngine.js'

export function affordabilityEngine(snapshot, loanType, tenureMonths) {
  const surplus = snapshot.surplus
  const stabilityFactor = snapshot.stabilityFactor

  const baseFactor = 0.45
  let safeEMIValue = surplus * baseFactor * stabilityFactor
  safeEMIValue = Math.max(0, safeEMIValue)

  let confidence = 'Medium'
  if (snapshot.monthlyIncome > 0 && snapshot.essentialExpenses > 0) {
    confidence = 'High'
  }
  if (snapshot.essentialExpenses === 0 && snapshot.monthlyIncome > 0) {
    confidence = 'Low'
  }
  if (snapshot.monthlyIncome <= 0) {
    confidence = 'Very Low'
  }

  const reasons = [
    `Your monthly surplus after expenses and EMIs is ₹${surplus.toFixed(0)}.`,
    `We cap your new EMI to ${(baseFactor * 100).toFixed(0)}% of that surplus.`,
    `Your income stability factor is ${stabilityFactor.toFixed(2)}.`,
  ]

  const rateAssessment = assessFairRate(snapshot, loanType)
  const typicalRate = (rateAssessment.fairRate.min + rateAssessment.fairRate.max) / 2
  const tenure = tenureMonths || 60

  // Calculate safe amount
  let safeAmountValue = calculatePrincipal(safeEMIValue, typicalRate, tenure)

  // 🔥 NEW: Cap the safe amount to a reasonable multiple of requested amount
  const requestedAmount = snapshot.requestedAmount || 0
  if (requestedAmount > 0) {
    // Cap at 1.5x requested amount (generous but not excessive)
    const maxCap = requestedAmount * 1.5
    if (safeAmountValue > maxCap) {
      safeAmountValue = maxCap
      reasons.push(`We've capped your safe amount to 1.5x your requested amount (₹${requestedAmount.toFixed(0)}).`)
    }
    // Also ensure minimum reasonable amount (0.5x requested)
    const minCap = requestedAmount * 0.5
    if (safeAmountValue < minCap && safeAmountValue > 0) {
      safeAmountValue = minCap
      reasons.push(`We've adjusted your safe amount to at least 50% of your requested amount.`)
    }
  }

  // If safe amount is too low, set a minimum
  if (safeAmountValue < 5000 && requestedAmount > 0) {
    safeAmountValue = requestedAmount * 0.5
  }

  const minAmount = safeAmountValue * 0.85
  const maxAmount = safeAmountValue * 1.1

  return {
    safeEMI: {
      value: safeEMIValue,
      confidence,
      reasons,
      assumptions: ['We assume 45% of surplus is safe for EMI.'],
      ruleReferences: ['affordability.baseFactor'],
    },
    safeAmount: {
      min: Math.max(0, minAmount),
      max: Math.max(0, maxAmount),
      confidence,
      reasons: [`Based on a fair rate of ${typicalRate.toFixed(1)}% and ${tenure} months.`],
    },
    dti: {
      value: snapshot.monthlyIncome > 0 ? (snapshot.essentialExpenses + snapshot.existingEMI) / snapshot.monthlyIncome : 0,
      confidence: 'Medium',
      reasons: ['Debt-to-income ratio based on expenses and EMIs.'],
    },
    surplus: {
      value: surplus,
      confidence: 'High',
      reasons: [`Calculated as income minus expenses and EMIs.`],
    },
  }
}