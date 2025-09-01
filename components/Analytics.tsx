'use client';

import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { appData } from '@/lib/data';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

export function Analytics() {
  return (
    <>
      <div className="section-header">
        <h1>Analytics Dashboard</h1>
        <p>Performance metrics and hiring insights</p>
      </div>

      <div className="analytics-placeholder">
        <div className="card">
          <div className="card__body">
            <div className="placeholder-content">
              <div className="placeholder-icon">📊</div>
              <h3>Analytics Coming Soon</h3>
              <p>
                Start using the platform to generate meaningful analytics. Once you've uploaded CVs and conducted interviews, 
                you'll see performance metrics, trends, and insights here.
              </p>
              <div className="placeholder-features">
                <div className="placeholder-feature">
                  <span>📈</span> Interview completion rates
                </div>
                <div className="placeholder-feature">
                  <span>⏱️</span> Average interview duration
                </div>
                <div className="placeholder-feature">
                  <span>🎯</span> Candidate scoring trends
                </div>
                <div className="placeholder-feature">
                  <span>📋</span> Skills assessment data
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}