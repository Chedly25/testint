import Anthropic from '@anthropic-ai/sdk';

function getAnthropicClient() {
  const apiKey = typeof window !== 'undefined' 
    ? localStorage.getItem('anthropic_api_key') 
    : process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY;
    
  if (!apiKey) {
    throw new Error('No Anthropic API key found. Please set your API key in Settings.');
  }
  
  return new Anthropic({
    apiKey,
    dangerouslyAllowBrowser: true
  });
}

export async function analyzeCV(cvContent: string) {
  try {
    const anthropic = getAnthropicClient();
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: `Analyze this CV/Resume for a job interview. Provide:
        1. Key strengths (3-5 points)
        2. Areas for improvement (3-5 points)
        3. Overall fit score (0-100)
        4. Suggested interview questions (5-7 questions)
        5. Brief summary (2-3 sentences)
        
        Format the response as JSON with keys: strengths (array), weaknesses (array), fitScore (number), suggestedQuestions (array), summary (string).
        
        CV Content:
        ${cvContent}`
      }]
    });
    
    const content = response.content[0].type === 'text' ? response.content[0].text : '';
    return JSON.parse(content);
  } catch (error) {
    console.error('Error analyzing CV:', error);
    throw error;
  }
}

export async function analyzeInterview(
  transcript: string[],
  cvContent?: string
) {
  try {
    const anthropic = getAnthropicClient();
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: `Analyze this interview transcript${cvContent ? ' along with the candidate\'s CV' : ''}. Provide:
        1. Overall interview score (0-100)
        2. Key strengths demonstrated (3-5 points)
        3. Areas of concern (3-5 points)
        4. Hiring recommendations (3-5 actionable points)
        5. Behavioral insights observed
        6. Technical assessment summary
        7. Cultural fit assessment
        
        Format the response as JSON with keys: overallScore (number), pros (array), cons (array), recommendations (array), behavioralInsights (array), technicalAssessment (string), culturalFit (string).
        
        Interview Transcript:
        ${transcript.join('\n')}
        
        ${cvContent ? `CV Content:\n${cvContent}` : ''}`
      }]
    });
    
    const content = response.content[0].type === 'text' ? response.content[0].text : '';
    return JSON.parse(content);
  } catch (error) {
    console.error('Error analyzing interview:', error);
    throw error;
  }
}

export async function generateFollowUpQuestion(
  currentTranscript: string[],
  cvContent?: string
): Promise<string> {
  try {
    const anthropic = getAnthropicClient();
    const response = await anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 200,
      messages: [{
        role: 'user',
        content: `Based on the current interview conversation${cvContent ? ' and the candidate\'s CV' : ''}, generate one intelligent follow-up question to dig deeper into the candidate's response or explore an important area not yet covered.
        
        Current conversation:
        ${currentTranscript.slice(-5).join('\n')}
        
        ${cvContent ? `CV highlights:\n${cvContent.substring(0, 500)}` : ''}
        
        Provide only the question, no explanation.`
      }]
    });
    
    return response.content[0].type === 'text' ? response.content[0].text : '';
  } catch (error) {
    console.error('Error generating follow-up question:', error);
    return '';
  }
}