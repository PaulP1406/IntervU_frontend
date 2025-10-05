'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useInterview } from '@/context/InterviewContext';
import { createInterviewSession, getInterviewQuestions } from '@/lib/api';
import Header from '@/components/Header';

// Define available interview topics
const INTERVIEW_TOPICS = [
  {
    id: 'workplace-behavior',
    title: 'Workplace Behavior',
    description: 'Teamwork, communication, and professionalism',
    icon: '👥',
  },
  {
    id: 'leadership',
    title: 'Leadership',
    description: 'Leading teams, decision-making, and influence',
    icon: '🎯',
  },
  {
    id: 'problem-solving',
    title: 'Problem Solving',
    description: 'Analytical thinking and creative solutions',
    icon: '🧩',
  },
  {
    id: 'conflict-resolution',
    title: 'Conflict Resolution',
    description: 'Handling disagreements and difficult situations',
    icon: '🤝',
  },
  {
    id: 'adaptability',
    title: 'Adaptability',
    description: 'Change management and flexibility',
    icon: '🔄',
  },
  {
    id: 'time-management',
    title: 'Time Management',
    description: 'Prioritization and meeting deadlines',
    icon: '⏰',
  },
  {
    id: 'customer-focus',
    title: 'Customer Focus',
    description: 'Client relationships and service excellence',
    icon: '⭐',
  },
  {
    id: 'innovation',
    title: 'Innovation & Creativity',
    description: 'New ideas and process improvements',
    icon: '💡',
  },
];

const MAX_SELECTIONS = 3;

export default function TopicsPage() {
  const router = useRouter();
  const { resumeText, jobTitle, jobInfo, companyName, additionalInfo, setSelectedTopics: setContextTopics, setSessionId, setQuestions } = useInterview();
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [isCreatingSession, setIsCreatingSession] = useState(false);

  const handleTopicToggle = (topicId: string) => {
    if (selectedTopics.includes(topicId)) {
      // Deselect topic
      setSelectedTopics(selectedTopics.filter(id => id !== topicId));
    } else if (selectedTopics.length < MAX_SELECTIONS) {
      // Select topic (only if under limit)
      setSelectedTopics([...selectedTopics, topicId]);
    }
  };

  const handleContinue = async () => {
    if (selectedTopics.length === 0) {
      alert('Please select at least one topic or click "Random Selection"');
      return;
    }

    // Get selected topic titles
    const topicTitles = selectedTopics.map(id => {
      const topic = INTERVIEW_TOPICS.find(t => t.id === id);
      return topic ? topic.title : '';
    }).filter(Boolean);

    // Save topics to context
    setContextTopics(topicTitles);

    // Create interview session with backend
    setIsCreatingSession(true);
    try {
      const sessionData = {
        parsedResumeText: resumeText,
        jobTitle: jobTitle,
        jobInfo: jobInfo,
        companyName: companyName || undefined,
        additionalInfo: additionalInfo || undefined,
        typeOfInterview: 'behavioral' as const,
        behaviouralTopics: topicTitles,
      };

      console.log('Creating interview session:', sessionData);
      
      // Step 1: Create session
      const sessionResponse = await createInterviewSession(sessionData);
      const newSessionId = sessionResponse.sessionId;
      setSessionId(newSessionId);
      
      console.log('Session created successfully:', newSessionId);
      
      // Step 2: Fetch AI-customized questions
      console.log('Fetching interview questions...');
      const questionsResponse = await getInterviewQuestions(newSessionId);
      setQuestions(questionsResponse.questions);
      
      console.log('Questions fetched:', questionsResponse.questions);
      console.log('Selected topics:', topicTitles);
      
      router.push('/waiting-room');
    } catch (error) {
      console.error('Failed to create session:', error);
      alert('Failed to create interview session. Please try again.');
    } finally {
      setIsCreatingSession(false);
    }
  };

  const handleRandomSelection = async () => {
    // Randomly select 3 topics
    const shuffled = [...INTERVIEW_TOPICS].sort(() => 0.5 - Math.random());
    const randomTopics = shuffled.slice(0, MAX_SELECTIONS).map(t => t.id);
    setSelectedTopics(randomTopics);
    
    // Auto-proceed after short delay to show selection
    setTimeout(async () => {
      const topicTitles = randomTopics.map(id => {
        const topic = INTERVIEW_TOPICS.find(t => t.id === id);
        return topic ? topic.title : '';
      }).filter(Boolean);

      setContextTopics(topicTitles);

      // Create session
      setIsCreatingSession(true);
      try {
        const sessionData = {
          parsedResumeText: resumeText,
          jobTitle: jobTitle,
          jobInfo: jobInfo,
          companyName: companyName || undefined,
          additionalInfo: additionalInfo || undefined,
          typeOfInterview: 'behavioral' as const,
          behaviouralTopics: topicTitles,
        };

        // Step 1: Create session
        const sessionResponse = await createInterviewSession(sessionData);
        const newSessionId = sessionResponse.sessionId;
        setSessionId(newSessionId);
        
        // Step 2: Fetch questions
        const questionsResponse = await getInterviewQuestions(newSessionId);
        setQuestions(questionsResponse.questions);
        
        console.log('Randomly selected topics:', topicTitles);
        console.log('Session created:', newSessionId);
        console.log('Questions fetched:', questionsResponse.questions);
        
        router.push('/waiting-room');
      } catch (error) {
        console.error('Failed to create session:', error);
        alert('Failed to create interview session. Please try again.');
        setIsCreatingSession(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Header />
      <div className="container mx-auto max-w-6xl py-12 px-4">
        {/* Page Title */}
        <div className="mb-12 text-center">
          <Link href="/upload" className="text-indigo-600 dark:text-indigo-400 hover:underline mb-4 inline-block">
            ← Back
          </Link>
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Select Your Interview Topics
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
            Choose up to {MAX_SELECTIONS} behavioral interview topics
          </p>
          <p className="text-lg text-gray-500 dark:text-gray-400">
            {selectedTopics.length} / {MAX_SELECTIONS} selected
          </p>
        </div>

        {/* Topic Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {INTERVIEW_TOPICS.map((topic) => {
            const isSelected = selectedTopics.includes(topic.id);
            const isDisabled = !isSelected && selectedTopics.length >= MAX_SELECTIONS;

            return (
              <button
                key={topic.id}
                onClick={() => handleTopicToggle(topic.id)}
                disabled={isDisabled}
                className={`
                  relative p-6 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105
                  ${isSelected
                    ? 'bg-indigo-600 text-white ring-4 ring-indigo-300 dark:ring-indigo-500'
                    : isDisabled
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-50'
                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:shadow-xl hover:bg-indigo-50 dark:hover:bg-gray-700'
                  }
                `}
              >
                {/* Selection Badge */}
                {isSelected && (
                  <div className="absolute top-3 right-3 bg-white text-indigo-600 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                    ✓
                  </div>
                )}

                {/* Icon */}
                <div className="text-5xl mb-3">{topic.icon}</div>

                {/* Title */}
                <h3 className="text-xl font-bold mb-2">{topic.title}</h3>

                {/* Description */}
                <p className={`text-sm ${isSelected ? 'text-indigo-100' : 'text-gray-600 dark:text-gray-400'}`}>
                  {topic.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={handleRandomSelection}
            className="w-full sm:w-auto px-8 py-4 bg-gray-600 hover:bg-gray-700 text-white text-lg font-semibold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            🎲 Random Selection
          </button>

          <button
            onClick={handleContinue}
            disabled={selectedTopics.length === 0 || isCreatingSession}
            className={`
              w-full sm:w-auto px-12 py-4 text-lg font-semibold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105
              ${selectedTopics.length === 0 || isCreatingSession
                ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }
            `}
          >
            {isCreatingSession ? 'Creating Session...' : 'Continue →'}
          </button>
        </div>

        {/* Hint Text */}
        {selectedTopics.length === MAX_SELECTIONS && (
          <p className="text-center mt-6 text-green-600 dark:text-green-400 font-semibold">
            ✓ Maximum topics selected! Click Continue to proceed.
          </p>
        )}
      </div>
    </div>
  );
}
