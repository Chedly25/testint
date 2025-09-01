'use client';

import { useState } from 'react';
import { appData } from '@/lib/data';

export function QuestionBank() {
  const [categoryFilter, setCategoryFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [questions, setQuestions] = useState(() => {
    const allQuestions: Array<{text: string, category: string, role: string}> = [];
    appData.interviewQuestions.forEach(categoryData => {
      categoryData.questions.forEach(question => {
        allQuestions.push({
          text: question,
          category: categoryData.category,
          role: 'General'
        });
      });
    });
    return allQuestions;
  });

  const [isGenerating, setIsGenerating] = useState(false);

  const filteredQuestions = questions.filter(q => {
    const matchesCategory = !categoryFilter || q.category === categoryFilter;
    const matchesRole = !roleFilter || q.role === roleFilter;
    return matchesCategory && matchesRole;
  });

  const generateNewQuestions = async () => {
    setIsGenerating(true);
    
    // Simulate generation delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newQuestions = [
      { text: "How do you handle working under pressure with tight deadlines?", category: "Behavioral", role: "General" },
      { text: "Describe your approach to learning new technologies.", category: "Technical", role: "General" },
      { text: "What would you do if you had to implement a feature with unclear requirements?", category: "Situational", role: "General" },
      { text: "Tell me about a time you had to convince a team to adopt your idea.", category: "Behavioral", role: "General" },
      { text: "How do you ensure your code is maintainable and scalable?", category: "Technical", role: "General" }
    ];
    
    const randomQuestions = newQuestions.sort(() => 0.5 - Math.random()).slice(0, 3);
    setQuestions(prev => [...prev, ...randomQuestions]);
    setIsGenerating(false);
  };

  return (
    <>
      <div className="section-header">
        <h1>AI Question Bank</h1>
        <p>Dynamic question generation for different roles and scenarios</p>
      </div>

      <div className="question-bank-controls">
        <div className="filter-controls">
          <select 
            className="form-control" 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Technical">Technical</option>
            <option value="Behavioral">Behavioral</option>
            <option value="Situational">Situational</option>
          </select>
          <select 
            className="form-control" 
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="Senior Software Engineer">Senior Software Engineer</option>
            <option value="Product Manager">Product Manager</option>
          </select>
          <button 
            className="btn btn--primary" 
            onClick={generateNewQuestions}
            disabled={isGenerating}
          >
            {isGenerating ? 'Generating...' : 'Generate New Questions'}
          </button>
        </div>
      </div>

      <div className="questions-grid">
        {filteredQuestions.map((question, index) => (
          <div key={index} className="question-card">
            <div className="question-header">
              <span className="question-category">{question.category}</span>
              <button className="btn btn--sm btn--outline">Save Question</button>
            </div>
            <p className="question-text">{question.text}</p>
            <div className="question-actions">
              <button className="btn btn--sm btn--primary">Use in Interview</button>
              <button className="btn btn--sm btn--secondary">Edit Question</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}