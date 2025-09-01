import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Sidebar } from '../components/Sidebar'

describe('Sidebar', () => {
  const mockSetActiveSection = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders all navigation items', () => {
    render(<Sidebar activeSection="dashboard" setActiveSection={mockSetActiveSection} />)
    
    expect(screen.getByText('Interview Helper Pro')).toBeInTheDocument()
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('CV Analysis')).toBeInTheDocument()
    expect(screen.getByText('Live Interview')).toBeInTheDocument()
    expect(screen.getByText('Final Report')).toBeInTheDocument()
    expect(screen.getByText('Analytics')).toBeInTheDocument()
    expect(screen.getByText('Comparison')).toBeInTheDocument()
    expect(screen.getByText('Library')).toBeInTheDocument()
    expect(screen.getByText('Behavioral Analysis')).toBeInTheDocument()
    expect(screen.getByText('Question Bank')).toBeInTheDocument()
  })

  it('highlights the active section', () => {
    render(<Sidebar activeSection="cv-analysis" setActiveSection={mockSetActiveSection} />)
    
    const activeItem = screen.getByText('CV Analysis').closest('li')
    expect(activeItem).toHaveClass('active')
  })

  it('calls setActiveSection when a navigation item is clicked', () => {
    render(<Sidebar activeSection="dashboard" setActiveSection={mockSetActiveSection} />)
    
    fireEvent.click(screen.getByText('Analytics'))
    expect(mockSetActiveSection).toHaveBeenCalledWith('analytics')
  })

  it('renders with correct structure', () => {
    render(<Sidebar activeSection="dashboard" setActiveSection={mockSetActiveSection} />)
    
    expect(screen.getByRole('navigation')).toBeInTheDocument()
    expect(screen.getByRole('list')).toBeInTheDocument()
  })
})