'use client';

import { useState, useEffect } from 'react';

export function Settings() {
  const [apiKey, setApiKey] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // Load API key from localStorage on component mount
    const savedApiKey = localStorage.getItem('anthropic_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      setIsSaved(true);
    }
  }, []);

  const handleSave = () => {
    if (apiKey.trim()) {
      // Save API key to localStorage
      localStorage.setItem('anthropic_api_key', apiKey.trim());
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  const handleClear = () => {
    setApiKey('');
    localStorage.removeItem('anthropic_api_key');
    setIsSaved(false);
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const maskApiKey = (key: string) => {
    if (key.length <= 8) return key;
    return key.slice(0, 4) + '*'.repeat(key.length - 8) + key.slice(-4);
  };

  return (
    <>
      <div className="section-header">
        <h1>API Settings</h1>
        <p>Configure your Anthropic API key for real AI-powered analysis</p>
      </div>

      <div className="settings-container">
        <div className="card api-settings">
          <div className="card__header">
            <h3>Anthropic API Configuration</h3>
            <div className="api-status">
              <span className={`status ${apiKey ? 'status--success' : 'status--warning'}`}>
                {apiKey ? 'API Key Configured' : 'No API Key'}
              </span>
            </div>
          </div>
          <div className="card__body">
            <div className="api-form">
              <div className="form-group">
                <label htmlFor="api-key">Anthropic API Key</label>
                <div className="api-input-group">
                  <input
                    id="api-key"
                    type={isVisible ? 'text' : 'password'}
                    className="form-control"
                    placeholder="sk-ant-api03-..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                  <button 
                    type="button" 
                    className="btn btn--outline btn--sm"
                    onClick={toggleVisibility}
                  >
                    {isVisible ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                <small className="form-help">
                  Get your API key from{' '}
                  <a 
                    href="https://console.anthropic.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="link"
                  >
                    Anthropic Console
                  </a>
                </small>
              </div>

              <div className="form-actions">
                <button 
                  className="btn btn--primary" 
                  onClick={handleSave}
                  disabled={!apiKey.trim()}
                >
                  {isSaved ? '✅ Saved!' : 'Save API Key'}
                </button>
                <button 
                  className="btn btn--outline" 
                  onClick={handleClear}
                  disabled={!apiKey}
                >
                  Clear
                </button>
              </div>

              {apiKey && (
                <div className="api-preview">
                  <strong>Current API Key:</strong> {maskApiKey(apiKey)}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="card api-info">
          <div className="card__header">
            <h3>How to Use</h3>
          </div>
          <div className="card__body">
            <div className="info-steps">
              <div className="step-item">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h4>Get your API Key</h4>
                  <p>Visit <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer">Anthropic Console</a> and create an API key</p>
                </div>
              </div>
              <div className="step-item">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h4>Enter the Key</h4>
                  <p>Paste your API key in the field above and click "Save API Key"</p>
                </div>
              </div>
              <div className="step-item">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h4>Upload CVs</h4>
                  <p>Go to CV Analysis and upload CVs to get real AI-powered insights instead of mock data</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card api-features">
          <div className="card__header">
            <h3>What You Get with Real API</h3>
          </div>
          <div className="card__body">
            <div className="feature-list">
              <div className="feature-item">
                <span className="feature-icon">🔍</span>
                <div className="feature-content">
                  <h4>Smart CV Analysis</h4>
                  <p>AI analyzes actual CV content, experience, and skills</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">💡</span>
                <div className="feature-content">
                  <h4>Personalized Questions</h4>
                  <p>Generate interview questions based on candidate's background</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📊</span>
                <div className="feature-content">
                  <h4>Detailed Insights</h4>
                  <p>Get specific strengths, weaknesses, and recommendations</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🎯</span>
                <div className="feature-content">
                  <h4>Role Matching</h4>
                  <p>Assess how well candidates fit specific job requirements</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}