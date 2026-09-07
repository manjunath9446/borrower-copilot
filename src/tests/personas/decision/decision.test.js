import { describe, it, expect } from 'vitest'
import { decisionEngine } from '../../../domain/decision/decisionEngine.js'
import { priyaProfile, raviProfile, anitaProfile } from '../fixtures.js'

describe('Decision Engine', () => {
  it('Priya should get borrow verdict', () => {
    const result = decisionEngine(priyaProfile)
    expect(result.verdict).toBe('borrow')
    expect(result.safeAmount.max).toBeGreaterThan(800000)
  })

  it('Ravi should get borderline or consider-waiting (conservative due to unknown credit)', () => {
    const result = decisionEngine(raviProfile)
    expect(['borderline', 'consider-waiting']).toContain(result.verdict)
  })

  it('Anita should get risky, consider-waiting, or borrow-less', () => {
    const result = decisionEngine(anitaProfile)
    expect(['risky', 'consider-waiting', 'borrow-less']).toContain(result.verdict)
  })
})