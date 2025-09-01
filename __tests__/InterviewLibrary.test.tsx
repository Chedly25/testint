import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { InterviewLibrary } from '../components/InterviewLibrary'

describe('InterviewLibrary', () => {
  it('renders the library header', () => {
    render(<InterviewLibrary />)
    
    expect(screen.getByText('Interview Library')).toBeInTheDocument()
    expect(screen.getByText('Searchable archive of all interviews with transcriptions')).toBeInTheDocument()
  })

  it('displays search and filter controls', () => {
    render(<InterviewLibrary />)
    
    expect(screen.getByPlaceholderText('Search interviews...')).toBeInTheDocument()
    expect(screen.getByText('All Positions')).toBeInTheDocument()
    expect(screen.getByText('All Status')).toBeInTheDocument()
  })

  it('shows filter dropdown options', () => {
    render(<InterviewLibrary />)
    
    // Position filter options
    expect(screen.getByText('Senior Software Engineer')).toBeInTheDocument()
    expect(screen.getByText('Product Manager')).toBeInTheDocument()
    expect(screen.getByText('UX Designer')).toBeInTheDocument()
    
    // Status filter options
    expect(screen.getByText('Completed')).toBeInTheDocument()
    expect(screen.getByText('In Progress')).toBeInTheDocument()
  })

  it('displays interview items from mock data', () => {
    render(<InterviewLibrary />)
    
    expect(screen.getByText('Sarah Chen')).toBeInTheDocument()
    expect(screen.getByText('Michael Rodriguez')).toBeInTheDocument()
    expect(screen.getByText('Emma Thompson')).toBeInTheDocument()
  })

  it('shows interview metadata', () => {
    render(<InterviewLibrary />)
    
    // Should show positions
    const seniorEngineers = screen.getAllByText('Senior Software Engineer')
    expect(seniorEngineers.length).toBeGreaterThan(0)
    
    // Should show dates
    expect(screen.getByText('2024-01-15')).toBeInTheDocument()
    
    // Should show status
    const completedStatuses = screen.getAllByText('completed')
    expect(completedStatuses.length).toBeGreaterThan(0)
  })

  it('displays interview excerpt', () => {
    render(<InterviewLibrary />)
    
    const excerpt = screen.getByText(/In my previous role, I worked on developing scalable web applications/)
    expect(excerpt).toBeInTheDocument()
  })

  it('shows action buttons for each interview', () => {
    render(<InterviewLibrary />)
    
    const viewButtons = screen.getAllByText('View Full Transcript')
    const playButtons = screen.getAllByText('Play Recording')
    
    expect(viewButtons.length).toBeGreaterThan(0)
    expect(playButtons.length).toBeGreaterThan(0)
  })

  it('filters interviews by search term', () => {
    render(<InterviewLibrary />)
    
    const searchInput = screen.getByPlaceholderText('Search interviews...')
    fireEvent.change(searchInput, { target: { value: 'Sarah' } })
    
    expect(screen.getByText('Sarah Chen')).toBeInTheDocument()
    expect(screen.queryByText('Michael Rodriguez')).not.toBeInTheDocument()
  })

  it('filters interviews by position', () => {
    render(<InterviewLibrary />)
    
    const positionSelect = screen.getByDisplayValue('All Positions')
    fireEvent.change(positionSelect, { target: { value: 'Product Manager' } })
    
    expect(screen.getByText('Emma Thompson')).toBeInTheDocument()
    expect(screen.queryByText('Sarah Chen')).not.toBeInTheDocument()
  })

  it('filters interviews by status', () => {
    render(<InterviewLibrary />)
    
    const statusSelect = screen.getByDisplayValue('All Status')
    fireEvent.change(statusSelect, { target: { value: 'completed' } })
    
    // Should only show completed interviews
    const completedItems = screen.getAllByText('completed')
    expect(completedItems.length).toBeGreaterThan(0)
  })

  it('shows no results message when no interviews match criteria', () => {
    render(<InterviewLibrary />)
    
    const searchInput = screen.getByPlaceholderText('Search interviews...')
    fireEvent.change(searchInput, { target: { value: 'NonExistentCandidate' } })
    
    expect(screen.getByText('No interviews found matching your criteria.')).toBeInTheDocument()
  })

  it('applies multiple filters simultaneously', () => {
    render(<InterviewLibrary />)
    
    const searchInput = screen.getByPlaceholderText('Search interviews...')
    fireEvent.change(searchInput, { target: { value: 'Michael' } })
    
    const positionSelect = screen.getByDisplayValue('All Positions')
    fireEvent.change(positionSelect, { target: { value: 'Senior Software Engineer' } })
    
    expect(screen.getByText('Michael Rodriguez')).toBeInTheDocument()
    expect(screen.queryByText('Sarah Chen')).not.toBeInTheDocument()
    expect(screen.queryByText('Emma Thompson')).not.toBeInTheDocument()
  })

  it('has correct status styling', () => {
    render(<InterviewLibrary />)
    
    const statusElements = document.querySelectorAll('.status')
    expect(statusElements.length).toBeGreaterThan(0)
    
    const successStatus = document.querySelector('.status--success')
    expect(successStatus).toBeInTheDocument()
  })
})