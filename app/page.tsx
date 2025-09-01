'use client';

import { useEffect, useState } from 'react';
import { Section } from '@/lib/types';
import { Sidebar } from '@/components/Sidebar';
import { Dashboard } from '@/components/Dashboard';
import { CVAnalysis } from '@/components/CVAnalysis';
import { LiveInterview } from '@/components/LiveInterview';
import { FinalReport } from '@/components/FinalReport';
import { Analytics } from '@/components/Analytics';
import { Comparison } from '@/components/Comparison';
import { InterviewLibrary } from '@/components/InterviewLibrary';
import { BehavioralAnalysis } from '@/components/BehavioralAnalysis';
import { QuestionBank } from '@/components/QuestionBank';
import { Settings } from '@/components/Settings';

export default function Home() {
  const [currentSection, setCurrentSection] = useState<Section>('dashboard');

  const handleSectionChange = (section: Section) => {
    setCurrentSection(section);
  };

  const handleQuickAction = (action: string) => {
    switch(action) {
      case 'new-interview':
        setCurrentSection('live-interview');
        break;
      case 'upload-cv':
        setCurrentSection('cv-analysis');
        break;
      case 'view-analytics':
        setCurrentSection('analytics');
        break;
    }
  };

  return (
    <div className="app">
      <Sidebar 
        currentSection={currentSection} 
        onSectionChange={handleSectionChange} 
      />
      <main className="main-content">
        <div className={`content-section ${currentSection === 'dashboard' ? 'active' : ''}`} id="dashboard">
          <Dashboard onQuickAction={handleQuickAction} />
        </div>
        
        <div className={`content-section ${currentSection === 'cv-analysis' ? 'active' : ''}`} id="cv-analysis">
          <CVAnalysis />
        </div>
        
        <div className={`content-section ${currentSection === 'live-interview' ? 'active' : ''}`} id="live-interview">
          <LiveInterview />
        </div>
        
        <div className={`content-section ${currentSection === 'final-report' ? 'active' : ''}`} id="final-report">
          <FinalReport />
        </div>
        
        <div className={`content-section ${currentSection === 'analytics' ? 'active' : ''}`} id="analytics">
          <Analytics />
        </div>
        
        <div className={`content-section ${currentSection === 'comparison' ? 'active' : ''}`} id="comparison">
          <Comparison />
        </div>
        
        <div className={`content-section ${currentSection === 'interview-library' ? 'active' : ''}`} id="interview-library">
          <InterviewLibrary />
        </div>
        
        <div className={`content-section ${currentSection === 'behavioral-analysis' ? 'active' : ''}`} id="behavioral-analysis">
          <BehavioralAnalysis />
        </div>
        
        <div className={`content-section ${currentSection === 'question-bank' ? 'active' : ''}`} id="question-bank">
          <QuestionBank />
        </div>
        
        <div className={`content-section ${currentSection === 'settings' ? 'active' : ''}`} id="settings">
          <Settings />
        </div>
      </main>
    </div>
  );
}