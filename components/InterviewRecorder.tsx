'use client';

import React, { useEffect, useRef, useState } from 'react';
import RecordRTC from 'recordrtc';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Circle, 
  Square,
  MessageCircle,
  Loader
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { generateFollowUpQuestion } from '@/lib/anthropic';

export function InterviewRecorder() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const recorderRef = useRef<RecordRTC | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<any>(null);
  
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [followUpQuestion, setFollowUpQuestion] = useState<string>('');
  const [isGeneratingQuestion, setIsGeneratingQuestion] = useState(false);
  
  const {
    isRecording,
    currentInterview,
    currentCV,
    startInterview,
    stopInterview,
    updateTranscript
  } = useStore();

  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join(' ');
        
        if (event.results[event.results.length - 1].isFinal) {
          updateTranscript(transcript);
          generateFollowUp();
        }
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
      };
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const generateFollowUp = async () => {
    if (!currentInterview || isGeneratingQuestion) return;
    
    setIsGeneratingQuestion(true);
    try {
      const question = await generateFollowUpQuestion(
        currentInterview.transcript,
        currentCV?.content
      );
      setFollowUpQuestion(question);
    } catch (error) {
      console.error('Failed to generate follow-up question:', error);
    } finally {
      setIsGeneratingQuestion(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      recorderRef.current = new RecordRTC(stream, {
        type: 'video',
        mimeType: 'video/webm'
      });
      
      recorderRef.current.startRecording();
      startInterview(currentCV?.id);
      
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Failed to access camera/microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (recorderRef.current) {
      recorderRef.current.stopRecording(() => {
        const blob = recorderRef.current?.getBlob();
        if (blob) {
          const url = URL.createObjectURL(blob);
          console.log('Recording saved:', url);
        }
      });
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    
    stopInterview();
  };

  const toggleVideo = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOn(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioOn(audioTrack.enabled);
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="bg-gray-900 rounded-xl overflow-hidden shadow-2xl">
        <div className="relative aspect-video bg-gray-800">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
          
          {!isRecording && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Click "Start Interview" to begin recording</p>
              </div>
            </div>
          )}
          
          {isRecording && (
            <div className="absolute top-4 right-4 flex items-center space-x-2 bg-red-600 text-white px-3 py-1 rounded-full">
              <Circle className="w-3 h-3 fill-current animate-pulse" />
              <span className="text-sm font-medium">Recording</span>
            </div>
          )}
        </div>
        
        <div className="bg-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <button
                onClick={toggleVideo}
                disabled={!isRecording}
                className={`p-3 rounded-lg transition-colors ${
                  isRecording 
                    ? isVideoOn 
                      ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                      : 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </button>
              
              <button
                onClick={toggleAudio}
                disabled={!isRecording}
                className={`p-3 rounded-lg transition-colors ${
                  isRecording 
                    ? isAudioOn 
                      ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                      : 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isAudioOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>
            </div>
            
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                isRecording
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isRecording ? (
                <>
                  <Square className="w-5 h-5" />
                  <span>Stop Interview</span>
                </>
              ) : (
                <>
                  <Circle className="w-5 h-5" />
                  <span>Start Interview</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {followUpQuestion && isRecording && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <MessageCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900 mb-1">
                Suggested Follow-up Question:
              </p>
              <p className="text-sm text-blue-800">{followUpQuestion}</p>
            </div>
            {isGeneratingQuestion && (
              <Loader className="w-4 h-4 text-blue-600 animate-spin" />
            )}
          </div>
        </div>
      )}
      
      {currentInterview && currentInterview.transcript.length > 0 && (
        <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Live Transcript:</h3>
          <div className="max-h-32 overflow-y-auto">
            {currentInterview.transcript.map((text, index) => (
              <p key={index} className="text-sm text-gray-700 mb-1">
                {text}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}