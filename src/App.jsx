// src/App.jsx
import React, { useState, useEffect } from 'react'
import { StoryHome } from './features/home/StoryHome.jsx'
import { Questionnaire } from './features/questionnaire/Questionnaire.jsx'
import { Results } from './features/results/Results.jsx'
import { NegotiationCard } from './features/negotiation-card/NegotiationCard.jsx'
import { useBorrowerStore } from './state/borrowerStore.js'

function App() {
  const [screen, setScreen] = useState('home')
  const { recommendation } = useBorrowerStore()

  useEffect(() => {
    if (recommendation && screen === 'questionnaire') {
      setScreen('results')
    }
  }, [recommendation, screen])

  switch (screen) {
    case 'home':
      return <StoryHome onStart={() => setScreen('questionnaire')} />
    case 'questionnaire':
      return <Questionnaire onComplete={() => setScreen('results')} />
    case 'results':
      return <Results onCard={() => setScreen('card')} />
    case 'card':
      return <NegotiationCard onBack={() => setScreen('results')} />
    default:
      return <StoryHome onStart={() => setScreen('questionnaire')} />
  }
}

export default App