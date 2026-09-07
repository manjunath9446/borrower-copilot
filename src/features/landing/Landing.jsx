import React from 'react'
import { useBorrowerStore } from '../../state/borrowerStore.js'

export function Landing({ onStart }) {
  const reset = useBorrowerStore(state => state.reset)

  const handleStart = () => {
    reset()
    onStart()
  }

  return (
    <div className="landing">
      <div className="badge">⚡ Smart Borrowing</div>
      <h1>Borrower Copilot</h1>
      <p className="subtitle">
        Know what you can afford, what lenders may offer, and what rate is fair.
        All before you step into a bank.
      </p>
      <div className="features">
        <span>Safe borrowing limit</span>
        <span>Fair interest rate</span>
        <span>Negotiation card</span>
      </div>
      <button className="btn-primary" onClick={handleStart}>
        Check my borrowing power
      </button>
    </div>
  )
}