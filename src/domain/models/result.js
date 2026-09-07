/**
 * @typedef {'Very Low'|'Low'|'Medium'|'High'} Confidence
 * @typedef {Object} ExplainedNumber
 * @property {number} value
 * @property {Confidence} confidence
 * @property {string[]} reasons
 * @property {string[]} [assumptions]
 * @property {string[]} [limitations]
 * @property {string[]} [ruleReferences]
 * 
 * @typedef {Object} ExplainedRange
 * @property {number} min
 * @property {number} max
 * @property {Confidence} confidence
 * @property {string[]} reasons
 */