'use client';

import { useState, useEffect, useRef } from 'react';
import { generateFollowUpQuestion } from '@/lib/anthropic';

// Type definitions for Web Speech API
interface ISpeechRecognitionEvent {
  resultIndex: number;
  results: ISpeechRecognitionResultList;
}

interface ISpeechRecognitionResultList {
  length: number;
  [index: number]: ISpeechRecognitionResult;
}

interface ISpeechRecognitionResult {
  length: number;
  isFinal: boolean;
  [index: number]: ISpeechRecognitionAlternative;
}

interface ISpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: ((ev: Event) => void) | null;
  onend: ((ev: Event) => void) | null;
  onerror: ((ev: Event) => void) | null;
  onresult: ((ev: ISpeechRecognitionEvent) => void) | null;
}

interface ISpeechRecognitionConstructor {
  new (): ISpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition?: ISpeechRecognitionConstructor;
    webkitSpeechRecognition?: ISpeechRecognitionConstructor;
  }
}

export function LiveInterview() {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [transcript, setTranscript] = useState<string[]>([]);
  const [suggestionTimer, setSuggestionTimer] = useState(120);
  const [currentSuggestion, setCurrentSuggestion] = useState(
    "Can you tell me about yourself and your background?"
  );
  const [isGeneratingQuestion, setIsGeneratingQuestion] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechRecognition, setSpeechRecognition] = useState<ISpeechRecognition | null>(null);
  const [hasApiKey, setHasApiKey] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const suggestionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<ISpeechRecognition | null>(null);

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

  useEffect(() => {
    // Check for API key and speech recognition support
    const checkApiKey = () => {
      const apiKey = localStorage.getItem('anthropic_api_key');
      setHasApiKey(!!apiKey);
    };

    checkApiKey();
    window.addEventListener('storage', checkApiKey);

    // Initialize speech recognition
    if (typeof window !== 'undefined' && (window.webkitSpeechRecognition || window.SpeechRecognition)) {
      const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognitionClass) {
        const recognition = new SpeechRecognitionClass();
        
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        
        recognition.onstart = () => {
          console.log('Speech recognition started');
          setIsListening(true);
        };
        
        recognition.onend = () => {
          console.log('Speech recognition ended');
          setIsListening(false);
          // Restart if still recording and not paused
          if (isRecording && !isPaused) {
            setTimeout(() => recognition.start(), 100);
          }
        };
        
        recognition.onerror = (event: Event) => {
          console.error('Speech recognition error:', (event as any).error);
          setIsListening(false);
        };
        
        recognition.onresult = (event: ISpeechRecognitionEvent) => {
          let finalTranscript = '';
          let interimTranscript = '';
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }
          
          if (finalTranscript) {
            const timestamp = new Date().toLocaleTimeString();
            setTranscript(prev => [...prev, `[${timestamp}] Speaker: ${finalTranscript.trim()}`]);
            
            // Generate AI question after candidate speaks
            if (hasApiKey && finalTranscript.trim().length > 10) {
              generateAIQuestion([...transcript, `Speaker: ${finalTranscript.trim()}`]);
            }
          }
        };
        
        setSpeechRecognition(recognition);
        recognitionRef.current = recognition;
      }
    }

    return () => {
      window.removeEventListener('storage', checkApiKey);
    };
  }, []);

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
      // Start speech recognition
      if (speechRecognition && !isPaused) {
        try {
          speechRecognition.start();
        } catch (error) {
          console.error('Error starting speech recognition:', error);
        }
      }

      // Start suggestion timer for AI questions
      if (hasApiKey) {
        suggestionTimerRef.current = setInterval(() => {
          setSuggestionTimer(prev => {
            if (prev <= 1) {
              generateAIQuestion(transcript);
              return 120;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        // Fallback to static suggestions if no API key
        suggestionTimerRef.current = setInterval(() => {
          setSuggestionTimer(prev => {
            if (prev <= 1) {
              generateNewSuggestion();
              return 120;
            }
            return prev - 1;
          });
        }, 1000);
      }

      return () => {
        if (suggestionTimerRef.current) clearInterval(suggestionTimerRef.current);
      };
    } else {
      // Stop speech recognition when not recording
      if (speechRecognition) {
        try {
          speechRecognition.stop();
        } catch (error) {
          console.error('Error stopping speech recognition:', error);
        }
      }
    }
  }, [isRecording, isPaused, speechRecognition, hasApiKey]);

  const generateAIQuestion = async (currentTranscript: string[]) => {
    if (!hasApiKey || isGeneratingQuestion) return;
    
    setIsGeneratingQuestion(true);
    try {
      const question = await generateFollowUpQuestion(currentTranscript);
      if (question && question.trim()) {
        setCurrentSuggestion(question.trim());
      }
    } catch (error) {
      console.error('Error generating AI question:', error);
      // Fallback to static suggestion
      generateNewSuggestion();
    } finally {
      setIsGeneratingQuestion(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setIsPaused(false);
    
    // Check for microphone permission
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => {
          console.log('Microphone access granted');
        })
        .catch((error) => {
          console.error('Microphone access denied:', error);
          alert('Microphone access is required for transcription. Please allow microphone access and try again.');
        });
    }
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setDuration(0);
    setSuggestionTimer(120);
    
    // Stop speech recognition
    if (speechRecognition) {
      try {
        speechRecognition.stop();
      } catch (error) {
        console.error('Error stopping speech recognition:', error);
      }
    }
    
    setTimeout(() => {
      alert('Interview recording completed! You can now view the final report.');
    }, 1000);
  };

  const handlePauseResume = () => {
    const newPausedState = !isPaused;
    setIsPaused(newPausedState);
    
    // Handle speech recognition pause/resume
    if (speechRecognition && isRecording) {
      try {
        if (newPausedState) {
          speechRecognition.stop();
        } else {
          speechRecognition.start();
        }
      } catch (error) {
        console.error('Error toggling speech recognition:', error);
      }
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
        <p>Record interviews with real-time transcription and AI-powered question suggestions</p>
        {!hasApiKey && (
          <div className="api-warning">
            <span>⚠️ Using basic suggestions. <a href="#settings" onClick={() => window.location.hash = 'settings'}>Set up your Anthropic API key</a> for AI-powered questions.</span>
          </div>
        )}
      </div>

      <div className="interview-container">
        <div className="interview-controls-bar">
          <div className="recording-status">
            <div className={`status-indicator ${isRecording ? 'recording' : ''}`}></div>
            <span>
              {isRecording 
                ? (isPaused ? 'Paused' : isListening ? 'Recording & Listening...' : 'Recording...') 
                : 'Ready to Record'}
            </span>
            {isRecording && (
              <small style={{ marginLeft: '10px', opacity: 0.7 }}>
                {isListening ? '🎤 Listening' : '🔇 Mic Off'}
              </small>
            )}
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
              <div>
                {speechRecognition ? (
                  <small style={{ marginRight: '10px', opacity: 0.7 }}>
                    {isListening ? '🎤 Active' : '🔇 Inactive'}
                  </small>
                ) : (
                  <small style={{ marginRight: '10px', opacity: 0.7 }}>
                    ⚠️ Speech recognition not supported
                  </small>
                )}
                <button className="btn btn--sm btn--outline" onClick={clearTranscription}>
                  Clear
                </button>
              </div>
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
              <h3>{hasApiKey ? 'AI Question Suggestions' : 'Question Suggestions'}</h3>
              <div className="suggestion-counter">
                {isGeneratingQuestion ? (
                  <span>🤖 Generating...</span>
                ) : (
                  <>Next suggestion in: <span>{suggestionTimer}s</span></>
                )}
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