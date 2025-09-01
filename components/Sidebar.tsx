'use client';

import { Section } from '@/lib/types';

interface SidebarProps {
  currentSection: Section;
  onSectionChange: (section: Section) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'cv-analysis', label: 'CV Analysis', icon: '📄' },
  { id: 'live-interview', label: 'Live Interview', icon: '🎥' },
  { id: 'final-report', label: 'Final Report', icon: '📋' },
  { id: 'analytics', label: 'Analytics', icon: '📈' },
  { id: 'comparison', label: 'Comparison', icon: '⚖️' },
  { id: 'interview-library', label: 'Interview Library', icon: '📚' },
  { id: 'behavioral-analysis', label: 'Behavioral Analysis', icon: '🧠' },
  { id: 'question-bank', label: 'Question Bank', icon: '❓' },
] as const;

export function Sidebar({ currentSection, onSectionChange }: SidebarProps) {
  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <h2>InterviewPro</h2>
        <p className="subtitle">AI Interview Assistant</p>
      </div>
      <ul className="nav-menu">
        {navItems.map((item) => (
          <li key={item.id}>
            <button
              className={`nav-btn ${currentSection === item.id ? 'active' : ''}`}
              onClick={() => onSectionChange(item.id as Section)}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}