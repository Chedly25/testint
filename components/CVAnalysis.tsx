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
      console.log('API Key available:', !!apiKey);
      
      if (!apiKey) {
        // Show mock data if no API key
        console.log('No API key found, using mock data');
        await new Promise(resolve => setTimeout(resolve, 2000));
        setAnalysisResults({
          ...appData.sampleCandidates[0],
          name: file.name.replace(/\.(pdf|docx)$/i, ''),
        });
        setShowResults(true);
        setUploadStatus('success');
        return;
      }

      console.log('Extracting text from file:', file.name);
      console.log('File details:', {
        name: file.name,
        type: file.type,
        size: file.size,
        sizeInMB: (file.size / (1024 * 1024)).toFixed(2) + ' MB'
      });
      
      // Extract text from file and analyze with real API
      const content = await extractTextFromFile(file);
      console.log('Text extraction successful!');
      console.log('Extracted text length:', content.length);
      console.log('Text preview (first 200 chars):', content.substring(0, 200));
      console.log('Text preview (last 200 chars):', content.substring(-200));
      
      if (!content || content.trim().length < 50) {
        throw new Error('Could not extract meaningful content from the file');
      }

      console.log('Calling Anthropic API...');
      const analysis = await analyzeCV(content);
      console.log('API Response:', analysis);
      
      // Map API response to our data structure
      setAnalysisResults({
        id: appData.sampleCandidates[0].id,
        name: file.name.replace(/\.(pdf|docx)$/i, ''),
        position: 'Candidate', // Default position
        cvScore: Math.round((analysis.fitScore || 75) / 10), // Convert 0-100 to 0-10
        interviewScore: appData.sampleCandidates[0].interviewScore,
        status: 'completed' as const,
        date: new Date().toISOString().split('T')[0],
        skills: appData.sampleCandidates[0].skills,
        strengths: analysis.strengths || ['Unable to extract strengths'],
        weaknesses: analysis.weaknesses || ['Unable to identify areas for improvement'],
        interviewDuration: appData.sampleCandidates[0].interviewDuration,
        sentimentScore: appData.sampleCandidates[0].sentimentScore,
      });
      
      setShowResults(true);
      setUploadStatus('success');
      console.log('Analysis complete');
      
    } catch (error) {
      console.error('Error analyzing CV:', error);
      setUploadStatus('error');
      
      // Show detailed error message with suggestions
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Full error details:', error);
      
      // Create a more helpful error dialog with debugging info
      const helpfulMessage = `CV Analysis Error: ${errorMessage}

File Details:
- Name: ${file.name}
- Type: ${file.type}
- Size: ${(file.size / (1024 * 1024)).toFixed(2)} MB

Troubleshooting Steps:
1. Try a different PDF file (preferably smaller than 5MB)
2. Ensure the PDF contains selectable text (not scanned images)
3. Try converting the PDF to DOCX format
4. Copy the CV content to a .txt file and upload that instead
5. Check the browser console for detailed error logs
6. Refresh the page and try again

Technical Note: Check the browser console (F12) for detailed error information.`;

      alert(helpfulMessage);
      setShowResults(false);
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