export function monthlySurplus(profile) {
  const income = profile.income?.monthlyNet || 0
  const essential = (profile.expenses?.household || 0) + (profile.expenses?.rent || 0)
  const existingEMI = profile.debt?.totalEMI || 0
  return income - essential - existingEMI
}

export function debtRatio(profile) {
  const income = profile.income?.monthlyNet || 0
  if (income === 0) return Infinity
  const totalDebt = (profile.debt?.totalEMI || 0) + (profile.expenses?.household || 0) + (profile.expenses?.rent || 0)
  return totalDebt / income
}