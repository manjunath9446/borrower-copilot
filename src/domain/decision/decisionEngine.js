import { normalizeProfile } from '../calculations/normalization.js'
import { affordabilityEngine } from '../engines/affordabilityEngine.js'
import { eligibilityEngine } from '../engines/eligibilityEngine.js'
import { assessFairRate } from '../engines/rateEngine.js'
import { runStressTest, STRESS_SCENARIOS } from '../engines/stressEngine.js'
import { computeRiskSignals } from './riskSignals.js'

export function decisionEngine(rawProfile) {
  const snapshot = normalizeProfile(rawProfile)
  const loanType = rawProfile.loan?.type || 'personal'
  const tenure = rawProfile.loan?.tenure || 60

  const affordability = affordabilityEngine(snapshot, loanType, tenure)
  const eligibility = eligibilityEngine(snapshot, loanType)
  const rateAssessment = assessFairRate(snapshot, loanType)

  const proposedAmount = rawProfile.loan?.amount || 0
  const proposedRate = (rateAssessment.fairRate.min + rateAssessment.fairRate.max) / 2

  const stressResults = STRESS_SCENARIOS.map(scenario => {
    const stressSnapshot = { ...snapshot }
    if (scenario.incomeChange) {
      stressSnapshot.monthlyIncome = snapshot.monthlyIncome * (1 + scenario.incomeChange)
    }
    const rateChange = scenario.rateChange || 0
    return runStressTest(
      rawProfile,
      stressSnapshot,
      loanType,
      tenure,
      proposedAmount,
      proposedRate + rateChange
    )
  })

  const risks = computeRiskSignals(snapshot, affordability, eligibility, stressResults)

  let verdict = 'borrow'
  const reasons = []
  const warnings = []
  const nextSteps = []

  const requested = snapshot.requestedAmount
  const safeMax = affordability.safeAmount?.max || 0
  const lenderMax = eligibility.likelyAmount?.max || 0

  if (requested > safeMax * 1.3) {
    verdict = 'consider-waiting'
    reasons.push('Requested amount significantly exceeds your safe borrowing capacity.')
  } else if (requested > safeMax) {
    verdict = 'borrow-less'
    reasons.push('Requested amount exceeds your safe capacity; consider borrowing less.')
  } else if (requested > lenderMax && lenderMax > 0) {
    verdict = 'borderline'
    reasons.push('Lenders may not sanction the full amount; be prepared to negotiate.')
  } else {
    reasons.push('Requested amount is within your safe range and lender expectations.')
  }

  if (risks.debtRisk === 'high') {
    warnings.push('Your debt-to-income ratio is high; avoid taking on more debt.')
    if (verdict === 'borrow') verdict = 'borderline'
  }
  if (risks.incomeRisk === 'high') {
    warnings.push('Your income is variable; ensure you have a buffer.')
    if (verdict === 'borrow') verdict = 'borderline'
  }
  if (risks.stressRisk === 'high') {
    warnings.push('Stress tests indicate you may struggle if income drops.')
    if (verdict === 'borrow') verdict = 'risky'
  }
  if (risks.liquidityRisk === 'high') {
    warnings.push('Your savings are low; consider building an emergency fund first.')
  }
  if (risks.creditRisk === 'high') {
    warnings.push('Your credit history may lead to higher rates or rejection.')
  }

  if (rawProfile.loan?.purpose === 'wedding' || rawProfile.loan?.purpose === 'vacation') {
    warnings.push('This is a consumption loan that does not generate income.')
  }

  const confidence = affordability.safeEMI?.confidence || 'Low'

  return {
    verdict,
    requestedAmount: requested,
    safeAmount: affordability.safeAmount || { min: 0, max: 0, confidence: 'Low', reasons: [] },
    lenderLikelyAmount: eligibility.likelyAmount || { min: 0, max: 0, confidence: 'Low', reasons: [] },
    maxComfortableEMI: affordability.safeEMI || { value: 0, confidence: 'Low', reasons: [] },
    fairRate: rateAssessment.fairRate || { min: 12, max: 18, confidence: 'Medium', reasons: [] },
    allInAPR: rateAssessment.allInAPR || { value: 0, confidence: 'Low', reasons: [] },
    stressResults,
    confidence,
    reasons,
    warnings,
    nextSteps,
    riskSignals: risks,
  }
}