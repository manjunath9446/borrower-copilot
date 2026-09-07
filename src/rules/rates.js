export const PRODUCT_BASE_RATES = {
  personal: { min: 12, max: 18 },
  home: { min: 8, max: 10 },
  'loan-against-property': { min: 9, max: 12 },
  gold: { min: 9, max: 12 },
  vehicle: { min: 10, max: 14 },
  business: { min: 12, max: 18 },
}

export const CREDIT_ADJUSTMENTS = [
  { minScore: 750, adjustment: -1.0 },
  { minScore: 700, adjustment: 0 },
  { minScore: 650, adjustment: 1.0 },
  { minScore: 0, adjustment: 2.0 },
]

export const PROCESSING_FEE = {
  personal: 2.0,
  home: 1.0,
  'loan-against-property': 1.5,
  gold: 1.0,
  vehicle: 1.5,
  business: 2.0,
}