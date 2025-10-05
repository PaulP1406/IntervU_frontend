'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import type { FeedbackResponse } from '@/lib/api';
import { useInterview } from '@/context/InterviewContext';

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
  const { transcripts } = useInterview();
  const [activeTab, setActiveTab] = useState<'overview' | 'detailed'>('overview');
  const [expandedQuestions, setExpandedQuestions] = useState<number[]>([]);
  const [feedbackData, setFeedbackData] = useState<FeedbackResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Protect route - redirect to upload if no feedback data
    const storedFeedback = localStorage.getItem('interviewFeedback');
    if (!storedFeedback) {
      console.log('No interview feedback found, redirecting to upload...');
      router.push('/upload');
      return;
    }
    
    // Load feedback from localStorage
    try {
      const feedback = JSON.parse(storedFeedback);
      setFeedbackData(feedback);
      console.log('Loaded feedback:', feedback);
      console.log('hireAbilityScore:', feedback.hireAbilityScore);
      console.log('overallFeedback:', feedback.overallFeedback);
    } catch (error) {
      console.error('Failed to parse feedback:', error);
      router.push('/upload');
    }
    setIsLoading(false);
  }, [router]);

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
  const hiringProbability = results?.hireAbilityScore ?? MOCK_RESULTS.hiringProbability;
  const overallScore = results ? (results.hireAbilityScore / 10) : MOCK_RESULTS.overallScore;
  const maxScore = 10;
  
  console.log('Results:', results);
  console.log('hiringProbability:', hiringProbability);
  console.log('overallScore:', overallScore);
  
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
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <header className="px-8 py-6 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">IntervU</h1>
          <span className="text-2xl">🦝</span>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Title Section */}
        <div className="mb-12 text-center">
          <h1 className="text-6xl font-bold text-white mb-4">
            Interview Complete! 🎉
          </h1>
          <p className="text-xl text-slate-300">
            {isLoading ? 'Loading your results...' : 'Here\'s your performance analysis and insights'}
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
            <p className="text-slate-300 text-lg mt-6">Analyzing your responses...</p>
          </div>
        ) : (
          <>
            {/* Overall Score Card */}
            <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-3xl p-10 shadow-2xl border border-slate-700 mb-12 backdrop-blur-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Left: Overall Score */}
                <div className="text-center">
                  <h2 className="text-slate-300 text-xl mb-6 font-semibold">Overall Score</h2>
                  <div className="relative w-56 h-56 mx-auto">
                    {/* Circular progress */}
                    <svg className="w-56 h-56 transform -rotate-90">
                      <circle
                        cx="112"
                        cy="112"
                        r="100"
                        stroke="rgba(148, 163, 184, 0.2)"
                        strokeWidth="14"
                        fill="none"
                      />
                      <circle
                        cx="112"
                        cy="112"
                        r="100"
                        stroke="url(#gradient)"
                        strokeWidth="14"
                        fill="none"
                        strokeDasharray={`${(overallScore / maxScore) * 628} 628`}
                        strokeLinecap="round"
                        className="transition-all duration-1000"
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#3B82F6" />
                          <stop offset="100%" stopColor="#8B5CF6" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-6xl font-bold text-white">
                        {overallScore.toFixed(1)}
                      </span>
                      <span className="text-slate-400 text-lg">out of {maxScore}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Hiring Probability */}
                <div className="flex flex-col justify-center">
                  <h2 className="text-slate-300 text-xl mb-6 font-semibold">Hiring Probability</h2>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-3">
                        <span className="text-white font-semibold text-3xl">{hiringProbability}%</span>
                        <span className={`font-bold text-xl ${hiringCategory.color}`}>
                          {hiringCategory.text}
                        </span>
                      </div>
                      <div className="w-full bg-slate-700/50 rounded-full h-5 overflow-hidden">
                        <div
                          className={`h-5 rounded-full transition-all duration-1000 ${
                            hiringProbability >= 75
                              ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                              : hiringProbability >= 50
                              ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                              : 'bg-gradient-to-r from-red-500 to-rose-600'
                          }`}
                          style={{ width: `${hiringProbability}%` }}
                        ></div>
                      </div>
                    </div>
                    <p className="text-slate-300 leading-relaxed text-lg">
                      Based on your interview performance, communication skills, and answer quality.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-4 px-8 rounded-[32px] font-semibold text-lg transition-all duration-200 ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            📊 Overview
          </button>
          <button
            onClick={() => setActiveTab('detailed')}
            className={`flex-1 py-4 px-8 rounded-[32px] font-semibold text-lg transition-all duration-200 ${
              activeTab === 'detailed'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            📝 Detailed Feedback
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">         

            {/* Key Takeaways */}
            <div className="bg-slate-800/30 rounded-3xl p-8 shadow-2xl border border-slate-700 backdrop-blur-sm">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="text-3xl">🎯</span>
                Key Takeaways
              </h3>
              <div className="space-y-4">
                {results && results.overallFeedback && results.overallFeedback.length > 0 ? (
                  results.overallFeedback.map((feedback, index) => (
                    <div key={index} className="bg-blue-900/20 border border-blue-700/40 rounded-xl p-5 backdrop-blur-sm">
                      <div className="flex items-start gap-4 text-slate-300">
                        <span className="text-blue-400 font-bold text-xl mt-1">{index + 1}.</span>
                        <p className="text-base leading-relaxed">{feedback}</p>
                      </div>
                    </div>
                  ))
                ) : results ? (
                  <div className="bg-blue-900/20 border border-blue-700/40 rounded-xl p-5 backdrop-blur-sm">
                    <p className="text-slate-300 text-base leading-relaxed">
                      {hiringProbability >= 70 ? (
                        "Strong performance! Continue practicing with the STAR method and focus on providing specific examples with measurable outcomes."
                      ) : hiringProbability >= 40 ? (
                        "Good foundation. Work on structuring your answers more clearly and providing specific, quantifiable results from your experiences."
                      ) : (
                        "Focus on providing professional, relevant responses using the STAR method. Practice with specific examples from your experience and avoid unprofessional language."
                      )}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="bg-blue-900/20 border border-blue-700/40 rounded-xl p-5 backdrop-blur-sm">
                      <p className="text-slate-300 text-base leading-relaxed">
                        Practice using the STAR method consistently across all answers and work on reducing filler words.
                      </p>
                    </div>
                    {MOCK_RESULTS.areasForImprovement.slice(0, 3).map((area, index) => (
                      <div key={index} className="flex items-start gap-4 text-slate-300">
                        <span className="text-blue-400 font-bold text-xl mt-1">{index + 1}.</span>
                        <span className="text-base">{area.suggestions[0]}</span>
                      </div>
                    ))}
                  </>
                )}
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
                    <div key={questionId} className="bg-slate-800/30 rounded-2xl border border-slate-700 overflow-hidden backdrop-blur-sm hover:border-slate-600 transition-all">
                      {/* Question Header - Clickable */}
                      <button
                        onClick={() => toggleQuestion(questionId)}
                        className="w-full p-6 flex items-center justify-between hover:bg-slate-800/50 transition-colors"
                      >
                        <div className="flex items-center gap-4 flex-1 text-left">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${getScoreBg(score)}`}>
                            <span className="text-white font-bold">{score}</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs font-semibold text-blue-400 uppercase tracking-wide">
                                Question {questionId} • {topic}
                              </span>
                            </div>
                            <h4 className="text-white font-semibold text-lg">{question}</h4>
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
                        <div className="border-t border-slate-700 p-6 space-y-6 bg-[#0a0a0f]/50">
                          {/* You Said - Show transcribed answer from context */}
                          {(results || hasAnswer) && (
                            <div>
                              <h5 className="text-white font-semibold mb-3 flex items-center gap-2 text-lg">
                                <span className="text-xl">💬</span>
                                You Said
                              </h5>
                              <div className="bg-slate-800/50 rounded-xl p-5 border-l-4 border-blue-600">
                                <p className="text-slate-300 leading-relaxed italic text-base">
                                  "{transcripts[index]?.answer || (item as any).yourAnswer || 'No answer recorded'}"
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Score Breakdown */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Strengths */}
                            <div className="bg-green-900/20 border border-green-700/40 rounded-xl p-5 backdrop-blur-sm">
                              <h5 className="text-green-400 font-semibold mb-4 flex items-center gap-2 text-lg">
                                <span>✅</span>
                                What You Did Well
                              </h5>
                              {strengths.length > 0 && strengths[0] !== "No strengths demonstrated - the response was inappropriate." ? (
                                <ul className="space-y-3">
                                  {strengths.map((strength: string, idx: number) => (
                                    <li key={idx} className="text-slate-300 text-sm flex items-start gap-3">
                                      <span className="text-green-400 mt-1 text-base">•</span>
                                      <span>{strength}</span>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-slate-500 text-sm italic">No strengths identified for this response.</p>
                              )}
                            </div>

                            {/* Areas for Improvement */}
                            <div className="bg-yellow-900/20 border border-yellow-700/40 rounded-xl p-5 backdrop-blur-sm">
                              <h5 className="text-yellow-400 font-semibold mb-4 flex items-center gap-2 text-lg">
                                <span>💡</span>
                                Areas to Improve
                              </h5>
                              {improvements.length > 0 ? (
                                <ul className="space-y-3">
                                  {improvements.map((improvement: string, idx: number) => (
                                    <li key={idx} className="text-slate-300 text-sm flex items-start gap-3">
                                      <span className="text-yellow-400 mt-1 text-base">•</span>
                                      <span>{improvement}</span>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-slate-500 text-sm italic">No areas for improvement identified.</p>
                              )}
                            </div>
                          </div>

                          {/* Suggestions - Only show if we have them (mock data) */}
                          {!results && (item as any).suggestions && (item as any).suggestions.length > 0 && (
                            <div className="bg-blue-900/20 border border-blue-700/40 rounded-xl p-5 backdrop-blur-sm">
                              <h5 className="text-blue-400 font-semibold mb-4 flex items-center gap-2 text-lg">
                                <span>🎯</span>
                                How to Improve This Answer
                              </h5>
                              <ul className="space-y-3">
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
            <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center">
          <button
            onClick={() => router.push('/technical')}
            className="px-10 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold text-lg rounded-[32px] transition-all duration-200 shadow-lg shadow-green-600/30 hover:shadow-green-600/50 flex items-center justify-center gap-2"
          >
            💻 Start Technical Interview
          </button>
          <button
            onClick={() => router.push('/upload')}
            className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg rounded-[32px] transition-all duration-200 shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 flex items-center justify-center gap-2"
          >
            🔄 Try Another Interview
          </button>
          <button
            onClick={() => router.push('/')}
            className="px-10 py-4 bg-slate-700 hover:bg-slate-600 text-white font-semibold text-lg rounded-[32px] transition-all duration-200"
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
