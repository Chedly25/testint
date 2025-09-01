'use client';

import { useState, useRef, useEffect } from 'react';
import { appData } from '@/lib/data';
import { extractTextFromFile } from '@/lib/pdf-parser';
import { analyzeCV } from '@/lib/anthropic';

export function CVAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(appData.sampleCandidates[0]);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [hasApiKey, setHasApiKey] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkApiKey = () => {
      const apiKey = localStorage.getItem('anthropic_api_key');
      setHasApiKey(!!apiKey);
    };

    checkApiKey();
    // Check for API key changes
    window.addEventListener('storage', checkApiKey);
    return () => window.removeEventListener('storage', checkApiKey);
  }, []);

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleFileUpload = async (file: File) => {
    setIsAnalyzing(true);
    setUploadStatus('uploading');
    
    try {
      // Check if API key is available
      const apiKey = localStorage.getItem('anthropic_api_key');
      
      if (!apiKey) {
        // Show mock data if no API key
        await new Promise(resolve => setTimeout(resolve, 2000));
        setAnalysisResults({
          ...appData.sampleCandidates[0],
          name: file.name.replace(/\.(pdf|docx)$/i, ''),
        });
        setShowResults(true);
        setUploadStatus('success');
        return;
      }

      // Extract text from file and analyze with real API
      const content = await extractTextFromFile(file);
      const analysis = await analyzeCV(content);
      
      // Map API response to our data structure
      setAnalysisResults({
        ...appData.sampleCandidates[0],
        name: file.name.replace(/\.(pdf|docx)$/i, ''),
        cvScore: Math.round(analysis.fitScore / 10), // Convert 0-100 to 0-10
        strengths: analysis.strengths || appData.sampleCandidates[0].strengths,
        weaknesses: analysis.weaknesses || appData.sampleCandidates[0].weaknesses,
      });
      
      setShowResults(true);
      setUploadStatus('success');
      
    } catch (error) {
      console.error('Error analyzing CV:', error);
      setUploadStatus('error');
      
      // Fallback to mock data on error
      setAnalysisResults({
        ...appData.sampleCandidates[0],
        name: file.name.replace(/\.(pdf|docx)$/i, ''),
      });
      setShowResults(true);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getDropzoneContent = () => {
    if (isAnalyzing) {
      return (
        <div className="dropzone-content">
          <div className="upload-icon">⏳</div>
          <h3>Analyzing CV...</h3>
          <p>Please wait while we process your file</p>
        </div>
      );
    }

    if (uploadStatus === 'success') {
      return (
        <div className="dropzone-content">
          <div className="upload-icon">✅</div>
          <h3>Analysis Complete</h3>
          <p>CV processed successfully</p>
          <button 
            className="btn btn--outline" 
            onClick={() => {
              setShowResults(false);
              setUploadStatus('idle');
            }}
          >
            Upload Another CV
          </button>
        </div>
      );
    }

    return (
      <div className="dropzone-content">
        <div className="upload-icon">📄</div>
        <h3>Drop your CV here</h3>
        <p>Supports PDF and DOCX files up to 10MB</p>
        <button className="btn btn--primary" onClick={handleBrowseClick}>
          Browse Files
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </div>
    );
  };

  return (
    <>
      <div className="section-header">
        <h1>CV Analysis</h1>
        <p>Upload and analyze candidate CVs with AI-powered insights</p>
        {!hasApiKey && (
          <div className="api-warning">
            <span>⚠️ Using mock data. <a href="#settings" onClick={() => window.location.hash = 'settings'}>Set up your Anthropic API key</a> for real AI analysis.</span>
          </div>
        )}
      </div>

      <div className="cv-analysis-container">
        <div className="card upload-area">
          <div className="card__body">
            <div 
              className="dropzone"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={!isAnalyzing && uploadStatus !== 'success' ? handleBrowseClick : undefined}
              style={{ cursor: !isAnalyzing && uploadStatus !== 'success' ? 'pointer' : 'default' }}
            >
              {getDropzoneContent()}
            </div>
          </div>
        </div>

        {showResults && (
          <div className="card cv-analysis-results">
            <div className="card__header">
              <h3>CV Analysis Results</h3>
              <div className="analysis-score">
                <span>Overall Score:</span>
                <div className="score-badge">{analysisResults.cvScore}</div>
              </div>
            </div>
            <div className="card__body">
              <div className="analysis-grid">
                <div className="strengths-section">
                  <h4>✅ Strengths</h4>
                  <ul>
                    {analysisResults.strengths.map((strength, index) => (
                      <li key={index}>{strength}</li>
                    ))}
                  </ul>
                </div>
                <div className="weaknesses-section">
                  <h4>⚠️ Areas for Improvement</h4>
                  <ul>
                    {analysisResults.weaknesses.map((weakness, index) => (
                      <li key={index}>{weakness}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="generated-questions">
                <h4>🎯 Suggested Interview Questions</h4>
                <div>
                  {[
                    "Can you tell me more about your experience with Python and React?",
                    "How have you demonstrated leadership in your previous roles?",
                    "What cloud technologies would you like to learn more about?",
                    "How do you approach system design challenges?",
                    "Tell me about a time when you had to adapt to agile methodologies."
                  ].map((question, index) => (
                    <div key={index} className="question-item">
                      <p><strong>Q:</strong> {question}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}