'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

// Mock data - will be replaced with backend response
const MOCK_RESULTS = {
  overallScore: 7.5,
  maxScore: 10,
  hiringProbability: 70, // percentage
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
  questionScores: [
    { question: "Workplace Behavior", score: 7.5 },
    { question: "Problem Solving", score: 8.0 },
    { question: "Adaptability", score: 7.0 },
    { question: "Leadership", score: 7.5 },
    { question: "Learning & Growth", score: 8.0 }
  ]
};

export default function ResultsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'detailed'>('overview');

  // Calculate hiring probability category
  const getHiringCategory = (probability: number) => {
    if (probability >= 70) return { text: "High Chance", color: "text-green-400", bgColor: "bg-green-600" };
    if (probability >= 40) return { text: "Moderate Chance", color: "text-yellow-400", bgColor: "bg-yellow-600" };
    return { text: "Low Chance", color: "text-red-400", bgColor: "bg-red-600" };
  };

  const hiringCategory = getHiringCategory(MOCK_RESULTS.hiringProbability);

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
            Here's your performance analysis and insights
          </p>
        </div>

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
                    strokeDasharray={`${(MOCK_RESULTS.overallScore / MOCK_RESULTS.maxScore) * 553} 553`}
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
                    {MOCK_RESULTS.overallScore}
                  </span>
                  <span className="text-gray-300 text-lg">/ {MOCK_RESULTS.maxScore}</span>
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
                        style={{ left: `${MOCK_RESULTS.hiringProbability}%` }}
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
                    {MOCK_RESULTS.hiringProbability}%
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
            {/* Strengths */}
            <div className="bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">💪</span>
                Your Strengths
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {MOCK_RESULTS.strengths.map((strength, index) => (
                  <div key={index} className="bg-gray-900 rounded-lg p-4 border border-green-500/30">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-semibold">{strength.category}</h4>
                      <span className={`text-xl font-bold ${getScoreColor(strength.score)}`}>
                        {strength.score}/10
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">{strength.feedback}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Areas for Improvement */}
            <div className="bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">🎯</span>
                Areas for Improvement
              </h3>
              <div className="space-y-4">
                {MOCK_RESULTS.areasForImprovement.map((area, index) => (
                  <div key={index} className="bg-gray-900 rounded-lg p-4 border border-yellow-500/30">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-semibold">{area.category}</h4>
                      <span className={`text-xl font-bold ${getScoreColor(area.score)}`}>
                        {area.score}/10
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mb-3">{area.feedback}</p>
                    <div className="ml-4 space-y-2">
                      {area.suggestions.map((suggestion, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <span className="text-indigo-400 mt-1">•</span>
                          <span className="text-gray-300 text-sm">{suggestion}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Detailed Tab */}
        {activeTab === 'detailed' && (
          <div className="bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-6">Question-by-Question Breakdown</h3>
            <div className="space-y-4">
              {MOCK_RESULTS.questionScores.map((item, index) => (
                <div key={index} className="bg-gray-900 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getScoreBg(item.score)}`}>
                        <span className="text-white font-bold text-sm">{index + 1}</span>
                      </div>
                      <h4 className="text-white font-semibold">{item.question}</h4>
                    </div>
                    <span className={`text-2xl font-bold ${getScoreColor(item.score)}`}>
                      {item.score}/10
                    </span>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-1000 ${
                        item.score >= 8 ? 'bg-green-600' : item.score >= 6 ? 'bg-yellow-600' : 'bg-red-600'
                      }`}
                      style={{ width: `${(item.score / 10) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Average */}
            <div className="mt-6 pt-6 border-t border-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 font-semibold">Average Score</span>
                <span className={`text-3xl font-bold ${getScoreColor(MOCK_RESULTS.overallScore)}`}>
                  {MOCK_RESULTS.overallScore}/10
                </span>
              </div>
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
      </div>
    </div>
  );
}
