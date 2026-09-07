export function computeRiskSignals(snapshot, affordability, eligibility, stressResults) {
  const signals = {}

  const dti = affordability.dti?.value || 0
  if (dti > 0.6) signals.debtRisk = 'high'
  else if (dti > 0.45) signals.debtRisk = 'medium'
  else signals.debtRisk = 'low'

  if (snapshot.stabilityFactor < 0.8) signals.incomeRisk = 'high'
  else if (snapshot.stabilityFactor < 0.9) signals.incomeRisk = 'medium'
  else signals.incomeRisk = 'low'

  const savingsMonths = snapshot.liquidSavings / (snapshot.essentialExpenses || 1)
  if (savingsMonths < 3) signals.liquidityRisk = 'high'
  else if (savingsMonths < 6) signals.liquidityRisk = 'medium'
  else signals.liquidityRisk = 'low'

  if (snapshot.creditQuality === 'poor') signals.creditRisk = 'high'
  else if (snapshot.creditQuality === 'unknown') signals.creditRisk = 'medium'
  else signals.creditRisk = 'low'

  const requested = snapshot.requestedAmount
  const safeMax = affordability.safeAmount?.max || 0
  if (requested > safeMax * 1.2) signals.affordabilityRisk = 'high'
  else if (requested > safeMax) signals.affordabilityRisk = 'medium'
  else signals.affordabilityRisk = 'low'

  const hasFail = stressResults?.some(r => r.status === 'fail') || false
  const hasTight = stressResults?.some(r => r.status === 'tight') || false
  if (hasFail) signals.stressRisk = 'high'
  else if (hasTight) signals.stressRisk = 'medium'
  else signals.stressRisk = 'low'

  return signals
}