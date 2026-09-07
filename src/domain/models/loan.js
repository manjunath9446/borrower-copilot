/**
 * @typedef {'personal'|'home'|'loan-against-property'|'gold'|'vehicle'|'business'} LoanType
 * @typedef {Object} LoanProduct
 * @property {LoanType} type
 * @property {string} label
 * @property {number} typicalMinRate
 * @property {number} typicalMaxRate
 * @property {number} processingFeePercent
 * @property {number} minTenureMonths
 * @property {number} maxTenureMonths
 * @property {boolean} secured
 */