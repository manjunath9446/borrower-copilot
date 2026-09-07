// src/features/negotiation-card/NegotiationCard.jsx
import React from 'react'
import { useBorrowerStore } from '../../state/borrowerStore.js'

export function NegotiationCard({ onBack }) {
  const { recommendation, profile } = useBorrowerStore()
  if (!recommendation) return <div style={{ textAlign: 'center', padding: '2rem' }}>No data</div>

  // Format numbers with commas
  const formatCurrency = (num) => {
    return '₹' + Number(num).toLocaleString('en-IN')
  }

  const safeMin = recommendation.safeAmount?.min || 0
  const safeMax = recommendation.safeAmount?.max || 0
  const emiValue = recommendation.maxComfortableEMI?.value || 0
  const rateMin = recommendation.fairRate?.min || 12
  const rateMax = recommendation.fairRate?.max || 18
  const requested = profile.loan?.amount || 0

  return (
    <div style={{ 
      maxWidth: '600px', 
      margin: '0 auto', 
      padding: '1rem 0' 
    }}>
      <div className="card" style={{ 
        padding: '2rem 1.5rem',
        border: '2px solid rgba(245, 179, 66, 0.25)',
        borderRadius: '24px',
        position: 'relative',
        overflow: 'hidden',
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(12px)'
      }}>
        {/* Decorative line */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'linear-gradient(90deg, #f5b342, #e69500, #f5b342)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 3s linear infinite'
        }} />

        <style>
          {`
            @keyframes shimmer {
              0% { background-position: 0% 0%; }
              100% { background-position: 200% 0%; }
            }
          `}
        </style>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ 
            color: '#f5b342', 
            fontSize: '1.8rem', 
            fontWeight: 700,
            marginBottom: '0.2rem'
          }}>
            My Borrower Card
          </h2>
          <p style={{ color: '#8888a0', fontSize: '0.85rem' }}>
            Take this to your lender
          </p>
        </div>

        {/* Card Items */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div className="card-item" style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            padding: '0.7rem 0',
            borderBottom: '1px solid rgba(255,255,255,0.05)'
          }}>
            <span className="label" style={{ color: '#8888a0' }}>Amount I want</span>
            <span className="value" style={{ color: '#ffffff', fontWeight: 600 }}>
              {formatCurrency(requested)}
            </span>
          </div>
          <div className="card-item" style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            padding: '0.7rem 0',
            borderBottom: '1px solid rgba(255,255,255,0.05)'
          }}>
            <span className="label" style={{ color: '#8888a0' }}>Target amount</span>
            <span className="value" style={{ color: '#f5b342', fontWeight: 600 }}>
              {formatCurrency(safeMin)} – {formatCurrency(safeMax)}
            </span>
          </div>
          <div className="card-item" style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            padding: '0.7rem 0',
            borderBottom: '1px solid rgba(255,255,255,0.05)'
          }}>
            <span className="label" style={{ color: '#8888a0' }}>Max EMI I can accept</span>
            <span className="value" style={{ color: '#ffffff', fontWeight: 600 }}>
              {formatCurrency(emiValue)}
            </span>
          </div>
          <div className="card-item" style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            padding: '0.7rem 0',
            borderBottom: '1px solid rgba(255,255,255,0.05)'
          }}>
            <span className="label" style={{ color: '#8888a0' }}>Fair rate</span>
            <span className="value" style={{ color: '#f5b342', fontWeight: 600 }}>
              {rateMin}% – {rateMax}%
            </span>
          </div>
        </div>

        {/* Questions */}
        <div className="card-questions" style={{ 
          marginTop: '1.5rem',
          padding: '1.2rem',
          background: 'rgba(255,255,255,0.04)',
          borderRadius: '16px'
        }}>
          <strong style={{ 
            display: 'block', 
            marginBottom: '0.8rem',
            color: '#f5b342',
            fontSize: '0.9rem'
          }}>
            Ask the lender:
          </strong>
          <ul style={{ 
            listStyle: 'none', 
            padding: 0,
            margin: 0
          }}>
            <li style={{ 
              padding: '0.3rem 0', 
              paddingLeft: '1.5rem', 
              position: 'relative',
              color: '#c0c0d0',
              fontSize: '0.95rem'
            }}>
              <span style={{ position: 'absolute', left: 0 }}>❓</span>
              What is the APR (all-in cost)?
            </li>
            <li style={{ 
              padding: '0.3rem 0', 
              paddingLeft: '1.5rem', 
              position: 'relative',
              color: '#c0c0d0',
              fontSize: '0.95rem'
            }}>
              <span style={{ position: 'absolute', left: 0 }}>❓</span>
              What is the total repayment amount?
            </li>
            <li style={{ 
              padding: '0.3rem 0', 
              paddingLeft: '1.5rem', 
              position: 'relative',
              color: '#c0c0d0',
              fontSize: '0.95rem'
            }}>
              <span style={{ position: 'absolute', left: 0 }}>❓</span>
              What processing fees apply?
            </li>
            <li style={{ 
              padding: '0.3rem 0', 
              paddingLeft: '1.5rem', 
              position: 'relative',
              color: '#c0c0d0',
              fontSize: '0.95rem'
            }}>
              <span style={{ position: 'absolute', left: 0 }}>❓</span>
              Are there any add-on products?
            </li>
            <li style={{ 
              padding: '0.3rem 0', 
              paddingLeft: '1.5rem', 
              position: 'relative',
              color: '#c0c0d0',
              fontSize: '0.95rem'
            }}>
              <span style={{ position: 'absolute', left: 0 }}>❓</span>
              What are the foreclosure charges?
            </li>
          </ul>
        </div>

        {/* Warning */}
        {recommendation.warnings && recommendation.warnings.length > 0 && (
          <div style={{ 
            marginTop: '1.5rem',
            padding: '1rem',
            background: 'rgba(255,70,70,0.1)',
            borderRadius: '12px',
            border: '1px solid rgba(255,70,70,0.2)',
            color: '#ffb0b0',
            fontSize: '0.95rem'
          }}>
            <span style={{ marginRight: '0.5rem' }}>⚠️</span>
            {recommendation.warnings[0]}
          </div>
        )}

        {/* Back Button */}
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button 
            className="btn-secondary" 
            onClick={onBack}
            style={{ 
              padding: '0.8rem 2.5rem',
              borderRadius: '60px',
              border: '1px solid rgba(255,255,255,0.15)',
              background: 'rgba(255,255,255,0.06)',
              color: '#e0e0e0',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.12)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.06)'}
          >
            Back to Results
          </button>
        </div>
      </div>
    </div>
  )
}