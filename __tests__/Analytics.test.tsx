import React from 'react'
import { render, screen } from '@testing-library/react'
import { Analytics } from '../components/Analytics'

describe('Analytics', () => {
  it('renders the analytics header', () => {
    render(<Analytics />)
    
    expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Performance metrics and hiring insights')).toBeInTheDocument()
  })

  it('displays monthly interview trends chart', () => {
    render(<Analytics />)
    
    expect(screen.getByText('Monthly Interview Trends')).toBeInTheDocument()
    expect(screen.getByTestId('line-chart')).toBeInTheDocument()
  })

  it('shows top skills assessed chart', () => {
    render(<Analytics />)
    
    expect(screen.getByText('Top Skills Assessed')).toBeInTheDocument()
    expect(screen.getByTestId('doughnut-chart')).toBeInTheDocument()
  })

  it('displays key metrics section', () => {
    render(<Analytics />)
    
    expect(screen.getByText('Key Metrics')).toBeInTheDocument()
  })

  it('shows completion rate metric', () => {
    render(<Analytics />)
    
    expect(screen.getByText('87%')).toBeInTheDocument()
    expect(screen.getByText('Completion Rate')).toBeInTheDocument()
  })

  it('displays average duration metric', () => {
    render(<Analytics />)
    
    expect(screen.getByText('42min')).toBeInTheDocument()
    expect(screen.getByText('Avg Duration')).toBeInTheDocument()
  })

  it('shows average score metric', () => {
    render(<Analytics />)
    
    expect(screen.getByText('8.3')).toBeInTheDocument()
    expect(screen.getByText('Avg Score')).toBeInTheDocument()
  })

  it('displays hire rate metric', () => {
    render(<Analytics />)
    
    expect(screen.getByText('73%')).toBeInTheDocument()
    expect(screen.getByText('Hire Rate')).toBeInTheDocument()
  })

  it('has correct grid layout structure', () => {
    render(<Analytics />)
    
    const analyticsGrid = document.querySelector('.analytics-grid')
    expect(analyticsGrid).toBeInTheDocument()
    
    const cards = screen.getAllByRole('generic').filter(el => 
      el.className.includes('card')
    )
    expect(cards.length).toBeGreaterThan(0)
  })

  it('has chart cards with proper structure', () => {
    render(<Analytics />)
    
    const chartCards = document.querySelectorAll('.chart-card')
    expect(chartCards.length).toBe(2)
  })

  it('displays metrics with correct structure', () => {
    render(<Analytics />)
    
    const metricsOverview = document.querySelector('.metrics-overview')
    expect(metricsOverview).toBeInTheDocument()
    
    const metricsGrid = document.querySelector('.metrics-grid')
    expect(metricsGrid).toBeInTheDocument()
  })

  it('shows all metric items', () => {
    render(<Analytics />)
    
    const metricItems = document.querySelectorAll('.metric-item')
    expect(metricItems.length).toBe(4)
  })
})