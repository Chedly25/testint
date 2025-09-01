'use client';

import { appData } from '@/lib/data';

interface DashboardProps {
  onQuickAction: (action: string) => void;
}

export function Dashboard({ onQuickAction }: DashboardProps) {
  return (
    <>
      <div className="section-header">
        <h1>Interview Helper Pro</h1>
        <p>AI-powered recruitment platform for comprehensive interview management</p>
      </div>
      
      <div className="dashboard-content dashboard-centered">
        <div className="card welcome-card">
          <div className="card__header">
            <h3>Welcome to Interview Helper Pro</h3>
          </div>
          <div className="card__body">
            <p>Get started with AI-powered interview management. Upload CVs, conduct interviews, and generate comprehensive reports.</p>
            <div className="feature-highlights">
              <div className="feature-item">
                <span className="feature-icon">📄</span>
                <div>
                  <strong>CV Analysis</strong>
                  <p>Upload and analyze candidate CVs with AI insights</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🎥</span>
                <div>
                  <strong>Live Interview</strong>
                  <p>Record interviews with real-time transcription</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📊</span>
                <div>
                  <strong>Analytics</strong>
                  <p>Track performance and hiring insights</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card quick-actions">
          <div className="card__header">
            <h3>Quick Actions</h3>
          </div>
          <div className="card__body">
            <div className="action-buttons">
              <button 
                className="btn btn--primary" 
                onClick={() => onQuickAction('new-interview')}
              >
                Start New Interview
              </button>
              <button 
                className="btn btn--secondary" 
                onClick={() => onQuickAction('upload-cv')}
              >
                Upload CV
              </button>
              <button 
                className="btn btn--outline" 
                onClick={() => onQuickAction('view-analytics')}
              >
                View Analytics
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}