export function calculateEMI(principal, annualRate, tenureMonths) {
  if (principal <= 0 || tenureMonths <= 0) return 0
  const monthlyRate = annualRate / 100 / 12
  if (monthlyRate === 0) return principal / tenureMonths
  return principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths) / (Math.pow(1 + monthlyRate, tenureMonths) - 1)
}

export function calculatePrincipal(emi, annualRate, tenureMonths) {
  if (emi <= 0 || tenureMonths <= 0) return 0
  const monthlyRate = annualRate / 100 / 12
  if (monthlyRate === 0) return emi * tenureMonths
  return emi * (1 - Math.pow(1 + monthlyRate, -tenureMonths)) / monthlyRate
}

export function totalInterest(principal, annualRate, tenureMonths) {
  const emi = calculateEMI(principal, annualRate, tenureMonths)
  return emi * tenureMonths - principal
}