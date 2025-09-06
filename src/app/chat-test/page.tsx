'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatTest() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState<string>('');

  const testGemini = async () => {
    setIsLoading(true);
    setApiStatus('Testing Google Gemini connection...');
    
    try {
      const response = await fetch('/api/gemini-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Hello, are you working?'
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setApiStatus('✅ Google Gemini connection successful!');
        setMessages(prev => [
          ...prev,
          { role: 'user', content: 'Hello Gemini, are you working?', timestamp: new Date() },
          { role: 'assistant', content: data.response, timestamp: new Date() }
        ]);
      } else {
        setApiStatus(`❌ Gemini Error: ${data.error}`);
      }
    } catch (error) {
      setApiStatus(`❌ Gemini Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    
    setIsLoading(false);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setIsLoading(true);

    setMessages(prev => [
      ...prev,
      { role: 'user', content: userMessage, timestamp: new Date() }
    ]);

    try {
      const response = await fetch('/api/gemini-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessages(prev => [
          ...prev,
          { role: 'assistant', content: data.response, timestamp: new Date() }
        ]);
      } else {
        setMessages(prev => [
          ...prev,
          { role: 'assistant', content: `Error: ${data.error}`, timestamp: new Date() }
        ]);
      }
    } catch (error) {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: `Connection error: ${error instanceof Error ? error.message : 'Unknown error'}`, timestamp: new Date() }
      ]);
    }
    
    setIsLoading(false);
  };

  const checkGeminiStatus = async () => {
    setApiStatus('Checking Google Gemini status...');
    
    try {
      const response = await fetch('/api/gemini-status');
      const data = await response.json();
      
      setApiStatus(`Gemini Status: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      setApiStatus(`Gemini status check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              ReadyCV - Gemini AI Test
            </Link>
            <div className="flex items-center space-x-4">
              <Link
                href="/upload"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Back to Upload
              </Link>
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Google Gemini Connection Test</h1>
          <p className="text-gray-600 mb-6">
            Use this page to test if your Google Gemini API key is working correctly before analyzing CVs.
          </p>

          {/* Status Section */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">API Status</h2>
            <div className="flex space-x-4 mb-4">
              <button
                onClick={testGemini}
                disabled={isLoading}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                Test Gemini
              </button>
              <button
                onClick={checkGeminiStatus}
                disabled={isLoading}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Check Gemini Status
              </button>
            </div>
            {apiStatus && (
              <pre className="text-sm bg-white p-3 rounded border overflow-auto max-h-32">
                {apiStatus}
              </pre>
            )}
          </div>

          {/* Chat Section */}
          <div className="border border-gray-200 rounded-lg">
            <div className="h-96 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  No messages yet. Click "Test Connection" or send a message to start.
                </div>
              ) : (
                messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-900'
                      }`}
                    >
                      <div className="font-medium text-sm mb-1">
                        {message.role === 'user' ? 'You' : 'Gemini'}
                      </div>
                      <div>{message.content}</div>
                      <div className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 text-gray-900 max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                      <span>Gemini is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Section */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message to test Gemini..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading}
                />
                <button
                  onClick={sendMessage}
                  disabled={isLoading || !input.trim()}
                  className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50"
                >
                  Send
                </button>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Troubleshooting</h3>
            <ul className="text-blue-800 space-y-1 text-sm">
              <li>• If you get errors, check your Gemini API key at aistudio.google.com</li>
              <li>• Make sure the Generative Language API is enabled in Google Cloud</li>
              <li>• Gemini has generous free tier limits</li>
              <li>• Check usage at Google AI Studio dashboard</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
