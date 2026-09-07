import { calculateEMI } from '../calculations/emi.js'
import { affordabilityEngine } from './affordabilityEngine.js'

export function runStressTest(profile, snapshot, loanType, tenureMonths, proposedAmount, proposedRate) {
  if (!proposedAmount || proposedAmount <= 0) {
    return {
      scenario: 'No loan to test',
      proposedEMI: 0,
      stressedSafeEMI: { value: 0, confidence: 'Low', reasons: [] },
      status: 'pass',
      bufferRemaining: 0,
      explanation: 'No loan amount provided for stress test.',
    }
  }

  const proposedEMI = calculateEMI(proposedAmount, proposedRate, tenureMonths)

  const stressedSnapshot = { 
    ...snapshot, 
    monthlyIncome: snapshot.monthlyIncome * 0.8,
    conservativeIncome: snapshot.conservativeIncome * 0.8,
  }
  const stressedAffordability = affordabilityEngine(stressedSnapshot, loanType, tenureMonths)
  const stressedSafeEMI = stressedAffordability.safeEMI

  const buffer = stressedSafeEMI.value - proposedEMI
  let status = 'pass'
  if (buffer < -1000) status = 'fail'
  else if (buffer < 500) status = 'tight'

  return {
    scenario: 'Income -20%',
    proposedEMI,
    stressedSafeEMI,
    status,
    bufferRemaining: buffer,
    explanation: `Under 20% income reduction, your safe EMI would be ₹${stressedSafeEMI.value.toFixed(0)}. Proposed EMI is ₹${proposedEMI.toFixed(0)}.`,
  }
}

export const STRESS_SCENARIOS = [
  { id: 'income_down_20', label: 'Income -20%', incomeChange: -0.20, rateChange: 0 },
  { id: 'income_down_30', label: 'Income -30%', incomeChange: -0.30, rateChange: 0 },
  { id: 'rate_up_2', label: 'Rate +2%', incomeChange: 0, rateChange: 0.02 },
  { id: 'combined', label: 'Income -20% & Rate +2%', incomeChange: -0.20, rateChange: 0.02 },
]