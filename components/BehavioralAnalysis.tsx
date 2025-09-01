'use client';

import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export function BehavioralAnalysis() {
  const sentimentData = {
    labels: ['0-5min', '5-10min', '10-15min', '15-20min', '20-25min', '25-30min'],
    datasets: [
      {
        label: 'Sentiment Score',
        data: [0.6, 0.7, 0.8, 0.9, 0.8, 0.85],
        borderColor: '#1FB8CD',
        backgroundColor: 'rgba(31, 184, 205, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 1,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const traits = [
    { name: 'Openness', score: 8.5, width: 85 },
    { name: 'Conscientiousness', score: 9.0, width: 90 },
    { name: 'Extraversion', score: 7.0, width: 70 },
    { name: 'Agreeableness', score: 8.0, width: 80 },
  ];

  return (
    <>
      <div className="section-header">
        <h1>Behavioral Analysis</h1>
        <p>AI-powered insights into candidate behavior and personality</p>
      </div>

      <div className="behavioral-grid">
        <div className="card sentiment-analysis">
          <div className="card__header">
            <h3>Sentiment Analysis</h3>
          </div>
          <div className="card__body">
            <div className="chart-container">
              <Line data={sentimentData} options={chartOptions} />
            </div>
            <div className="sentiment-insights">
              <div className="insight-item">
                <span className="insight-label">Overall Sentiment:</span>
                <span className="insight-value positive">Positive (0.8)</span>
              </div>
              <div className="insight-item">
                <span className="insight-label">Confidence Level:</span>
                <span className="insight-value high">High (0.85)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card personality-traits">
          <div className="card__header">
            <h3>Personality Assessment</h3>
          </div>
          <div className="card__body">
            <div className="traits-list">
              {traits.map((trait, index) => (
                <div key={index} className="trait-item">
                  <span className="trait-name">{trait.name}</span>
                  <div className="trait-bar">
                    <div 
                      className="trait-fill" 
                      style={{ width: `${trait.width}%` }}
                    ></div>
                  </div>
                  <span className="trait-score">{trait.score}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card communication-analysis">
          <div className="card__header">
            <h3>Communication Style</h3>
          </div>
          <div className="card__body">
            <div className="communication-metrics">
              <div className="comm-metric">
                <span className="metric-label">Speaking Pace</span>
                <span className="metric-value">Optimal</span>
              </div>
              <div className="comm-metric">
                <span className="metric-label">Clarity</span>
                <span className="metric-value">Excellent</span>
              </div>
              <div className="comm-metric">
                <span className="metric-label">Engagement</span>
                <span className="metric-value">High</span>
              </div>
              <div className="comm-metric">
                <span className="metric-label">Confidence</span>
                <span className="metric-value">Strong</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}