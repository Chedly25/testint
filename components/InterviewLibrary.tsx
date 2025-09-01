'use client';

import { useState } from 'react';
import { appData } from '@/lib/data';

export function InterviewLibrary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [positionFilter, setPositionFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredInterviews = appData.sampleCandidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPosition = !positionFilter || candidate.position === positionFilter;
    const matchesStatus = !statusFilter || candidate.status === statusFilter;
    
    return matchesSearch && matchesPosition && matchesStatus;
  });

  return (
    <>
      <div className="section-header">
        <h1>Interview Library</h1>
        <p>Searchable archive of all interviews with transcriptions</p>
      </div>

      <div className="library-controls">
        <div className="search-filters">
          <input 
            type="text" 
            className="form-control" 
            placeholder="Search interviews..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select 
            className="form-control" 
            value={positionFilter}
            onChange={(e) => setPositionFilter(e.target.value)}
          >
            <option value="">All Positions</option>
            <option value="Senior Software Engineer">Senior Software Engineer</option>
            <option value="Product Manager">Product Manager</option>
            <option value="UX Designer">UX Designer</option>
          </select>
          <select 
            className="form-control" 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="completed">Completed</option>
            <option value="in-progress">In Progress</option>
          </select>
        </div>
      </div>

      <div className="library-grid">
        {filteredInterviews.length === 0 ? (
          <p className="text-center">No interviews found matching your criteria.</p>
        ) : (
          filteredInterviews.map(interview => (
            <div key={interview.id} className="library-item">
              <h4>{interview.name}</h4>
              <div className="library-meta">
                <span>{interview.position}</span>
                <span>{interview.date}</span>
                <span className={`status ${interview.status === 'completed' ? 'status--success' : 'status--warning'}`}>
                  {interview.status}
                </span>
              </div>
              <div className="library-excerpt">
                "In my previous role, I worked on developing scalable web applications using modern frameworks..."
              </div>
              <div className="library-actions">
                <button className="btn btn--sm btn--primary">View Full Transcript</button>
                <button className="btn btn--sm btn--outline">Play Recording</button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}