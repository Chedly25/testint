import { AppData } from './types';

export const appData: AppData = {
  sampleCandidates: [
    {
      id: 1,
      name: "Sarah Johnson",
      position: "Senior Software Engineer",
      cvScore: 8.5,
      interviewScore: 9.2,
      status: "completed",
      date: "2025-08-19",
      skills: ["Python", "React", "System Design", "Leadership"],
      strengths: ["Strong technical background", "Excellent communication", "Leadership experience"],
      weaknesses: ["Limited cloud experience", "New to agile methodologies"],
      interviewDuration: "45 minutes",
      sentimentScore: 0.8
    },
    {
      id: 2,
      name: "Michael Chen",
      position: "Product Manager", 
      cvScore: 7.8,
      interviewScore: 8.1,
      status: "in-progress",
      date: "2025-08-19",
      skills: ["Product Strategy", "Analytics", "Stakeholder Management"],
      strengths: ["Data-driven approach", "Strategic thinking", "Cross-functional collaboration"],
      weaknesses: ["Limited technical depth", "New to B2B products"],
      interviewDuration: "38 minutes",
      sentimentScore: 0.7
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      position: "UX Designer",
      cvScore: 9.1,
      interviewScore: 8.7,
      status: "completed",
      date: "2025-08-18",
      skills: ["Design Systems", "User Research", "Prototyping", "Figma"],
      strengths: ["Creative problem solving", "User empathy", "Design thinking"],
      weaknesses: ["Limited development knowledge", "New to enterprise UX"],
      interviewDuration: "42 minutes",
      sentimentScore: 0.9
    }
  ],
  interviewQuestions: [
    {
      category: "Technical",
      questions: [
        "Describe a challenging technical problem you've solved recently",
        "How do you approach system design for scalable applications?",
        "Walk me through your debugging process for complex issues",
        "What's your experience with cloud technologies?",
        "How do you ensure code quality in your projects?"
      ]
    },
    {
      category: "Behavioral", 
      questions: [
        "Tell me about a time you had to work with a difficult team member",
        "Describe a situation where you had to meet a tight deadline",
        "How do you handle constructive criticism?",
        "Tell me about a project you're particularly proud of",
        "How do you stay updated with industry trends?"
      ]
    },
    {
      category: "Situational",
      questions: [
        "If you discovered a critical bug in production, what would you do?",
        "How would you explain a complex technical concept to a non-technical stakeholder?",
        "What would you do if you disagreed with your manager's technical decision?",
        "How would you prioritize multiple urgent tasks?",
        "What would you do if a team member wasn't meeting expectations?"
      ]
    }
  ],
  analyticsData: {
    totalInterviews: 156,
    completionRate: 87,
    averageDuration: 42,
    topSkills: ["JavaScript", "Python", "Communication", "Problem Solving"],
    monthlyTrends: [
      {"month": "Jan", "interviews": 23, "hires": 8},
      {"month": "Feb", "interviews": 31, "hires": 12},
      {"month": "Mar", "interviews": 28, "hires": 10},
      {"month": "Apr", "interviews": 35, "hires": 15},
      {"month": "May", "interviews": 39, "hires": 16}
    ]
  }
};