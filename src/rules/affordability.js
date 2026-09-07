export const FOIR_CAP = {
  value: 0.50,
  category: 'PRODUCT_JUDGEMENT',
  source: 'Conservative estimate for prototype',
  rationale: 'We cap total obligations at 50% of income for safety.',
}

export const FOIR_SAFE = {
  value: 0.35,
  category: 'PRODUCT_JUDGEMENT',
  source: 'Prototype target',
  rationale: 'Ideal ratio to keep buffer.',
}

export const STABILITY_ADJUSTMENT = {
  high: 1.0,
  medium: 0.9,
  low: 0.8,
  unknown: 0.85,
}