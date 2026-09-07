import { PRODUCT_BASE_RATES, CREDIT_ADJUSTMENTS, PROCESSING_FEE } from '../../rules/rates.js'
import { calculateEMI } from '../calculations/emi.js'

export function assessFairRate(snapshot, loanType) {
  const base = PRODUCT_BASE_RATES[loanType] || { min: 12, max: 18 }
  let rateMin = base.min
  let rateMax = base.max

  const score = snapshot.creditQuality === 'good' ? 780 : 
                snapshot.creditQuality === 'fair' ? 720 : 
                snapshot.creditQuality === 'poor' ? 620 : 0

  let adj = 0
  for (const rule of CREDIT_ADJUSTMENTS) {
    if (score >= rule.minScore) { adj = rule.adjustment; break }
  }
  rateMin += adj
  rateMax += adj
  rateMin = Math.max(0, rateMin)
  rateMax = Math.max(rateMin, rateMax)

  const feePercent = PROCESSING_FEE[loanType] || 2.0
  const gstPercent = 18
  const principal = snapshot.requestedAmount || 100000
  const fee = principal * (feePercent / 100)
  const gst = fee * (gstPercent / 100)
  const totalFee = fee + gst

  const tenure = 60
  const avgRate = (rateMin + rateMax) / 2
  const emi = calculateEMI(principal, avgRate, tenure)
  const totalPayment = emi * tenure + totalFee
  const apr = ((totalPayment / principal) ** (1/(tenure/12)) - 1) * 100

  return {
    fairRate: {
      min: rateMin,
      max: rateMax,
      confidence: snapshot.creditQuality !== 'unknown' ? 'High' : 'Medium',
      reasons: [`Base rate ${base.min}-${base.max}% adjusted for credit.`],
    },
    allInAPR: {
      value: apr,
      confidence: 'Medium',
      reasons: [`Includes processing fee of ${feePercent}% and GST.`],
    },
    breakdown: {
      interest: emi * tenure - principal,
      processingFee: fee,
      gst: gst,
      totalCost: totalPayment,
    },
  }
}