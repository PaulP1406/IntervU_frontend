'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';

interface TechnicalFeedback {
    sessionId: string;
    hireAbilityScore: number;
    suggestions: string[];
    strengths: string[];
    questionTitle: string;
    difficulty: string;
    timeTaken: number;
    hintsUsed: number;
    code: string;
    language: string;
    isCompleted?: boolean;
}

export default function TechnicalResultsPage() {
    const router = useRouter();
    const [feedback, setFeedback] = useState<TechnicalFeedback | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedFeedback = localStorage.getItem('technicalFeedback');
        if (storedFeedback) {
            setFeedback(JSON.parse(storedFeedback));
        } else {
            // No feedback found, redirect to home
            // router.push('/');
        }
        setIsLoading(false);
    }, [router]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-400';
        if (score >= 60) return 'text-yellow-400';
        return 'text-red-400';
    };

    const getScoreLabel = (score: number) => {
        if (score >= 80) return 'Excellent';
        if (score >= 60) return 'Good';
        return 'Needs Improvement';
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent mb-4"></div>
                    <p className="text-white text-lg">Analyzing your coding performance...</p>
                </div>
            </div>
        );
    }

    if (!feedback) {
        return null;
    }

    return (
        <div className="min-h-screen bg-[#0a0a0f] pt-24">
            <Header />
            
            <div className="py-12 px-8 relative">
                {/* Left Leaves */}
                <img 
                    src="/leavesLeft.svg"
                    alt="Decorative leaves"
                    className="absolute left-0 top-0 h-auto pointer-events-none"
                    style={{ width: '15%' }}
                />
                
                {/* Right Leaves */}
                <img 
                    src="/leavesRight.svg"
                    alt="Decorative leaves"
                    className="absolute right-0 top-0 h-auto pointer-events-none"
                    style={{ width: '15%' }}
                />
                
                <div className="max-w-6xl mx-auto relative z-10">
                    {/* Header */}
                    <div className="mb-8 text-center">
                        <h1 className="text-4xl font-bold text-white mb-2">
                            Technical Interview Complete!
                        </h1>
                        <p className="text-xl text-slate-300">
                            Here's your performance analysis and insights
                        </p>
                    </div>

                    {/* Overall Score Card */}
                    <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-3xl p-10 shadow-2xl border border-slate-700 mb-6 backdrop-blur-sm">
                        <div className="text-center">
                            <h2 className="text-slate-300 text-xl mb-6 font-semibold">Hireability Score</h2>
                            <div className="relative w-56 h-56 mx-auto mb-6">
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
                                        strokeDasharray={`${(feedback.hireAbilityScore / 100) * 628} 628`}
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
                                        {feedback.hireAbilityScore}
                                    </span>
                                    <span className="text-slate-400 text-lg">out of 100</span>
                                </div>
                            </div>
                            <div className="text-2xl font-bold text-slate-300">
                                {getScoreLabel(feedback.hireAbilityScore)}
                            </div>
                        </div>
                    </div>

                    {/* Performance Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-slate-800/30 backdrop-blur-sm rounded-3xl p-6 border border-slate-700 shadow-xl">
                            <h3 className="text-lg font-semibold text-slate-300 mb-2">Time Taken</h3>
                            <p className="text-3xl font-bold text-white">{formatTime(feedback.timeTaken)}</p>
                        </div>
                        <div className="bg-slate-800/30 backdrop-blur-sm rounded-3xl p-6 border border-slate-700 shadow-xl">
                            <h3 className="text-lg font-semibold text-slate-300 mb-2">Hints Used</h3>
                            <p className="text-3xl font-bold text-white">{feedback.hintsUsed}</p>
                        </div>
                        <div className="bg-slate-800/30 backdrop-blur-sm rounded-3xl p-6 border border-slate-700 shadow-xl">
                            <h3 className="text-lg font-semibold text-slate-300 mb-2">Difficulty</h3>
                            <p className="text-3xl font-bold text-white capitalize">{feedback.difficulty}</p>
                        </div>
                    </div>

                    {/* Question Info - Only show if completed */}
                    {feedback.isCompleted && (
                        <div className="bg-slate-800/30 backdrop-blur-sm rounded-3xl p-8 mb-8 border border-slate-700 shadow-2xl">
                            <h2 className="text-2xl font-bold text-white mb-6">Problem Solved</h2>
                            <p className="text-xl text-slate-300 mb-4">{feedback.questionTitle}</p>
                            <span className="inline-block px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-semibold">
                                {feedback.language}
                            </span>
                        </div>
                    )}

                    {/* Strengths */}
                    <div className="bg-slate-800/30 backdrop-blur-sm rounded-3xl p-8 mb-8 border border-slate-700 shadow-2xl">
                        <h2 className="text-2xl font-bold text-white mb-6">Your Strengths</h2>
                        <div className="space-y-4">
                            {feedback.strengths.map((strength, index) => (
                                <div
                                    key={index}
                                    className="bg-green-900/20 border border-green-700/40 rounded-xl p-5 backdrop-blur-sm"
                                >
                                    <div className="flex items-start gap-3">
                                        <span className="text-green-400 mt-1 text-base">•</span>
                                        <p className="text-slate-300 leading-relaxed">{strength}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Suggestions for Improvement */}
                    <div className="bg-slate-800/30 backdrop-blur-sm rounded-3xl p-8 mb-8 border border-slate-700 shadow-2xl">
                        <h2 className="text-2xl font-bold text-white mb-6">Areas for Improvement</h2>
                        <div className="space-y-4">
                            {feedback.suggestions.map((suggestion, index) => (
                                <div
                                    key={index}
                                    className="bg-blue-900/20 border border-blue-700/40 rounded-xl p-5 backdrop-blur-sm"
                                >
                                    <div className="flex items-start gap-3">
                                        <span className="text-blue-400 mt-1 text-base">•</span>
                                        <p className="text-slate-300 leading-relaxed">{suggestion}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center">
                        <button
                            onClick={() => router.push('/')}
                            className="px-10 py-4 bg-slate-700 hover:bg-slate-600 text-white font-semibold text-lg rounded-[32px] transition-all duration-200"
                        >
                            Back to Home
                        </button>
                        <button
                            onClick={() => router.push('/interview')}
                            className="px-10 py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-lg rounded-[32px] transition-all duration-200 shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50 flex items-center justify-center gap-2"
                        >
                            Start Behavioral Interview
                        </button>
                        <button
                            onClick={() => {
                                localStorage.removeItem('technicalFeedback');
                                router.push('/technical');
                            }}
                            className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg rounded-[32px] transition-all duration-200 shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 flex items-center justify-center gap-2"
                        >
                            Try Another Question
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
