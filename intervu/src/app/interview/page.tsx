'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

// Mock questions - will be replaced with backend data
const MOCK_QUESTIONS = [
  {
    id: 1,
    question: "Tell me about a time when you had to work with a difficult team member. How did you handle the situation?",
    topic: "Workplace Behavior",
    timeLimit: 120 // seconds
  },
  {
    id: 2,
    question: "Describe a situation where you had to make a difficult decision with limited information. What was your approach?",
    topic: "Problem Solving",
    timeLimit: 120
  },
  {
    id: 3,
    question: "Can you share an example of when you had to adapt to a significant change at work? How did you manage it?",
    topic: "Adaptability",
    timeLimit: 120
  },
  {
    id: 4,
    question: "Tell me about a time when you took initiative on a project. What motivated you and what was the outcome?",
    topic: "Leadership",
    timeLimit: 120
  },
  {
    id: 5,
    question: "Describe a situation where you received critical feedback. How did you respond and what did you learn?",
    topic: "Learning & Growth",
    timeLimit: 120
  }
];

export default function InterviewPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(MOCK_QUESTIONS[0].timeLimit);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const currentQuestion = MOCK_QUESTIONS[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === MOCK_QUESTIONS.length - 1;

  // Initialize camera
  useEffect(() => {
    const initCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (error) {
        console.error('Error accessing media devices:', error);
      }
    };

    initCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Timer countdown
  useEffect(() => {
    if (!isRecording || isPaused) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleNextQuestion();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRecording, isPaused, currentQuestionIndex]);

  const handleStartRecording = () => {
    setIsRecording(true);
    console.log('Started recording for question:', currentQuestion.id);
  };

  const handlePauseRecording = () => {
    setIsPaused(!isPaused);
    console.log(isPaused ? 'Resumed recording' : 'Paused recording');
  };

  const handleNextQuestion = () => {
    console.log('Moving to next question. Current answer recorded.');
    
    if (isLastQuestion) {
      handleSubmitInterview();
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setTimeRemaining(MOCK_QUESTIONS[currentQuestionIndex + 1].timeLimit);
      setIsRecording(false);
      setIsPaused(false);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setTimeRemaining(MOCK_QUESTIONS[currentQuestionIndex - 1].timeLimit);
      setIsRecording(false);
      setIsPaused(false);
    }
  };

  const handleSubmitInterview = () => {
    console.log('Interview completed! Submitting all answers...');
    // TODO: Send all recordings to backend
    
    // Cleanup
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    
    router.push('/thank-you'); // Will create this page next if needed
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-8">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Mock Interview
            </h1>
            <p className="text-gray-400">
              Question {currentQuestionIndex + 1} of {MOCK_QUESTIONS.length} • {currentQuestion.topic}
            </p>
          </div>
          
          {/* Timer */}
          <div className="text-right">
            <div className={`text-4xl font-bold ${timeRemaining < 30 ? 'text-red-400' : 'text-white'}`}>
              {formatTime(timeRemaining)}
            </div>
            <p className="text-gray-400 text-sm mt-1">Time Remaining</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Question */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-700">
              <div className="mb-6">
                <span className="inline-block px-3 py-1 bg-indigo-600 text-white text-sm font-semibold rounded-full mb-4">
                  {currentQuestion.topic}
                </span>
                <h2 className="text-2xl font-semibold text-white leading-relaxed">
                  {currentQuestion.question}
                </h2>
              </div>

              {/* Recording Controls */}
              <div className="flex items-center gap-4 mt-8">
                {!isRecording ? (
                  <button
                    onClick={handleStartRecording}
                    className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
                  >
                    <div className="w-3 h-3 rounded-full bg-white"></div>
                    Start Recording
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handlePauseRecording}
                      className="px-8 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-lg transition-colors"
                    >
                      {isPaused ? 'Resume' : 'Pause'}
                    </button>
                    <div className="flex items-center gap-2 text-red-400 animate-pulse">
                      <div className="w-3 h-3 rounded-full bg-red-600"></div>
                      <span className="font-semibold">Recording...</span>
                    </div>
                  </>
                )}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-700">
                <button
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="px-6 py-2 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  ← Previous
                </button>
                
                <button
                  onClick={handleNextQuestion}
                  disabled={!isRecording}
                  className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-30 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
                >
                  {isLastQuestion ? 'Submit Interview' : 'Next Question →'}
                </button>
              </div>
            </div>
          </div>

          {/* Right: Video Preview */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700 sticky top-8">
              <h3 className="text-white font-semibold mb-4">Your Video</h3>
              <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Progress Indicator */}
              <div className="mt-6">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>Progress</span>
                  <span>{Math.round(((currentQuestionIndex + 1) / MOCK_QUESTIONS.length) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / MOCK_QUESTIONS.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Question List */}
              <div className="mt-6">
                <h4 className="text-white font-semibold mb-3 text-sm">Questions</h4>
                <div className="space-y-2">
                  {MOCK_QUESTIONS.map((q, index) => (
                    <div
                      key={q.id}
                      className={`flex items-center gap-2 text-sm ${
                        index === currentQuestionIndex
                          ? 'text-indigo-400 font-semibold'
                          : index < currentQuestionIndex
                          ? 'text-green-400'
                          : 'text-gray-500'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                        index === currentQuestionIndex
                          ? 'bg-indigo-600 text-white'
                          : index < currentQuestionIndex
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-700 text-gray-400'
                      }`}>
                        {index < currentQuestionIndex ? '✓' : index + 1}
                      </div>
                      <span className="truncate">{q.topic}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Exit Interview */}
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              if (confirm('Are you sure you want to exit the interview? Your progress will be lost.')) {
                if (stream) {
                  stream.getTracks().forEach(track => track.stop());
                }
                router.push('/waiting-room');
              }
            }}
            className="text-gray-400 hover:text-white transition-colors text-sm"
          >
            Exit Interview
          </button>
        </div>
      </div>
    </div>
  );
}
