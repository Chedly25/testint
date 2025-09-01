import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Comparison } from '../components/Comparison'

describe('Comparison', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the comparison header', () => {
    render(<Comparison />)
    
    expect(screen.getByText('Candidate Comparison')).toBeInTheDocument()
    expect(screen.getByText('Compare multiple candidates side by side')).toBeInTheDocument()
  })

  it('displays candidate selection dropdowns', () => {
    render(<Comparison />)
    
    expect(screen.getByText('Select first candidate...')).toBeInTheDocument()
    expect(screen.getByText('Select second candidate...')).toBeInTheDocument()
  })

  it('shows compare button', () => {
    render(<Comparison />)
    
    expect(screen.getByText('Compare')).toBeInTheDocument()
  })

  it('populates candidate options in dropdowns', () => {
    render(<Comparison />)
    
    const selects = screen.getAllByRole('combobox')
    expect(selects).toHaveLength(2)
    
    // Open first dropdown
    fireEvent.click(selects[0])
    
    // Should have candidate options (from mock data)
    expect(screen.getByText('Sarah Chen')).toBeInTheDocument()
    expect(screen.getByText('Michael Rodriguez')).toBeInTheDocument()
  })

  it('handles candidate selection', () => {
    render(<Comparison />)
    
    const firstSelect = screen.getAllByRole('combobox')[0]
    fireEvent.change(firstSelect, { target: { value: '1' } })
    
    const secondSelect = screen.getAllByRole('combobox')[1]
    fireEvent.change(secondSelect, { target: { value: '2' } })
    
    // Both dropdowns should have selected values
    expect(firstSelect).toHaveValue('1')
    expect(secondSelect).toHaveValue('2')
  })

  it('shows comparison results when compare button is clicked', () => {
    render(<Comparison />)
    
    const firstSelect = screen.getAllByRole('combobox')[0]
    fireEvent.change(firstSelect, { target: { value: '1' } })
    
    const secondSelect = screen.getAllByRole('combobox')[1]
    fireEvent.change(secondSelect, { target: { value: '2' } })
    
    const compareButton = screen.getByText('Compare')
    fireEvent.click(compareButton)
    
    expect(screen.getByText('Criteria')).toBeInTheDocument()
    expect(screen.getByText('CV Score')).toBeInTheDocument()
    expect(screen.getByText('Interview Score')).toBeInTheDocument()
    expect(screen.getByText('Experience')).toBeInTheDocument()
    expect(screen.getByText('Duration')).toBeInTheDocument()
  })

  it('displays skills comparison chart', () => {
    render(<Comparison />)
    
    const firstSelect = screen.getAllByRole('combobox')[0]
    fireEvent.change(firstSelect, { target: { value: '1' } })
    
    const secondSelect = screen.getAllByRole('combobox')[1]
    fireEvent.change(secondSelect, { target: { value: '2' } })
    
    const compareButton = screen.getByText('Compare')
    fireEvent.click(compareButton)
    
    expect(screen.getByText('Skills Comparison')).toBeInTheDocument()
    expect(screen.getByTestId('radar-chart')).toBeInTheDocument()
  })

  it('shows alert when trying to compare same candidate', () => {
    render(<Comparison />)
    
    const firstSelect = screen.getAllByRole('combobox')[0]
    fireEvent.change(firstSelect, { target: { value: '1' } })
    
    const secondSelect = screen.getAllByRole('combobox')[1]
    fireEvent.change(secondSelect, { target: { value: '1' } })
    
    const compareButton = screen.getByText('Compare')
    fireEvent.click(compareButton)
    
    expect(global.alert).toHaveBeenCalledWith('Please select two different candidates to compare.')
  })

  it('shows alert when candidates are not selected', () => {
    render(<Comparison />)
    
    const compareButton = screen.getByText('Compare')
    fireEvent.click(compareButton)
    
    expect(global.alert).toHaveBeenCalledWith('Please select two different candidates to compare.')
  })

  it('highlights winner in comparison table', () => {
    render(<Comparison />)
    
    const firstSelect = screen.getAllByRole('combobox')[0]
    fireEvent.change(firstSelect, { target: { value: '1' } })
    
    const secondSelect = screen.getAllByRole('combobox')[1]
    fireEvent.change(secondSelect, { target: { value: '2' } })
    
    const compareButton = screen.getByText('Compare')
    fireEvent.click(compareButton)
    
    // Check for winner class in table cells
    const winnerCells = document.querySelectorAll('.winner')
    expect(winnerCells.length).toBeGreaterThan(0)
  })

  it('displays candidate names in table headers', () => {
    render(<Comparison />)
    
    const firstSelect = screen.getAllByRole('combobox')[0]
    fireEvent.change(firstSelect, { target: { value: '1' } })
    
    const secondSelect = screen.getAllByRole('combobox')[1]
    fireEvent.change(secondSelect, { target: { value: '2' } })
    
    const compareButton = screen.getByText('Compare')
    fireEvent.click(compareButton)
    
    // Should show candidate names in the comparison table headers
    expect(screen.getByText('Sarah Chen')).toBeInTheDocument()
    expect(screen.getByText('Michael Rodriguez')).toBeInTheDocument()
  })
})