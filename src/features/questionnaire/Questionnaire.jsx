// src/features/questionnaire/Questionnaire.jsx
import React, { useState, useEffect } from 'react'
import { useBorrowerStore } from '../../state/borrowerStore.js'
import { getApplicableQuestions } from '../../questionnaire/questions.js'

export function Questionnaire({ onComplete }) {
  const { profile, updateProfile, answeredIds, recommendation, isCalculating } = useBorrowerStore()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [inputValue, setInputValue] = useState('')
  const [rangeMin, setRangeMin] = useState('')
  const [rangeMax, setRangeMax] = useState('')
  const [error, setError] = useState('')

  // Get applicable questions based on current profile
  const applicable = getApplicableQuestions(profile)
  const currentQuestion = applicable[currentIndex]
  const isLastQuestion = currentIndex === applicable.length - 1

  // If recommendation is ready, go to results
  useEffect(() => {
    if (recommendation) {
      onComplete()
    }
  }, [recommendation, onComplete])

  // Reset input values when question changes
  useEffect(() => {
    setInputValue('')
    setRangeMin('')
    setRangeMax('')
    setError('')
  }, [currentIndex])

  // Debug logging
  useEffect(() => {
    console.log('Current question:', currentQuestion)
    console.log('Applicable questions:', applicable.length)
  }, [currentQuestion, applicable])

  const handleNext = () => {
    if (!currentQuestion) {
      setError('No question available')
      return
    }

    // Handle different types
    let value = inputValue

    // For range type, we need to collect min and max
    if (currentQuestion.type === 'range') {
      const min = Number(rangeMin)
      const max = Number(rangeMax)
      if (isNaN(min) || isNaN(max) || min < 0 || max < 0) {
        setError('Please enter valid numbers for both min and max')
        return
      }
      if (min > max) {
        setError('Minimum cannot be greater than maximum')
        return
      }
      // Update profile with min and max
      updateProfile(currentQuestion.id, { min, max })
      setRangeMin('')
      setRangeMax('')
      // Move to next or stay
      if (currentIndex < applicable.length - 1) {
        setCurrentIndex(currentIndex + 1)
      }
      return
    }

    // For number, validate
    if (currentQuestion.type === 'number') {
      const num = Number(inputValue)
      if (isNaN(num) || num < 0) {
        setError('Please enter a valid number')
        return
      }
      value = num
    }

    // For select, check if value is selected
    if (currentQuestion.type === 'select' && !inputValue) {
      setError('Please select an option')
      return
    }

    // For text, check if not empty
    if (currentQuestion.type === 'text' && !inputValue.trim()) {
      setError('Please enter a value')
      return
    }

    // For boolean, value is already set (true/false)
    if (currentQuestion.type === 'boolean') {
      // handled in button onClick
      return
    }

    // Clear error and update profile
    setError('')
    if (currentQuestion.type !== 'range' && currentQuestion.type !== 'boolean') {
      updateProfile(currentQuestion.id, value)
      setInputValue('')
    }

    // Move to next question
    if (currentIndex < applicable.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setError('')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleNext()
    }
  }

  // If no questions, show message
  if (applicable.length === 0) {
    return (
      <div className="questionnaire" style={{ padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: '#8888a0' }}>No questions to show. Please refresh.</p>
      </div>
    )
  }

  // If current question is not found, show message
  if (!currentQuestion) {
    return (
      <div className="questionnaire" style={{ padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: '#8888a0' }}>Loading question...</p>
      </div>
    )
  }

  // Calculate progress based on answered questions
  const answeredCount = answeredIds.filter(id => 
    applicable.some(q => q.id === id)
  ).length

  const progress = applicable.length > 0 ? (answeredCount / applicable.length) * 100 : 0

  // Determine if next button should be disabled
  const isNextDisabled = () => {
    if (currentQuestion.type === 'boolean') return false
    if (currentQuestion.type === 'range') {
      return !rangeMin || !rangeMax
    }
    if (currentQuestion.type === 'select') return !inputValue
    if (currentQuestion.type === 'number') return !inputValue
    if (currentQuestion.type === 'text') return !inputValue.trim()
    return !inputValue
  }

  return (
    <div className="questionnaire" style={{ padding: '1.5rem' }}>
      {/* Progress */}
      <div className="step-indicator">
        <span>
          Question <span className="current">{currentIndex + 1}</span> of {applicable.length}
        </span>
        <span style={{ color: '#8888a0', fontSize: '0.8rem' }}>
          {Math.round(progress)}% done
        </span>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${Math.min(progress, 100)}%` }} />
      </div>

      {/* Question */}
      <div style={{ marginTop: '2rem' }}>
        <div className="question-text">{currentQuestion.text}</div>
        {currentQuestion.helpText && (
          <div className="help-text">{currentQuestion.helpText}</div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div style={{ 
          color: '#ff6b6b', 
          fontSize: '0.9rem', 
          marginTop: '0.5rem',
          padding: '0.5rem',
          background: 'rgba(255,0,0,0.1)',
          borderRadius: '8px'
        }}>
          {error}
        </div>
      )}

      {/* Input */}
      <div className="input-area" style={{ marginTop: '1.5rem' }}>
        {currentQuestion.type === 'select' && (
          <select
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value)
              setError('')
            }}
            onKeyPress={handleKeyPress}
            style={{
              width: '100%',
              padding: '1rem',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '12px',
              color: '#e0e0e0',
              fontSize: '1rem',
              outline: 'none'
            }}
          >
            <option value="">Select...</option>
            {currentQuestion.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )}

        {currentQuestion.type === 'number' && (
          <input
            type="number"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value)
              setError('')
            }}
            onKeyPress={handleKeyPress}
            placeholder="Enter amount in ₹"
            min="0"
            step="1000"
            style={{
              width: '100%',
              padding: '1rem',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '12px',
              color: '#e0e0e0',
              fontSize: '1rem',
              outline: 'none'
            }}
          />
        )}

        {currentQuestion.type === 'range' && (
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#8888a0', marginBottom: '0.3rem' }}>
                Minimum (₹)
              </label>
              <input
                type="number"
                value={rangeMin}
                onChange={(e) => {
                  setRangeMin(e.target.value)
                  setError('')
                }}
                placeholder="Min"
                min="0"
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '12px',
                  color: '#e0e0e0',
                  fontSize: '1rem',
                  outline: 'none'
                }}
              />
            </div>
            <span style={{ color: '#8888a0', fontSize: '1.2rem' }}>to</span>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#8888a0', marginBottom: '0.3rem' }}>
                Maximum (₹)
              </label>
              <input
                type="number"
                value={rangeMax}
                onChange={(e) => {
                  setRangeMax(e.target.value)
                  setError('')
                }}
                placeholder="Max"
                min="0"
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '12px',
                  color: '#e0e0e0',
                  fontSize: '1rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>
        )}

        {currentQuestion.type === 'text' && (
          <input
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value)
              setError('')
            }}
            onKeyPress={handleKeyPress}
            placeholder="Enter your answer"
            style={{
              width: '100%',
              padding: '1rem',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '12px',
              color: '#e0e0e0',
              fontSize: '1rem',
              outline: 'none'
            }}
          />
        )}

        {currentQuestion.type === 'boolean' && (
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={() => {
                setError('')
                updateProfile(currentQuestion.id, true)
                if (currentIndex < applicable.length - 1) {
                  setTimeout(() => setCurrentIndex(currentIndex + 1), 200)
                }
              }}
              style={{
                flex: 1,
                padding: '1rem',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(255,255,255,0.04)',
                color: '#e0e0e0',
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.08)'}
              onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.04)'}
            >
              Yes
            </button>
            <button
              onClick={() => {
                setError('')
                updateProfile(currentQuestion.id, false)
                if (currentIndex < applicable.length - 1) {
                  setTimeout(() => setCurrentIndex(currentIndex + 1), 200)
                }
              }}
              style={{
                flex: 1,
                padding: '1rem',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(255,255,255,0.04)',
                color: '#e0e0e0',
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.08)'}
              onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.04)'}
            >
              No
            </button>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="navigation" style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
        <button
          className="btn-secondary"
          onClick={handleBack}
          disabled={currentIndex === 0}
          style={{
            flex: 1,
            padding: '0.8rem',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.04)',
            color: '#e0e0e0',
            fontSize: '1rem',
            cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
            opacity: currentIndex === 0 ? 0.4 : 1
          }}
        >
          Back
        </button>
        <button
          className="btn-primary"
          onClick={handleNext}
          disabled={isNextDisabled()}
          style={{
            flex: 1,
            padding: '0.8rem',
            borderRadius: '12px',
            border: 'none',
            background: isNextDisabled() ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #f5b342, #e69500)',
            color: isNextDisabled() ? '#8888a0' : '#0a0a1a',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: isNextDisabled() ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s'
          }}
        >
          {isLastQuestion ? 'See Results' : 'Next'}
        </button>
      </div>

      {/* Loading indicator */}
      {isCalculating && (
        <div style={{ textAlign: 'center', marginTop: '1rem', color: '#8888a0' }}>
          Calculating your results...
        </div>
      )}
    </div>
  )
}