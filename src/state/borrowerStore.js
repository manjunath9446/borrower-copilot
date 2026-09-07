// src/state/borrowerStore.js
import { create } from 'zustand'
import { decisionEngine } from '../domain/decision/decisionEngine.js'
import { questionDefinitions } from '../questionnaire/questions.js'

export const useBorrowerStore = create((set, get) => ({
  // Initial profile with defaults
  profile: {
    borrower: { incomeSource: 'salaried' },
    income: {},
    expenses: {},
    debt: {},
    savings: {},
    credit: { historyStatus: 'unknown' },
    loan: { type: 'personal', amount: 0 },
    evidence: { incomeDocumented: false, expensesKnown: false },
  },
  answeredIds: [],
  recommendation: null,
  isCalculating: false,

  // Update a single answer
  updateProfile: (questionId, answer) => {
    // Find the question definition
    const question = questionDefinitions.find(q => q.id === questionId)
    if (!question) {
      console.warn(`Question ${questionId} not found`)
      return
    }

    // Compute the partial update from mapsTo
    let update = {}
    if (typeof question.mapsTo === 'function') {
      if (question.type === 'range') {
        update = question.mapsTo(answer.min, answer.max)
      } else {
        update = question.mapsTo(answer)
      }
    }

    set((state) => {
      // Deep merge the update into the profile
      const newProfile = mergeDeep(state.profile, update)
      
      // Add to answeredIds if not already there
      const newAnswered = state.answeredIds.includes(questionId)
        ? state.answeredIds
        : [...state.answeredIds, questionId]

      return { profile: newProfile, answeredIds: newAnswered }
    })

    // Trigger recommendation calculation
    get().computeRecommendation()
  },

  computeRecommendation: () => {
    const { profile } = get()
    
    // Only compute if we have a loan amount
    if (profile.loan?.amount > 0) {
      try {
        const rec = decisionEngine(profile)
        set({ recommendation: rec, isCalculating: false })
      } catch (error) {
        console.error('Error computing recommendation:', error)
        set({ isCalculating: false })
      }
    } else {
      set({ recommendation: null })
    }
  },

  reset: () => {
    set({
      profile: {
        borrower: { incomeSource: 'salaried' },
        income: {},
        expenses: {},
        debt: {},
        savings: {},
        credit: { historyStatus: 'unknown' },
        loan: { type: 'personal', amount: 0 },
        evidence: { incomeDocumented: false, expensesKnown: false },
      },
      answeredIds: [],
      recommendation: null,
      isCalculating: false,
    })
  },
}))

// Deep merge helper
function mergeDeep(target, source) {
  const result = { ...target }
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = mergeDeep(target[key] || {}, source[key])
    } else {
      result[key] = source[key]
    }
  }
  return result
}