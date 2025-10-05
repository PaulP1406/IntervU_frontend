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

// Technical Interview Types
export interface TechnicalQuestion {
  id: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  question: {
    question: string;
    questionId: string;
    description: string;
    functionName: string;
    testCases: {
      input: string;
      expectedOutput: string;
    }[];
  };
}

export interface ExecuteCodeRequest {
  questionId: string;
  code: string;
  language: 'python' | 'javascript' | 'cpp' | 'java';
}

export interface ExecuteCodeResponse {
  questionId: string;
  code: string;
  language: string;
  output: string;
  error: string;
  executionTime: number;
  success: boolean;
}

export interface HintRequest {
  sessionId: string;
  questionId: string;
  previousHints: string[];
  userCode: string;
  userSpeech: string;
}

export interface HintResponse {
  sessionId: string;
  conversationalHint: string;
  hintSummary: string;
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

// Technical Interview APIs

// Get a random technical question by difficulty
export async function getTechnicalQuestion(difficulty: 'Easy' | 'Medium' | 'Hard'): Promise<TechnicalQuestion> {
  console.log('🚀 [API] Fetching technical question...');
  console.log('📤 [REQUEST] GET /api/technical-question?difficulty=' + difficulty);
  
  const response = await fetch(`${API_BASE_URL}/api/technical-question?difficulty=${difficulty}`);

  if (!response.ok) {
    const error = await response.text();
    console.error('❌ [ERROR] Failed to fetch technical question:', error);
    throw new Error(error || 'Failed to fetch technical question');
  }

  const result = await response.json();
  console.log('✅ [RESPONSE] Technical question received:', JSON.stringify(result, null, 2));
  return result;
}

// Execute code against test cases
export async function executeCode(data: ExecuteCodeRequest): Promise<ExecuteCodeResponse> {
  console.log('🚀 [API] Executing code...');
  console.log('📤 [REQUEST] POST /api/execute-code');
  console.log('📦 [PAYLOAD]:', JSON.stringify({ ...data, code: data.code.substring(0, 100) + '...' }, null, 2));
  
  const response = await fetch(`${API_BASE_URL}/api/execute-code`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('❌ [ERROR] Code execution failed:', error);
    throw new Error(error || 'Failed to execute code');
  }

  const result = await response.json();
  console.log('✅ [RESPONSE] Execution result:', JSON.stringify(result, null, 2));
  console.log('📊 [INFO] Success:', result.success, '| Execution time:', result.executionTime + 'ms');
  return result;
}

// Get AI-powered hint
export async function getHint(data: HintRequest): Promise<HintResponse> {
  console.log('🚀 [API] Requesting hint...');
  console.log('📤 [REQUEST] POST /api/hint');
  console.log('📦 [PAYLOAD]:', JSON.stringify({ ...data, userCode: data.userCode.substring(0, 50) + '...' }, null, 2));
  
  const response = await fetch(`${API_BASE_URL}/api/hint`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('❌ [ERROR] Failed to get hint:', error);
    throw new Error(error || 'Failed to get hint');
  }

  const result = await response.json();
  console.log('✅ [RESPONSE] Hint received:', JSON.stringify(result, null, 2));
  return result;
}
