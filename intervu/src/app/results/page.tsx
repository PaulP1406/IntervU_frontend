'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import type { FeedbackResponse } from '@/lib/api';

// Mock data - will be replaced with backend response
const MOCK_RESULTS = {
  overallScore: 7.5,
  maxScore: 10,
  hiringProbability: 70, // percentage
  overallSuggestions: [
    "Practice using the STAR method consistently across all answers",
    "Work on reducing filler words and hesitations",
    "Include more quantifiable results and metrics in your examples"
  ],
  strengths: [
    {
      category: "Communication Skills",
      score: 8.5,
      feedback: "Excellent articulation and clarity in responses. You effectively conveyed your thoughts and experiences."
    },
    {
      category: "Problem Solving",
      score: 8.0,
      feedback: "Strong analytical approach. You demonstrated good logical thinking and structured problem-solving methods."
    }
  ],
  areasForImprovement: [
    {
      category: "STAR Method Usage",
      score: 6.5,
      feedback: "While you provided good examples, consistently following the STAR (Situation, Task, Action, Result) framework would make your answers more impactful.",
      suggestions: [
        "Clearly separate each component of STAR in your responses",
        "Spend more time on the 'Result' portion to highlight outcomes",
        "Use specific metrics and numbers when describing results"
      ]
    },
    {
      category: "Confidence & Body Language",
      score: 6.0,
      feedback: "Some hesitation detected in your delivery. Work on maintaining eye contact and reducing filler words.",
      suggestions: [
        "Practice your answers to build confidence",
        "Record yourself to identify and reduce 'um', 'uh', 'like'",
        "Maintain steady eye contact with the camera"
      ]
    },
    {
      category: "Depth of Examples",
      score: 7.0,
      feedback: "Your examples were relevant but could benefit from more specific details and quantifiable results.",
      suggestions: [
        "Include specific numbers, percentages, or timeframes",
        "Describe the impact of your actions on the team/company",
        "Prepare 2-3 detailed stories for each competency"
      ]
    }
  ],
  questionFeedback: [
    {
      questionId: 1,
      question: "Tell me about a time when you had to work with a difficult team member. How did you handle the situation?",
      topic: "Workplace Behavior",
      score: 7.5,
      yourAnswer: "Well, I remember when I worked at my previous company, there was a colleague who was very resistant to change. When we were implementing a new project management system, they refused to use it and kept using the old methods. I scheduled a one-on-one meeting with them to understand their concerns. It turned out they were worried about losing track of their work. I showed them how the new system could actually help them stay more organized, and I offered to help them migrate their data. After that, they became one of the biggest advocates for the new system.",
      strengths: [
        "Good use of specific example from past experience",
        "Showed empathy by understanding the colleague's concerns",
        "Positive outcome with the colleague becoming an advocate"
      ],
      improvements: [
        "Could follow STAR method more clearly - separate Situation, Task, Action, Result",
        "Add specific timeframe (how long did this process take?)",
        "Quantify the impact (how many team members adopted the system after?)"
      ],
      suggestions: [
        "Start with: 'In my previous role at [Company], over a 2-month period...'",
        "Clearly state the task: 'My task was to ensure 100% team adoption...'",
        "End with metrics: 'This resulted in 100% team adoption within 3 weeks'"
      ]
    },
    {
      questionId: 2,
      question: "Describe a situation where you had to make a difficult decision with limited information. What was your approach?",
      topic: "Problem Solving",
      score: 8.0,
      yourAnswer: "At my last job, our main supplier suddenly went out of business right before a major product launch. We had only 3 days to find a replacement. I quickly researched alternative suppliers, created a comparison matrix of price, quality, and delivery time. I consulted with the team leads, and we decided to go with a slightly more expensive supplier that could guarantee delivery on time. The launch went smoothly and we established a good relationship with the new supplier.",
      strengths: [
        "Clear problem statement with urgency (3 days deadline)",
        "Demonstrated systematic approach (comparison matrix)",
        "Good decision-making process involving team consultation",
        "Positive outcome mentioned"
      ],
      improvements: [
        "Could mention the quantity/scale of the decision impact",
        "Add more detail about the comparison criteria used",
        "Explain what you learned from this experience"
      ],
      suggestions: [
        "Mention dollar amounts or scale: 'This affected a $500K product launch...'",
        "Add learning: 'This taught me the importance of supplier diversification'",
        "Include follow-up action: 'I implemented a backup supplier policy'"
      ]
    },
    {
      questionId: 3,
      question: "Can you share an example of when you had to adapt to a significant change at work? How did you manage it?",
      topic: "Adaptability",
      score: 7.0,
      yourAnswer: "When COVID hit, our entire company went remote overnight. I had to adapt quickly from working in an office to working from home. I set up a dedicated workspace, established a routine, and learned to use new collaboration tools like Zoom and Slack. I also made sure to over-communicate with my team since we couldn't just talk at our desks anymore. It was challenging at first, but I actually became more productive.",
      strengths: [
        "Relatable and significant change example",
        "Showed proactive approach (setting up workspace, learning tools)",
        "Demonstrated awareness of team communication needs"
      ],
      improvements: [
        "This is a common answer - try to make it more unique to you",
        "Missing specific results and metrics",
        "Could explain challenges in more detail"
      ],
      suggestions: [
        "Add unique details: 'I created a virtual coffee chat schedule for team bonding'",
        "Quantify productivity: 'My project completion rate increased by 20%'",
        "Share a specific challenge you overcame beyond the basics"
      ]
    },
    {
      questionId: 4,
      question: "Tell me about a time when you took initiative on a project. What motivated you and what was the outcome?",
      topic: "Leadership",
      score: 7.5,
      yourAnswer: "I noticed that our team was spending a lot of time on repetitive data entry tasks. Even though it wasn't part of my job description, I learned Python and created a script to automate the process. I motivated myself because I saw how frustrated the team was and I knew there was a better way. After implementing the script, we saved about 10 hours per week across the team. My manager was impressed and I got to present this at our monthly all-hands meeting.",
      strengths: [
        "Excellent proactive behavior (learning new skill)",
        "Clear motivation explained (team frustration)",
        "Quantified result (10 hours saved per week)",
        "Recognition received (all-hands presentation)"
      ],
      improvements: [
        "Could expand on the implementation process and challenges",
        "Mention how you got buy-in from the team",
        "Add what happened after (was this adopted company-wide?)"
      ],
      suggestions: [
        "Add: 'I first tested with one team member to gather feedback'",
        "Mention scale: 'This was later rolled out to 5 other teams, saving 50+ hours/week'",
        "Include skills gained: 'This motivated me to pursue more automation projects'"
      ]
    },
    {
      questionId: 5,
      question: "Describe a situation where you received critical feedback. How did you respond and what did you learn?",
      topic: "Learning & Growth",
      score: 8.0,
      yourAnswer: "In my first quarter review, my manager told me that my presentations lacked structure and were hard to follow. Initially, I was disappointed because I thought I was doing well. But I asked for specific examples and advice. She suggested I use a framework like the pyramid principle. I took an online course on presentation skills, practiced with colleagues, and asked for feedback. By the next quarter, my manager noted significant improvement and I even trained new hires on effective presentations.",
      strengths: [
        "Showed emotional maturity (acknowledged initial disappointment)",
        "Proactive response (asked for examples, took course)",
        "Demonstrated continuous improvement",
        "Great outcome (became a trainer) - shows mastery"
      ],
      improvements: [
        "Could mention specific frameworks or techniques learned",
        "Add how many presentations you gave to practice"
      ],
      suggestions: [
        "Name the framework: 'I learned to use the Situation-Complication-Resolution format'",
        "Quantify practice: 'I delivered 15 practice presentations to colleagues over 2 months'",
        "This is one of your strongest answers - use this as a template for others!"
      ]
    }
  ]
};

export default function ResultsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'detailed'>('overview');
  const [expandedQuestions, setExpandedQuestions] = useState<number[]>([]);
  const [feedbackData, setFeedbackData] = useState<FeedbackResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load feedback from localStorage
    const storedFeedback = localStorage.getItem('interviewFeedback');
    if (storedFeedback) {
      try {
        const feedback = JSON.parse(storedFeedback);
        setFeedbackData(feedback);
        console.log('Loaded feedback:', feedback);
      } catch (error) {
        console.error('Failed to parse feedback:', error);
      }
    }
    setIsLoading(false);
  }, []);

  const toggleQuestion = (questionId: number) => {
    setExpandedQuestions(prev => 
      prev.includes(questionId) 
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  // Use backend data if available, otherwise fallback to mock
  const results = feedbackData || null;

  // Calculate hiring probability category based on hireAbilityScore
  const hiringProbability = results?.hireAbilityScore || MOCK_RESULTS.hiringProbability;
  const overallScore = results ? results.hireAbilityScore / 10 : MOCK_RESULTS.overallScore;
  const maxScore = 10;
  
  const getHiringCategory = (probability: number) => {
    if (probability >= 70) return { text: "High Chance", color: "text-green-400", bgColor: "bg-green-600" };
    if (probability >= 40) return { text: "Moderate Chance", color: "text-yellow-400", bgColor: "bg-yellow-600" };
    return { text: "Low Chance", color: "text-red-400", bgColor: "bg-red-600" };
  };

  const hiringCategory = getHiringCategory(hiringProbability);

  // Score color coding
  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-400";
    if (score >= 6) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreBg = (score: number) => {
    if (score >= 8) return "bg-green-600";
    if (score >= 6) return "bg-yellow-600";
    return "bg-red-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">
            Interview Complete! 🎉
          </h1>
          <p className="text-gray-400">
            {isLoading ? 'Loading your results...' : 'Here\'s your performance analysis and insights'}
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            <p className="text-gray-400 mt-4">Analyzing your responses...</p>
          </div>
        ) : (
          <>
            {/* Overall Score Card */}
            <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-2xl p-8 shadow-xl border border-indigo-500/50 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left: Overall Score */}
                <div className="text-center">
                  <h2 className="text-gray-300 text-lg mb-4">Overall Score</h2>
                  <div className="relative w-48 h-48 mx-auto">
                    {/* Circular progress */}
                    <svg className="w-48 h-48 transform -rotate-90">
                      <circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="12"
                        fill="none"
                      />
                      <circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke="url(#gradient)"
                        strokeWidth="12"
                        fill="none"
                        strokeDasharray={`${(overallScore / maxScore) * 553} 553`}
                        strokeLinecap="round"
                        className="transition-all duration-1000"
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#818CF8" />
                          <stop offset="100%" stopColor="#C084FC" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-5xl font-bold text-white">
                        {overallScore.toFixed(1)}
                      </span>
                      <span className="text-gray-300 text-lg">/ {maxScore}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Hiring Probability */}
                <div className="flex flex-col justify-center">
                  <h2 className="text-gray-300 text-lg mb-4 text-center">
                    Would You Get Hired?
                  </h2>
                  
                  {/* Probability Graph */}
                  <div className="mb-6">
                    <div className="relative h-32 bg-gray-800/50 rounded-lg p-4">
                      {/* Bell curve visualization */}
                      <div className="absolute inset-0 flex items-end justify-center px-4 pb-4">
                        <div className="w-full h-24 relative">
                          {/* Red zone (0-39%) */}
                          <div className="absolute left-0 bottom-0 w-[30%] h-full bg-gradient-to-t from-red-600/30 to-transparent rounded-l-lg border-l-2 border-b-2 border-red-600/50"></div>
                          
                          {/* Yellow zone (40-69%) */}
                          <div className="absolute left-[30%] bottom-0 w-[40%] h-full bg-gradient-to-t from-yellow-600/30 to-transparent border-b-2 border-yellow-600/50"></div>
                          
                          {/* Green zone (70-100%) */}
                          <div className="absolute right-0 bottom-0 w-[30%] h-full bg-gradient-to-t from-green-600/30 to-transparent rounded-r-lg border-r-2 border-b-2 border-green-600/50"></div>
                          
                          {/* Indicator */}
                          <div 
                            className="absolute bottom-0 transform -translate-x-1/2 transition-all duration-1000"
                            style={{ left: `${hiringProbability}%` }}
                          >
                            <div className="flex flex-col items-center">
                              <div className={`w-3 h-3 rounded-full ${hiringCategory.bgColor} animate-pulse mb-1`}></div>
                              <div className="w-0.5 h-20 bg-white"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Labels */}
                    <div className="flex justify-between text-xs text-gray-400 mt-2 px-2">
                      <span>30% says NO</span>
                      <span className={`font-bold ${hiringCategory.color}`}>
                        {hiringProbability}%
                      </span>
                      <span>70% says YES</span>
                    </div>
                  </div>

                  <div className="text-center">
                    <div className={`inline-flex items-center gap-2 px-6 py-3 ${hiringCategory.bgColor} rounded-full`}>
                      <span className="text-white font-bold text-lg">
                        {hiringCategory.text}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors ${
              activeTab === 'overview'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            📊 Overview
          </button>
          <button
            onClick={() => setActiveTab('detailed')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors ${
              activeTab === 'detailed'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            📝 Detailed Feedback
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Overall Performance Summary */}
            <div className="bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">�</span>
                Performance Summary
              </h3>
              <div className="space-y-4">
                {results ? (
                  results.interviewQuestionFeedback.map((qf, index) => (
                    <div key={index} className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="text-white font-semibold flex-1">Question {index + 1}</h4>
                        <span className={`text-xl font-bold ${getScoreColor(qf.score)} ml-2`}>
                          {qf.score}/10
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm mb-3 italic">"{qf.question}"</p>
                      
                      {/* Strengths */}
                      <div className="mb-3">
                        <h5 className="text-green-400 font-semibold text-sm mb-2">✅ Strengths:</h5>
                        {qf.strengths.length > 0 && qf.strengths[0] !== "No strengths demonstrated - the response was inappropriate." ? (
                          <ul className="space-y-1">
                            {qf.strengths.map((strength, idx) => (
                              <li key={idx} className="text-gray-300 text-sm flex items-start gap-2">
                                <span className="text-green-400 mt-1">•</span>
                                <span>{strength}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-500 text-sm italic">No strengths identified for this response.</p>
                        )}
                      </div>
                      
                      {/* Areas for Improvement */}
                      <div>
                        <h5 className="text-yellow-400 font-semibold text-sm mb-2">💡 Areas to Improve:</h5>
                        {qf.areasForImprovement.length > 0 ? (
                          <ul className="space-y-1">
                            {qf.areasForImprovement.map((improvement, idx) => (
                              <li key={idx} className="text-gray-300 text-sm flex items-start gap-2">
                                <span className="text-yellow-400 mt-1">•</span>
                                <span>{improvement}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-500 text-sm italic">No areas for improvement identified.</p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  MOCK_RESULTS.strengths.map((strength, index) => (
                    <div key={index} className="bg-gray-900 rounded-lg p-4 border border-green-500/30">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-semibold">{strength.category}</h4>
                        <span className={`text-xl font-bold ${getScoreColor(strength.score)}`}>
                          {strength.score}/10
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm">{strength.feedback}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Key Takeaways */}
            <div className="bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">🎯</span>
                Key Takeaways
              </h3>
              <div className="space-y-3">
                <div className="bg-indigo-900/20 border border-indigo-700/30 rounded-lg p-4">
                  <p className="text-gray-300">
                    {results ? (
                      hiringProbability >= 70 ? (
                        "Strong performance! Continue practicing with the STAR method and focus on providing specific examples with measurable outcomes."
                      ) : hiringProbability >= 40 ? (
                        "Good foundation. Work on structuring your answers more clearly and providing specific, quantifiable results from your experiences."
                      ) : (
                        "Focus on providing professional, relevant responses using the STAR method. Practice with specific examples from your experience and avoid unprofessional language."
                      )
                    ) : (
                      "Practice using the STAR method consistently across all answers and work on reducing filler words."
                    )}
                  </p>
                </div>
                {!results && MOCK_RESULTS.areasForImprovement.slice(0, 3).map((area, index) => (
                  <div key={index} className="flex items-start gap-3 text-gray-300">
                    <span className="text-indigo-400 font-bold mt-1">{index + 1}.</span>
                    <span>{area.suggestions[0]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Detailed Tab */}
        {activeTab === 'detailed' && (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-2">Question-by-Question Review</h3>
              <p className="text-gray-400 text-sm mb-6">
                Click on each question to see detailed score and feedback
              </p>
              
              <div className="space-y-4">
                {(results ? results.interviewQuestionFeedback : MOCK_RESULTS.questionFeedback).map((item, index) => {
                  const isExpanded = expandedQuestions.includes(index + 1);
                  const questionId = index + 1;
                  const score = item.score;
                  const question = item.question;
                  const topic = results ? "Interview Question" : (item as any).topic;
                  const strengths = item.strengths;
                  const improvements = results ? (item as any).areasForImprovement : (item as any).improvements;
                  const hasAnswer = !results && (item as any).yourAnswer;
                  
                  return (
                    <div key={questionId} className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
                      {/* Question Header - Clickable */}
                      <button
                        onClick={() => toggleQuestion(questionId)}
                        className="w-full p-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors"
                      >
                        <div className="flex items-center gap-4 flex-1 text-left">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${getScoreBg(score)}`}>
                            <span className="text-white font-bold">{score}</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-semibold text-indigo-400 uppercase">
                                Question {questionId} • {topic}
                              </span>
                            </div>
                            <h4 className="text-white font-semibold line-clamp-2">{question}</h4>
                          </div>
                        </div>
                        <div className="ml-4">
                          <svg 
                            className={`w-6 h-6 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </button>

                      {/* Expanded Content */}
                      {isExpanded && (
                        <div className="border-t border-gray-700 p-6 space-y-6">
                          {/* Your Answer - Only show if we have it (mock data) */}
                          {hasAnswer && (
                            <div>
                              <h5 className="text-white font-semibold mb-3 flex items-center gap-2">
                                <span className="text-lg">💬</span>
                                Your Answer
                              </h5>
                              <div className="bg-gray-800 rounded-lg p-4 border-l-4 border-indigo-600">
                                <p className="text-gray-300 leading-relaxed italic">
                                  "{(item as any).yourAnswer}"
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Score Breakdown */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Strengths */}
                            <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-4">
                              <h5 className="text-green-400 font-semibold mb-3 flex items-center gap-2">
                                <span>✅</span>
                                What You Did Well
                              </h5>
                              {strengths.length > 0 && strengths[0] !== "No strengths demonstrated - the response was inappropriate." ? (
                                <ul className="space-y-2">
                                  {strengths.map((strength: string, idx: number) => (
                                    <li key={idx} className="text-gray-300 text-sm flex items-start gap-2">
                                      <span className="text-green-400 mt-1">•</span>
                                      <span>{strength}</span>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-gray-500 text-sm italic">No strengths identified for this response.</p>
                              )}
                            </div>

                            {/* Areas for Improvement */}
                            <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-lg p-4">
                              <h5 className="text-yellow-400 font-semibold mb-3 flex items-center gap-2">
                                <span>💡</span>
                                Areas to Improve
                              </h5>
                              {improvements.length > 0 ? (
                                <ul className="space-y-2">
                                  {improvements.map((improvement: string, idx: number) => (
                                    <li key={idx} className="text-gray-300 text-sm flex items-start gap-2">
                                      <span className="text-yellow-400 mt-1">•</span>
                                      <span>{improvement}</span>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-gray-500 text-sm italic">No areas for improvement identified.</p>
                              )}
                            </div>
                          </div>

                          {/* Suggestions - Only show if we have them (mock data) */}
                          {!results && (item as any).suggestions && (item as any).suggestions.length > 0 && (
                            <div className="bg-indigo-900/20 border border-indigo-700/30 rounded-lg p-4">
                              <h5 className="text-indigo-400 font-semibold mb-3 flex items-center gap-2">
                                <span>🎯</span>
                                How to Improve This Answer
                              </h5>
                              <ul className="space-y-2">
                                {(item as any).suggestions.map((suggestion: string, idx: number) => (
                                  <li key={idx} className="text-gray-300 text-sm flex items-start gap-2">
                                    <span className="text-indigo-400 mt-1">→</span>
                                    <span>{suggestion}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Overall Summary at Bottom */}
            <div className="bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span>📋</span>
                Overall Summary
              </h3>
              {results ? (
                <div className="space-y-4">
                  <div className="bg-gray-900 rounded-lg p-4">
                    <p className="text-gray-300 mb-2">
                      <span className="font-semibold text-white">Overall Score: </span>
                      <span className={`text-xl font-bold ${getScoreColor(overallScore)}`}>
                        {overallScore.toFixed(1)}/10
                      </span>
                    </p>
                    <p className="text-gray-300">
                      <span className="font-semibold text-white">Hiring Probability: </span>
                      <span className={`font-bold ${hiringCategory.color}`}>
                        {hiringProbability}% - {hiringCategory.text}
                      </span>
                    </p>
                  </div>
                  <p className="text-gray-400">
                    Review the feedback for each question above to understand your performance and areas for improvement.
                  </p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {MOCK_RESULTS.overallSuggestions.map((suggestion, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-300">
                      <span className="text-indigo-400 font-bold mt-1">{idx + 1}.</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.push('/upload')}
            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            🔄 Try Another Interview
          </button>
          <button
            onClick={() => {
              // TODO: Implement download/share functionality
              console.log('Download report');
            }}
            className="px-8 py-4 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            📥 Download Report
          </button>
          <button
            onClick={() => router.push('/')}
            className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
          >
            🏠 Back to Home
          </button>
        </div>
          </>
        )}
      </div>
    </div>
  );
}
