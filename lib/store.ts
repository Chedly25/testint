import { create } from 'zustand';

export interface CVData {
  id: string;
  fileName: string;
  content: string;
  uploadedAt: Date;
  analysis?: CVAnalysis;
}

export interface CVAnalysis {
  strengths: string[];
  weaknesses: string[];
  fitScore: number;
  suggestedQuestions: string[];
  summary: string;
}

export interface InterviewRecording {
  id: string;
  cvId?: string;
  videoBlob?: Blob;
  audioBlob?: Blob;
  transcript: string[];
  startedAt: Date;
  endedAt?: Date;
  analysis?: InterviewAnalysis;
}

export interface InterviewAnalysis {
  overallScore: number;
  pros: string[];
  cons: string[];
  recommendations: string[];
  behavioralInsights: string[];
  technicalAssessment: string;
  culturalFit: string;
}

interface AppState {
  cvs: CVData[];
  currentCV: CVData | null;
  interviews: InterviewRecording[];
  currentInterview: InterviewRecording | null;
  isRecording: boolean;
  
  uploadCV: (cv: CVData) => void;
  setCurrentCV: (cv: CVData | null) => void;
  updateCVAnalysis: (cvId: string, analysis: CVAnalysis) => void;
  
  startInterview: (cvId?: string) => void;
  stopInterview: () => void;
  updateTranscript: (text: string) => void;
  updateInterviewAnalysis: (interviewId: string, analysis: InterviewAnalysis) => void;
}

export const useStore = create<AppState>((set) => ({
  cvs: [],
  currentCV: null,
  interviews: [],
  currentInterview: null,
  isRecording: false,
  
  uploadCV: (cv) => set((state) => ({
    cvs: [...state.cvs, cv],
    currentCV: cv
  })),
  
  setCurrentCV: (cv) => set({ currentCV: cv }),
  
  updateCVAnalysis: (cvId, analysis) => set((state) => ({
    cvs: state.cvs.map(cv => 
      cv.id === cvId ? { ...cv, analysis } : cv
    ),
    currentCV: state.currentCV?.id === cvId 
      ? { ...state.currentCV, analysis }
      : state.currentCV
  })),
  
  startInterview: (cvId) => set((state) => {
    const newInterview: InterviewRecording = {
      id: Date.now().toString(),
      cvId,
      transcript: [],
      startedAt: new Date()
    };
    return {
      interviews: [...state.interviews, newInterview],
      currentInterview: newInterview,
      isRecording: true
    };
  }),
  
  stopInterview: () => set((state) => ({
    currentInterview: state.currentInterview 
      ? { ...state.currentInterview, endedAt: new Date() }
      : null,
    isRecording: false
  })),
  
  updateTranscript: (text) => set((state) => ({
    currentInterview: state.currentInterview
      ? {
          ...state.currentInterview,
          transcript: [...state.currentInterview.transcript, text]
        }
      : null
  })),
  
  updateInterviewAnalysis: (interviewId, analysis) => set((state) => ({
    interviews: state.interviews.map(interview =>
      interview.id === interviewId ? { ...interview, analysis } : interview
    ),
    currentInterview: state.currentInterview?.id === interviewId
      ? { ...state.currentInterview, analysis }
      : state.currentInterview
  }))
}));