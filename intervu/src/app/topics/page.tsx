'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  const handleTopicToggle = (topicId: string) => {
    if (selectedTopics.includes(topicId)) {
      // Deselect topic
      setSelectedTopics(selectedTopics.filter(id => id !== topicId));
    } else if (selectedTopics.length < MAX_SELECTIONS) {
      // Select topic (only if under limit)
      setSelectedTopics([...selectedTopics, topicId]);
    }
  };

  const handleContinue = () => {
    if (selectedTopics.length === 0) {
      alert('Please select at least one topic or click "Random Selection"');
      return;
    }

    // TODO: Store selected topics and navigate to waiting room
    console.log('Selected topics:', selectedTopics);
    router.push('/waiting-room');
  };

  const handleRandomSelection = () => {
    // Randomly select 3 topics
    const shuffled = [...INTERVIEW_TOPICS].sort(() => 0.5 - Math.random());
    const randomTopics = shuffled.slice(0, MAX_SELECTIONS).map(t => t.id);
    setSelectedTopics(randomTopics);
    
    // Auto-proceed after short delay to show selection
    setTimeout(() => {
      console.log('Randomly selected topics:', randomTopics);
      router.push('/waiting-room');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
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
            disabled={selectedTopics.length === 0}
            className={`
              w-full sm:w-auto px-12 py-4 text-lg font-semibold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105
              ${selectedTopics.length === 0
                ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }
            `}
          >
            Continue →
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
