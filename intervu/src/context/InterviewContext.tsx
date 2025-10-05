'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { InterviewQuestion } from '@/lib/api';

interface InterviewContextType {
  sessionId: string | null;
  setSessionId: (id: string) => void;
  
  resumeText: string;
  setResumeText: (text: string) => void;
  
  resumeFileName: string;
  setResumeFileName: (name: string) => void;
  
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
  
  questions: InterviewQuestion[];
  setQuestions: (questions: InterviewQuestion[]) => void;
  
  transcripts: Array<{ question: string; answer: string }>;
  setTranscripts: (transcripts: Array<{ question: string; answer: string }>) => void;

  technicalDifficulty: string;
  setTechnicalDifficulty: (difficulty: string) => void;
}

const InterviewContext = createContext<InterviewContextType | undefined>(undefined);

export function InterviewProvider({ children }: { children: ReactNode }) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [resumeText, setResumeText] = useState('');
  const [resumeFileName, setResumeFileName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [jobInfo, setJobInfo] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [transcripts, setTranscripts] = useState<Array<{ question: string; answer: string }>>([]);
  const [technicalDifficulty, setTechnicalDifficulty] = useState<string>('Medium');

  return (
    <InterviewContext.Provider
      value={{
        sessionId,
        setSessionId,
        resumeText,
        setResumeText,
        resumeFileName,
        setResumeFileName,
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
        technicalDifficulty,
        setTechnicalDifficulty,
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
