export interface Candidate {
  id: number;
  name: string;
  position: string;
  cvScore: number;
  interviewScore: number;
  status: 'completed' | 'in-progress';
  date: string;
  skills: string[];
  strengths: string[];
  weaknesses: string[];
  interviewDuration: string;
  sentimentScore: number;
}

export interface InterviewQuestion {
  category: 'Technical' | 'Behavioral' | 'Situational';
  questions: string[];
}

export interface AnalyticsData {
  totalInterviews: number;
  completionRate: number;
  averageDuration: number;
  topSkills: string[];
  monthlyTrends: {
    month: string;
    interviews: number;
    hires: number;
  }[];
}

export interface AppData {
  sampleCandidates: Candidate[];
  interviewQuestions: InterviewQuestion[];
  analyticsData: AnalyticsData;
}

export type Section = 
  | 'dashboard' 
  | 'cv-analysis' 
  | 'live-interview' 
  | 'final-report' 
  | 'analytics' 
  | 'comparison' 
  | 'interview-library' 
  | 'behavioral-analysis' 
  | 'question-bank'
  | 'settings';