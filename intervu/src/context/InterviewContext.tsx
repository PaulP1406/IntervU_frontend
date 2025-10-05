'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface InterviewContextType {
  sessionId: number | null;
  setSessionId: (id: number) => void;
  
  resumeText: string;
  setResumeText: (text: string) => void;
  
  jobTitle: string;
  setJobTitle: (title: string) => void;
  
  jobInfo: string;
  setJobInfo: (info: string) => void;
  
  companyName: string;
  setCompanyName: (name: string) => void;
  
  additionalInfo: string;
  setAdditionalInfo: (info: string) => void;
  
  selectedTopics: string[];
  setSelectedTopics: (topics: string[]) => void;
  
  questions: Array<{ question: string; topic: string }>;
  setQuestions: (questions: Array<{ question: string; topic: string }>) => void;
  
  transcripts: Array<{ question: string; answer: string }>;
  setTranscripts: (transcripts: Array<{ question: string; answer: string }>) => void;
}

const InterviewContext = createContext<InterviewContextType | undefined>(undefined);

export function InterviewProvider({ children }: { children: ReactNode }) {
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [resumeText, setResumeText] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [jobInfo, setJobInfo] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [questions, setQuestions] = useState<Array<{ question: string; topic: string }>>([]);
  const [transcripts, setTranscripts] = useState<Array<{ question: string; answer: string }>>([]);

  return (
    <InterviewContext.Provider
      value={{
        sessionId,
        setSessionId,
        resumeText,
        setResumeText,
        jobTitle,
        setJobTitle,
        jobInfo,
        setJobInfo,
        companyName,
        setCompanyName,
        additionalInfo,
        setAdditionalInfo,
        selectedTopics,
        setSelectedTopics,
        questions,
        setQuestions,
        transcripts,
        setTranscripts,
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
}

export function useInterview() {
  const context = useContext(InterviewContext);
  if (context === undefined) {
    throw new Error('useInterview must be used within an InterviewProvider');
  }
  return context;
}
