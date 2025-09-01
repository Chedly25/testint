'use client';

import { useState, useEffect, useRef } from 'react';

export function LiveInterview() {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [transcript, setTranscript] = useState<string[]>([]);
  const [suggestionTimer, setSuggestionTimer] = useState(120);
  const [currentSuggestion, setCurrentSuggestion] = useState(
    "Can you elaborate on the challenges you faced in that project?"
  );
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const suggestionTimerRef = useRef<NodeJS.Timeout | null>(null);

  const suggestions = [
    "Can you provide a specific example of that?",
    "How did you measure the success of that project?",
    "What would you do differently if you could do it again?",
    "How did your team members react to that approach?",
    "What was the biggest challenge you faced in that situation?",
    "Can you walk me through your thought process there?",
    "How does that experience relate to this role?",
    "What did you learn from that experience?"
  ];

  const mockResponses = [
    "Thank you for that question. In my previous role, I worked on developing a scalable web application...",
    "That's a great point. I believe my experience with React and Python makes me a good fit because...",
    "I approach problem-solving by first understanding the requirements, then breaking down the problem into smaller components...",
    "One challenge I faced was when we had to migrate our entire system to a new architecture...",
    "I'm particularly excited about this opportunity because it aligns with my career goals..."
  ];

  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording, isPaused]);

  useEffect(() => {
    if (isRecording) {
      // Start mock transcription
      const transcriptTimer = setTimeout(() => {
        addMockTranscript();
      }, 10000);

      // Start suggestion timer
      suggestionTimerRef.current = setInterval(() => {
        setSuggestionTimer(prev => {
          if (prev <= 1) {
            generateNewSuggestion();
            return 120;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        clearTimeout(transcriptTimer);
        if (suggestionTimerRef.current) clearInterval(suggestionTimerRef.current);
      };
    }
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setIsPaused(false);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setDuration(0);
    setSuggestionTimer(120);
    setTimeout(() => {
      alert('Interview recording completed! You can now view the final report.');
    }, 1000);
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };

  const addMockTranscript = () => {
    const timestamp = new Date().toLocaleTimeString();
    const response = mockResponses[Math.floor(Math.random() * mockResponses.length)];
    
    setTranscript(prev => [...prev, `[${timestamp}] Candidate: ${response}`]);
    
    // Schedule next response
    if (isRecording) {
      setTimeout(addMockTranscript, Math.random() * 30000 + 20000);
    }
  };

  const generateNewSuggestion = () => {
    const newSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
    setCurrentSuggestion(newSuggestion);
  };

  const useSuggestion = () => {
    const timestamp = new Date().toLocaleTimeString();
    setTranscript(prev => [...prev, `[${timestamp}] Interviewer: ${currentSuggestion}`]);
  };

  const clearTranscription = () => {
    setTranscript([]);
  };

  return (
    <>
      <div className="section-header">
        <h1>Live Interview Recording</h1>
        <p>Record interviews with real-time AI assistance</p>
      </div>

      <div className="interview-container">
        <div className="interview-controls-bar">
          <div className="recording-status">
            <div className={`status-indicator ${isRecording ? 'recording' : ''}`}></div>
            <span>
              {isRecording 
                ? (isPaused ? 'Paused' : 'Recording...') 
                : 'Ready to Record'}
            </span>
          </div>
          <div className="interview-timer">
            {formatTime(duration)}
          </div>
          <div className="interview-buttons">
            {!isRecording ? (
              <button className="btn btn--primary" onClick={handleStartRecording}>
                Start Recording
              </button>
            ) : (
              <>
                <button className="btn btn--outline" onClick={handleStopRecording}>
                  Stop Recording
                </button>
                <button className="btn btn--secondary" onClick={handlePauseResume}>
                  {isPaused ? 'Resume' : 'Pause'}
                </button>
              </>
            )}
          </div>
        </div>

        <div className="interview-workspace">
          <div className="card recording-area">
            <div className="card__body">
              <div className="video-placeholder">
                <div className="camera-icon">🎥</div>
                <p>Camera feed will appear here</p>
              </div>
            </div>
          </div>

          <div className="card transcription-panel">
            <div className="card__header">
              <h3>Live Transcription</h3>
              <button className="btn btn--sm btn--outline" onClick={clearTranscription}>
                Clear
              </button>
            </div>
            <div className="card__body">
              <div className="transcription-area">
                {transcript.length === 0 ? (
                  <p className="placeholder-text">Transcription will appear here as you speak...</p>
                ) : (
                  transcript.map((text, index) => (
                    <div 
                      key={index} 
                      style={{
                        margin: '10px 0',
                        padding: '8px',
                        background: text.includes('Interviewer:') ? 'var(--color-bg-6)' : 'var(--color-bg-1)',
                        borderRadius: '6px'
                      }}
                    >
                      {text}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="card ai-suggestions">
            <div className="card__header">
              <h3>AI Question Suggestions</h3>
              <div className="suggestion-counter">
                Next suggestion in: <span>{suggestionTimer}s</span>
              </div>
            </div>
            <div className="card__body">
              <div className="suggestion-area">
                <div className="suggestion-item">
                  <p><strong>Suggested Follow-up:</strong> {currentSuggestion}</p>
                  <button className="btn btn--sm btn--outline" onClick={useSuggestion}>
                    Use Question
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}