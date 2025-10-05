"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useInterview } from "@/context/InterviewContext";
import {
    submitTechnicalFeedback,
    type TechnicalFeedbackRequest,
    type TechnicalFeedbackResponse,
} from "@/lib/api";

export default function TechnicalFeedback() {
    const router = useRouter();
    const { technicalDifficulty } = useInterview();
    const [isLoading, setIsLoading] = useState(true);
    const [result, setResult] = useState<TechnicalFeedbackResponse | null>(
        null
    );
    const [errorMsg, setErrorMsg] = useState<string>("");

    useEffect(() => {
        const runExecution = async () => {
            try {
                const raw = sessionStorage.getItem("technicalFeedbackPayload");
                if (!raw) {
                    router.replace("/technical");
                    return;
                }
                const payload: TechnicalFeedbackRequest = JSON.parse(raw);
                setIsLoading(true);
                const feedback = await submitTechnicalFeedback(payload);
                setResult(feedback);
            } catch (err: any) {
                console.error("Failed to get technical feedback:", err);
                setErrorMsg(err?.message || "Failed to get technical feedback");
            } finally {
                setIsLoading(false);
            }
        };
        runExecution();
    }, [router]);

    if (isLoading) {
        return (
            <div className="h-screen bg-gray-900 flex items-center justify-center">
                <LoadingSpinner
                    message="Running your solution..."
                    size="large"
                />
            </div>
        );
    }

    return (
        <div className="h-screen bg-gray-900 flex flex-col">
            <div className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.push("/results")}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        ← Back to Results
                    </button>
                    <h1 className="text-white font-semibold text-lg">
                        Technical Interview Feedback
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-gray-400 text-sm">
                        Difficulty: {technicalDifficulty}
                    </span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* Overall Score Card - styled similar to Results */}
                    {result && (
                        <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-3xl p-8 shadow-2xl border border-slate-700 backdrop-blur-sm">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                {/* Left: Technical Score Gauge */}
                                <div className="text-center">
                                    <h2 className="text-slate-300 text-xl mb-6 font-semibold">
                                        Technical Score
                                    </h2>
                                    <div className="relative w-56 h-56 mx-auto">
                                        <svg className="w-56 h-56 transform -rotate-90">
                                            <circle
                                                cx="112"
                                                cy="112"
                                                r="100"
                                                stroke="rgba(148,163,184,0.2)"
                                                strokeWidth="14"
                                                fill="none"
                                            />
                                            <circle
                                                cx="112"
                                                cy="112"
                                                r="100"
                                                stroke="url(#tech-gradient)"
                                                strokeWidth="14"
                                                fill="none"
                                                strokeDasharray={`${
                                                    (result.hireAbilityScore /
                                                        100) *
                                                    628
                                                } 628`}
                                                strokeLinecap="round"
                                                className="transition-all duration-1000"
                                            />
                                            <defs>
                                                <linearGradient
                                                    id="tech-gradient"
                                                    x1="0%"
                                                    y1="0%"
                                                    x2="100%"
                                                    y2="100%"
                                                >
                                                    <stop
                                                        offset="0%"
                                                        stopColor="#3B82F6"
                                                    />
                                                    <stop
                                                        offset="100%"
                                                        stopColor="#8B5CF6"
                                                    />
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className="text-6xl font-bold text-white">
                                                {result.hireAbilityScore}
                                            </span>
                                            <span className="text-slate-400 text-lg">
                                                out of 100
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                {/* Right: Overview */}
                                <div className="flex flex-col justify-center">
                                    <h2 className="text-slate-300 text-xl mb-6 font-semibold">
                                        Overview
                                    </h2>
                                    <p className="text-slate-300 leading-relaxed text-lg">
                                        Your solution and approach were analyzed
                                        for correctness, readability, and
                                        efficiency. Below are your key strengths
                                        and suggested improvements.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Strengths - styled like Results */}
                    {result?.strengths && result.strengths.length > 0 && (
                        <div className="bg-green-900/20 border border-green-700/40 rounded-3xl p-8 shadow-2xl backdrop-blur-sm">
                            <h3 className="text-green-400 font-bold text-2xl mb-4 flex items-center gap-2">
                                <span>✅</span>
                                What You Did Well
                            </h3>
                            <ul className="space-y-3">
                                {result.strengths.map((s, i) => (
                                    <li
                                        key={i}
                                        className="text-slate-300 text-base flex items-start gap-3"
                                    >
                                        <span className="text-green-400 mt-1 text-base">
                                            •
                                        </span>
                                        <span>{s}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Suggestions - styled like Results */}
                    {result?.suggestions && result.suggestions.length > 0 && (
                        <div className="bg-blue-900/20 border border-blue-700/40 rounded-3xl p-8 shadow-2xl backdrop-blur-sm">
                            <h3 className="text-blue-400 font-bold text-2xl mb-4 flex items-center gap-2">
                                <span>🎯</span>
                                Suggestions to Improve
                            </h3>
                            <ul className="space-y-3">
                                {result.suggestions.map((s, i) => (
                                    <li
                                        key={i}
                                        className="text-gray-300 text-base flex items-start gap-2"
                                    >
                                        <span className="text-indigo-400 mt-1">
                                            →
                                        </span>
                                        <span>{s}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Error */}
                    {errorMsg && (
                        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                            <h3 className="text-red-400 font-semibold mb-2">
                                Error
                            </h3>
                            <pre className="text-red-300 text-sm bg-gray-900 p-3 rounded overflow-x-auto whitespace-pre-wrap">
                                {errorMsg}
                            </pre>
                        </div>
                    )}

                    {/* Meta */}
                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-300 text-sm">
                            <div>
                                <span className="text-gray-400">Session</span>
                                <div className="text-white font-mono text-xs break-all">
                                    {result?.sessionId || "-"}
                                </div>
                            </div>
                            <div>
                                <span className="text-gray-400">
                                    Suggestions
                                </span>
                                <div className="text-white text-sm">
                                    {result?.suggestions?.length || 0} items
                                </div>
                            </div>
                            <div>
                                <span className="text-gray-400">Strengths</span>
                                <div className="text-white text-sm">
                                    {result?.strengths?.length || 0} items
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-center gap-4 pt-2">
                        <button
                            onClick={() => router.push("/technical")}
                            className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                        >
                            Try Another Question
                        </button>
                        <button
                            onClick={() => router.push("/results")}
                            className="px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
                        >
                            Back to Results
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
