import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { FinalReport } from '../components/FinalReport'

describe('FinalReport', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the final report header', () => {
    render(<FinalReport />)
    
    expect(screen.getByText('Final Interview Report')).toBeInTheDocument()
    expect(screen.getByText('Comprehensive analysis and hiring recommendation')).toBeInTheDocument()
  })

  it('displays candidate overview section', () => {
    render(<FinalReport />)
    
    expect(screen.getByText('Candidate Overview')).toBeInTheDocument()
    expect(screen.getByText('Overall Score:')).toBeInTheDocument()
    expect(screen.getByText('8.9')).toBeInTheDocument()
  })

  it('shows candidate information and metrics', () => {
    render(<FinalReport />)
    
    expect(screen.getByText('Sarah Chen')).toBeInTheDocument()
    expect(screen.getByText('Senior Software Engineer')).toBeInTheDocument()
    expect(screen.getByText('CV Score')).toBeInTheDocument()
    expect(screen.getByText('Interview Score')).toBeInTheDocument()
    expect(screen.getByText('Duration')).toBeInTheDocument()
  })

  it('displays competency breakdown chart', () => {
    render(<FinalReport />)
    
    expect(screen.getByText('Competency Breakdown')).toBeInTheDocument()
    expect(screen.getByTestId('radar-chart')).toBeInTheDocument()
  })

  it('shows strengths and development areas', () => {
    render(<FinalReport />)
    
    expect(screen.getByText('Strengths & Areas for Development')).toBeInTheDocument()
    expect(screen.getByText('✅ Strengths')).toBeInTheDocument()
    expect(screen.getByText('📈 Development Areas')).toBeInTheDocument()
  })

  it('displays hiring recommendation', () => {
    render(<FinalReport />)
    
    expect(screen.getByText('Hiring Recommendation')).toBeInTheDocument()
    expect(screen.getByText('Strongly Recommend')).toBeInTheDocument()
  })

  it('shows recommendation text', () => {
    render(<FinalReport />)
    
    const recommendationText = screen.getByText(/Sarah Chen demonstrates exceptional technical competency/)
    expect(recommendationText).toBeInTheDocument()
  })

  it('displays action buttons', () => {
    render(<FinalReport />)
    
    expect(screen.getByText('Download Full Report')).toBeInTheDocument()
    expect(screen.getByText('Share Report')).toBeInTheDocument()
    expect(screen.getByText('Schedule Follow-up')).toBeInTheDocument()
  })

  it('handles download report functionality', () => {
    render(<FinalReport />)
    
    const downloadButton = screen.getByText('Download Full Report')
    fireEvent.click(downloadButton)
    
    // Verify URL.createObjectURL was called
    expect(global.URL.createObjectURL).toHaveBeenCalled()
    
    // Verify HTMLElement.click was called
    expect(HTMLElement.prototype.click).toHaveBeenCalled()
  })

  it('displays correct scores from mock data', () => {
    render(<FinalReport />)
    
    // Check for scores that should be in the mock data
    expect(screen.getByText('9.2/10')).toBeInTheDocument() // CV Score
    expect(screen.getByText('8.5/10')).toBeInTheDocument() // Interview Score
    expect(screen.getByText('45 minutes')).toBeInTheDocument() // Duration
  })

  it('lists candidate strengths', () => {
    render(<FinalReport />)
    
    // Check for specific strengths from mock data
    expect(screen.getByText(/Strong technical foundation/)).toBeInTheDocument()
    expect(screen.getByText(/Excellent problem-solving skills/)).toBeInTheDocument()
  })

  it('lists development areas', () => {
    render(<FinalReport />)
    
    // Check for specific weaknesses from mock data
    expect(screen.getByText(/Limited experience with cloud technologies/)).toBeInTheDocument()
  })

  it('has correct recommendation status styling', () => {
    render(<FinalReport />)
    
    const recommendationStatus = screen.getByText('Strongly Recommend')
    expect(recommendationStatus).toHaveClass('status--success')
  })
})