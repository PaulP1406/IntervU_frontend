'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import Image from 'next/image';
import { INTERVIEWER_VOICE } from '@/lib/constants';

export default function InstructionsPage() {
  const router = useRouter();
  const [raccoonFrame, setRaccoonFrame] = useState<'silent' | 'speaking'>('silent');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const ttsAudioRef = useRef<HTMLAudioElement | null>(null);

  // Auto-play instructions audio on page load
  useEffect(() => {
    let isActive = true;

    const speakInstructions = async () => {
      // Check if API key is available
      const apiKey = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;
      if (!apiKey) {
        console.warn('ElevenLabs API key not configured - skipping audio');
        return;
      }

      try {
        setIsSpeaking(true);

        const response = await fetch(
          `https://api.elevenlabs.io/v1/text-to-speech/${INTERVIEWER_VOICE}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'xi-api-key': apiKey,
            },
            body: JSON.stringify({
              text: "Welcome to IntervU! Let me walk you through how our AI-powered interview practice works. First, upload your resume. Then provide job details. Select interview topics you want to focus on. Practice your interview with AI-generated questions. And finally, receive detailed feedback to improve your skills. Good luck with your preparation!",
              model_id: 'eleven_monolingual_v1',
              voice_settings: {
                stability: 0.5,
                similarity_boost: 0.75,
              },
            }),
          }
        );

        if (!response.ok) {
          console.warn('Failed to generate speech:', response.status, response.statusText);
          setIsSpeaking(false);
          return;
        }

        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);

        if (!isActive) {
          URL.revokeObjectURL(audioUrl);
          return;
        }

        const audio = new Audio(audioUrl);
        ttsAudioRef.current = audio;

        audio.onended = () => {
          if (isActive) {
            setIsSpeaking(false);
          }
          URL.revokeObjectURL(audioUrl);
        };

        await audio.play();
      } catch (error) {
        console.error('Error with text-to-speech:', error);
        if (isActive) {
          setIsSpeaking(false);
        }
      }
    };

    speakInstructions();

    return () => {
      isActive = false;
      if (ttsAudioRef.current) {
        ttsAudioRef.current.pause();
        ttsAudioRef.current = null;
      }
    };
  }, []);

  // Animate raccoon when speaking
  useEffect(() => {
    if (!isSpeaking) {
      setRaccoonFrame('silent');
      return;
    }

    const interval = setInterval(() => {
      setRaccoonFrame(prev => prev === 'silent' ? 'speaking' : 'silent');
    }, 300);

    return () => clearInterval(interval);
  }, [isSpeaking]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-24 relative overflow-hidden">
      <Header />
      
      {/* Decorative Leaves - Background */}
      <div className="absolute top-20 left-0 pointer-events-none z-0">
        <Image
          src="/leavesLeft.svg"
          alt=""
          width={350}
          height={350}
        />
      </div>
      <div className="absolute top-20 right-0 pointer-events-none z-0">
        <Image
          src="/leavesRight.svg"
          alt=""
          width={350}
          height={350}
        />
      </div>
      
      <div className="max-w-4xl mx-auto p-6 relative z-10">
        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            How It Works
            {/* <Image
              src="/logo.svg"
              alt="IntervU"
              width={180}
              height={45}
              className="inline-block"
            /> */}
          </h1>
        </div>

        {/* Main Instructions Card */}
        <div className="bg-gray-800 rounded-2xl p-8 px-8 shadow-xl border border-gray-700 mb-6">
          <div className="space-y-8">
            {/* Step 1 */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-white mb-2">
                  Upload Your Resume
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  Upload your resume in PDF format. Our AI analyzes your experience, skills, and background to create personalized interview questions tailored to your profile.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-white mb-2">
                  Provide Job Details
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  Enter the job title, company name, and job description you're applying for. This helps us generate interview questions that are directly relevant to your target position.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-white mb-2">
                  Select Interview Topics
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  Choose at least 3 focus areas such as Technical Skills, Leadership, Problem Solving, or Communication. This ensures a comprehensive practice session covering all important aspects.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-xl">4</span>
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-white mb-2">
                  Practice Your Interview
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  Answer AI-generated questions via video recording. You have 2 minutes per question to provide thoughtful responses. Click "Start Answer" to begin and "Stop" when finished. Your answers are automatically transcribed and analyzed.
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-xl">5</span>
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-white mb-2">
                  Receive Detailed Feedback
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  After completing all questions, receive comprehensive feedback including your overall score, question-by-question analysis, strengths and areas for improvement, plus actionable tips to enhance your interview skills.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tips Card */}
        <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 rounded-2xl p-6 shadow-xl border border-indigo-700/50 mb-8">
          <h3 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
            💡 Pro Tips for Success
          </h3>
          <ul className="space-y-3 text-gray-200">
            <li className="flex items-start gap-2">
              <span className="text-yellow-400 mt-1">•</span>
              <span>Find a quiet space with good lighting for your video recording</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-400 mt-1">•</span>
              <span>Use the STAR method (Situation, Task, Action, Result) to structure your answers</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-400 mt-1">•</span>
              <span>Speak clearly and maintain eye contact with the camera</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.push('/')}
            className="px-12 py-4 bg-gray-700 hover:bg-gray-600 text-white text-lg font-semibold rounded-[32px] transition-colors duration-200"
          >
            Back to Home
          </button>
          <button
            onClick={() => router.push('/upload')}
            className="px-12 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-[32px] transition-colors duration-200"
          >
            Get Started
          </button>
          
        </div>
      </div>

      {/* Fixed Raccoon Mascot - Bottom Right */}
      <div className="hidden md:block fixed bottom-0 right-6 z-50">
        <Image
          src="/raccoonWave1.svg"
          alt="IntervU Mascot"
          width={300}
          height={300}
          className="drop-shadow-2xl"
        />
      </div>
    </div>
  );
}
