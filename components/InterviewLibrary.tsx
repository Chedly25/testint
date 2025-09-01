'use client';

import { useState } from 'react';
import { appData } from '@/lib/data';

export function InterviewLibrary() {
  return (
    <>
      <div className="section-header">
        <h1>Interview Library</h1>
        <p>Searchable archive of all interviews with transcriptions</p>
      </div>

      <div className="library-placeholder">
        <div className="card">
          <div className="card__body">
            <div className="placeholder-content">
              <div className="placeholder-icon">📚</div>
              <h3>No Interviews Yet</h3>
              <p>
                Your interview library is empty. Once you start conducting interviews using the Live Interview feature,
                recordings and transcriptions will appear here for easy searching and review.
              </p>
              <div className="placeholder-features">
                <div className="placeholder-feature">
                  <span>🔍</span> Search by candidate name or position
                </div>
                <div className="placeholder-feature">
                  <span>📝</span> Full interview transcriptions
                </div>
                <div className="placeholder-feature">
                  <span>🎵</span> Audio/video recordings
                </div>
                <div className="placeholder-feature">
                  <span>📅</span> Filter by date and status
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}