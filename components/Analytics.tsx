'use client';

import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { appData } from '@/lib/data';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

export function Analytics() {
  const trendsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Total Interviews',
        data: [23, 31, 28, 35, 39],
        borderColor: '#1FB8CD',
        backgroundColor: 'rgba(31, 184, 205, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Successful Hires',
        data: [8, 12, 10, 15, 16],
        borderColor: '#FFC185',
        backgroundColor: 'rgba(255, 193, 133, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const skillsData = {
    labels: ['JavaScript', 'Python', 'Communication', 'Problem Solving', 'Leadership'],
    datasets: [
      {
        data: [25, 20, 18, 15, 12],
        backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F'],
      },
    ],
  };

  return (
    <>
      <div className="section-header">
        <h1>Analytics Dashboard</h1>
        <p>Performance metrics and hiring insights</p>
      </div>

      <div className="analytics-grid">
        <div className="card chart-card">
          <div className="card__header">
            <h3>Monthly Interview Trends</h3>
          </div>
          <div className="card__body">
            <div className="chart-container">
              <Line data={trendsData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>
        </div>

        <div className="card chart-card">
          <div className="card__header">
            <h3>Top Skills Assessed</h3>
          </div>
          <div className="card__body">
            <div className="chart-container">
              <Doughnut data={skillsData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>
        </div>

        <div className="card metrics-overview">
          <div className="card__header">
            <h3>Key Metrics</h3>
          </div>
          <div className="card__body">
            <div className="metrics-grid">
              <div className="metric-item">
                <div className="metric-value">87%</div>
                <div className="metric-label">Completion Rate</div>
              </div>
              <div className="metric-item">
                <div className="metric-value">42min</div>
                <div className="metric-label">Avg Duration</div>
              </div>
              <div className="metric-item">
                <div className="metric-value">8.3</div>
                <div className="metric-label">Avg Score</div>
              </div>
              <div className="metric-item">
                <div className="metric-value">73%</div>
                <div className="metric-label">Hire Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}