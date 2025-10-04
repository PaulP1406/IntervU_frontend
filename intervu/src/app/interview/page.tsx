'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function InterviewPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Interview Page
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          This page is under construction
        </p>
        <Link 
          href="/waiting-room" 
          className="text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          ← Back to Waiting Room
        </Link>
      </div>
    </div>
  );
}
