"use client";

import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useInterview } from '@/context/InterviewContext';
import { getInterviewFeedback } from '@/lib/api';
import Header from '@/components/Header';
import { INTERVIEWER_VOICE } from '@/lib/constants';
import LoadingSpinner from '@/components/LoadingSpinner';
import Image from 'next/image';

// Mock questions - will be replaced with backend data
const MOCK_QUESTIONS = [
    {
        id: 1,
        question:
            "Tell me about a time when you had to work with a difficult team member. How did you handle the situation?",
        topic: "Workplace Behavior",
        timeLimit: 120, // seconds
        hints: [
            "Use the STAR method: Situation, Task, Action, Result",
            "Focus on your communication and conflict resolution skills",
            "Highlight what you learned from the experience",
        ],
    },
    {
        id: 2,
        question:
            "Describe a situation where you had to make a difficult decision with limited information. What was your approach?",
        topic: "Problem Solving",
        timeLimit: 120,
        hints: [
            "Explain your decision-making process step by step",
            "Mention how you gathered available information",
            "Discuss the outcome and what you'd do differently",
        ],
    },
    {
        id: 3,
        question:
            "Can you share an example of when you had to adapt to a significant change at work? How did you manage it?",
        topic: "Adaptability",
        timeLimit: 120,
        hints: [
            "Show your flexibility and positive attitude",
            "Describe specific actions you took to adapt",
            "Emphasize the successful outcome",
        ],
    },
    {
        id: 4,
        question:
            "Tell me about a time when you took initiative on a project. What motivated you and what was the outcome?",
        topic: "Leadership",
        timeLimit: 120,
        hints: [
            "Demonstrate your proactive nature",
            "Explain your motivation and vision",
            "Quantify the impact if possible",
        ],
    },
    {
        id: 5,
        question:
            "Describe a situation where you received critical feedback. How did you respond and what did you learn?",
        topic: "Learning & Growth",
        timeLimit: 120,
        hints: [
            "Show emotional maturity and openness to feedback",
            "Describe concrete actions you took to improve",
            "Highlight the growth that resulted",
        ],
    },
];

export default function InterviewPage() {
    const router = useRouter();
    const {
        sessionId,
        questions: contextQuestions,
        setTranscripts: setContextTranscripts,
    } = useInterview();
    const videoRef = useRef<HTMLVideoElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const transcriptsRef = useRef<{ question: string; answer: string }[]>([]);
    const ttsAudioRef = useRef<HTMLAudioElement | null>(null);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState(120); // Default 2 minutes
    const [isRecording, setIsRecording] = useState(false);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [flippedHints, setFlippedHints] = useState<number[]>([]);
    const [questionTranscripts, setQuestionTranscripts] = useState<
        {
            question: string;
            answer: string;
        }[]
    >([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [isReadyToAdvance, setIsReadyToAdvance] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [displayedQuestion, setDisplayedQuestion] = useState("");
    const [autoStartTimer, setAutoStartTimer] = useState(10);
    const [showTimerWarning, setShowTimerWarning] = useState(false);
    const [raccoonFrame, setRaccoonFrame] = useState<'silent' | 'speaking'>('silent');

    // Use questions from context if available, otherwise use mock
    const questions =
        contextQuestions.length > 0 ? contextQuestions : MOCK_QUESTIONS;
    const currentQuestion = questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === questions.length - 1;

    // Animate raccoon when speaking
    useEffect(() => {
        if (!isSpeaking) {
            setRaccoonFrame('silent');
            return;
        }

        // Alternate between silent and speaking frames every 300ms
        const interval = setInterval(() => {
            setRaccoonFrame(prev => prev === 'silent' ? 'speaking' : 'silent');
        }, 300);

        return () => clearInterval(interval);
    }, [isSpeaking]);

    // Initialize camera
    useEffect(() => {
        const initCamera = async () => {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true,
                });
                setStream(mediaStream);
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }
            } catch (error) {
                console.error("Error accessing media devices:", error);
            }
        };

        initCamera();

        return () => {
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
            }
        };
    }, []);

    // Text-to-Speech for questions with typewriter effect
    useEffect(() => {
        let isActive = true;
        let typewriterTimeout: NodeJS.Timeout;

        // Reset timer warning for new question
        setShowTimerWarning(false);

        const speakQuestion = async () => {
            if (!currentQuestion || !isActive) return;

            try {
                // Reset displayed question
                setDisplayedQuestion("");
                setIsSpeaking(true);

                // Stop any previous audio
                if (ttsAudioRef.current) {
                    ttsAudioRef.current.pause();
                    ttsAudioRef.current.currentTime = 0;
                    ttsAudioRef.current = null;
                }

                const response = await fetch("/api/text-to-speech", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        text: currentQuestion.question,
                        voiceId: INTERVIEWER_VOICE,
                    }),
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error("Failed to generate speech:", response.status, errorText);
                    setIsSpeaking(false);
                    setDisplayedQuestion(currentQuestion.question);
                    return;
                }

                if (!isActive) {
                    console.log("Component unmounted, cancelling TTS");
                    setIsSpeaking(false);
                    return;
                }

                // Get audio blob
                const audioBlob = await response.blob();
                const audioUrl = URL.createObjectURL(audioBlob);

                if (!isActive) {
                    URL.revokeObjectURL(audioUrl);
                    return;
                }

                // Create and play audio
                const audio = new Audio(audioUrl);
                ttsAudioRef.current = audio;

                // Start typewriter effect when audio starts
                audio.onplay = () => {
                    if (!isActive) return;

                    const questionText = currentQuestion.question;
                    let index = 0;

                    const typeWriter = () => {
                        if (index < questionText.length && isActive) {
                            setDisplayedQuestion(
                                questionText.substring(0, index + 1)
                            );
                            index++;
                            typewriterTimeout = setTimeout(typeWriter, 48); // Adjust speed here (lower = faster)
                        }
                    };

                    typeWriter();
                };

                audio.onended = () => {
                    if (isActive) {
                        setIsSpeaking(false);
                        setDisplayedQuestion(currentQuestion.question); // Ensure full question is shown
                        setShowTimerWarning(true); // Show timer warning after TTS finishes
                    }
                    URL.revokeObjectURL(audioUrl);
                };

                audio.onerror = () => {
                    console.error("Error playing audio");
                    if (isActive) {
                        setIsSpeaking(false);
                        setDisplayedQuestion(currentQuestion.question);
                        setShowTimerWarning(true); // Show timer warning even on error
                    }
                    URL.revokeObjectURL(audioUrl);
                };

                if (isActive) {
                    await audio.play();
                }
            } catch (error) {
                console.error("Error with text-to-speech:", error);
                if (isActive) {
                    setIsSpeaking(false);
                    setDisplayedQuestion(currentQuestion.question);
                    setShowTimerWarning(true); // Show timer even on error
                }
            }
        };

        speakQuestion();

        // Cleanup on unmount or question change
        return () => {
            isActive = false;
            clearTimeout(typewriterTimeout);

            if (ttsAudioRef.current) {
                ttsAudioRef.current.pause();
                ttsAudioRef.current.currentTime = 0;
                ttsAudioRef.current = null;
            }
        };
    }, [currentQuestionIndex]); // Only depend on question index, not the whole question object

    // Auto-start recording timer (10 seconds after TTS finishes)
    useEffect(() => {
        // Don't run timer if: still speaking, already recording, already answered, or warning not shown
        if (
            isSpeaking ||
            isRecording ||
            isReadyToAdvance ||
            !showTimerWarning
        ) {
            return;
        }

        // Start countdown from 10 seconds
        let timeLeft = 10;
        setAutoStartTimer(timeLeft);

        const countdown = setInterval(() => {
            timeLeft--;
            setAutoStartTimer(timeLeft);

            if (timeLeft <= 0) {
                clearInterval(countdown);
                // Auto-start recording when timer reaches 0
                if (!isRecording && !isReadyToAdvance && showTimerWarning) {
                    handleStartRecording();
                    setShowTimerWarning(false); // Hide warning after auto-start
                }
            }
        }, 1000);

        return () => clearInterval(countdown);
    }, [isSpeaking, isRecording, isReadyToAdvance, showTimerWarning]);

    // Timer countdown
    useEffect(() => {
        if (!isRecording) return;

        const timer = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleStopRecording();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isRecording, currentQuestionIndex]);

    const handleStartRecording = () => {
        if (!stream) return;

        // Reset for this question
        audioChunksRef.current = [];

        // Start audio recording (audio only, not video)
        const audioStream = new MediaStream(stream.getAudioTracks());

        const mediaRecorder = new MediaRecorder(audioStream, {
            mimeType: "audio/webm",
        });

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                audioChunksRef.current.push(event.data);
            }
        };

        mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunksRef.current, {
                type: "audio/webm",
            });

            setIsTranscribing(true);
            console.log(
                "[AUDIO] Recorded, sending to Whisper API for transcription..."
            );

            // Send audio to backend for transcription
            try {
                const formData = new FormData();
                formData.append("audio", audioBlob, "answer.webm");

                const response = await fetch("/api/transcribe", {
                    method: "POST",
                    body: formData,
                });

                const data = await response.json();

                if (data.success) {
                    const whisperTranscript = data.transcript;

                    console.log(
                        "✅ [TRANSCRIPTION] Success! Length:",
                        whisperTranscript.length,
                        "chars"
                    );

                    // Save transcript in backend API format
                    const newTranscript = {
                        question: currentQuestion.question,
                        answer: whisperTranscript,
                    };

                    // Update both ref and state
                    transcriptsRef.current = [
                        ...transcriptsRef.current,
                        newTranscript,
                    ];

                    setQuestionTranscripts((prev) => {
                        const updated = [...prev, newTranscript];
                        console.log(
                            "📝 [SAVED] Total transcripts:",
                            updated.length
                        );
                        console.log(
                            "📝 [REF] Total in ref:",
                            transcriptsRef.current.length
                        );
                        return updated;
                    });

                    console.log("📋 [QUESTION] Answered:", {
                        questionNumber: currentQuestionIndex + 1,
                        question: currentQuestion.question,
                        answerLength: whisperTranscript.length,
                        audioSize: audioBlob.size,
                    });

                    setIsTranscribing(false);
                    setIsReadyToAdvance(true);
                    console.log(
                        "✅ [READY] User can now advance to next question"
                    );
                } else {
                    console.error(
                        "❌ [ERROR] Transcription failed:",
                        data.error
                    );

                    const placeholderTranscript = {
                        question: currentQuestion.question,
                        answer: "[Transcription failed - please answer verbally]",
                    };

                    // Update both ref and state
                    transcriptsRef.current = [
                        ...transcriptsRef.current,
                        placeholderTranscript,
                    ];

                    // Save with placeholder if transcription fails
                    setQuestionTranscripts((prev) => [
                        ...prev,
                        placeholderTranscript,
                    ]);

                    setIsTranscribing(false);
                    setIsReadyToAdvance(true);
                    console.log(
                        "⚠️ [READY] Transcription failed but user can advance"
                    );
                }
            } catch (error) {
                console.error(
                    "❌ [ERROR] Error calling transcription API:",
                    error
                );

                const placeholderTranscript = {
                    question: currentQuestion.question,
                    answer: "[Transcription failed - please answer verbally]",
                };

                // Update both ref and state
                transcriptsRef.current = [
                    ...transcriptsRef.current,
                    placeholderTranscript,
                ];

                // Save with placeholder if API call fails
                setQuestionTranscripts((prev) => [
                    ...prev,
                    placeholderTranscript,
                ]);

                setIsTranscribing(false);
                setIsReadyToAdvance(true);
                console.log("⚠️ [READY] API error but user can advance");
            }
        };

        mediaRecorder.start();
        mediaRecorderRef.current = mediaRecorder;

        setIsRecording(true);
        console.log(
            "Started recording audio for question:",
            currentQuestion.question
        );
    };

    const handleStopRecording = () => {
        if (
            !mediaRecorderRef.current ||
            mediaRecorderRef.current.state === "inactive"
        )
            return;

        console.log("⏹️ [RECORDING] Stopping recording...");

        // Stop the recording (transcription will happen in onstop callback)
        mediaRecorderRef.current.stop();
        setIsRecording(false);
    };

    const handleNextQuestion = async () => {
        if (!isReadyToAdvance) return;

        console.log("➡️ [NEXT] User clicked next/submit button");

        if (isLastQuestion) {
            // Submit interview
            console.log("🏁 [SUBMIT] Last question - submitting interview");
            await handleSubmitInterview();
        } else {
            // Go to next question
            console.log("📄 [NEXT] Moving to next question");
            setCurrentQuestionIndex((prev) => prev + 1);
            setTimeRemaining(120);
            setFlippedHints([]);
            setIsReadyToAdvance(false);
        }
    };

    const handleSubmitInterview = async () => {
        // Stop any ongoing recording
        if (
            mediaRecorderRef.current &&
            mediaRecorderRef.current.state !== "inactive"
        ) {
            mediaRecorderRef.current.stop();
            // Wait for transcription to complete
            console.log("⏳ [SUBMIT] Waiting for transcription to complete...");
            await new Promise((resolve) => setTimeout(resolve, 3000));
        }

        // Use ref to get the latest transcripts (not stale state)
        const finalTranscripts =
            transcriptsRef.current.length > 0
                ? transcriptsRef.current
                : questionTranscripts;

        console.log(
            "📝 [INTERVIEW] Interview completed! Submitting all answers..."
        );
        console.log(
            "📊 [STATS] Transcripts from ref:",
            transcriptsRef.current.length
        );
        console.log(
            "📊 [STATS] Transcripts from state:",
            questionTranscripts.length
        );
        console.log("📊 [STATS] Using transcripts:", finalTranscripts.length);
        console.log(
            "📋 [ALL TRANSCRIPTS]:",
            JSON.stringify(finalTranscripts, null, 2)
        );

        // Save transcripts to context
        setContextTranscripts(finalTranscripts);

        // Send to backend for feedback
        if (sessionId && finalTranscripts.length > 0) {
            setIsSubmitting(true);
            try {
                console.log("🚀 [API] Sending to backend...");
                console.log(
                    "📦 [PAYLOAD]:",
                    JSON.stringify(
                        {
                            sessionId,
                            interviewQuestionsWithAnswers: finalTranscripts,
                        },
                        null,
                        2
                    )
                );

                const feedback = await getInterviewFeedback({
                    sessionId,
                    interviewQuestionsWithAnswers: finalTranscripts,
                });

                console.log("Received feedback:", feedback);

                // Store feedback in localStorage to pass to results page
                localStorage.setItem(
                    "interviewFeedback",
                    JSON.stringify(feedback)
                );

                // Cleanup camera and microphone
                if (stream) {
                    stream.getTracks().forEach((track) => track.stop());
                    setStream(null);
                }

                router.push("/results");
            } catch (error) {
                console.error("Failed to get feedback:", error);
                alert("Failed to get interview feedback. Please try again.");
                setIsSubmitting(false);
            }
        } else {
            console.warn("No session ID or transcripts available");
            // Cleanup camera and microphone
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
                setStream(null);
            }
            router.push("/results");
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-24">
      <Header />
      {/* Loading Overlays */}
      {isTranscribing && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <LoadingSpinner 
            message="Processing your answer..."
            size="large"
          />
        </div>
      )}
      
      {isSubmitting && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <LoadingSpinner 
            message="Submitting your interview..."
            size="large"
          />
        </div>
      )}
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
        
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Interview Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-white mb-1">
                  Mock Interview Session
                </h1>
                <p className="text-gray-400 text-sm">
                  Question {currentQuestionIndex + 1} of 3 • {currentQuestion.topic}
                </p>
              </div>
              
              {/* Timer */}
              <div className="text-right">
                <div className={`text-3xl font-bold ${timeRemaining < 30 ? 'text-red-400' : 'text-white'}`}>
                  {formatTime(timeRemaining)}
                </div>
                <p className="text-gray-400 text-xs mt-1">Time Remaining</p>
              </div>
            </div>
          </div>

          {/* Main Interview Area */}
          <div className="">
            {/* Video Grid - Interviewer and Candidate */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* AI Interviewer */}
                    <div className="bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-900 rounded-full flex items-center justify-center overflow-hidden">
                                <Image
                                    src="/raccoonSmile.svg"
                                    alt="InterviewBot"
                                    width={30}
                                    height={30}
                                    className='mt-3'
                                />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold">
                                    Ryan the raccoon
                                </h3>
                                <p className="text-gray-400 text-sm">
                                    Your AI Interviewer
                                </p>
                            </div>
                        </div>

                        {/* Mascot/Avatar Area */}
                        <div className="relative aspect-video bg-gradient-to-br from-indigo-500 to-purple-900 rounded-lg overflow-hidden mb-4">
                            {/* Simple animated mascot */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="w-32 h-32 mx-auto bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                                        <Image
                                            src={raccoonFrame === 'speaking' ? '/raccoonCircleEyesSpeaking 2.svg' : '/raccoonCircleEyesSilent 1.svg'}
                                            alt="AI Interviewer"
                                            width={96}
                                            height={96}
                                            className="transition-opacity duration-150 mt-8"
                                        />
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
                            {isSpeaking && (
                                <div className="absolute top-4 right-4 flex items-center gap-2 bg-indigo-600 px-3 py-1 rounded-full">
                                    <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                                    <span className="text-white text-xs font-semibold">
                                        SPEAKING
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Question Display */}
                        <div className="bg-gray-900 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="inline-block px-2 py-1 bg-indigo-600 text-white text-xs font-semibold rounded">
                                    {currentQuestion.topic}
                                </span>
                                {isSpeaking && (
                                    <span className="text-indigo-400 text-xs flex items-center gap-1">
                                        <span className="animate-pulse">
                                            🔊
                                        </span>
                                        Reading question...
                                    </span>
                                )}
                            </div>
                            <p className="text-white text-lg leading-relaxed min-h-[3.5rem]">
                                {displayedQuestion || "\u00A0"}
                                {isSpeaking &&
                                    displayedQuestion.length <
                                        currentQuestion.question.length && (
                                        <span className="animate-pulse">|</span>
                                    )}
                            </p>
                        </div>
                    </div>

                    {/* Candidate Video */}
                    <div className="bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">
                                        YOU
                                    </span>
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold">
                                        You
                                    </h3>
                                    <p className="text-gray-400 text-sm">
                                        Candidate
                                    </p>
                                </div>
                            </div>

                            {/* Recording status */}
                            {isRecording && (
                                <div className="flex items-center gap-2 bg-red-600 px-3 py-1 rounded-full">
                                    <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                                    <span className="text-white text-xs font-semibold">
                                        RECORDING
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Recording Controls */}
                        <div className="flex items-center gap-3 mt-4">
                            {!isRecording ? (
                                <button
                                    onClick={() => {
                                        handleStartRecording();
                                        setShowTimerWarning(false); // Hide timer when manually starting
                                    }}
                                    disabled={
                                        isTranscribing ||
                                        isReadyToAdvance ||
                                        isSpeaking
                                    }
                                    className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-30 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                                >
                                    <div className="w-3 h-3 rounded-full bg-white"></div>
                                    {isReadyToAdvance
                                        ? "Answer Recorded"
                                        : isSpeaking
                                        ? "Ryan is talking..."
                                        : "Start Answer"}
                                </button>
                            ) : (
                                <button
                                    onClick={handleStopRecording}
                                    disabled={isTranscribing}
                                    className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-30 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
                                >
                                    {isTranscribing
                                        ? "⏳ Processing..."
                                        : "⏹ Stop"}
                                </button>
                            )}
                        </div>

                        {/* Auto-start timer warning - only shows after TTS completes */}
                        {showTimerWarning &&
                            !isRecording &&
                            !isReadyToAdvance &&
                            autoStartTimer > 0 && (
                                <div className="mt-4 bg-yellow-900/30 border border-yellow-600/50 rounded-lg p-3">
                                    <div className="flex items-center gap-2">
                                        <span className="text-yellow-400 text-xl">
                                            ⏱️
                                        </span>
                                        <div className="flex-1">
                                            <p className="text-yellow-200 text-sm font-semibold">
                                                Auto-starting in{" "}
                                                {autoStartTimer} second
                                                {autoStartTimer !== 1
                                                    ? "s"
                                                    : ""}
                                            </p>
                                            <p className="text-yellow-300/70 text-xs mt-1">
                                                Recording will begin
                                                automatically if you don't start
                                                manually
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                        {/* Live Recording Status */}
                        {isRecording && (
                            <div className="mt-4 bg-gray-900 rounded-lg p-4 border border-indigo-500/30">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                                    <span className="text-gray-400 text-sm font-semibold">
                                        Recording Audio
                                    </span>
                                </div>

                                <div className="text-gray-400 text-sm">
                                    <p>🎙️ Your answer is being recorded</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom Controls */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Hints Panel - Flip Cards */}
                    <div className="lg:col-span-2 bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700">
                        <div className="mb-4">
                            <h3 className="text-white font-semibold mb-2">
                                Interview Hints
                            </h3>
                            <p className="text-gray-400 text-sm">
                                Click on a card to reveal the hint
                            </p>
                        </div>

                        <div className="space-y-3">
                            {(currentQuestion as any).hints?.map(
                                (hint: string, index: number) => {
                                    const isFlipped = flippedHints.includes(index);
                                    return (
                                        <div
                                            key={index}
                                            onClick={() => {
                                                if (isFlipped) {
                                                    setFlippedHints(flippedHints.filter(i => i !== index));
                                                } else {
                                                    setFlippedHints([...flippedHints, index]);
                                                }
                                            }}
                                            className="relative h-24 cursor-pointer perspective-1000"
                                            style={{ perspective: '1000px' }}
                                        >
                                            <div
                                                className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
                                                    isFlipped ? 'rotate-x-180' : ''
                                                }`}
                                                style={{
                                                    transformStyle: 'preserve-3d',
                                                    transform: isFlipped ? 'rotateX(180deg)' : 'rotateX(0deg)'
                                                }}
                                            >
                                                {/* Front of card */}
                                                <div
                                                    className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg p-4 flex items-center justify-center gap-3 backface-hidden border-2 border-indigo-500"
                                                    style={{ backfaceVisibility: 'hidden' }}
                                                >
                                                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                                                        <span className="text-indigo-600 font-bold">
                                                            {index + 1}
                                                        </span>
                                                    </div>
                                                    <div className="flex-1 text-center">
                                                        <p className="text-white font-semibold">
                                                            Click to reveal hint {index + 1}
                                                        </p>
                                                        <p className="text-indigo-200 text-sm mt-1">
                                                            Tap to flip
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Back of card */}
                                                <div
                                                    className="absolute inset-0 bg-gray-900 rounded-lg p-4 flex items-start gap-3 border border-indigo-500/30 backface-hidden"
                                                    style={{
                                                        backfaceVisibility: 'hidden',
                                                        transform: 'rotateX(180deg)'
                                                    }}
                                                >
                                                    <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                                                        <span className="text-white font-bold text-sm">
                                                            {index + 1}
                                                        </span>
                                                    </div>
                                                    <p className="text-gray-300 text-sm leading-relaxed flex-1">
                                                        {hint}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }
                            ) || (
                                <div className="text-center py-8">
                                    <p className="text-gray-400 text-sm">
                                        No hints available for this question
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Progress & Navigation */}
                    <div className="bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700">
                        {/* Progress */}
                        <div className="mb-6">
                            <div className="flex justify-between text-sm text-gray-400 mb-2">
                                <span>Progress</span>
                                <span>
                                    {Math.round(
                                        (questionTranscripts.length /
                                            questions.length) *
                                            100
                                    )}
                                    %
                                </span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                                <div
                                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                                    style={{
                                        width: `${
                                            (questionTranscripts.length /
                                                questions.length) *
                                            100
                                        }%`,
                                    }}
                                ></div>
                            </div>
                        </div>

                        {/* Question List */}
                        <div className="mb-6">
                            <h4 className="text-white font-semibold mb-3 text-sm">
                                Questions
                            </h4>
                            <div className="space-y-2">
                                {questions.map((q, index) => (
                                    <div
                                        key={index}
                                        className={`flex items-center gap-2 text-sm ${
                                            index === currentQuestionIndex
                                                ? "text-indigo-400 font-semibold"
                                                : index < currentQuestionIndex
                                                ? "text-green-400"
                                                : "text-gray-500"
                                        }`}
                                    >
                                        <div
                                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
                                                index === currentQuestionIndex
                                                    ? "bg-indigo-600 text-white"
                                                    : index <
                                                      currentQuestionIndex
                                                    ? "bg-green-600 text-white"
                                                    : "bg-gray-700 text-gray-400"
                                            }`}
                                        >
                                            {index < currentQuestionIndex
                                                ? "✓"
                                                : index + 1}
                                        </div>
                                        <span className="truncate">
                                            {q.topic}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Navigation */}
                        <div className="space-y-3">
                            <button
                                onClick={handleNextQuestion}
                                disabled={!isReadyToAdvance || isSubmitting}
                                className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-30 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
                            >
                                {isSubmitting
                                    ? "🔄 Submitting Interview..."
                                    : isTranscribing
                                    ? "⏳ Processing Answer..."
                                    : isReadyToAdvance
                                    ? isLastQuestion
                                        ? "✓ Submit Interview"
                                        : "Next Question →"
                                    : isLastQuestion
                                    ? "✓ Submit Interview"
                                    : "Next Question →"}
                            </button>

                            <button
                                onClick={() => {
                                    if (
                                        confirm(
                                            "Are you sure you want to exit the interview? Your progress will be lost."
                                        )
                                    ) {
                                        if (stream) {
                                            stream
                                                .getTracks()
                                                .forEach((track) =>
                                                    track.stop()
                                                );
                                        }
                                        router.push("/waiting-room");
                                    }
                                }}
                                className="w-full px-6 py-2 text-gray-500 hover:text-gray-300 transition-colors text-sm"
                            >
                                Exit Interview
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
