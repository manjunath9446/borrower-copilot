// src/features/home/StoryHome.jsx
import React, { useEffect, useRef } from 'react'
import { useBorrowerStore } from '../../state/borrowerStore.js'

export function StoryHome({ onStart }) {
  const reset = useBorrowerStore(state => state.reset)
  const sectionsRef = useRef([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('section-visible')
          }
        })
      },
      { threshold: 0.2 }
    )

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section)
    })

    return () => observer.disconnect()
  }, [])

  const handleStart = () => {
    reset()
    onStart()
  }

  return (
    <div className="story-home">
      {/* ===== SECTION 1: HERO ===== */}
      <section 
        className="story-section hero-section"
        ref={el => sectionsRef.current[0] = el}
      >
        <div className="hero-content">
          <div className="badge">⚡ Smart Borrowing</div>
          <h1>Borrower Copilot</h1>
          <p className="subtitle">
            Know what you can afford, what lenders may offer, and what rate is fair.<br />
            All before you step into a bank.
          </p>
          <div className="features">
            <span>✓ Safe borrowing limit</span>
            <span>✓ Fair interest rate</span>
            <span>✓ Negotiation card</span>
          </div>
          <button className="btn-primary" onClick={handleStart}>
            Check my borrowing power →
          </button>
        </div>

      </section>

      {/* ===== SECTION 2: THE DREAM ===== */}
      <section 
        className="story-section dream-section"
        ref={el => sectionsRef.current[1] = el}
      >
        <div className="section-content">
          <div className="section-number">01</div>
          <h2>The Dream</h2>
          <p className="section-description">
            Every borrower starts with a goal. A home, a business, an education, 
            or a wedding. You know exactly what you want — but the path to getting 
            there is unclear.
          </p>
          <div className="dream-visual">
            <span className="dream-icon"></span>
            <span className="dream-icon"></span>
            <span className="dream-icon"></span>
            <span className="dream-icon"></span>
          </div>
          <blockquote>
            "I just want to know if I can afford this loan."
          </blockquote>
        </div>
      </section>

      {/* ===== SECTION 3: THE CONFUSION ===== */}
      <section 
        className="story-section confusion-section"
        ref={el => sectionsRef.current[2] = el}
      >
        <div className="section-content">
          <div className="section-number">02</div>
          <h2>The Confusion</h2>
          <p className="section-description">
            You walk into a bank. The lender talks about interest rates, 
            processing fees, and EMIs. You hear words like APR, FOIR, and 
            CIBIL score. You nod, sign the papers, and hope for the best.
          </p>
          <div className="confusion-grid">
            <div className="confusion-item">
              <span className="confusion-icon"></span>
              <span>What's a fair rate?</span>
            </div>
            <div className="confusion-item">
              <span className="confusion-icon"></span>
              <span>Can I afford the EMI?</span>
            </div>
            <div className="confusion-item">
              <span className="confusion-icon"></span>
              <span>What are the hidden fees?</span>
            </div>
            <div className="confusion-item">
              <span className="confusion-icon"></span>
              <span>Is this loan right for me?</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 4: THE EMI TRAP ===== */}
      <section 
        className="story-section emi-section"
        ref={el => sectionsRef.current[3] = el}
      >
        <div className="section-content">
          <div className="section-number">03</div>
          <h2>The EMI Trap</h2>
          <p className="section-description">
            You start paying the EMI. Month after month, you wonder if you're 
            paying too much. You calculate and recalculate, but the numbers 
            don't add up. You're locked in for years.
          </p>
          <div className="emi-visual">
            <div className="emi-bar">
              <div className="emi-bar-fill" style={{ width: '45%' }}>
                <span>₹22,000/month</span>
              </div>
            </div>
            <div className="emi-note">
              <span>45% of your income goes to EMI</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 5: AI ASSISTANCE ===== */}
      <section 
        className="story-section ai-section"
        ref={el => sectionsRef.current[4] = el}
      >
        <div className="section-content">
          <div className="section-number">04</div>
          <h2>AI Assistance</h2>
          <p className="section-description">
            <span className="highlight">Borrower Copilot</span> steps in. 
            Answer 8 simple questions about your income, expenses, and goals. 
            Our AI does the math and gives you clear, honest answers.
          </p>
          <div className="ai-steps">
            <div className="ai-step">
              <span className="step-number">1</span>
              <span>Tell us about yourself</span>
            </div>
            <div className="ai-step">
              <span className="step-number">2</span>
              <span>We calculate your safe limits</span>
            </div>
            <div className="ai-step">
              <span className="step-number">3</span>
              <span>Get your personalized report</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 6: THE CONFIDENCE ===== */}
      <section 
        className="story-section confidence-section"
        ref={el => sectionsRef.current[5] = el}
      >
        <div className="section-content">
          <div className="section-number">05</div>
          <h2>The Confidence</h2>
          <p className="section-description">
            Now you walk into the lender with a <span className="highlight">Negotiation Card</span> 
            in hand. You know your safe amount, your fair rate, and your 
            maximum EMI. You're no longer guessing.
          </p>
          <div className="confidence-card">
            <div className="confidence-item">
              <span>Your safe amount</span>
              <strong>₹5.5L – ₹6.2L</strong>
            </div>
            <div className="confidence-item">
              <span>Your fair rate</span>
              <strong>11.5% – 13.5%</strong>
            </div>
            <div className="confidence-item">
              <span>Your max EMI</span>
              <strong>₹18,000/month</strong>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 7: CALL TO ACTION ===== */}
      <section 
        className="story-section cta-section"
        ref={el => sectionsRef.current[6] = el}
      >
        <div className="section-content text-center">
          <h2>Ready to borrow smarter?</h2>
          <p className="section-description" style={{ maxWidth: '500px', margin: '0 auto 2rem' }}>
            Get your personalized borrowing report in under 5 minutes. 
            No login, no credit bureau, no hidden costs.
          </p>
          <button className="btn-primary btn-large" onClick={handleStart}>
            Start Your Journey →
          </button>
          <div className="cta-footer">
            <span> No login required</span>
            <span> 8 simple questions</span>
            <span> Free to use</span>
          </div>
        </div>
      </section>
    </div>
  )
}