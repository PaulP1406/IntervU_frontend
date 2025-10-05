import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen">
        <main className="text-center max-w-4xl">
          {/* Hero Section */}
          <h1 className="text-6xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6">
            IntervU
          </h1>
          
          <p className="text-2xl md:text-3xl text-gray-700 dark:text-gray-200 mb-4">
            Ace Your Next Interview
          </p>
          
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
            Practice with AI-powered mock interviews tailored to your resume and job description. 
            Get instant feedback and improve your interview skills.
          </p>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">📄</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Upload Your Resume</h3>
              <p className="text-gray-600 dark:text-gray-300">
                We analyze your experience and skills
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Target the Role</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Provide the job details you're applying for
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">AI Mock Interview</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Practice with realistic interview questions
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <Link
            href="/instructions"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white text-xl font-semibold px-12 py-4 rounded-full shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            Try It Out
          </Link>
        </main>

        {/* Footer */}
        <footer className="mt-16 text-gray-500 dark:text-gray-400 text-sm">
          <p>© 2025 IntervU. Prepare smarter, interview better.</p>
        </footer>
      </div>
    </div>
  );
}
