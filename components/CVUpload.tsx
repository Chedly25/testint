'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { useStore } from '@/lib/store';
import { extractTextFromFile } from '@/lib/pdf-parser';
import { analyzeCV } from '@/lib/anthropic';

export function CVUpload() {
  const { uploadCV, updateCVAnalysis } = useStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    setIsProcessing(true);
    setError(null);
    setSuccess(false);
    
    try {
      const content = await extractTextFromFile(file);
      
      const cvData = {
        id: Date.now().toString(),
        fileName: file.name,
        content,
        uploadedAt: new Date()
      };
      
      uploadCV(cvData);
      setSuccess(true);
      
      const analysis = await analyzeCV(content);
      updateCVAnalysis(cvData.id, analysis);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process CV');
    } finally {
      setIsProcessing(false);
    }
  }, [uploadCV, updateCVAnalysis]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxFiles: 1,
    disabled: isProcessing
  });

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer
          transition-all duration-200 ease-in-out
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
          ${error ? 'border-red-300 bg-red-50' : ''}
          ${success ? 'border-green-300 bg-green-50' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center space-y-4">
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
              <p className="text-gray-600">Processing CV...</p>
            </>
          ) : error ? (
            <>
              <AlertCircle className="w-12 h-12 text-red-500" />
              <p className="text-red-600 font-medium">Error</p>
              <p className="text-sm text-red-500">{error}</p>
            </>
          ) : success ? (
            <>
              <CheckCircle className="w-12 h-12 text-green-500" />
              <p className="text-green-600 font-medium">CV Uploaded Successfully!</p>
              <p className="text-sm text-gray-500">Analysis in progress...</p>
            </>
          ) : (
            <>
              {isDragActive ? (
                <FileText className="w-12 h-12 text-blue-500" />
              ) : (
                <Upload className="w-12 h-12 text-gray-400" />
              )}
              <div>
                <p className="text-lg font-medium text-gray-700">
                  {isDragActive ? 'Drop your CV here' : 'Drag & Drop your CV'}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  or click to browse (PDF, DOCX, TXT)
                </p>
              </div>
            </>
          )}
        </div>
      </div>
      
      {!isProcessing && !error && !success && (
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-400">
            Maximum file size: 10MB • Your data is processed securely
          </p>
        </div>
      )}
    </div>
  );
}