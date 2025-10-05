// API client for backend communication

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export interface SessionData {
  parsedResumeText: string;
  jobTitle: string;
  jobInfo: string;
  companyName?: string;
  additionalInfo?: string;
  typeOfInterview?: 'technical' | 'behavioral' | 'both';
  behaviouralTopics?: string[];
  technicalDifficulty?: 'beginner' | 'intermediate' | 'advanced';
}

export interface InterviewQuestion {
  id: string;
  topic: string;
  question: string;
  hints: string[];
}

export interface QuestionsResponse {
  sessionId: string;
  questions: InterviewQuestion[];
}

export interface QuestionAnswer {
  question: string;
  answer: string;
}

export interface FeedbackRequest {
  sessionId: string;
  interviewQuestionsWithAnswers: QuestionAnswer[];
}

export interface QuestionFeedback {
  question: string;
  userAnswer?: string;
  score: number;
  strengths: string[];
  areasForImprovement: string[];
}

export interface FeedbackResponse {
  sessionId: string;
  interviewQuestionFeedback: QuestionFeedback[];
  hireAbilityScore: number;
  overallFeedback?: string[];
}

// Create interview session
export async function createInterviewSession(data: SessionData): Promise<{ sessionId: string }> {
  console.log('🚀 [API] Creating interview session...');
  console.log('📤 [REQUEST] POST /api/interview/session');
  console.log('📦 [PAYLOAD]:', JSON.stringify(data, null, 2));
  
  const response = await fetch(`${API_BASE_URL}/api/interview/session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('❌ [ERROR] Session creation failed:', error);
    throw new Error(error || 'Failed to create interview session');
  }

  const result = await response.json();
  console.log('✅ [RESPONSE] Session created:', JSON.stringify(result, null, 2));
  return result;
}

// Get interview questions for a session
export async function getInterviewQuestions(sessionId: string): Promise<QuestionsResponse> {
  console.log('🚀 [API] Fetching interview questions...');
  console.log('📤 [REQUEST] GET /api/interview-questions?sessionId=' + sessionId);
  
  const response = await fetch(`${API_BASE_URL}/api/interview-questions?sessionId=${sessionId}`);

  if (!response.ok) {
    const error = await response.text();
    console.error('❌ [ERROR] Failed to fetch questions:', error);
    throw new Error(error || 'Failed to fetch interview questions');
  }

  const result = await response.json();
  console.log('✅ [RESPONSE] Questions received:', JSON.stringify(result, null, 2));
  console.log('📊 [INFO] Total questions received:', result.questions?.length || 0);
  return result;
}

// Get interview feedback
export async function getInterviewFeedback(data: FeedbackRequest): Promise<FeedbackResponse> {
  console.log('🚀 [API] Submitting interview for feedback...');
  console.log('📤 [REQUEST] POST /api/interview/feedback');
  console.log('📦 [PAYLOAD]:', JSON.stringify(data, null, 2));
  console.log('📊 [INFO] Total questions answered:', data.interviewQuestionsWithAnswers.length);
  
  const response = await fetch(`${API_BASE_URL}/api/interview/feedback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('❌ [ERROR] Failed to get feedback:', error);
    throw new Error(error || 'Failed to get interview feedback');
  }

  const result = await response.json();
  console.log('✅ [RESPONSE] Feedback received:', JSON.stringify(result, null, 2));
  console.log('📊 [INFO] Feedback items:', result.interviewQuestionFeedback?.length || 0);
  console.log('📊 [INFO] Hire ability score:', result.hireAbilityScore);
  return result;
}

// Health check
export async function healthCheck(): Promise<{ status: string; message: string }> {
  const response = await fetch(`${API_BASE_URL}/health`);
  
  if (!response.ok) {
    throw new Error('Backend is not responding');
  }

  return response.json();
}
