"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import Image from "next/image";
import {
    getTechnicalQuestion,
    executeCode,
    getHint,
    createInterviewSession,
    type TechnicalQuestion,
    type ExecuteCodeResponse,
} from "@/lib/api";
import { useInterview } from "@/context/InterviewContext";
import { INTERVIEWER_VOICE } from "@/lib/constants";
import LoadingSpinner from "@/components/LoadingSpinner";

// TypeScript declarations for speech recognition APIs
declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}

// Generate starter code based on function name
const getStarterCode = (language: string, functionName: string) => {
    switch (language) {
        case "python":
            return `def ${functionName}():\n    # Write your code here\n    pass`;
        case "javascript":
            return `/**\n * @param {any} param\n * @return {any}\n */\nvar ${functionName} = function(param) {\n    \n};`;
        case "cpp":
            return `class Solution {\npublic:\n    void ${functionName}() {\n        \n    }\n};`;
        case "java":
            return `class Solution {\n    public void ${functionName}() {\n        \n    }\n}`;
        default:
            return `def ${functionName}():\n    # Write your code here\n    pass`;
    }
};

export default function TechnicalInterview() {
    const router = useRouter();
    const {
        sessionId,
        technicalDifficulty,
        resumeText,
        jobTitle,
        jobInfo,
        companyName,
        additionalInfo,
        setSessionId,
    } = useInterview();

    const [selectedTab, setSelectedTab] = useState<
        "description" | "submissions" | "notes" | "hints"
    >("description");
    const [language, setLanguage] = useState<
        "python" | "javascript" | "cpp" | "java"
    >("python");
    const [code, setCode] = useState(getStarterCode("python", "solution"));
    const [problem, setProblem] = useState<TechnicalQuestion | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [testResults, setTestResults] = useState<ExecuteCodeResponse | null>(
        null
    );
    const [isRunning, setIsRunning] = useState(false);
    const [notes, setNotes] = useState("");
    const [previousHints, setPreviousHints] = useState<string[]>([]);
    const [conversationalHints, setConversationalHints] = useState<string[]>(
        []
    );
    const [isGettingHint, setIsGettingHint] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isCreatingSession, setIsCreatingSession] = useState(false);
    const [ttsAudioRef, setTtsAudioRef] = useState<HTMLAudioElement | null>(
        null
    );
    const [timer, setTimer] = useState(0); // Timer in seconds
    const [showHintNotification, setShowHintNotification] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
    const [hasSuccessfulSubmission, setHasSuccessfulSubmission] = useState(false);
    const [isFinishing, setIsFinishing] = useState(false);
    const [leftPanelWidth, setLeftPanelWidth] = useState(50); // Percentage
    const [isDragging, setIsDragging] = useState(false);
    const [isDraggingModule, setIsDraggingModule] = useState(false);
    const [modulePosition, setModulePosition] = useState({ x: 0, y: 0 });
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    // Timer effect - start counting when component mounts
    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prev) => prev + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Handle panel resizing
    const handleMouseDown = () => {
        setIsDragging(true);
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging) return;
            
            const containerWidth = window.innerWidth;
            const newWidth = (e.clientX / containerWidth) * 100;
            
            // Constrain between 30% and 70%
            if (newWidth >= 30 && newWidth <= 70) {
                setLeftPanelWidth(newWidth);
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    // Handle AI Interviewer module dragging
    const handleModuleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setDragOffset({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
        setIsDraggingModule(true);
    };

    useEffect(() => {
        const handleModuleMouseMove = (e: MouseEvent) => {
            if (!isDraggingModule) return;
            
            setModulePosition({
                x: e.clientX - dragOffset.x,
                y: e.clientY - dragOffset.y
            });
        };

        const handleModuleMouseUp = () => {
            setIsDraggingModule(false);
        };

        if (isDraggingModule) {
            document.addEventListener('mousemove', handleModuleMouseMove);
            document.addEventListener('mouseup', handleModuleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleModuleMouseMove);
            document.removeEventListener('mouseup', handleModuleMouseUp);
        };
    }, [isDraggingModule, dragOffset]);

    // Create session if one doesn't exist
    useEffect(() => {
        const createSessionIfNeeded = async () => {
            if (!sessionId && !isCreatingSession) {
                setIsCreatingSession(true);
                try {
                    // Create a minimal session for technical interview
                    const sessionData = {
                        parsedResumeText:
                            resumeText || "Technical interview session",
                        jobTitle: jobTitle || "Software Engineer",
                        jobInfo: jobInfo || "Technical coding interview",
                        companyName: companyName || undefined,
                        additionalInfo: additionalInfo || undefined,
                        typeOfInterview: "behavioral" as const,
                        behaviouralTopics: ["Technical Skills"],
                    };

                    console.log(
                        "Creating technical interview session:",
                        sessionData
                    );
                    const sessionResponse = await createInterviewSession(
                        sessionData
                    );
                    setSessionId(sessionResponse.sessionId);
                    console.log(
                        "Technical session created:",
                        sessionResponse.sessionId
                    );
                } catch (error) {
                    console.error("Failed to create technical session:", error);
                    alert(
                        "Failed to create session for technical interview. Please try again."
                    );
                } finally {
                    setIsCreatingSession(false);
                }
            }
        };

        createSessionIfNeeded();
    }, [
        sessionId,
        isCreatingSession,
        resumeText,
        jobTitle,
        jobInfo,
        companyName,
        additionalInfo,
        setSessionId,
    ]);

    // Load initial question
    useEffect(() => {
        if (sessionId) {
            loadQuestion();
        }
    }, [sessionId]);

    const loadQuestion = async () => {
        setIsLoading(true);
        try {
            // Use difficulty from context (selected in upload form), default to Medium
            const difficultyMap: Record<string, "Easy" | "Medium" | "Hard"> = {
                easy: "Easy",
                medium: "Medium",
                hard: "Hard",
            };
            const selectedDifficulty = technicalDifficulty?.toLowerCase() || "medium";
            const question = await getTechnicalQuestion(
                difficultyMap[selectedDifficulty] || "Medium"
            );
            setProblem(question);
            setCode(getStarterCode(language, question.question.functionName));
            setTestResults(null);
            setPreviousHints([]);
            setConversationalHints([]);
            setNotes("");
        } catch (error) {
            console.error("Failed to load question:", error);
            alert("Failed to load technical question. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleLanguageChange = (
        newLang: "python" | "javascript" | "cpp" | "java"
    ) => {
        setLanguage(newLang);
        if (problem) {
            setCode(getStarterCode(newLang, problem.question.functionName));
        }
    };

    const handleRunCode = async () => {
        if (!problem) return;

        setIsRunning(true);
        try {
            const result = await executeCode({
                questionId: problem.id,
                code,
                language,
            });
            if (result.error) console.log("📋 [DETAILS] Error:", result.error);
            setTestResults(result);
        } catch (error) {
            console.error("Failed to run code:", error);
            alert("Failed to execute code. Please try again.");
        } finally {
            setIsRunning(false);
        }
    };

    const handleSubmit = async () => {
        if (!problem) return;

        setIsRunning(true);
        try {
            const result = await executeCode({
                questionId: problem.id,
                code,
                language,
            });
            setTestResults(result);

            if (result.success) {
                setHasSuccessfulSubmission(true);
                alert("✅ All test cases passed! Great job! You can now finish the interview.");
                setSelectedTab("submissions");
            } else {
                alert("❌ Some test cases failed. Check the results below.");
            }
        } catch (error) {
            console.error("Failed to submit code:", error);
            alert("Failed to submit code. Please try again.");
        } finally {
            setIsRunning(false);
        }
    };

    const handleFinishInterview = async () => {
        if (!problem || !sessionId) {
            alert("Session not available.");
            return;
        }

        if (!hasSuccessfulSubmission) {
            alert("Please complete at least one successful submission before finishing the interview.");
            return;
        }

        try {
            setIsFinishing(true);

            // Call technical feedback API via Next.js route
            const payload = {
                sessionId,
                questionId: problem.id,
                userCode: code,
                hintsUsed: previousHints.length,
                isCompleted: hasSuccessfulSubmission,
                timeTaken: timer,
            };

            console.log('📤 Sending technical feedback request:');
            console.log('📦 Payload:', JSON.stringify(payload, null, 2));

            const response = await fetch('/api/technical-feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
                console.error('❌ Technical feedback API error:', response.status, errorData);
                
                // Show user-friendly error message
                if (response.status === 503 || response.status === 502) {
                    alert(`Backend server is starting up or unavailable.\n\n${errorData.details}\n\nPlease try again in a few moments.`);
                } else {
                    alert(`Failed to generate feedback: ${errorData.error}\n\n${errorData.details || ''}`);
                }
                
                setIsFinishing(false);
                return;
            }

            const feedbackData = await response.json();
            console.log('📊 Technical feedback received:', feedbackData);

            // Store feedback in context or localStorage for results page
            localStorage.setItem('technicalFeedback', JSON.stringify({
                ...feedbackData,
                questionTitle: problem.question.question,
                difficulty: problem.difficulty,
                timeTaken: timer,
                hintsUsed: previousHints.length,
                code: code,
                language: language,
            }));

            // Navigate to results page
            router.push('/technical-results');
        } catch (error) {
            console.error('Failed to finish interview:', error);
            alert('Failed to submit feedback. Please try again.');
        } finally {
            setIsFinishing(false);
        }
    };

    const handleGetHint = async () => {
        if (!problem || !sessionId) {
            alert(
                "Session not available. Please go back and start a new interview."
            );
            return;
        }

        // If currently recording, stop and process
        if (isRecording && mediaRecorder) {
            console.log("🛑 Stopping recording...");
            mediaRecorder.stop();
            setIsRecording(false);
            return;
        }

        // Start recording
        try {
            console.log("🎤 Starting audio recording for hint...");
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            const recorder = new MediaRecorder(stream);
            const chunks: Blob[] = [];

            recorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunks.push(e.data);
                }
            };

            recorder.onstop = async () => {
                console.log("🎤 Recording stopped, processing...");
                stream.getTracks().forEach(track => track.stop());
                
                const audioBlob = new Blob(chunks, { type: 'audio/webm' });
                
                try {
                    setIsGettingHint(true);
                    
                    // Transcribe using Whisper
                    const formData = new FormData();
                    formData.append('audio', audioBlob, 'hint-question.webm');
                    
                    console.log("🔄 Transcribing with Whisper...");
                    const transcribeResponse = await fetch('/api/transcribe', {
                        method: 'POST',
                        body: formData,
                    });

                    if (!transcribeResponse.ok) {
                        const errorText = await transcribeResponse.text();
                        console.error("❌ Transcription failed:", errorText);
                        throw new Error('Failed to transcribe audio');
                    }

                    const transcribeData = await transcribeResponse.json();
                    console.log("📝 Transcribe response:", transcribeData);
                    
                    const speechText = transcribeData.text || transcribeData.transcript || '';
                    console.log("✅ Transcribed text:", speechText);

                    if (!speechText || !speechText.trim()) {
                        alert("No speech detected. Please try again.");
                        setIsGettingHint(false);
                        return;
                    }

                    // Call the hint API with the transcribed speech
                    const hint = await getHint({
                        sessionId,
                        questionId: problem.id,
                        previousHints,
                        userCode: code,
                        userSpeech: speechText,
                    });

                    setPreviousHints([...previousHints, hint.hintSummary]);
                    setConversationalHints([
                        ...conversationalHints,
                        hint.conversationalHint,
                    ]);

                    // Trigger hint notification animation
                    setShowHintNotification(true);
                    setTimeout(() => setShowHintNotification(false), 2000);

                    setIsGettingHint(false);

                    // Convert the conversational hint to speech
                    try {
                        await speakText(hint.conversationalHint);
                    } catch (ttsError) {
                        console.error("Text-to-speech failed:", ttsError);
                        alert(`Hint: ${hint.conversationalHint}`);
                    }
                } catch (error) {
                    console.error("Failed to process hint:", error);
                    alert("Failed to process your question. Please try again.");
                    setIsGettingHint(false);
                }
            };

            recorder.start();
            setMediaRecorder(recorder);
            setIsRecording(true);
            console.log("🎤 Recording started...");
            
        } catch (error) {
            console.error("Failed to access microphone:", error);
            alert("Failed to access microphone. Please check your permissions and try again.");
        }
    };

    const handleReset = () => {
        if (problem) {
            setCode(getStarterCode(language, problem.question.functionName));
        }
        setTestResults(null);
    };

    const playHint = async (hintText: string): Promise<void> => {
        try {
            // Stop any existing audio
            if (ttsAudioRef) {
                ttsAudioRef.pause();
                ttsAudioRef.currentTime = 0;
                setTtsAudioRef(null);
            }

            setIsPlaying(true);

            const response = await fetch("/api/text-to-speech", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    text: hintText,
                    voiceId: INTERVIEWER_VOICE, // Use consistent interviewer voice
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to generate speech");
            }

            // Get audio blob
            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);

            // Create and play audio
            const audio = new Audio(audioUrl);
            setTtsAudioRef(audio);

            audio.onended = () => {
                setIsPlaying(false);
                setTtsAudioRef(null);
                URL.revokeObjectURL(audioUrl);
            };

            audio.onerror = () => {
                setIsPlaying(false);
                setTtsAudioRef(null);
                URL.revokeObjectURL(audioUrl);
                throw new Error("Failed to play audio");
            };

            await audio.play();
        } catch (error) {
            setIsPlaying(false);
            console.error("Hint playback error:", error);
            alert("Failed to play hint audio. Please try again.");
        }
    };

    const speakText = async (text: string): Promise<void> => {
        try {
            // Stop any existing audio
            if (ttsAudioRef) {
                ttsAudioRef.pause();
                ttsAudioRef.currentTime = 0;
                setTtsAudioRef(null);
            }

            setIsPlaying(true);

            const response = await fetch("/api/text-to-speech", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    text: text,
                    voiceId: INTERVIEWER_VOICE, // Use consistent interviewer voice
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to generate speech");
            }

            // Get audio blob
            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);

            // Create and play audio
            const audio = new Audio(audioUrl);
            setTtsAudioRef(audio);

            audio.onended = () => {
                setIsPlaying(false);
                setTtsAudioRef(null);
                URL.revokeObjectURL(audioUrl);
            };

            audio.onerror = () => {
                setIsPlaying(false);
                setTtsAudioRef(null);
                URL.revokeObjectURL(audioUrl);
                throw new Error("Failed to play audio");
            };

            await audio.play();
        } catch (error) {
            setIsPlaying(false);
            console.error("Text-to-speech error:", error);
            throw error;
        }
    };

    const getMonacoLanguage = (lang: string) => {
        switch (lang) {
            case "python":
                return "python";
            case "javascript":
                return "javascript";
            case "cpp":
                return "cpp";
            case "java":
                return "java";
            default:
                return "python";
        }
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty.toLowerCase()) {
            case "easy":
                return "text-green-500";
            case "medium":
                return "text-yellow-500";
            case "hard":
                return "text-red-500";
            default:
                return "text-gray-500";
        }
    };

    return (
        <div className="h-screen bg-gray-900 flex flex-col relative">
            {/* Loading Overlay */}
            {(isLoading || isRunning || isGettingHint) && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
                    <LoadingSpinner
                        message={
                            isLoading
                                ? "Loading technical question..."
                                : isRunning
                                ? "Executing your code..."
                                : "Getting hint..."
                        }
                        size="large"
                    />
                </div>
            )}
            {isFinishing && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
                    <LoadingSpinner 
                        message="Generating your technical feedback..."
                        size="large"
                    />
                </div>
            )}
            {/* Header */}
            <div className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.push("/results")}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        ← Back
                    </button>
                    <h1 className="text-white font-semibold text-lg">
                        Technical Interview
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-gray-700 text-white rounded-md text-sm font-mono">
                        ⏱️{" "}
                        {Math.floor(timer / 60)
                            .toString()
                            .padStart(2, "0")}
                        :{(timer % 60).toString().padStart(2, "0")}
                    </div>
                </div>
            </div>

            {/* Main Content - Split Panel */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-visible relative">
                {/* Left Panel - Problem Description */}
                <div 
                    className="w-full lg:border-r border-gray-700 flex flex-col bg-gray-900 overflow-visible"
                    style={{ width: window.innerWidth >= 1024 ? `${leftPanelWidth}%` : '100%' }}
                >
                    {/* Tabs */}
                    <div className="flex border-b border-gray-700 bg-gray-800">
                        <button
                            onClick={() => setSelectedTab("description")}
                            className={`px-4 py-3 text-sm font-medium transition-colors ${
                                selectedTab === "description"
                                    ? "text-white border-b-2 border-green-500"
                                    : "text-gray-400 hover:text-white"
                            }`}
                        >
                            Description
                        </button>
                        <button
                            onClick={() => setSelectedTab("submissions")}
                            className={`px-4 py-3 text-sm font-medium transition-colors ${
                                selectedTab === "submissions"
                                    ? "text-white border-b-2 border-green-500"
                                    : "text-gray-400 hover:text-white"
                            }`}
                        >
                            Submissions
                        </button>
                        <button
                            onClick={() => setSelectedTab("notes")}
                            className={`px-4 py-3 text-sm font-medium transition-colors ${
                                selectedTab === "notes"
                                    ? "text-white border-b-2 border-green-500"
                                    : "text-gray-400 hover:text-white"
                            }`}
                        >
                            Notes
                        </button>
                        <button
                            onClick={() => setSelectedTab("hints")}
                            className={`px-4 py-3 text-sm font-medium transition-all duration-300 ${
                                selectedTab === "hints"
                                    ? "text-white border-b-2 border-green-500"
                                    : "text-gray-400 hover:text-white"
                            } ${
                                showHintNotification
                                    ? "bg-yellow-600/20 rounded-t-md"
                                    : ""
                            }`}
                        >
                            <span
                                className={`transition-all duration-300 ${
                                    showHintNotification
                                        ? "animate-pulse text-base font-bold"
                                        : "text-sm"
                                }`}
                            >
                                💡 Hints ({previousHints.length})
                            </span>
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="flex-1 overflow-y-auto p-6 relative">
                        {/* Decorative leaves for description */}
                        {selectedTab === "description" && (
                            <>
                                <div className="absolute left-2 top-2 opacity-20 pointer-events-none z-0">
                                    <Image
                                        src="/leavesLeft.svg"
                                        alt=""
                                        width={120}
                                        height={120}
                                    />
                                </div>
                                <div className="absolute right-2 bottom-2 opacity-20 pointer-events-none z-0">
                                    <Image
                                        src="/leavesRight.svg"
                                        alt=""
                                        width={120}
                                        height={120}
                                    />
                                </div>
                            </>
                        )}
                        
                        <div className="relative z-10">
                        {selectedTab === "description" &&
                            (isCreatingSession ? (
                                <div className="text-center py-12">
                                    <p className="text-gray-400">
                                        Creating session...
                                    </p>
                                </div>
                            ) : isLoading ? (
                                <div className="text-center py-12">
                                    <p className="text-gray-400">
                                        Loading question...
                                    </p>
                                </div>
                            ) : problem ? (
                                <div className="space-y-6">
                                    {/* Title and Difficulty */}
                                    <div>
                                        <h2 className="text-2xl font-bold text-white mb-2">
                                            {problem.question.question}
                                        </h2>
                                        <span
                                            className={`text-sm font-semibold ${getDifficultyColor(
                                                problem.difficulty
                                            )}`}
                                        >
                                            {problem.difficulty}
                                        </span>
                                    </div>

                                    {/* Description */}
                                    <div className="text-gray-300 leading-relaxed text-xl whitespace-pre-line">
                                        {problem.question.description}
                                    </div>

                                    {/* Test Cases */}
                                    <div className="space-y-4">
                                        <p className="text-white font-semibold text-lg">
                                            Test Cases:
                                        </p>
                                        {problem.question.testCases.map(
                                            (testCase, idx) => (
                                                <div
                                                    key={idx}
                                                    className="bg-gray-800 rounded-lg p-4 border border-gray-700"
                                                >
                                                    <p className="text-white font-semibold mb-2">
                                                        Test Case {idx + 1}:
                                                    </p>
                                                    <div className="space-y-1 text-sm">
                                                        <p className="text-gray-300">
                                                            <span className="text-gray-400">
                                                                Input:
                                                            </span>{" "}
                                                            {testCase.input}
                                                        </p>
                                                        <p className="text-gray-300">
                                                            <span className="text-gray-400">
                                                                Expected Output:
                                                            </span>{" "}
                                                            {
                                                                testCase.expectedOutput
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>

                                    {/* AI Interviewer Section */}
                                    <div 
                                        className="fixed z-50 cursor-move shadow-2xl"
                                        style={{
                                            left: `${modulePosition.x}px`,
                                            top: `${modulePosition.y}px`,
                                            width: '400px'
                                        }}
                                        onMouseDown={handleModuleMouseDown}
                                    >
                                        <div className="bg-gray-800 rounded-lg p-4 border-2 border-orange-500/50">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center">
                                                    <span className="text-white font-bold text-lg">
                                                        AI
                                                    </span>
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-white font-semibold">
                                                        InterviewBot
                                                    </h3>
                                                    <p className="text-gray-400 text-sm">
                                                        Drag to move
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Mascot/Avatar Area */}
                                            <div className="relative aspect-video bg-gradient-to-br from-indigo-900 to-purple-900 rounded-lg overflow-hidden mb-4">
                                                {/* Simple animated mascot */}
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="text-center">
                                                        <div className="w-32 h-32 mx-auto bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                                                            <span className="text-6xl">
                                                                🤖
                                                            </span>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <div
                                                                className={`h-2 bg-indigo-400 rounded-full mx-auto transition-all duration-300 ${
                                                                    isRecording
                                                                        ? "w-24 animate-pulse"
                                                                        : "w-16"
                                                                }`}
                                                            ></div>
                                                            <div
                                                                className={`h-2 bg-purple-400 rounded-full mx-auto transition-all duration-300 ${
                                                                    isRecording
                                                                        ? "w-16 animate-pulse"
                                                                        : "w-20"
                                                                }`}
                                                            ></div>
                                                            <div
                                                                className={`h-2 bg-indigo-400 rounded-full mx-auto transition-all duration-300 ${
                                                                    isRecording
                                                                        ? "w-20 animate-pulse"
                                                                        : "w-12"
                                                                }`}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Recording indicator on interviewer side */}
                                                {isRecording && (
                                                    <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 px-3 py-1 rounded-full">
                                                        <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                                                        <span className="text-white text-xs font-semibold">
                                                            LISTENING
                                                        </span>
                                                    </div>
                                                )}

                                                {/* Speaking indicator */}
                                                {isPlaying && (
                                                    <div className="absolute top-4 right-4 flex items-center gap-2 bg-indigo-600 px-3 py-1 rounded-full">
                                                        <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                                                        <span className="text-white text-xs font-semibold">
                                                            SPEAKING
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Talk to Interviewer Button */}
                                            <div className="flex justify-center">
                                                <button
                                                    onClick={handleGetHint}
                                                    disabled={
                                                        isGettingHint ||
                                                        isPlaying ||
                                                        isCreatingSession
                                                    }
                                                    className="px-6 py-3 bg-gradient-to-br from-orange-500 to-amber-900 hover:from-orange-600 hover:to-amber-950 text-white rounded-lg transition-all disabled:opacity-50 flex items-center gap-2"
                                                    onMouseDown={(e) => e.stopPropagation()}
                                                >
                                                    🎤{" "}
                                                    {isCreatingSession
                                                        ? "Creating Session..."
                                                        : isPlaying
                                                        ? "AI Speaking..."
                                                        : isGettingHint
                                                        ? "Processing Answer..."
                                                        : isRecording
                                                        ? "🔴 Recording... (Click to Stop)"
                                                        : "Talk to Interviewer"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <p className="text-gray-400">
                                        Failed to load question. Please try
                                        again.
                                    </p>
                                </div>
                            ))}

                        {selectedTab === "submissions" && (
                            <div className="text-center py-12">
                                <p className="text-gray-400">
                                    No submissions yet. Submit your code to see
                                    results here.
                                </p>
                            </div>
                        )}

                        {selectedTab === "notes" && (
                            <div>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Write your notes here..."
                                    className="w-full h-96 bg-gray-800 text-gray-300 rounded-lg p-4 border border-gray-700 focus:border-green-500 focus:outline-none resize-none"
                                />
                            </div>
                        )}

                        {selectedTab === "hints" && (
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold text-white mb-4">
                                    Interviewer Hints
                                </h3>
                                {previousHints.length === 0 ? (
                                    <div className="text-center py-12">
                                        <p className="text-gray-400 text-lg mb-4">
                                            No hints received yet
                                        </p>
                                        <p className="text-gray-500 text-sm">
                                            Click "Talk to Interviewer" to ask
                                            for help and receive hints
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {previousHints.map((hint, index) => (
                                            <div
                                                key={index}
                                                className="relative bg-gray-800 rounded-lg p-6 border border-indigo-500/30 hover:border-indigo-500 transition-colors overflow-hidden"
                                            >
                                                {/* Decorative leaves */}
                                                <div className="absolute left-0 top-0 opacity-15 pointer-events-none">
                                                    <Image
                                                        src="/leavesLeft.svg"
                                                        alt=""
                                                        width={80}
                                                        height={80}
                                                    />
                                                </div>
                                                <div className="absolute right-0 bottom-0 opacity-15 pointer-events-none">
                                                    <Image
                                                        src="/leavesRight.svg"
                                                        alt=""
                                                        width={80}
                                                        height={80}
                                                    />
                                                </div>
                                                
                                                <div className="flex items-start gap-4 relative z-10">
                                                    <div className="flex-shrink-0 w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-base">
                                                        {index + 1}
                                                    </div>
                                                    <div className="flex-1">
                                                        {/* Summary Hint */}
                                                        <p className="text-white font-semibold text-base leading-relaxed mb-3">
                                                            {hint}
                                                        </p>

                                                        {/* Conversational Hint */}
                                                        {conversationalHints[
                                                            index
                                                        ] && (
                                                            <div className="bg-gray-900 rounded-lg p-3 mb-3">
                                                                <p className="text-gray-400 text-sm mb-2">
                                                                    Full
                                                                    Response:
                                                                </p>
                                                                <p className="text-gray-200 leading-relaxed text-sm">
                                                                    {
                                                                        conversationalHints[
                                                                            index
                                                                        ]
                                                                    }
                                                                </p>
                                                            </div>
                                                        )}

                                                        {/* Play Button */}
                                                        {conversationalHints[
                                                            index
                                                        ] && (
                                                            <div className="flex items-center gap-2">
                                                                <button
                                                                    onClick={() =>
                                                                        playHint(
                                                                            conversationalHints[
                                                                                index
                                                                            ]
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        isPlaying
                                                                    }
                                                                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs rounded-md transition-colors disabled:opacity-50 flex items-center gap-1"
                                                                >
                                                                    🔊{" "}
                                                                    {isPlaying
                                                                        ? "Playing..."
                                                                        : "Play Audio"}
                                                                </button>
                                                                <p className="text-gray-500 text-xs">
                                                                    Hint #
                                                                    {index + 1}
                                                                </p>
                                                            </div>
                                                        )}

                                                        {!conversationalHints[
                                                            index
                                                        ] && (
                                                            <p className="text-gray-500 text-xs mt-2">
                                                                Hint #
                                                                {index + 1}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                        </div>
                    </div>
                </div>

                {/* Draggable Divider */}
                <div
                    onMouseDown={handleMouseDown}
                    className={`hidden lg:block w-1 bg-gray-700 hover:bg-blue-500 cursor-col-resize transition-colors relative z-10 ${
                        isDragging ? 'bg-blue-500' : ''
                    }`}
                    style={{ minWidth: '4px' }}
                >
                    <div className="absolute inset-y-0 -left-1 -right-1" />
                </div>

                {/* Right Panel - Code Editor */}
                <div className="w-full lg:flex-1 flex flex-col bg-gray-900">
                    {/* Language Selector and Actions */}
                    <div className="flex items-center justify-between bg-gray-800 border-b border-gray-700 px-4 py-2">
                        <select
                            value={language}
                            onChange={(e) =>
                                handleLanguageChange(e.target.value as any)
                            }
                            className="bg-gray-700 text-white px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            <option value="python">Python</option>
                            <option value="javascript">JavaScript</option>
                            <option value="cpp">C++</option>
                            <option value="java">Java</option>
                        </select>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleReset}
                                className="px-3 py-1.5 text-gray-400 hover:text-white text-sm transition-colors"
                            >
                                Reset
                            </button>
                        </div>
                    </div>

                    {/* Code Editor */}
                    <div className="flex-1 overflow-hidden">
                        <Editor
                            height="100%"
                            language={getMonacoLanguage(language)}
                            value={code}
                            onChange={(value) => setCode(value || "")}
                            theme="vs-dark"
                            options={{
                                minimap: { enabled: false },
                                fontSize: 14,
                                lineNumbers: "on",
                                roundedSelection: false,
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                                tabSize: 4,
                                insertSpaces: true,
                                wordWrap: "on",
                                padding: { top: 16, bottom: 16 },
                                suggestOnTriggerCharacters: true,
                                quickSuggestions: true,
                                fontFamily:
                                    'Monaco, Consolas, "Courier New", monospace',
                                fontLigatures: true,
                                cursorBlinking: "smooth",
                                cursorSmoothCaretAnimation: "on",
                                smoothScrolling: true,
                            }}
                        />
                    </div>

                    {/* Test Results Panel */}
                    {testResults && (
                        <div className="border-t border-gray-700 bg-gray-800 p-4 max-h-64 overflow-y-auto">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-white font-semibold">
                                    {testResults.success
                                        ? "✅ All Tests Passed!"
                                        : "❌ Test Failed"}
                                </h3>
                                <button
                                    onClick={() => setTestResults(null)}
                                    className="text-gray-400 hover:text-white text-sm"
                                >
                                    ✕
                                </button>
                            </div>
                            <div className="space-y-2">
                                <div
                                    className={`p-3 rounded ${
                                        testResults.success
                                            ? "bg-green-900/30 border border-green-700"
                                            : "bg-red-900/30 border border-red-700"
                                    }`}
                                >
                                    <p className="text-gray-300 text-sm mb-2">
                                        <span className="font-semibold">
                                            Execution Time:
                                        </span>{" "}
                                        {testResults.executionTime}ms
                                    </p>
                                    {testResults.output && (
                                        <div className="mb-2">
                                            <p className="text-gray-400 text-xs mb-1">
                                                Output:
                                            </p>
                                            <pre className="text-gray-300 text-xs bg-gray-900 p-2 rounded overflow-x-auto">
                                                {testResults.output}
                                            </pre>
                                        </div>
                                    )}
                                    {testResults.error && (
                                        <div>
                                            <p className="text-red-400 text-xs mb-1">
                                                Error:
                                            </p>
                                            <pre className="text-red-300 text-xs bg-gray-900 p-2 rounded overflow-x-auto">
                                                {testResults.error}
                                            </pre>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between bg-gray-800 border-t border-gray-700 px-4 py-3">
                        <div className="text-gray-400 text-sm">
                            {previousHints.length > 0 && (
                                <span>
                                    💡 Hints used: {previousHints.length}
                                </span>
                            )}
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handleRunCode}
                                disabled={isRunning || !problem}
                                className="px-6 py-2 bg-gradient-to-br from-orange-500 to-amber-900 hover:from-orange-600 hover:to-amber-950 text-white rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isRunning ? "Running..." : "▶ Run"}
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={isRunning || !problem}
                                className="px-6 py-2 bg-gradient-to-br from-orange-500 to-amber-900 hover:from-orange-600 hover:to-amber-950 text-white font-semibold rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Submit
                            </button>
                            <button
                                onClick={handleFinishInterview}
                                disabled={!hasSuccessfulSubmission || isFinishing}
                                className={`px-6 py-2 font-semibold rounded-md transition-all ${
                                    hasSuccessfulSubmission
                                        ? 'bg-gradient-to-br from-orange-500 to-amber-900 hover:from-orange-600 hover:to-amber-950 text-white'
                                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                } disabled:opacity-50`}
                                title={!hasSuccessfulSubmission ? 'Complete at least one successful submission first' : 'Finish interview and see results'}
                            >
                                {isFinishing ? '⏳ Finishing...' : '✓ Finish Interview'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
