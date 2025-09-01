import React from 'react'
import { render, screen } from '@testing-library/react'
import { BehavioralAnalysis } from '../components/BehavioralAnalysis'

describe('BehavioralAnalysis', () => {
  it('renders the behavioral analysis header', () => {
    render(<BehavioralAnalysis />)
    
    expect(screen.getByText('Behavioral Analysis')).toBeInTheDocument()
    expect(screen.getByText('AI-powered insights into candidate behavior and personality')).toBeInTheDocument()
  })

  it('displays sentiment analysis section', () => {
    render(<BehavioralAnalysis />)
    
    expect(screen.getByText('Sentiment Analysis')).toBeInTheDocument()
    expect(screen.getByTestId('line-chart')).toBeInTheDocument()
  })

  it('shows sentiment insights', () => {
    render(<BehavioralAnalysis />)
    
    expect(screen.getByText('Overall Sentiment:')).toBeInTheDocument()
    expect(screen.getByText('Positive (0.8)')).toBeInTheDocument()
    expect(screen.getByText('Confidence Level:')).toBeInTheDocument()
    expect(screen.getByText('High (0.85)')).toBeInTheDocument()
  })

  it('displays personality assessment section', () => {
    render(<BehavioralAnalysis />)
    
    expect(screen.getByText('Personality Assessment')).toBeInTheDocument()
  })

  it('shows personality traits with scores', () => {
    render(<BehavioralAnalysis />)
    
    expect(screen.getByText('Openness')).toBeInTheDocument()
    expect(screen.getByText('8.5')).toBeInTheDocument()
    
    expect(screen.getByText('Conscientiousness')).toBeInTheDocument()
    expect(screen.getByText('9.0')).toBeInTheDocument()
    
    expect(screen.getByText('Extraversion')).toBeInTheDocument()
    expect(screen.getByText('7.0')).toBeInTheDocument()
    
    expect(screen.getByText('Agreeableness')).toBeInTheDocument()
    expect(screen.getByText('8.0')).toBeInTheDocument()
  })

  it('displays communication analysis section', () => {
    render(<BehavioralAnalysis />)
    
    expect(screen.getByText('Communication Style')).toBeInTheDocument()
  })

  it('shows communication metrics', () => {
    render(<BehavioralAnalysis />)
    
    expect(screen.getByText('Speaking Pace')).toBeInTheDocument()
    expect(screen.getByText('Optimal')).toBeInTheDocument()
    
    expect(screen.getByText('Clarity')).toBeInTheDocument()
    expect(screen.getByText('Excellent')).toBeInTheDocument()
    
    expect(screen.getByText('Engagement')).toBeInTheDocument()
    expect(screen.getByText('High')).toBeInTheDocument()
    
    expect(screen.getByText('Confidence')).toBeInTheDocument()
    expect(screen.getByText('Strong')).toBeInTheDocument()
  })

  it('has correct behavioral grid layout', () => {
    render(<BehavioralAnalysis />)
    
    const behavioralGrid = document.querySelector('.behavioral-grid')
    expect(behavioralGrid).toBeInTheDocument()
  })

  it('displays all card sections', () => {
    render(<BehavioralAnalysis />)
    
    const cards = document.querySelectorAll('.card')
    expect(cards.length).toBe(3) // sentiment, personality, communication
  })

  it('shows personality trait bars with correct styling', () => {
    render(<BehavioralAnalysis />)
    
    const traitBars = document.querySelectorAll('.trait-bar')
    expect(traitBars.length).toBe(4)
    
    const traitFills = document.querySelectorAll('.trait-fill')
    expect(traitFills.length).toBe(4)
  })

  it('displays sentiment insights with correct styling', () => {
    render(<BehavioralAnalysis />)
    
    const positiveInsight = document.querySelector('.insight-value.positive')
    expect(positiveInsight).toBeInTheDocument()
    
    const highConfidence = document.querySelector('.insight-value.high')
    expect(highConfidence).toBeInTheDocument()
  })

  it('shows communication metrics in correct structure', () => {
    render(<BehavioralAnalysis />)
    
    const commMetrics = document.querySelectorAll('.comm-metric')
    expect(commMetrics.length).toBe(4)
    
    const metricLabels = document.querySelectorAll('.metric-label')
    expect(metricLabels.length).toBe(4)
    
    const metricValues = document.querySelectorAll('.metric-value')
    expect(metricValues.length).toBe(4)
  })

  it('has chart container for sentiment analysis', () => {
    render(<BehavioralAnalysis />)
    
    const chartContainer = document.querySelector('.chart-container')
    expect(chartContainer).toBeInTheDocument()
  })

  it('displays traits list with correct structure', () => {
    render(<BehavioralAnalysis />)
    
    const traitsList = document.querySelector('.traits-list')
    expect(traitsList).toBeInTheDocument()
    
    const traitItems = document.querySelectorAll('.trait-item')
    expect(traitItems.length).toBe(4)
  })
})