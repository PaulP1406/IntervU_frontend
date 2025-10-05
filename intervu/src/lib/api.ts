// API client for backend communication

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export interface SessionData {
  sessionId: number;
  parsedResumeText: string;
  jobTitle: string;
  jobInfo: string;
  companyName?: string;
  additionalInfo?: string;
  behaviouralTopics?: string[];
}

export interface QuestionAnswer {
  question: string;
  answer: string;
}

export interface FeedbackRequest {
  sessionId: number;
  interviewQuestionsWithAnswers: QuestionAnswer[];
}

export interface QuestionFeedback {
  question: string;
  score: number;
  strengths: string[];
  areasForImprovement: string[];
}

export interface FeedbackResponse {
  sessionId: number;
  interviewQuestionFeedback: QuestionFeedback[];
  hireAbilityScore: number;
}

// Create interview session
export async function createInterviewSession(data: SessionData): Promise<{ sessionId: number }> {
  const response = await fetch(`${API_BASE_URL}/api/interview/session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Failed to create interview session');
  }

  return response.json();
}

// Get interview feedback
export async function getInterviewFeedback(data: FeedbackRequest): Promise<FeedbackResponse> {
  const response = await fetch(`${API_BASE_URL}/api/interview/feedback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Failed to get interview feedback');
  }

  return response.json();
}

// Health check
export async function healthCheck(): Promise<{ status: string; message: string }> {
  const response = await fetch(`${API_BASE_URL}/health`);
  
  if (!response.ok) {
    throw new Error('Backend is not responding');
  }

  return response.json();
}
