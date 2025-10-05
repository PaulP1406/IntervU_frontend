'use client';

import { useRouter } from 'next/navigation';

export default function TechnicalInterview() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-700">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            Technical Interview
          </h1>
          <p className="text-gray-300 text-lg mb-8">
            Coming Soon
          </p>
          <p className="text-gray-400 mb-8">
            The technical interview section is currently under development. 
            Check back soon for coding challenges, system design questions, and technical assessments!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <button
              onClick={() => router.push('/results')}
              className="px-8 py-4 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
            >
              ← Back to Results
            </button>
            <button
              onClick={() => router.push('/')}
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors"
            >
              🏠 Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
