'use client';

import { useState } from 'react';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { appData } from '@/lib/data';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export function Comparison() {
  const [candidate1Id, setCandidate1Id] = useState('');
  const [candidate2Id, setCandidate2Id] = useState('');
  const [showResults, setShowResults] = useState(false);

  const handleComparison = () => {
    if (candidate1Id && candidate2Id && candidate1Id !== candidate2Id) {
      setShowResults(true);
    } else {
      alert('Please select two different candidates to compare.');
    }
  };

  const candidate1 = appData.sampleCandidates.find(c => c.id.toString() === candidate1Id);
  const candidate2 = appData.sampleCandidates.find(c => c.id.toString() === candidate2Id);

  const comparisonData = {
    labels: ['Technical', 'Communication', 'Leadership', 'Problem Solving', 'Teamwork'],
    datasets: [
      ...(candidate1 ? [{
        label: candidate1.name,
        data: [candidate1.cvScore, 8, 7, candidate1.interviewScore, 8],
        backgroundColor: 'rgba(31, 184, 205, 0.2)',
        borderColor: '#1FB8CD',
        borderWidth: 2
      }] : []),
      ...(candidate2 ? [{
        label: candidate2.name,
        data: [candidate2.cvScore, 7, 6, candidate2.interviewScore, 7],
        backgroundColor: 'rgba(255, 193, 133, 0.2)',
        borderColor: '#FFC185',
        borderWidth: 2
      }] : [])
    ],
  };

  return (
    <>
      <div className="section-header">
        <h1>Candidate Comparison</h1>
        <p>Compare multiple candidates side by side</p>
      </div>

      <div className="comparison-controls">
        <div className="candidate-selector">
          <select 
            className="form-control" 
            value={candidate1Id} 
            onChange={(e) => setCandidate1Id(e.target.value)}
          >
            <option value="">Select first candidate...</option>
            {appData.sampleCandidates.map(candidate => (
              <option key={candidate.id} value={candidate.id}>{candidate.name}</option>
            ))}
          </select>
          <select 
            className="form-control" 
            value={candidate2Id} 
            onChange={(e) => setCandidate2Id(e.target.value)}
          >
            <option value="">Select second candidate...</option>
            {appData.sampleCandidates.map(candidate => (
              <option key={candidate.id} value={candidate.id}>{candidate.name}</option>
            ))}
          </select>
          <button className="btn btn--primary" onClick={handleComparison}>Compare</button>
        </div>
      </div>

      {showResults && candidate1 && candidate2 && (
        <div className="comparison-results">
          <div className="card comparison-table">
            <div className="card__body">
              <table className="comparison-grid">
                <thead>
                  <tr>
                    <th>Criteria</th>
                    <th>{candidate1.name}</th>
                    <th>{candidate2.name}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>CV Score</td>
                    <td className={`score-cell ${candidate1.cvScore > candidate2.cvScore ? 'winner' : ''}`}>
                      {candidate1.cvScore}
                    </td>
                    <td className={`score-cell ${candidate2.cvScore > candidate1.cvScore ? 'winner' : ''}`}>
                      {candidate2.cvScore}
                    </td>
                  </tr>
                  <tr>
                    <td>Interview Score</td>
                    <td className={`score-cell ${candidate1.interviewScore > candidate2.interviewScore ? 'winner' : ''}`}>
                      {candidate1.interviewScore}
                    </td>
                    <td className={`score-cell ${candidate2.interviewScore > candidate1.interviewScore ? 'winner' : ''}`}>
                      {candidate2.interviewScore}
                    </td>
                  </tr>
                  <tr>
                    <td>Experience</td>
                    <td>{candidate1.position}</td>
                    <td>{candidate2.position}</td>
                  </tr>
                  <tr>
                    <td>Duration</td>
                    <td>{candidate1.interviewDuration}</td>
                    <td>{candidate2.interviewDuration}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="card comparison-charts">
            <div className="card__header">
              <h3>Skills Comparison</h3>
            </div>
            <div className="card__body">
              <div className="chart-container">
                <Radar data={comparisonData} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}