'use client';

import React, { useEffect, useState } from 'react';
import { 
  FileText, 
  Video, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  TrendingUp,
  Users,
  Brain,
  Download,
  Loader
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { analyzeInterview } from '@/lib/anthropic';

export function FinalReview() {
  const { currentCV, currentInterview, updateInterviewAnalysis } = useStore();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<'cv' | 'interview' | 'combined'>('combined');

  useEffect(() => {
    if (currentInterview && !currentInterview.analysis && currentInterview.endedAt) {
      performAnalysis();
    }
  }, [currentInterview]);

  const performAnalysis = async () => {
    if (!currentInterview || currentInterview.analysis) return;
    
    setIsAnalyzing(true);
    try {
      const analysis = await analyzeInterview(
        currentInterview.transcript,
        currentCV?.content
      );
      updateInterviewAnalysis(currentInterview.id, analysis);
    } catch (error) {
      console.error('Failed to analyze interview:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const downloadReport = () => {
    const report = generateReportContent();
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interview-report-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateReportContent = () => {
    let report = 'INTERVIEW ASSESSMENT REPORT\n';
    report += '=' .repeat(50) + '\n\n';
    
    if (currentCV) {
      report += `Candidate: ${currentCV.fileName}\n`;
      report += `Date: ${new Date().toLocaleDateString()}\n\n`;
      
      if (currentCV.analysis) {
        report += 'CV ANALYSIS\n';
        report += '-'.repeat(30) + '\n';
        report += `Fit Score: ${currentCV.analysis.fitScore}/100\n\n`;
        report += 'Strengths:\n';
        currentCV.analysis.strengths.forEach(s => report += `• ${s}\n`);
        report += '\nWeaknesses:\n';
        currentCV.analysis.weaknesses.forEach(w => report += `• ${w}\n`);
        report += '\n';
      }
    }
    
    if (currentInterview?.analysis) {
      report += 'INTERVIEW ANALYSIS\n';
      report += '-'.repeat(30) + '\n';
      report += `Overall Score: ${currentInterview.analysis.overallScore}/100\n\n`;
      report += 'Pros:\n';
      currentInterview.analysis.pros.forEach(p => report += `• ${p}\n`);
      report += '\nCons:\n';
      currentInterview.analysis.cons.forEach(c => report += `• ${c}\n`);
      report += '\nRecommendations:\n';
      currentInterview.analysis.recommendations.forEach(r => report += `• ${r}\n`);
    }
    
    return report;
  };

  if (isAnalyzing) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Analyzing Interview...</h2>
          <p className="text-gray-600">This may take a few moments</p>
        </div>
      </div>
    );
  }

  if (!currentCV && !currentInterview) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
        <div className="bg-gray-50 rounded-xl p-12 text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">No Data Available</h2>
          <p className="text-gray-600">Upload a CV and complete an interview to see the analysis</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">Candidate Assessment Report</h1>
              <p className="text-blue-100">
                Comprehensive analysis based on CV and interview performance
              </p>
            </div>
            <button
              onClick={downloadReport}
              className="flex items-center space-x-2 bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download Report</span>
            </button>
          </div>
        </div>
        
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('cv')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'cv'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>CV Analysis</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('interview')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'interview'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Video className="w-4 h-4" />
                <span>Interview Analysis</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('combined')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'combined'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Brain className="w-4 h-4" />
                <span>Combined Assessment</span>
              </div>
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {activeTab === 'cv' && currentCV?.analysis && (
            <div className="space-y-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">CV Fit Score</h3>
                  <span className="text-3xl font-bold text-blue-600">
                    {currentCV.analysis.fitScore}/100
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${currentCV.analysis.fitScore}%` }}
                  />
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="flex items-center text-lg font-semibold text-green-800 mb-3">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Strengths
                  </h3>
                  <ul className="space-y-2">
                    {currentCV.analysis.strengths.map((strength, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-green-600 mr-2">•</span>
                        <span className="text-gray-700">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-red-50 rounded-lg p-4">
                  <h3 className="flex items-center text-lg font-semibold text-red-800 mb-3">
                    <XCircle className="w-5 h-5 mr-2" />
                    Areas for Improvement
                  </h3>
                  <ul className="space-y-2">
                    {currentCV.analysis.weaknesses.map((weakness, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-red-600 mr-2">•</span>
                        <span className="text-gray-700">{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'interview' && currentInterview?.analysis && (
            <div className="space-y-6">
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Interview Score</h3>
                  <span className="text-3xl font-bold text-purple-600">
                    {currentInterview.analysis.overallScore}/100
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-purple-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${currentInterview.analysis.overallScore}%` }}
                  />
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="flex items-center text-lg font-semibold text-green-800 mb-3">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Pros
                  </h3>
                  <ul className="space-y-2">
                    {currentInterview.analysis.pros.map((pro, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-green-600 mr-2">•</span>
                        <span className="text-gray-700">{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-red-50 rounded-lg p-4">
                  <h3 className="flex items-center text-lg font-semibold text-red-800 mb-3">
                    <XCircle className="w-5 h-5 mr-2" />
                    Cons
                  </h3>
                  <ul className="space-y-2">
                    {currentInterview.analysis.cons.map((con, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-red-600 mr-2">•</span>
                        <span className="text-gray-700">{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="flex items-center text-lg font-semibold text-blue-800 mb-3">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Recommendations
                </h3>
                <ul className="space-y-2">
                  {currentInterview.analysis.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-blue-600 mr-2">→</span>
                      <span className="text-gray-700">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          
          {activeTab === 'combined' && (
            <div className="space-y-6">
              {currentCV?.analysis && currentInterview?.analysis && (
                <>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Overall Assessment</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">CV Fit Score</span>
                          <span className="font-semibold">{currentCV.analysis.fitScore}/100</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Interview Score</span>
                          <span className="font-semibold">{currentInterview.analysis.overallScore}/100</span>
                        </div>
                        <div className="pt-3 border-t border-gray-200">
                          <div className="flex justify-between">
                            <span className="text-gray-800 font-medium">Combined Score</span>
                            <span className="text-2xl font-bold text-blue-600">
                              {Math.round((currentCV.analysis.fitScore + currentInterview.analysis.overallScore) / 2)}/100
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-6">
                      <h3 className="flex items-center text-lg font-semibold text-gray-800 mb-4">
                        <Users className="w-5 h-5 mr-2" />
                        Cultural Fit
                      </h3>
                      <p className="text-gray-700">
                        {currentInterview.analysis.culturalFit}
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 rounded-lg p-6">
                    <h3 className="flex items-center text-lg font-semibold text-yellow-800 mb-4">
                      <Brain className="w-5 h-5 mr-2" />
                      Behavioral Insights
                    </h3>
                    <ul className="space-y-2">
                      {currentInterview.analysis.behavioralInsights.map((insight, i) => (
                        <li key={i} className="flex items-start">
                          <span className="text-yellow-600 mr-2">•</span>
                          <span className="text-gray-700">{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Technical Assessment
                    </h3>
                    <p className="text-gray-700">
                      {currentInterview.analysis.technicalAssessment}
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
                    <h3 className="text-xl font-semibold mb-3">Final Recommendation</h3>
                    <div className="space-y-2">
                      {currentInterview.analysis.recommendations.slice(0, 2).map((rec, i) => (
                        <p key={i} className="flex items-start">
                          <span className="mr-2">→</span>
                          <span>{rec}</span>
                        </p>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}