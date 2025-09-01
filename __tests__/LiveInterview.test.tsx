import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { LiveInterview } from '../components/LiveInterview'

describe('LiveInterview', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('renders the live interview header', () => {
    render(<LiveInterview />)
    
    expect(screen.getByText('Live Interview Recording')).toBeInTheDocument()
    expect(screen.getByText('Record interviews with real-time AI assistance')).toBeInTheDocument()
  })

  it('shows recording controls', () => {
    render(<LiveInterview />)
    
    expect(screen.getByText('Ready to Record')).toBeInTheDocument()
    expect(screen.getByText('Start Recording')).toBeInTheDocument()
    expect(screen.getByText('00:00')).toBeInTheDocument()
  })

  it('displays video placeholder', () => {
    render(<LiveInterview />)
    
    expect(screen.getByText('Camera feed will appear here')).toBeInTheDocument()
  })

  it('shows transcription panel', () => {
    render(<LiveInterview />)
    
    expect(screen.getByText('Live Transcription')).toBeInTheDocument()
    expect(screen.getByText('Clear')).toBeInTheDocument()
    expect(screen.getByText('Transcription will appear here as you speak...')).toBeInTheDocument()
  })

  it('displays AI suggestions panel', () => {
    render(<LiveInterview />)
    
    expect(screen.getByText('AI Question Suggestions')).toBeInTheDocument()
    expect(screen.getByText('Use Question')).toBeInTheDocument()
    expect(screen.getByText(/Next suggestion in:/)).toBeInTheDocument()
  })

  it('starts recording when button is clicked', () => {
    render(<LiveInterview />)
    
    const startButton = screen.getByText('Start Recording')
    fireEvent.click(startButton)
    
    expect(screen.getByText('Recording...')).toBeInTheDocument()
    expect(screen.getByText('Stop Recording')).toBeInTheDocument()
    expect(screen.getByText('Pause')).toBeInTheDocument()
  })

  it('updates timer during recording', () => {
    render(<LiveInterview />)
    
    const startButton = screen.getByText('Start Recording')
    fireEvent.click(startButton)
    
    // Fast forward time
    jest.advanceTimersByTime(5000)
    
    expect(screen.getByText('00:05')).toBeInTheDocument()
  })

  it('pauses and resumes recording', () => {
    render(<LiveInterview />)
    
    const startButton = screen.getByText('Start Recording')
    fireEvent.click(startButton)
    
    const pauseButton = screen.getByText('Pause')
    fireEvent.click(pauseButton)
    
    expect(screen.getByText('Paused')).toBeInTheDocument()
    expect(screen.getByText('Resume')).toBeInTheDocument()
    
    const resumeButton = screen.getByText('Resume')
    fireEvent.click(resumeButton)
    
    expect(screen.getByText('Recording...')).toBeInTheDocument()
  })

  it('stops recording and shows completion message', async () => {
    render(<LiveInterview />)
    
    const startButton = screen.getByText('Start Recording')
    fireEvent.click(startButton)
    
    const stopButton = screen.getByText('Stop Recording')
    fireEvent.click(stopButton)
    
    expect(screen.getByText('Ready to Record')).toBeInTheDocument()
    expect(screen.getByText('00:00')).toBeInTheDocument()
    
    // Wait for alert
    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Interview recording completed! You can now view the final report.')
    })
  })

  it('clears transcription when clear button is clicked', () => {
    render(<LiveInterview />)
    
    const clearButton = screen.getByText('Clear')
    fireEvent.click(clearButton)
    
    expect(screen.getByText('Transcription will appear here as you speak...')).toBeInTheDocument()
  })

  it('uses AI suggestion when button is clicked', () => {
    render(<LiveInterview />)
    
    const startButton = screen.getByText('Start Recording')
    fireEvent.click(startButton)
    
    const useQuestionButton = screen.getByText('Use Question')
    fireEvent.click(useQuestionButton)
    
    // Should add the suggestion to transcript
    expect(screen.getByText(/Interviewer:/)).toBeInTheDocument()
  })

  it('updates suggestion timer countdown', () => {
    render(<LiveInterview />)
    
    const startButton = screen.getByText('Start Recording')
    fireEvent.click(startButton)
    
    // Check initial timer
    expect(screen.getByText('120s')).toBeInTheDocument()
    
    // Fast forward time
    jest.advanceTimersByTime(1000)
    
    expect(screen.getByText('119s')).toBeInTheDocument()
  })
})