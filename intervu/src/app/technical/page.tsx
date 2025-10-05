'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

// Mock problem data - will be replaced with backend
const MOCK_PROBLEM = {
  title: "Best Time to Buy and Sell Stock",
  difficulty: "Easy",
  description: `You are given an integer array prices where prices[i] is the price of NeetCoin on the ith day.

You may choose a single day to buy one NeetCoin and choose a different day in the future to sell it.

Return the maximum profit you can achieve. You may choose to not make any transactions, in which case the profit would be 0.`,
  examples: [
    {
      input: "prices = [10,1,5,6,7,1]",
      output: "6",
      explanation: "Buy prices[1] and sell prices[4], profit = 7 - 1 = 6."
    },
    {
      input: "prices = [10,8,7,5,2]",
      output: "0",
      explanation: "No profitable transactions can be made, thus the max profit is 0."
    }
  ],
  constraints: [
    "1 <= prices.length <= 100",
    "0 <= prices[i] <= 100"
  ],
  starterCode: {
    python: `class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        `,
    javascript: `/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function(prices) {
    
};`,
    cpp: `class Solution {
public:
    int maxProfit(vector<int>& prices) {
        
    }
};`,
    java: `class Solution {
    public int maxProfit(int[] prices) {
        
    }
}`
  }
};

export default function TechnicalInterview() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<'description' | 'submissions' | 'notes'>('description');
  const [language, setLanguage] = useState<'python' | 'javascript' | 'cpp' | 'java'>('python');
  const [code, setCode] = useState(MOCK_PROBLEM.starterCode.python);
  const [testResults, setTestResults] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);

  const handleLanguageChange = (newLang: 'python' | 'javascript' | 'cpp' | 'java') => {
    setLanguage(newLang);
    setCode(MOCK_PROBLEM.starterCode[newLang]);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'hard': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/results')}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ← Back
          </button>
          <h1 className="text-white font-semibold text-lg">Technical Interview</h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors text-sm">
            ⏱️ <span className="ml-1">45:00</span>
          </button>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors text-sm"
          >
            🏠 Home
          </button>
        </div>
      </div>

      {/* Main Content - Split Panel */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Problem Description */}
        <div className="w-1/2 border-r border-gray-700 flex flex-col bg-gray-900">
          {/* Tabs */}
          <div className="flex border-b border-gray-700 bg-gray-800">
            <button
              onClick={() => setSelectedTab('description')}
              className={`px-4 py-3 text-sm font-medium transition-colors ${
                selectedTab === 'description'
                  ? 'text-white border-b-2 border-green-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setSelectedTab('submissions')}
              className={`px-4 py-3 text-sm font-medium transition-colors ${
                selectedTab === 'submissions'
                  ? 'text-white border-b-2 border-green-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Submissions
            </button>
            <button
              onClick={() => setSelectedTab('notes')}
              className={`px-4 py-3 text-sm font-medium transition-colors ${
                selectedTab === 'notes'
                  ? 'text-white border-b-2 border-green-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Notes
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {selectedTab === 'description' && (
              <div className="space-y-6">
                {/* Title and Difficulty */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {MOCK_PROBLEM.title}
                  </h2>
                  <span className={`text-sm font-semibold ${getDifficultyColor(MOCK_PROBLEM.difficulty)}`}>
                    {MOCK_PROBLEM.difficulty}
                  </span>
                </div>

                {/* Description */}
                <div className="text-gray-300 leading-relaxed whitespace-pre-line">
                  {MOCK_PROBLEM.description}
                </div>

                {/* Examples */}
                <div className="space-y-4">
                  {MOCK_PROBLEM.examples.map((example, idx) => (
                    <div key={idx} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                      <p className="text-white font-semibold mb-2">Example {idx + 1}:</p>
                      <div className="space-y-1 text-sm">
                        <p className="text-gray-300">
                          <span className="text-gray-400">Input:</span> {example.input}
                        </p>
                        <p className="text-gray-300">
                          <span className="text-gray-400">Output:</span> {example.output}
                        </p>
                        <p className="text-gray-300">
                          <span className="text-gray-400">Explanation:</span> {example.explanation}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Constraints */}
                <div>
                  <p className="text-white font-semibold mb-2">Constraints:</p>
                  <ul className="space-y-1">
                    {MOCK_PROBLEM.constraints.map((constraint, idx) => (
                      <li key={idx} className="text-gray-300 text-sm ml-4">
                        • {constraint}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {selectedTab === 'submissions' && (
              <div className="text-center py-12">
                <p className="text-gray-400">No submissions yet. Submit your code to see results here.</p>
              </div>
            )}

            {selectedTab === 'notes' && (
              <div>
                <textarea
                  placeholder="Write your notes here..."
                  className="w-full h-96 bg-gray-800 text-gray-300 rounded-lg p-4 border border-gray-700 focus:border-green-500 focus:outline-none resize-none"
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Code Editor */}
        <div className="w-1/2 flex flex-col bg-gray-900">
          {/* Language Selector and Actions */}
          <div className="flex items-center justify-between bg-gray-800 border-b border-gray-700 px-4 py-2">
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value as any)}
              className="bg-gray-700 text-white px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
              <option value="cpp">C++</option>
              <option value="java">Java</option>
            </select>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 text-gray-400 hover:text-white text-sm transition-colors">
                Reset
              </button>
              <button className="px-3 py-1.5 text-gray-400 hover:text-white text-sm transition-colors">
                Settings
              </button>
            </div>
          </div>

          {/* Code Editor */}
          <div className="flex-1 overflow-hidden">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-full bg-gray-900 text-gray-300 p-4 font-mono text-sm focus:outline-none resize-none"
              style={{ fontFamily: 'Monaco, Consolas, monospace' }}
              spellCheck={false}
            />
          </div>

          {/* Test Results Panel */}
          {testResults && (
            <div className="border-t border-gray-700 bg-gray-800 p-4 max-h-48 overflow-y-auto">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white font-semibold">Test Results</h3>
                <button
                  onClick={() => setTestResults(null)}
                  className="text-gray-400 hover:text-white text-sm"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-2">
                {testResults.map((result: any, idx: number) => (
                  <div
                    key={idx}
                    className={`p-3 rounded ${
                      result.passed ? 'bg-green-900/30 border border-green-700' : 'bg-red-900/30 border border-red-700'
                    }`}
                  >
                    <p className={`text-sm font-semibold ${result.passed ? 'text-green-400' : 'text-red-400'}`}>
                      {result.passed ? '✓' : '✗'} Test Case {idx + 1}
                    </p>
                    <p className="text-gray-300 text-xs mt-1">Input: {result.input}</p>
                    <p className="text-gray-300 text-xs">
                      Expected: {result.expected} | Got: {result.output}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between bg-gray-800 border-t border-gray-700 px-4 py-3">
            <button className="text-gray-400 hover:text-white text-sm transition-colors">
              Console
            </button>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setIsRunning(true);
                  // Mock test results
                  setTimeout(() => {
                    setTestResults([
                      { passed: true, input: '[7,1,5,3,6,4]', expected: '5', output: '5' },
                      { passed: true, input: '[7,6,4,3,1]', expected: '0', output: '0' }
                    ]);
                    setIsRunning(false);
                  }, 1000);
                }}
                disabled={isRunning}
                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors disabled:opacity-50"
              >
                {isRunning ? 'Running...' : '▶ Run'}
              </button>
              <button
                onClick={() => {
                  alert('Submit functionality will be implemented with backend integration');
                }}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md transition-colors"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
