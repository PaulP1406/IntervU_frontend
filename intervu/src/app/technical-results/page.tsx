'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
            router.push('/');
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
                <div className="text-white text-xl">Loading results...</div>
            </div>
        );
    }

    if (!feedback) {
        return null;
    }

    return (
        <div className="min-h-screen bg-[#0a0a0f] py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold text-white mb-4">
                        Technical Interview Results
                    </h1>
                    <p className="text-xl text-slate-400">
                        Here's your performance analysis
                    </p>
                </div>

                {/* Hireability Score Card */}
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-3xl p-8 mb-8 border border-slate-700/50">
                    <div className="text-center">
                        <h2 className="text-2xl font-semibold text-slate-300 mb-4">
                            Hireability Score
                        </h2>
                        <div className={`text-8xl font-bold ${getScoreColor(feedback.hireAbilityScore)} mb-2`}>
                            {feedback.hireAbilityScore}
                        </div>
                        <div className="text-2xl text-slate-400 mb-4">
                            {getScoreLabel(feedback.hireAbilityScore)}
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-4 max-w-md mx-auto">
                            <div
                                className={`h-4 rounded-full transition-all duration-1000 ${
                                    feedback.hireAbilityScore >= 80
                                        ? 'bg-green-500'
                                        : feedback.hireAbilityScore >= 60
                                        ? 'bg-yellow-500'
                                        : 'bg-red-500'
                                }`}
                                style={{ width: `${feedback.hireAbilityScore}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-slate-800/50 backdrop-blur-sm rounded-3xl p-6 border border-slate-700/50">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-3xl">⏱️</span>
                            <h3 className="text-lg font-semibold text-slate-300">Time Taken</h3>
                        </div>
                        <p className="text-3xl font-bold text-white">{formatTime(feedback.timeTaken)}</p>
                    </div>
                    <div className="bg-slate-800/50 backdrop-blur-sm rounded-3xl p-6 border border-slate-700/50">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-3xl">💡</span>
                            <h3 className="text-lg font-semibold text-slate-300">Hints Used</h3>
                        </div>
                        <p className="text-3xl font-bold text-white">{feedback.hintsUsed}</p>
                    </div>
                    <div className="bg-slate-800/50 backdrop-blur-sm rounded-3xl p-6 border border-slate-700/50">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-3xl">🎯</span>
                            <h3 className="text-lg font-semibold text-slate-300">Difficulty</h3>
                        </div>
                        <p className="text-3xl font-bold text-white">{feedback.difficulty}</p>
                    </div>
                </div>

                {/* Question Info */}
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-3xl p-8 mb-8 border border-slate-700/50">
                    <h2 className="text-2xl font-semibold text-white mb-4">Problem Solved</h2>
                    <p className="text-xl text-slate-300 mb-2">{feedback.questionTitle}</p>
                    <span className="inline-block px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-semibold">
                        {feedback.language}
                    </span>
                </div>

                {/* Strengths */}
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-3xl p-8 mb-8 border border-slate-700/50">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="text-4xl">✨</span>
                        <h2 className="text-2xl font-semibold text-white">Your Strengths</h2>
                    </div>
                    <div className="space-y-4">
                        {feedback.strengths.map((strength, index) => (
                            <div
                                key={index}
                                className="flex items-start gap-4 bg-green-900/20 border border-green-700/30 rounded-2xl p-4"
                            >
                                <span className="text-green-400 text-2xl flex-shrink-0">✓</span>
                                <p className="text-slate-200 leading-relaxed">{strength}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Suggestions for Improvement */}
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-3xl p-8 mb-8 border border-slate-700/50">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="text-4xl">🎓</span>
                        <h2 className="text-2xl font-semibold text-white">Areas for Improvement</h2>
                    </div>
                    <div className="space-y-4">
                        {feedback.suggestions.map((suggestion, index) => (
                            <div
                                key={index}
                                className="flex items-start gap-4 bg-blue-900/20 border border-blue-700/30 rounded-2xl p-4"
                            >
                                <span className="text-blue-400 text-2xl flex-shrink-0">💡</span>
                                <p className="text-slate-200 leading-relaxed">{suggestion}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/"
                        className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-[32px] transition-colors text-center"
                    >
                        Return to Home
                    </Link>
                    <button
                        onClick={() => {
                            localStorage.removeItem('technicalFeedback');
                            router.push('/technical');
                        }}
                        className="px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-[32px] transition-colors"
                    >
                        Try Another Question
                    </button>
                </div>
            </div>
        </div>
    );
}
