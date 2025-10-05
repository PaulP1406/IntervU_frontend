'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { getTechnicalQuestion, executeCode, getHint, type TechnicalQuestion, type ExecuteCodeResponse } from '@/lib/api';
import { useInterview } from '@/context/InterviewContext';

// Generate starter code based on function name
const getStarterCode = (language: string, functionName: string) => {
  switch (language) {
    case 'python':
      return `def ${functionName}():\n    # Write your code here\n    pass`;
    case 'javascript':
      return `/**\n * @param {any} param\n * @return {any}\n */\nvar ${functionName} = function(param) {\n    \n};`;
    case 'cpp':
      return `class Solution {\npublic:\n    void ${functionName}() {\n        \n    }\n};`;
    case 'java':
      return `class Solution {\n    public void ${functionName}() {\n        \n    }\n}`;
    default:
      return `def ${functionName}():\n    # Write your code here\n    pass`;
  }
};

export default function TechnicalInterview() {
  const router = useRouter();
  const { sessionId } = useInterview();
  
  const [selectedTab, setSelectedTab] = useState<'description' | 'submissions' | 'notes'>('description');
  const [language, setLanguage] = useState<'python' | 'javascript' | 'cpp' | 'java'>('python');
  const [code, setCode] = useState(getStarterCode('python', 'solution'));
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [problem, setProblem] = useState<TechnicalQuestion | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<ExecuteCodeResponse | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [notes, setNotes] = useState('');
  const [previousHints, setPreviousHints] = useState<string[]>([]);
  const [isGettingHint, setIsGettingHint] = useState(false);

  // Load initial question
  useEffect(() => {
    loadQuestion(difficulty);
  }, []);

  const loadQuestion = async (diff: 'Easy' | 'Medium' | 'Hard') => {
    setIsLoading(true);
    try {
      const question = await getTechnicalQuestion(diff);
      console.log('📦 [RECEIVED] Technical Question:', JSON.stringify(question, null, 2));
      console.log('📋 [DETAILS] ID:', question.id);
      console.log('📋 [DETAILS] Difficulty:', question.difficulty);
      console.log('📋 [DETAILS] Function Name:', question.question.functionName);
      console.log('📋 [DETAILS] Test Cases:', question.question.testCases.length);
      setProblem(question);
      setCode(getStarterCode(language, question.question.functionName));
      setTestResults(null);
      setPreviousHints([]);
      setNotes('');
    } catch (error) {
      console.error('Failed to load question:', error);
      alert('Failed to load technical question. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDifficultyChange = (newDiff: 'Easy' | 'Medium' | 'Hard') => {
    setDifficulty(newDiff);
    loadQuestion(newDiff);
  };

  const handleLanguageChange = (newLang: 'python' | 'javascript' | 'cpp' | 'java') => {
    setLanguage(newLang);
    if (problem) {
      setCode(getStarterCode(newLang, problem.question.functionName));
    }
  };

  const handleRunCode = async () => {
    if (!problem) return;
    
    setIsRunning(true);
    try {
      console.log('🚀 Running code with questionId:', problem.id);
      const result = await executeCode({
        questionId: problem.id,
        code,
        language
      });
      console.log('📦 [RECEIVED] Execution Result:', JSON.stringify(result, null, 2));
      console.log('📋 [DETAILS] Success:', result.success);
      console.log('📋 [DETAILS] Execution Time:', result.executionTime + 'ms');
      console.log('📋 [DETAILS] Output:', result.output);
      if (result.error) console.log('📋 [DETAILS] Error:', result.error);
      setTestResults(result);
    } catch (error) {
      console.error('Failed to run code:', error);
      alert('Failed to execute code. Please try again.');
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!problem) return;
    
    setIsRunning(true);
    try {
      console.log('🚀 Submitting code with questionId:', problem.id);
      const result = await executeCode({
        questionId: problem.id,
        code,
        language
      });
      console.log('📦 [RECEIVED] Submit Result:', JSON.stringify(result, null, 2));
      console.log('📋 [DETAILS] Success:', result.success);
      console.log('📋 [DETAILS] Execution Time:', result.executionTime + 'ms');
      setTestResults(result);
      
      if (result.success) {
        alert('✅ All test cases passed! Great job!');
        setSelectedTab('submissions');
      } else {
        alert('❌ Some test cases failed. Check the results below.');
      }
    } catch (error) {
      console.error('Failed to submit code:', error);
      alert('Failed to submit code. Please try again.');
    } finally {
      setIsRunning(false);
    }
  };

  const handleGetHint = async () => {
    if (!problem || !sessionId) {
      alert('Session not available. Please go back and start a new interview.');
      return;
    }
    
    setIsGettingHint(true);
    try {
      console.log('🚀 Requesting hint with questionId:', problem.id);
      const hint = await getHint({
        sessionId,
        questionId: problem.id,
        previousHints,
        userCode: code,
        userSpeech: "Can you give me a hint for this problem?"
      });
      console.log('📦 [RECEIVED] Hint Response:', JSON.stringify(hint, null, 2));
      console.log('📋 [DETAILS] Conversational Hint:', hint.conversationalHint);
      console.log('📋 [DETAILS] Hint Summary:', hint.hintSummary);
      
      setPreviousHints([...previousHints, hint.hintSummary]);
      alert(`💡 Hint: ${hint.conversationalHint}`);
    } catch (error) {
      console.error('Failed to get hint:', error);
      alert('Failed to get hint. Please try again.');
    } finally {
      setIsGettingHint(false);
    }
  };

  const handleReset = () => {
    if (problem) {
      setCode(getStarterCode(language, problem.question.functionName));
    }
    setTestResults(null);
  };

  const getMonacoLanguage = (lang: string) => {
    switch (lang) {
      case 'python': return 'python';
      case 'javascript': return 'javascript';
      case 'cpp': return 'cpp';
      case 'java': return 'java';
      default: return 'python';
    }
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
          <select
            value={difficulty}
            onChange={(e) => handleDifficultyChange(e.target.value as any)}
            className="bg-gray-700 text-white px-3 py-1.5 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleGetHint}
            disabled={isGettingHint}
            className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md transition-colors text-sm disabled:opacity-50"
          >
            💡 {isGettingHint ? 'Getting Hint...' : 'Get Hint'}
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
              isLoading ? (
                <div className="text-center py-12">
                  <p className="text-gray-400">Loading question...</p>
                </div>
              ) : problem ? (
                <div className="space-y-6">
                  {/* Title and Difficulty */}
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      {problem.question.question}
                    </h2>
                    <span className={`text-sm font-semibold ${getDifficultyColor(problem.difficulty)}`}>
                      {problem.difficulty}
                    </span>
                  </div>

                  {/* Description */}
                  <div className="text-gray-300 leading-relaxed whitespace-pre-line">
                    {problem.question.description}
                  </div>

                  {/* Test Cases */}
                  <div className="space-y-4">
                    <p className="text-white font-semibold">Test Cases:</p>
                    {problem.question.testCases.map((testCase, idx) => (
                      <div key={idx} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                        <p className="text-white font-semibold mb-2">Test Case {idx + 1}:</p>
                        <div className="space-y-1 text-sm">
                          <p className="text-gray-300">
                            <span className="text-gray-400">Input:</span> {testCase.input}
                          </p>
                          <p className="text-gray-300">
                            <span className="text-gray-400">Expected Output:</span> {testCase.expectedOutput}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-400">Failed to load question. Please try again.</p>
                </div>
              )
            )}

            {selectedTab === 'submissions' && (
              <div className="text-center py-12">
                <p className="text-gray-400">No submissions yet. Submit your code to see results here.</p>
              </div>
            )}

            {selectedTab === 'notes' && (
              <div>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
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
              onChange={(value) => setCode(value || '')}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                roundedSelection: false,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 4,
                insertSpaces: true,
                wordWrap: 'on',
                padding: { top: 16, bottom: 16 },
                suggestOnTriggerCharacters: true,
                quickSuggestions: true,
                fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                fontLigatures: true,
                cursorBlinking: 'smooth',
                cursorSmoothCaretAnimation: 'on',
                smoothScrolling: true,
              }}
            />
          </div>

          {/* Test Results Panel */}
          {testResults && (
            <div className="border-t border-gray-700 bg-gray-800 p-4 max-h-64 overflow-y-auto">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-semibold">
                  {testResults.success ? '✅ All Tests Passed!' : '❌ Test Failed'}
                </h3>
                <button
                  onClick={() => setTestResults(null)}
                  className="text-gray-400 hover:text-white text-sm"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-2">
                <div className={`p-3 rounded ${
                  testResults.success ? 'bg-green-900/30 border border-green-700' : 'bg-red-900/30 border border-red-700'
                }`}>
                  <p className="text-gray-300 text-sm mb-2">
                    <span className="font-semibold">Execution Time:</span> {testResults.executionTime}ms
                  </p>
                  {testResults.output && (
                    <div className="mb-2">
                      <p className="text-gray-400 text-xs mb-1">Output:</p>
                      <pre className="text-gray-300 text-xs bg-gray-900 p-2 rounded overflow-x-auto">{testResults.output}</pre>
                    </div>
                  )}
                  {testResults.error && (
                    <div>
                      <p className="text-red-400 text-xs mb-1">Error:</p>
                      <pre className="text-red-300 text-xs bg-gray-900 p-2 rounded overflow-x-auto">{testResults.error}</pre>
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
                <span>💡 Hints used: {previousHints.length}</span>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleRunCode}
                disabled={isRunning || !problem}
                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors disabled:opacity-50"
              >
                {isRunning ? 'Running...' : '▶ Run'}
              </button>
              <button
                onClick={handleSubmit}
                disabled={isRunning || !problem}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md transition-colors disabled:opacity-50"
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
