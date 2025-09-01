import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QuestionBank } from '../components/QuestionBank'

describe('QuestionBank', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('renders the question bank header', () => {
    render(<QuestionBank />)
    
    expect(screen.getByText('AI Question Bank')).toBeInTheDocument()
    expect(screen.getByText('Dynamic question generation for different roles and scenarios')).toBeInTheDocument()
  })

  it('displays filter controls', () => {
    render(<QuestionBank />)
    
    expect(screen.getByText('All Categories')).toBeInTheDocument()
    expect(screen.getByText('All Roles')).toBeInTheDocument()
    expect(screen.getByText('Generate New Questions')).toBeInTheDocument()
  })

  it('shows category filter options', () => {
    render(<QuestionBank />)
    
    expect(screen.getByText('Technical')).toBeInTheDocument()
    expect(screen.getByText('Behavioral')).toBeInTheDocument()
    expect(screen.getByText('Situational')).toBeInTheDocument()
  })

  it('displays role filter options', () => {
    render(<QuestionBank />)
    
    expect(screen.getByText('Senior Software Engineer')).toBeInTheDocument()
    expect(screen.getByText('Product Manager')).toBeInTheDocument()
  })

  it('displays initial questions from mock data', () => {
    render(<QuestionBank />)
    
    // Should show questions from appData
    const questionCards = document.querySelectorAll('.question-card')
    expect(questionCards.length).toBeGreaterThan(0)
  })

  it('shows question categories', () => {
    render(<QuestionBank />)
    
    // Should display category badges
    const categorySpans = document.querySelectorAll('.question-category')
    expect(categorySpans.length).toBeGreaterThan(0)
  })

  it('displays question action buttons', () => {
    render(<QuestionBank />)
    
    const saveButtons = screen.getAllByText('Save Question')
    const useButtons = screen.getAllByText('Use in Interview')
    const editButtons = screen.getAllByText('Edit Question')
    
    expect(saveButtons.length).toBeGreaterThan(0)
    expect(useButtons.length).toBeGreaterThan(0)
    expect(editButtons.length).toBeGreaterThan(0)
  })

  it('filters questions by category', () => {
    render(<QuestionBank />)
    
    const categorySelect = screen.getByDisplayValue('All Categories')
    fireEvent.change(categorySelect, { target: { value: 'Technical' } })
    
    // Should filter questions to only show Technical category
    const technicalQuestions = document.querySelectorAll('.question-card')
    expect(technicalQuestions.length).toBeGreaterThan(0)
  })

  it('filters questions by role', () => {
    render(<QuestionBank />)
    
    const roleSelect = screen.getByDisplayValue('All Roles')
    fireEvent.change(roleSelect, { target: { value: 'Senior Software Engineer' } })
    
    // Should filter questions for Senior Software Engineer role
    const roleQuestions = document.querySelectorAll('.question-card')
    expect(roleQuestions.length).toBeGreaterThan(0)
  })

  it('generates new questions when button is clicked', async () => {
    render(<QuestionBank />)
    
    const initialQuestionCount = document.querySelectorAll('.question-card').length
    
    const generateButton = screen.getByText('Generate New Questions')
    fireEvent.click(generateButton)
    
    // Should show generating state
    expect(screen.getByText('Generating...')).toBeInTheDocument()
    
    // Fast forward time to complete generation
    jest.advanceTimersByTime(1500)
    
    await waitFor(() => {
      const newQuestionCount = document.querySelectorAll('.question-card').length
      expect(newQuestionCount).toBeGreaterThan(initialQuestionCount)
    })
    
    // Button should return to normal state
    expect(screen.getByText('Generate New Questions')).toBeInTheDocument()
  })

  it('disables generate button during generation', () => {
    render(<QuestionBank />)
    
    const generateButton = screen.getByText('Generate New Questions')
    fireEvent.click(generateButton)
    
    expect(generateButton).toBeDisabled()
  })

  it('shows question text in cards', () => {
    render(<QuestionBank />)
    
    const questionTexts = document.querySelectorAll('.question-text')
    expect(questionTexts.length).toBeGreaterThan(0)
    
    // Should have actual question content
    const firstQuestion = questionTexts[0]
    expect(firstQuestion.textContent).toBeTruthy()
    expect(firstQuestion.textContent?.length).toBeGreaterThan(10)
  })

  it('applies combined filters', () => {
    render(<QuestionBank />)
    
    const categorySelect = screen.getByDisplayValue('All Categories')
    fireEvent.change(categorySelect, { target: { value: 'Behavioral' } })
    
    const roleSelect = screen.getByDisplayValue('All Roles')
    fireEvent.change(roleSelect, { target: { value: 'General' } })
    
    // Should show filtered results
    const filteredQuestions = document.querySelectorAll('.question-card')
    expect(filteredQuestions.length).toBeGreaterThan(0)
  })

  it('has correct grid layout structure', () => {
    render(<QuestionBank />)
    
    const questionsGrid = document.querySelector('.questions-grid')
    expect(questionsGrid).toBeInTheDocument()
    
    const questionBankControls = document.querySelector('.question-bank-controls')
    expect(questionBankControls).toBeInTheDocument()
  })

  it('shows filter controls in correct structure', () => {
    render(<QuestionBank />)
    
    const filterControls = document.querySelector('.filter-controls')
    expect(filterControls).toBeInTheDocument()
    
    const formControls = document.querySelectorAll('.form-control')
    expect(formControls.length).toBe(3) // 2 selects + 1 button
  })

  it('displays question headers with category and save button', () => {
    render(<QuestionBank />)
    
    const questionHeaders = document.querySelectorAll('.question-header')
    expect(questionHeaders.length).toBeGreaterThan(0)
    
    const questionCategories = document.querySelectorAll('.question-category')
    expect(questionCategories.length).toBeGreaterThan(0)
  })
})