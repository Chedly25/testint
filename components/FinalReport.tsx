'use client';

import { useEffect, useRef } from 'react';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { appData } from '@/lib/data';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export function FinalReport() {
  const candidate = appData.sampleCandidates[0];

  const competencyData = {
    labels: ['Technical Skills', 'Communication', 'Leadership', 'Problem Solving', 'Teamwork', 'Innovation'],
    datasets: [
      {
        label: 'Candidate Score',
        data: [9, 8, 7, 9, 8, 6],
        backgroundColor: 'rgba(31, 184, 205, 0.2)',
        borderColor: '#1FB8CD',
        borderWidth: 2,
        pointBackgroundColor: '#1FB8CD',
      },
      {
        label: 'Role Requirements',
        data: [8, 7, 6, 8, 7, 5],
        backgroundColor: 'rgba(255, 193, 133, 0.2)',
        borderColor: '#FFC185',
        borderWidth: 2,
        pointBackgroundColor: '#FFC185',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        beginAtZero: true,
        max: 10,
      },
    },
  };

  const downloadReport = () => {
    const reportContent = `
INTERVIEW ASSESSMENT REPORT
===================================================

Candidate: ${candidate.name}
Position: ${candidate.position}
Date: ${new Date().toLocaleDateString()}

SCORES:
CV Score: ${candidate.cvScore}/10
Interview Score: ${candidate.interviewScore}/10
Overall Score: ${Math.round((candidate.cvScore + candidate.interviewScore) / 2)}/10

STRENGTHS:
${candidate.strengths.map(s => `• ${s}`).join('\n')}

AREAS FOR DEVELOPMENT:
${candidate.weaknesses.map(w => `• ${w}`).join('\n')}

RECOMMENDATION: Strongly Recommend
${candidate.name} demonstrates exceptional technical competency and strong leadership potential.
Her communication skills and problem-solving approach align well with our team culture.
While there are opportunities for growth in cloud technologies, her foundation is solid
and she shows excellent learning agility.

Generated on: ${new Date().toLocaleString()}
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interview-report-${candidate.name.replace(' ', '_')}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="section-header">
        <h1>Final Interview Report</h1>
        <p>Comprehensive analysis and hiring recommendation</p>
      </div>

      <div className="report-container">
        <div className="card candidate-summary">
          <div className="card__header">
            <h3>Candidate Overview</h3>
            <div className="overall-score">
              <span>Overall Score:</span>
              <div className="score-circle">8.9</div>
            </div>
          </div>
          <div className="card__body">
            <div className="candidate-info">
              <h4>{candidate.name}</h4>
              <p>{candidate.position}</p>
              <div className="candidate-metrics">
                <div className="metric">
                  <span>CV Score</span>
                  <strong>{candidate.cvScore}/10</strong>
                </div>
                <div className="metric">
                  <span>Interview Score</span>
                  <strong>{candidate.interviewScore}/10</strong>
                </div>
                <div className="metric">
                  <span>Duration</span>
                  <strong>{candidate.interviewDuration}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="report-grid">
          <div className="card competency-scores">
            <div className="card__header">
              <h3>Competency Breakdown</h3>
            </div>
            <div className="card__body">
              <div className="competency-chart">
                <Radar data={competencyData} options={chartOptions} />
              </div>
            </div>
          </div>

          <div className="card pros-cons">
            <div className="card__header">
              <h3>Strengths & Areas for Development</h3>
            </div>
            <div className="card__body">
              <div className="pros-cons-grid">
                <div className="pros-section">
                  <h4>✅ Strengths</h4>
                  <ul>
                    {candidate.strengths.map((strength, index) => (
                      <li key={index}>{strength}</li>
                    ))}
                  </ul>
                </div>
                <div className="cons-section">
                  <h4>📈 Development Areas</h4>
                  <ul>
                    {candidate.weaknesses.map((weakness, index) => (
                      <li key={index}>{weakness}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card hiring-recommendation">
          <div className="card__header">
            <h3>Hiring Recommendation</h3>
            <div className="recommendation-status status status--success">Strongly Recommend</div>
          </div>
          <div className="card__body">
            <p className="recommendation-text">
              {candidate.name} demonstrates exceptional technical competency and strong leadership potential. 
              Her communication skills and problem-solving approach align well with our team culture. 
              While there are opportunities for growth in cloud technologies, her foundation is solid 
              and she shows excellent learning agility.
            </p>
            <div className="report-actions">
              <button className="btn btn--primary" onClick={downloadReport}>
                Download Full Report
              </button>
              <button className="btn btn--secondary">Share Report</button>
              <button className="btn btn--outline">Schedule Follow-up</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}