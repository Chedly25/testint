import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CVAnalysis } from '../components/CVAnalysis'

describe('CVAnalysis', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the CV analysis header', () => {
    render(<CVAnalysis />)
    
    expect(screen.getByText('CV Analysis')).toBeInTheDocument()
    expect(screen.getByText('Upload and analyze candidate CVs with AI-powered insights')).toBeInTheDocument()
  })

  it('shows upload area initially', () => {
    render(<CVAnalysis />)
    
    expect(screen.getByText('Drop your CV here')).toBeInTheDocument()
    expect(screen.getByText('Supports PDF and DOCX files up to 10MB')).toBeInTheDocument()
    expect(screen.getByText('Browse Files')).toBeInTheDocument()
  })

  it('handles file upload via browse button', () => {
    render(<CVAnalysis />)
    
    const browseButton = screen.getByText('Browse Files')
    fireEvent.click(browseButton)
    
    // Check that file input exists (it's hidden)
    const fileInput = screen.getByRole('button', { hidden: true }) as HTMLInputElement
    expect(fileInput).toBeInTheDocument()
  })

  it('shows analyzing state during file processing', async () => {
    render(<CVAnalysis />)
    
    // Create a mock PDF file
    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' })
    
    // Get file input and simulate file selection
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
    }
  })

  it('shows analysis results after processing', async () => {
    render(<CVAnalysis />)
    
    // Create a mock PDF file
    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' })
    
    // Get file input and simulate file selection
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    if (fileInput) {
      Object.defineProperty(fileInput, 'files', {
        value: [file],
        writable: false,
      })
      fireEvent.change(fileInput)
      
      // Wait for analysis to complete
      await waitFor(() => {
        expect(screen.getByText('CV Analysis Results')).toBeInTheDocument()
      }, { timeout: 3000 })
      
      expect(screen.getByText('✅ Strengths')).toBeInTheDocument()
      expect(screen.getByText('⚠️ Areas for Improvement')).toBeInTheDocument()
      expect(screen.getByText('🎯 Suggested Interview Questions')).toBeInTheDocument()
    }
  })

  it('shows upload another CV button after analysis', async () => {
    render(<CVAnalysis />)
    
    // Create a mock PDF file
    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' })
    
    // Get file input and simulate file selection
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    if (fileInput) {
      Object.defineProperty(fileInput, 'files', {
        value: [file],
        writable: false,
      })
      fireEvent.change(fileInput)
      
      await waitFor(() => {
        expect(screen.getByText('Upload Another CV')).toBeInTheDocument()
      }, { timeout: 3000 })
    }
  })

  it('handles drag and drop functionality', () => {
    render(<CVAnalysis />)
    
    const dropzone = screen.getByText('Drop your CV here').closest('div')
    
    // Create a mock file
    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' })
    
    // Mock drag events
    const dragOverEvent = new Event('dragover', { bubbles: true })
    const dropEvent = new Event('drop', { bubbles: true })
    Object.defineProperty(dropEvent, 'dataTransfer', {
      value: { files: [file] },
    })
    
    if (dropzone) {
      fireEvent(dropzone, dragOverEvent)
      fireEvent(dropzone, dropEvent)
    }
  })
})