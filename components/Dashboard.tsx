'use client';

import { appData } from '@/lib/data';

interface DashboardProps {
  onQuickAction: (action: string) => void;
}

export function Dashboard({ onQuickAction }: DashboardProps) {
  const recentInterviews = appData.sampleCandidates.slice(0, 3);

  return (
    <>
      <div className="section-header">
        <h1>Dashboard Overview</h1>
        <p>Your interview management hub</p>
      </div>
      
      <div className="dashboard-grid">
        <div className="card stats-card">
          <div className="card__body">
            <h3>Total Interviews</h3>
            <div className="stat-number">156</div>
            <div className="stat-change positive">+12% this month</div>
          </div>
        </div>
        
        <div className="card stats-card">
          <div className="card__body">
            <h3>Completion Rate</h3>
            <div className="stat-number">87%</div>
            <div className="stat-change positive">+5% vs last month</div>
          </div>
        </div>
        
        <div className="card stats-card">
          <div className="card__body">
            <h3>Avg Duration</h3>
            <div className="stat-number">42min</div>
            <div className="stat-change neutral">Same as last month</div>
          </div>
        </div>
        
        <div className="card stats-card">
          <div className="card__body">
            <h3>Active Candidates</h3>
            <div className="stat-number">23</div>
            <div className="stat-change positive">+8 new this week</div>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="card recent-interviews">
          <div className="card__header">
            <h3>Recent Interviews</h3>
            <button className="btn btn--sm btn--outline">View All</button>
          </div>
          <div className="card__body">
            <div className="interview-list">
              {recentInterviews.map((candidate) => (
                <div key={candidate.id} className="interview-item">
                  <div className="interview-info">
                    <h4>{candidate.name}</h4>
                    <p>{candidate.position} • {candidate.date}</p>
                  </div>
                  <div className="interview-status">
                    <span className={`status ${candidate.status === 'completed' ? 'status--success' : 'status--warning'}`}>
                      {candidate.status}
                    </span>
                  </div>
                </div>
              ))}
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