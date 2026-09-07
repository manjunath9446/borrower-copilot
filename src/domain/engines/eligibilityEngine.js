// src/domain/engines/eligibilityEngine.js
import { PRODUCT_BASE_RATES } from '../../rules/rates.js'
import { INCOME_MULTIPLES } from '../../rules/products.js'

export function eligibilityEngine(snapshot, loanType) {
  const income = snapshot.monthlyIncome
  const creditQuality = snapshot.creditQuality
  const loanTypeKey = loanType || 'personal'

  const multiple = INCOME_MULTIPLES[loanTypeKey] || { min: 2, max: 4 }
  const annualIncome = income * 12
  const minAmount = annualIncome * multiple.min
  const maxAmount = annualIncome * multiple.max

  let creditFactor = 1.0
  if (creditQuality === 'good') creditFactor = 1.1
  else if (creditQuality === 'poor') creditFactor = 0.7
  else if (creditQuality === 'unknown') creditFactor = 0.85

  let adjustedMin = minAmount * creditFactor
  let adjustedMax = maxAmount * creditFactor

  // 🔥 NEW: Cap lender amount based on requested amount
  const requestedAmount = snapshot.requestedAmount || 0
  if (requestedAmount > 0) {
    // Don't show more than 2x requested amount for personal loans
    if (loanTypeKey === 'personal') {
      const maxLenderCap = requestedAmount * 2
      if (adjustedMax > maxLenderCap) {
        adjustedMax = maxLenderCap
        adjustedMin = Math.min(adjustedMin, maxLenderCap)
      }
    }
    // For secured loans, allow up to 3x
    if (['home', 'loan-against-property'].includes(loanTypeKey)) {
      const maxLenderCap = requestedAmount * 3
      if (adjustedMax > maxLenderCap) {
        adjustedMax = maxLenderCap
        adjustedMin = Math.min(adjustedMin, maxLenderCap)
      }
    }
  }

  // Ensure min is not greater than max
  if (adjustedMin > adjustedMax) {
    adjustedMin = adjustedMax * 0.8
  }

  // Rate band
  const baseRate = PRODUCT_BASE_RATES[loanTypeKey] || { min: 12, max: 18 }
  let rateMin = baseRate.min
  let rateMax = baseRate.max

  if (creditQuality === 'good') { rateMin -= 1; rateMax -= 1 }
  else if (creditQuality === 'poor') { rateMin += 2; rateMax += 2 }

  rateMin = Math.max(0, rateMin)
  rateMax = Math.max(rateMin, rateMax)

  let confidence = 'Medium'
  if (snapshot.creditQuality !== 'unknown') confidence = 'High'
  else confidence = 'Low'

  return {
    likelyAmount: {
      min: Math.max(0, adjustedMin),
      max: adjustedMax,
      confidence,
      reasons: [`Based on ${multiple.min}-${multiple.max}x annual income, adjusted for credit.`],
    },
    likelyRate: {
      min: rateMin,
      max: rateMax,
      confidence,
      reasons: [`Base rate for ${loanType} adjusted for credit quality.`],
    },
    productSuitability: 'Standard',
  }
}