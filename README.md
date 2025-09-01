# Interview Helper Pro

AI-powered recruitment platform for comprehensive interview management with real-time analytics, CV analysis, and behavioral insights.

## Features

- **CV Analysis**: Upload and analyze candidate CVs with AI-powered insights
- **Live Interview Recording**: Real-time transcription and AI question suggestions  
- **Behavioral Analysis**: Sentiment tracking and personality assessment
- **Candidate Comparison**: Side-by-side comparison with radar charts
- **Analytics Dashboard**: Performance metrics and hiring insights
- **Interview Library**: Searchable archive with filtering capabilities
- **AI Question Bank**: Dynamic question generation for different roles
- **Final Reports**: Comprehensive reporting with downloadable summaries

## Tech Stack

- **Frontend**: React 19, Next.js 15, TypeScript
- **Styling**: CSS with custom design system
- **Charts**: Chart.js with react-chartjs-2
- **Testing**: Jest with React Testing Library

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run development server**
   ```bash
   npm run dev
   ```

3. **Open [http://localhost:3000](http://localhost:3000) in your browser**

4. **Run tests**
   ```bash
   npm test
   ```

## Heroku Deployment

### Method 1: Heroku CLI

1. **Install Heroku CLI** and login:
   ```bash
   heroku login
   ```

2. **Create a new Heroku app**:
   ```bash
   heroku create your-app-name
   ```

3. **Deploy to Heroku**:
   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

### Method 2: Heroku Dashboard

1. Go to [Heroku Dashboard](https://dashboard.heroku.com/)
2. Click "New" → "Create new app"  
3. Connect your GitHub repository
4. Click "Deploy Branch"

### Method 3: One-click Deploy

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

## Environment Variables (Optional)

```bash
# For real AI analysis (optional)
ANTHROPIC_API_KEY=your_api_key_here
```

## Production Build

```bash
npm run build
npm start
```

## File Structure

```
interview-helper-pro/
├── app/                  # Next.js app directory
├── components/          # React components  
├── lib/                 # Utilities and data
├── __tests__/           # Test files
├── Procfile            # Heroku configuration
├── app.json            # Heroku app settings
└── package.json        # Dependencies
```

## Testing

The application includes comprehensive test coverage:
- 119 total tests across 9 components
- Unit tests for all major components
- Integration tests for complete workflows

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

## Troubleshooting Heroku Deployment

- **Build Issues**: Check Node.js version is >=18.0.0
- **Runtime Issues**: Check logs with `heroku logs --tail`
- **Environment**: Heroku automatically sets `PORT` environment variable
