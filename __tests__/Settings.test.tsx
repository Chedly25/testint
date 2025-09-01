import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Settings } from '../components/Settings'

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
})

describe('Settings', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the settings header', () => {
    render(<Settings />)
    
    expect(screen.getByText('API Settings')).toBeInTheDocument()
    expect(screen.getByText('Configure your Anthropic API key for real AI-powered analysis')).toBeInTheDocument()
  })

  it('displays API configuration form', () => {
    render(<Settings />)
    
    expect(screen.getByText('Anthropic API Configuration')).toBeInTheDocument()
    expect(screen.getByLabelText('Anthropic API Key')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('sk-ant-api03-...')).toBeInTheDocument()
  })

  it('shows no API key status initially', () => {
    mockLocalStorage.getItem.mockReturnValue(null)
    
    render(<Settings />)
    
    expect(screen.getByText('No API Key')).toBeInTheDocument()
  })

  it('loads existing API key from localStorage', () => {
    const mockApiKey = 'sk-ant-api03-test-key-12345'
    mockLocalStorage.getItem.mockReturnValue(mockApiKey)
    
    render(<Settings />)
    
    expect(screen.getByDisplayValue(mockApiKey)).toBeInTheDocument()
    expect(screen.getByText('API Key Configured')).toBeInTheDocument()
  })

  it('allows user to input API key', () => {
    render(<Settings />)
    
    const input = screen.getByPlaceholderText('sk-ant-api03-...')
    fireEvent.change(input, { target: { value: 'sk-ant-test-key' } })
    
    expect(input).toHaveValue('sk-ant-test-key')
  })

  it('saves API key to localStorage when save button is clicked', () => {
    render(<Settings />)
    
    const input = screen.getByPlaceholderText('sk-ant-api03-...')
    const saveButton = screen.getByText('Save API Key')
    
    fireEvent.change(input, { target: { value: 'sk-ant-test-key' } })
    fireEvent.click(saveButton)
    
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('anthropic_api_key', 'sk-ant-test-key')
  })

  it('shows success message after saving', async () => {
    render(<Settings />)
    
    const input = screen.getByPlaceholderText('sk-ant-api03-...')
    const saveButton = screen.getByText('Save API Key')
    
    fireEvent.change(input, { target: { value: 'sk-ant-test-key' } })
    fireEvent.click(saveButton)
    
    expect(screen.getByText('✅ Saved!')).toBeInTheDocument()
    
    // Wait for the success message to disappear
    await waitFor(() => {
      expect(screen.getByText('Save API Key')).toBeInTheDocument()
    }, { timeout: 2500 })
  })

  it('clears API key when clear button is clicked', () => {
    const mockApiKey = 'sk-ant-api03-test-key-12345'
    mockLocalStorage.getItem.mockReturnValue(mockApiKey)
    
    render(<Settings />)
    
    const clearButton = screen.getByText('Clear')
    fireEvent.click(clearButton)
    
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('anthropic_api_key')
  })

  it('toggles password visibility', () => {
    render(<Settings />)
    
    const input = screen.getByPlaceholderText('sk-ant-api03-...')
    const toggleButton = screen.getByText('👁️‍🗨️')
    
    expect(input).toHaveAttribute('type', 'password')
    
    fireEvent.click(toggleButton)
    expect(input).toHaveAttribute('type', 'text')
    
    fireEvent.click(toggleButton)
    expect(input).toHaveAttribute('type', 'password')
  })

  it('masks API key in preview', () => {
    const mockApiKey = 'sk-ant-api03-very-long-test-key-12345'
    mockLocalStorage.getItem.mockReturnValue(mockApiKey)
    
    render(<Settings />)
    
    expect(screen.getByText('Current API Key: sk-a****************************2345')).toBeInTheDocument()
  })

  it('disables save button when no API key entered', () => {
    render(<Settings />)
    
    const saveButton = screen.getByText('Save API Key')
    expect(saveButton).toBeDisabled()
  })

  it('disables clear button when no API key exists', () => {
    mockLocalStorage.getItem.mockReturnValue(null)
    
    render(<Settings />)
    
    const clearButton = screen.getByText('Clear')
    expect(clearButton).toBeDisabled()
  })

  it('displays how-to-use instructions', () => {
    render(<Settings />)
    
    expect(screen.getByText('How to Use')).toBeInTheDocument()
    expect(screen.getByText('Get your API Key')).toBeInTheDocument()
    expect(screen.getByText('Enter the Key')).toBeInTheDocument()
    expect(screen.getByText('Upload CVs')).toBeInTheDocument()
  })

  it('displays feature benefits', () => {
    render(<Settings />)
    
    expect(screen.getByText('What You Get with Real API')).toBeInTheDocument()
    expect(screen.getByText('Smart CV Analysis')).toBeInTheDocument()
    expect(screen.getByText('Personalized Questions')).toBeInTheDocument()
    expect(screen.getByText('Detailed Insights')).toBeInTheDocument()
    expect(screen.getByText('Role Matching')).toBeInTheDocument()
  })

  it('includes link to Anthropic Console', () => {
    render(<Settings />)
    
    const links = screen.getAllByText('Anthropic Console')
    expect(links[0]).toHaveAttribute('href', 'https://console.anthropic.com/')
    expect(links[0]).toHaveAttribute('target', '_blank')
    expect(links[0]).toHaveAttribute('rel', 'noopener noreferrer')
  })
})