'use client';

import { useRouter } from 'next/navigation';
import Header from '@/components/Header';

export default function InstructionsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-24">
      <Header />
      <div className="max-w-4xl mx-auto p-6">
        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            How IntervU Works
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
                  📄 Upload Your Resume
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  Start by uploading your resume in PDF format. Our AI will analyze your experience, 
                  skills, and background to create personalized interview questions that match your profile.
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
                  🎯 Provide Job Details
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  Enter the job title, company name, and job description you're applying for. 
                  This helps us tailor the interview questions to be relevant to your target role.
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
                  📋 Select Interview Topics
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  Choose the areas you want to focus on, such as Technical Skills, Leadership, 
                  Problem Solving, or Communication. Select at least 3 topics for a comprehensive practice session.
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
                  🎤 Practice Your Interview
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  Answer AI-generated questions via video recording. You'll have 2 minutes per question. 
                  Click "Start Answer" to begin recording, and "Stop" when you're done. Your responses 
                  will be automatically transcribed and analyzed.
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
                  📊 Receive Detailed Feedback
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  After completing all questions, you'll receive comprehensive feedback including:
                </p>
                <ul className="mt-3 space-y-2 text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    <span><strong>Overall Score:</strong> Your hiring probability and performance rating</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    <span><strong>Question-by-Question Analysis:</strong> Detailed breakdown of each answer</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    <span><strong>Strengths & Areas for Improvement:</strong> Personalized recommendations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    <span><strong>Key Takeaways:</strong> Actionable tips to improve your interview skills</span>
                  </li>
                </ul>
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
            <li className="flex items-start gap-2">
              <span className="text-yellow-400 mt-1">•</span>
              <span>Take your time to think before answering - quality over speed</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-400 mt-1">•</span>
              <span>Review the hints if you need guidance on how to approach a question</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.push('/')}
            className="px-12 py-4 bg-gray-700 hover:bg-gray-600 text-white text-lg font-semibold rounded-[32px] transition-colors duration-200"
          >
            ← Back to Home
          </button>
          <button
            onClick={() => router.push('/upload')}
            className="px-12 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-[32px] transition-colors duration-200"
          >
            Get Started →
          </button>
          
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            🔒 Your data is secure and private. We use AI to provide feedback, but your information is never shared.
          </p>
        </div>
      </div>
    </div>
  );
}
