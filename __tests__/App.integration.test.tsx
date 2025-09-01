import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Home from '../app/page'

describe('App Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('renders main application with sidebar and dashboard', () => {
    render(<Home />)
    
    expect(screen.getByText('Interview Helper Pro')).toBeInTheDocument()
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Overview of your recruitment activities')).toBeInTheDocument()
  })

  it('navigates between different sections via sidebar', () => {
    render(<Home />)
    
    // Start with dashboard
    expect(screen.getByText('Total Interviews')).toBeInTheDocument()
    
    // Navigate to CV Analysis
    fireEvent.click(screen.getByText('CV Analysis'))
    expect(screen.getByText('Upload and analyze candidate CVs with AI-powered insights')).toBeInTheDocument()
    
    // Navigate to Live Interview
    fireEvent.click(screen.getByText('Live Interview'))
    expect(screen.getByText('Record interviews with real-time AI assistance')).toBeInTheDocument()
    
    // Navigate to Analytics
    fireEvent.click(screen.getByText('Analytics'))
    expect(screen.getByText('Performance metrics and hiring insights')).toBeInTheDocument()
  })

  it('completes full CV analysis workflow', async () => {
    render(<Home />)
    
    // Navigate to CV Analysis
    fireEvent.click(screen.getByText('CV Analysis'))
    
    // Should show upload area
    expect(screen.getByText('Drop your CV here')).toBeInTheDocument()
    
    // Simulate file upload
    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' })
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    
    if (fileInput) {
      Object.defineProperty(fileInput, 'files', {
        value: [file],
        writable: false,
      })
      fireEvent.change(fileInput)
      
      // Should show analyzing state
      await waitFor(() => {
        expect(screen.getByText('Analyzing CV...')).toBeInTheDocument()
      })
      
      // Wait for analysis to complete
      await waitFor(() => {
        expect(screen.getByText('CV Analysis Results')).toBeInTheDocument()
      }, { timeout: 3000 })
      
      // Should show analysis results
      expect(screen.getByText('✅ Strengths')).toBeInTheDocument()
      expect(screen.getByText('🎯 Suggested Interview Questions')).toBeInTheDocument()
    }
  })

  it('completes interview recording workflow', async () => {
    render(<Home />)
    
    // Navigate to Live Interview
    fireEvent.click(screen.getByText('Live Interview'))
    
    // Should show recording controls
    expect(screen.getByText('Ready to Record')).toBeInTheDocument()
    expect(screen.getByText('Start Recording')).toBeInTheDocument()
    
    // Start recording
    fireEvent.click(screen.getByText('Start Recording'))
    
    expect(screen.getByText('Recording...')).toBeInTheDocument()
    expect(screen.getByText('Stop Recording')).toBeInTheDocument()
    expect(screen.getByText('Pause')).toBeInTheDocument()
    
    // Advance time to see timer update
    jest.advanceTimersByTime(5000)
    expect(screen.getByText('00:05')).toBeInTheDocument()
    
    // Use AI suggestion
    fireEvent.click(screen.getByText('Use Question'))
    expect(screen.getByText(/Interviewer:/)).toBeInTheDocument()
    
    // Stop recording
    fireEvent.click(screen.getByText('Stop Recording'))
    
    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Interview recording completed! You can now view the final report.')
    })
  })

  it('performs candidate comparison workflow', () => {
    render(<Home />)
    
    // Navigate to Comparison
    fireEvent.click(screen.getByText('Comparison'))
    
    // Should show comparison controls
    expect(screen.getByText('Select first candidate...')).toBeInTheDocument()
    expect(screen.getByText('Select second candidate...')).toBeInTheDocument()
    
    // Select candidates
    const firstSelect = screen.getAllByRole('combobox')[0]
    fireEvent.change(firstSelect, { target: { value: '1' } })
    
    const secondSelect = screen.getAllByRole('combobox')[1]
    fireEvent.change(secondSelect, { target: { value: '2' } })
    
    // Compare candidates
    fireEvent.click(screen.getByText('Compare'))
    
    // Should show comparison results
    expect(screen.getByText('CV Score')).toBeInTheDocument()
    expect(screen.getByText('Interview Score')).toBeInTheDocument()
    expect(screen.getByText('Skills Comparison')).toBeInTheDocument()
  })

  it('searches and filters in interview library', () => {
    render(<Home />)
    
    // Navigate to Library
    fireEvent.click(screen.getByText('Library'))
    
    // Should show all interviews initially
    expect(screen.getByText('Sarah Chen')).toBeInTheDocument()
    expect(screen.getByText('Michael Rodriguez')).toBeInTheDocument()
    expect(screen.getByText('Emma Thompson')).toBeInTheDocument()
    
    // Search for specific candidate
    const searchInput = screen.getByPlaceholderText('Search interviews...')
    fireEvent.change(searchInput, { target: { value: 'Sarah' } })
    
    expect(screen.getByText('Sarah Chen')).toBeInTheDocument()
    expect(screen.queryByText('Michael Rodriguez')).not.toBeInTheDocument()
  })

  it('generates new questions in question bank', async () => {
    render(<Home />)
    
    // Navigate to Question Bank
    fireEvent.click(screen.getByText('Question Bank'))
    
    // Should show question bank
    expect(screen.getByText('AI Question Bank')).toBeInTheDocument()
    
    const initialQuestionCount = document.querySelectorAll('.question-card').length
    
    // Generate new questions
    fireEvent.click(screen.getByText('Generate New Questions'))
    
    // Should show generating state
    expect(screen.getByText('Generating...')).toBeInTheDocument()
    
    // Fast forward time
    jest.advanceTimersByTime(1500)
    
    // Should have more questions
    await waitFor(() => {
      const newQuestionCount = document.querySelectorAll('.question-card').length
      expect(newQuestionCount).toBeGreaterThan(initialQuestionCount)
    })
  })

  it('downloads report from final report section', () => {
    render(<Home />)
    
    // Navigate to Final Report
    fireEvent.click(screen.getByText('Final Report'))
    
    // Should show final report
    expect(screen.getByText('Final Interview Report')).toBeInTheDocument()
    expect(screen.getByText('Overall Score:')).toBeInTheDocument()
    
    // Download report
    fireEvent.click(screen.getByText('Download Full Report'))
    
    // Should trigger download
    expect(global.URL.createObjectURL).toHaveBeenCalled()
    expect(HTMLElement.prototype.click).toHaveBeenCalled()
  })

  it('displays analytics charts and metrics', () => {
    render(<Home />)
    
    // Navigate to Analytics
    fireEvent.click(screen.getByText('Analytics'))
    
    // Should show analytics
    expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Monthly Interview Trends')).toBeInTheDocument()
    expect(screen.getByText('Top Skills Assessed')).toBeInTheDocument()
    
    // Should show charts
    expect(screen.getByTestId('line-chart')).toBeInTheDocument()
    expect(screen.getByTestId('doughnut-chart')).toBeInTheDocument()
    
    // Should show key metrics
    expect(screen.getByText('87%')).toBeInTheDocument()
    expect(screen.getByText('42min')).toBeInTheDocument()
  })

  it('shows behavioral analysis with sentiment data', () => {
    render(<Home />)
    
    // Navigate to Behavioral Analysis
    fireEvent.click(screen.getByText('Behavioral Analysis'))
    
    // Should show behavioral analysis
    expect(screen.getByText('Behavioral Analysis')).toBeInTheDocument()
    expect(screen.getByText('Sentiment Analysis')).toBeInTheDocument()
    expect(screen.getByText('Personality Assessment')).toBeInTheDocument()
    expect(screen.getByText('Communication Style')).toBeInTheDocument()
    
    // Should show sentiment insights
    expect(screen.getByText('Positive (0.8)')).toBeInTheDocument()
    expect(screen.getByText('High (0.85)')).toBeInTheDocument()
  })

  it('maintains active section highlighting in sidebar', () => {
    render(<Home />)
    
    // Dashboard should be active initially
    expect(screen.getByText('Dashboard').closest('li')).toHaveClass('active')
    
    // Navigate to CV Analysis
    fireEvent.click(screen.getByText('CV Analysis'))
    expect(screen.getByText('CV Analysis').closest('li')).toHaveClass('active')
    expect(screen.getByText('Dashboard').closest('li')).not.toHaveClass('active')
    
    // Navigate to Analytics
    fireEvent.click(screen.getByText('Analytics'))
    expect(screen.getByText('Analytics').closest('li')).toHaveClass('active')
    expect(screen.getByText('CV Analysis').closest('li')).not.toHaveClass('active')
  })
})