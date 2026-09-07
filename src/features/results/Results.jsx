// src/features/results/Results.jsx
import React from 'react'
import { useBorrowerStore } from '../../state/borrowerStore.js'

export function Results({ onCard }) {
  const { recommendation } = useBorrowerStore()
  if (!recommendation) return <div style={{ textAlign: 'center', padding: '2rem' }}>No data</div>

  const verdictClass = {
    'borrow': 'borrow',
    'borrow-less': 'borrow-less',
    'borderline': 'borderline',
    'risky': 'risky',
    'consider-waiting': 'consider-waiting'
  }[recommendation.verdict] || ''

  const verdictLabel = {
    'borrow': '🟢 Borrowing looks manageable',
    'borrow-less': '🟡 Consider borrowing less',
    'borderline': '🟠 Borrowing is borderline',
    'risky': '🔴 Borrowing looks risky',
    'consider-waiting': '🔴 Consider waiting'
  }[recommendation.verdict] || ''

  // Format numbers with commas
  const formatCurrency = (num) => {
    return '₹' + Number(num).toLocaleString('en-IN')
  }

  return (
    <div style={{ 
      maxWidth: '600px', 
      margin: '0 auto', 
      padding: '1rem 0' 
    }}>
      {/* Verdict */}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <div className={`verdict-badge ${verdictClass}`} style={{ fontSize: '1.1rem', padding: '0.6rem 2rem' }}>
          {verdictLabel}
        </div>
      </div>

      {/* Result Cards */}
      <div className="result-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div className="result-item">
          <div className="label">You requested</div>
          <div className="value" style={{ fontSize: '1.2rem' }}>
            {formatCurrency(recommendation.requestedAmount)}
          </div>
        </div>
        <div className="result-item">
          <div className="label">You should target</div>
          <div className="value" style={{ fontSize: '1.2rem' }}>
            <span className="highlight">{formatCurrency(recommendation.safeAmount.min)}</span>
            {' – '}
            <span className="highlight">{formatCurrency(recommendation.safeAmount.max)}</span>
          </div>
        </div>
        <div className="result-item">
          <div className="label">Lender may offer</div>
          <div className="value" style={{ fontSize: '1.2rem' }}>
            {formatCurrency(recommendation.lenderLikelyAmount.min)} – {formatCurrency(recommendation.lenderLikelyAmount.max)}
          </div>
        </div>
        <div className="result-item">
          <div className="label">Max comfortable EMI</div>
          <div className="value" style={{ fontSize: '1.2rem' }}>
            {formatCurrency(recommendation.maxComfortableEMI.value)}
          </div>
        </div>
        <div className="result-item" style={{ gridColumn: '1 / -1' }}>
          <div className="label">Fair rate</div>
          <div className="value" style={{ fontSize: '1.2rem' }}>
            {recommendation.fairRate.min}% – {recommendation.fairRate.max}%
          </div>
        </div>
      </div>

      {/* Confidence */}
      {recommendation.confidence && (
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <span className="confidence-badge" style={{ 
            display: 'inline-block',
            padding: '0.2rem 1rem',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: '600',
            background: recommendation.confidence === 'High' ? 'rgba(0,200,100,0.15)' : 
                        recommendation.confidence === 'Medium' ? 'rgba(255,193,7,0.15)' : 
                        'rgba(255,107,0,0.15)',
            color: recommendation.confidence === 'High' ? '#00c864' : 
                   recommendation.confidence === 'Medium' ? '#ffd43b' : '#ffa94d',
            border: '1px solid ' + (recommendation.confidence === 'High' ? 'rgba(0,200,100,0.2)' : 
                                    recommendation.confidence === 'Medium' ? 'rgba(255,193,7,0.2)' : 
                                    'rgba(255,107,0,0.2)')
          }}>
            Confidence: {recommendation.confidence}
          </span>
        </div>
      )}

      {/* Reasons */}
      {recommendation.reasons && recommendation.reasons.length > 0 && (
        <div className="reasons" style={{ marginBottom: '1.5rem' }}>
          <strong style={{ display: 'block', marginBottom: '0.5rem', color: '#f5b342' }}>Why?</strong>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {recommendation.reasons.map((reason, i) => (
              <li key={i} style={{ 
                padding: '0.3rem 0', 
                paddingLeft: '1.5rem', 
                position: 'relative',
                color: '#c0c0d0',
                fontSize: '0.95rem'
              }}>
                <span style={{ position: 'absolute', left: 0, color: '#f5b342', fontWeight: 700 }}>›</span>
                {reason}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Warnings */}
      {recommendation.warnings && recommendation.warnings.length > 0 && (
        <div className="warnings" style={{ marginBottom: '1.5rem' }}>
          <strong style={{ display: 'block', marginBottom: '0.5rem', color: '#ff4646' }}>Warnings</strong>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {recommendation.warnings.map((warning, i) => (
              <li key={i} style={{ 
                padding: '0.2rem 0', 
                paddingLeft: '1.5rem', 
                position: 'relative',
                color: '#ffb0b0'
              }}>
                <span style={{ position: 'absolute', left: 0 }}>⚠</span>
                {warning}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Button */}
      <div style={{ textAlign: 'center' }}>
        <button 
          className="btn-primary" 
          onClick={onCard} 
          style={{ 
            padding: '0.9rem 2.5rem',
            fontSize: '1rem',
            minWidth: '200px'
          }}
        >
          View Negotiation Card
        </button>
      </div>
    </div>
  )
}