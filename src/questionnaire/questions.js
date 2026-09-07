export const questionDefinitions = [
  {
    id: 'income_source',
    text: 'What is your primary source of income?',
    type: 'select',
    options: [
      { value: 'salaried', label: 'Salaried employee' },
      { value: 'self-employed', label: 'Self-employed / Business owner' },
      { value: 'gig', label: 'Gig / Variable income' },
    ],
    required: true,
    showWhen: () => true,
    mapsTo: (answer) => ({ borrower: { incomeSource: answer } }),
    affects: ['all'],
  },
  {
    id: 'monthly_income',
    text: 'What is your average monthly take-home income? (₹)',
    type: 'number',
    required: true,
    helpText: 'Enter the amount you take home after taxes',
    showWhen: (profile) => profile.borrower?.incomeSource === 'salaried',
    mapsTo: (answer) => ({ income: { monthlyNet: answer, stability: 'high' } }),
    affects: ['safeEMI', 'safeAmount', 'lenderLikelyAmount'],
  },
  {
    id: 'income_range',
    text: 'What is your typical monthly income range? (₹)',
    type: 'range',
    required: true,
    showWhen: (profile) => profile.borrower?.incomeSource === 'gig' || profile.borrower?.incomeSource === 'self-employed',
    mapsTo: (min, max) => ({ income: { minMonthly: min, maxMonthly: max, stability: 'medium' } }),
    affects: ['safeEMI', 'safeAmount'],
  },
  {
    id: 'existing_emi',
    text: 'What are your total existing monthly loan EMIs? (₹)',
    type: 'number',
    required: false,
    helpText: 'Enter 0 if you have no existing loans',
    showWhen: () => true,
    mapsTo: (answer) => ({ debt: { totalEMI: answer } }),
    affects: ['safeEMI', 'debtRisk'],
  },
  {
    id: 'household_expenses',
    text: 'What are your monthly household expenses (excluding rent)? (₹)',
    type: 'number',
    required: false,
    helpText: 'Enter 0 if you want to skip this',
    showWhen: () => true,
    mapsTo: (answer) => ({ expenses: { household: answer } }),
    affects: ['safeEMI'],
  },
  {
    id: 'rent',
    text: 'What is your monthly rent? (₹)',
    type: 'number',
    required: false,
    helpText: 'Enter 0 if you own your home',
    showWhen: () => true,
    mapsTo: (answer) => ({ expenses: { rent: answer } }),
    affects: ['safeEMI'],
  },
  {
    id: 'credit_score',
    text: 'Do you know your credit score (CIBIL)?',
    type: 'number',
    required: false,
    helpText: 'Enter a number between 300-900. Skip if you don\'t know.',
    showWhen: () => true,
    mapsTo: (answer) => ({ credit: { score: answer, historyStatus: answer ? 'good' : 'unknown' } }),
    affects: ['fairRate', 'lenderLikelyAmount'],
  },
  {
    id: 'loan_type',
    text: 'What type of loan are you looking for?',
    type: 'select',
    options: [
      { value: 'personal', label: 'Personal Loan' },
      { value: 'home', label: 'Home Loan' },
      { value: 'loan-against-property', label: 'Loan Against Property' },
      { value: 'gold', label: 'Gold Loan' },
      { value: 'vehicle', label: 'Vehicle Loan' },
      { value: 'business', label: 'Business Loan' },
    ],
    required: true,
    showWhen: () => true,
    mapsTo: (answer) => ({ loan: { type: answer } }),
    affects: ['fairRate', 'lenderLikelyAmount'],
  },
  {
    id: 'loan_amount',
    text: 'How much do you want to borrow? (₹)',
    type: 'number',
    required: true,
    helpText: 'Enter the amount you need',
    showWhen: () => true,
    mapsTo: (answer) => ({ loan: { amount: answer } }),
    affects: ['all'],
  },
  {
    id: 'loan_purpose',
    text: 'What is the purpose of this loan?',
    type: 'text',
    required: false,
    showWhen: () => true,
    mapsTo: (answer) => ({ loan: { purpose: answer } }),
    affects: ['verdict'],
  },
  {
    id: 'loan_tenure',
    text: 'How long do you want to repay? (months)',
    type: 'number',
    required: false,
    helpText: 'Enter number of months (e.g., 60 for 5 years)',
    showWhen: () => true,
    mapsTo: (answer) => ({ loan: { tenure: answer } }),
    affects: ['safeAmount'],
  },
]

export function getApplicableQuestions(profile) {
  return questionDefinitions.filter(q => {
    try {
      return q.showWhen(profile)
    } catch {
      return true
    }
  })
}

