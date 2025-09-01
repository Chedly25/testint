# Interview Helper Pro - Setup Guide

## Important: API Key Configuration

Before using the application, you must configure your Anthropic API key:

1. Open the `.env.local` file in the project root
2. Replace `your_anthropic_api_key_here` with your actual Anthropic API key
3. Save the file and restart the development server

## Quick Start

```bash
# Install dependencies
npm install

# Configure your API key in .env.local

# Start the development server
npm run dev
```

The application will be available at http://localhost:3000

## Features Overview

### CV Upload & Analysis
- Drag and drop CV files (PDF, DOCX, TXT)
- Automatic text extraction
- AI-powered strengths/weaknesses analysis
- Suggested interview questions generation

### Interview Recording
- Live video/audio recording
- Real-time speech-to-text transcription
- AI-generated follow-up questions
- Automatic session management

### Final Review Dashboard
- Combined CV and interview analysis
- Scoring and recommendations
- Pros/cons breakdown
- Downloadable reports

## Technical Notes

- The application uses browser-based APIs for recording
- Speech recognition works best in Chrome/Edge browsers
- Ensure camera/microphone permissions are granted
- All AI processing uses the Anthropic Claude API