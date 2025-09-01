import React from 'react'
import { render, screen } from '@testing-library/react'
import { Dashboard } from '../components/Dashboard'

describe('Dashboard', () => {
  it('renders the dashboard header', () => {
    render(<Dashboard onQuickAction={() => {}} />)
    
    expect(screen.getByText('Dashboard Overview')).toBeInTheDocument()
    expect(screen.getByText('Your interview management hub')).toBeInTheDocument()
  })

  it('displays key metrics cards', () => {
    render(<Dashboard />)
    
    expect(screen.getByText('Total Interviews')).toBeInTheDocument()
    expect(screen.getByText('Pending Reviews')).toBeInTheDocument()
    expect(screen.getByText('Hired This Month')).toBeInTheDocument()
    expect(screen.getByText('Success Rate')).toBeInTheDocument()
  })

  it('shows recent interviews section', () => {
    render(<Dashboard />)
    
    expect(screen.getByText('Recent Interviews')).toBeInTheDocument()
    expect(screen.getByText('View All')).toBeInTheDocument()
  })

  it('displays candidate information in recent interviews', () => {
    render(<Dashboard />)
    
    expect(screen.getByText('Sarah Chen')).toBeInTheDocument()
    expect(screen.getByText('Michael Rodriguez')).toBeInTheDocument()
    expect(screen.getByText('Emma Thompson')).toBeInTheDocument()
  })

  it('shows correct interview statuses', () => {
    render(<Dashboard />)
    
    const completedElements = screen.getAllByText('completed')
    expect(completedElements.length).toBeGreaterThan(0)
  })

  it('displays correct score values', () => {
    render(<Dashboard />)
    
    expect(screen.getByText('156')).toBeInTheDocument()
    expect(screen.getByText('23')).toBeInTheDocument()
    expect(screen.getByText('42')).toBeInTheDocument()
    expect(screen.getByText('87%')).toBeInTheDocument()
  })
})