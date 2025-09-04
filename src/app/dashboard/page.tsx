'use client';

import Link from "next/link";
import { useState, useEffect } from "react";

interface CVResult {
  id: string;
  fileName: string;
  jobRole: string;
  uploadDate: string;
  overallScore: number;
  atsCompatibility: number;
  keywordMatch: number;
  readabilityScore: number;
  status: 'completed' | 'processing' | 'failed';
  improvementSuggestions: ImprovementSuggestion[];
}

interface ImprovementSuggestion {
  id: string;
  category: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  estimatedImprovement: number;
}

export default function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedResult, setSelectedResult] = useState<CVResult | null>(null);

  // Sample data - will be replaced with API calls later
  const sampleResults: CVResult[] = [
    {
      id: '1',
      fileName: 'john_doe_resume.pdf',
      jobRole: 'Software Engineer',
      uploadDate: '2025-01-15',
      overallScore: 85,
      atsCompatibility: 92,
      keywordMatch: 78,
      readabilityScore: 88,
      status: 'completed',
      improvementSuggestions: [
        {
          id: '1',
          category: 'high',
          title: 'Add More Technical Keywords',
          description: 'Include more industry-specific keywords like "React", "Node.js", "AWS", and "Docker" to improve keyword matching for software engineering roles.',
          impact: 'high',
          estimatedImprovement: 8
        },
        {
          id: '2',
          category: 'medium',
          title: 'Quantify Achievements',
          description: 'Replace generic statements with quantifiable achievements (e.g., "Improved performance by 40%" instead of "Improved performance").',
          impact: 'medium',
          estimatedImprovement: 5
        },
        {
          id: '3',
          category: 'low',
          title: 'Optimize File Format',
          description: 'Save your CV as a .docx file instead of PDF for better ATS compatibility, or ensure PDF is text-searchable.',
          impact: 'low',
          estimatedImprovement: 3
        }
      ]
    },
    {
      id: '2',
      fileName: 'john_doe_resume_v2.pdf',
      jobRole: 'Full Stack Developer',
      uploadDate: '2025-01-10',
      overallScore: 78,
      atsCompatibility: 85,
      keywordMatch: 82,
      readabilityScore: 75,
      status: 'completed',
      improvementSuggestions: [
        {
          id: '4',
          category: 'critical',
          title: 'Improve Readability Score',
          description: 'Your CV readability score is low. Use standard fonts (Arial, Calibri, Times New Roman), increase font size to 10-12pt, and improve line spacing.',
          impact: 'high',
          estimatedImprovement: 12
        },
        {
          id: '5',
          category: 'high',
          title: 'Add Skills Section',
          description: 'Create a dedicated skills section with technical skills relevant to full-stack development, organized by category (Frontend, Backend, Tools).',
          impact: 'high',
          estimatedImprovement: 7
        },
        {
          id: '6',
          category: 'medium',
          title: 'Include Portfolio Links',
          description: 'Add links to your GitHub repositories, personal projects, or portfolio website to showcase your work.',
          impact: 'medium',
          estimatedImprovement: 4
        }
      ]
    },
    {
      id: '3',
      fileName: 'john_doe_resume_final.pdf',
      jobRole: 'Frontend Developer',
      uploadDate: '2025-01-05',
      overallScore: 91,
      atsCompatibility: 95,
      keywordMatch: 88,
      readabilityScore: 92,
      status: 'completed',
      improvementSuggestions: [
        {
          id: '7',
          category: 'medium',
          title: 'Add Performance Metrics',
          description: 'Include specific performance improvements or user experience enhancements in your project descriptions.',
          impact: 'medium',
          estimatedImprovement: 4
        },
        {
          id: '8',
          category: 'low',
          title: 'Update Recent Technologies',
          description: 'Consider adding newer technologies like Next.js 14, React Server Components, or modern CSS frameworks if relevant to your experience.',
          impact: 'low',
          estimatedImprovement: 2
        }
      ]
    }
  ];

  const latestResult = sampleResults[0];

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/check-cookie');
      const data = await response.json();

      if (data.hasToken) {
        setIsAuthenticated(true);
      } else {
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      window.location.href = '/login';
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Logout error:', error);
      window.location.href = '/';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-yellow-600 bg-yellow-100';
    if (score >= 70) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Good';
    if (score >= 70) return 'Fair';
    return 'Needs Improvement';
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'critical': return 'text-red-600 bg-red-100 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-100 border-green-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              ReadyCV
            </Link>
            <div className="flex items-center space-x-4">
              <Link
                href="/upload"
                className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-2 rounded-lg font-medium hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Upload New CV
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">CV Analysis Dashboard</h1>
          <p className="text-gray-600">View your CV analysis results and track improvements over time</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Latest Result Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Latest Analysis</h2>
                <span className="text-sm text-gray-500">{latestResult.uploadDate}</span>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">File:</span>
                  <span className="text-sm text-gray-600">{latestResult.fileName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Target Role:</span>
                  <span className="text-sm text-gray-600">{latestResult.jobRole}</span>
                </div>
              </div>

              {/* Overall Score */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-semibold text-gray-900">Overall Score</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(latestResult.overallScore)}`}>
                    {latestResult.overallScore}/100 - {getScoreLabel(latestResult.overallScore)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${latestResult.overallScore}%` }}
                  ></div>
                </div>
              </div>

              {/* Detailed Scores */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900 mb-1">{latestResult.atsCompatibility}%</div>
                  <div className="text-sm text-gray-600">ATS Compatibility</div>
                  <div className={`text-xs px-2 py-1 rounded-full mt-2 inline-block ${getScoreColor(latestResult.atsCompatibility)}`}>
                    {getScoreLabel(latestResult.atsCompatibility)}
                  </div>
                </div>

                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900 mb-1">{latestResult.keywordMatch}%</div>
                  <div className="text-sm text-gray-600">Keyword Match</div>
                  <div className={`text-xs px-2 py-1 rounded-full mt-2 inline-block ${getScoreColor(latestResult.keywordMatch)}`}>
                    {getScoreLabel(latestResult.keywordMatch)}
                  </div>
                </div>

                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900 mb-1">{latestResult.readabilityScore}%</div>
                  <div className="text-sm text-gray-600">Readability</div>
                  <div className={`text-xs px-2 py-1 rounded-full mt-2 inline-block ${getScoreColor(latestResult.readabilityScore)}`}>
                    {getScoreLabel(latestResult.readabilityScore)}
                  </div>
                </div>
              </div>

              {/* Improvement Suggestions */}
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Improvement Suggestions</h3>
                <div className="space-y-4">
                  {latestResult.improvementSuggestions.slice(0, 3).map((suggestion) => (
                    <div key={suggestion.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize border ${getCategoryColor(suggestion.category)}`}>
                            {suggestion.category}
                          </span>
                          <span className={`text-xs font-medium ${getImpactColor(suggestion.impact)}`}>
                            +{suggestion.estimatedImprovement} pts potential
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-xs text-gray-500">Impact:</span>
                          <span className={`text-xs font-medium capitalize ${getImpactColor(suggestion.impact)}`}>
                            {suggestion.impact}
                          </span>
                        </div>
                      </div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">{suggestion.title}</h4>
                      <p className="text-sm text-gray-600">{suggestion.description}</p>
                    </div>
                  ))}
                </div>
                {latestResult.improvementSuggestions.length > 3 && (
                  <div className="mt-4 text-center">
                    <button
                      onClick={() => setSelectedResult(latestResult)}
                      className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                    >
                      View all {latestResult.improvementSuggestions.length} suggestions →
                    </button>
                  </div>
                )}

                {/* Improvement Summary */}
                <div className="mt-6 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">Potential Score Improvement</h4>
                      <p className="text-xs text-gray-600">By implementing all suggestions</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-emerald-600">
                        +{latestResult.improvementSuggestions.reduce((total, suggestion) => total + suggestion.estimatedImprovement, 0)} pts
                      </div>
                      <div className="text-xs text-gray-500">
                        New score: {Math.min(100, latestResult.overallScore + latestResult.improvementSuggestions.reduce((total, suggestion) => total + suggestion.estimatedImprovement, 0))}/100
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex space-x-4">
                <button
                  onClick={() => setSelectedResult(latestResult)}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-2 rounded-lg font-medium hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  View Detailed Report
                </button>
                <Link
                  href="/upload"
                  className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Upload New Version
                </Link>
              </div>
            </div>
          </div>

          {/* Previous Results */}
          <div>
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Previous Analyses</h3>

              <div className="space-y-4">
                {sampleResults.slice(1).map((result) => (
                  <div key={result.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900 truncate">{result.fileName}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(result.overallScore)}`}>
                        {result.overallScore}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 mb-2">{result.jobRole}</div>
                    <div className="text-xs text-gray-500">{result.uploadDate}</div>
                  </div>
                ))}
              </div>

              <div className="mt-4 text-center">
                <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                  View All Results →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Report Modal */}
        {selectedResult && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-semibold text-gray-900">Detailed Analysis Report</h3>
                  <button
                    onClick={() => setSelectedResult(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-6">
                  {/* File Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium text-gray-700">File Name:</span>
                      <p className="text-gray-900">{selectedResult.fileName}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Target Role:</span>
                      <p className="text-gray-900">{selectedResult.jobRole}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Upload Date:</span>
                      <p className="text-gray-900">{selectedResult.uploadDate}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Status:</span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        {selectedResult.status}
                      </span>
                    </div>
                  </div>

                  {/* Detailed Scores */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Analysis Breakdown</h4>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">ATS Compatibility</span>
                          <span className="text-sm text-gray-600">{selectedResult.atsCompatibility}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${selectedResult.atsCompatibility}%` }}></div>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">How well your CV passes through Applicant Tracking Systems</p>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">Keyword Match</span>
                          <span className="text-sm text-gray-600">{selectedResult.keywordMatch}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: `${selectedResult.keywordMatch}%` }}></div>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">Relevance of keywords for your target job role</p>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">Readability Score</span>
                          <span className="text-sm text-gray-600">{selectedResult.readabilityScore}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${selectedResult.readabilityScore}%` }}></div>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">How easy it is for recruiters to read your CV</p>
                      </div>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Improvement Suggestions</h4>
                    <div className="space-y-4">
                      {selectedResult.improvementSuggestions.map((suggestion) => (
                        <div key={suggestion.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize border ${getCategoryColor(suggestion.category)}`}>
                                {suggestion.category} Priority
                              </span>
                              <span className={`text-xs font-medium ${getImpactColor(suggestion.impact)}`}>
                                Est. +{suggestion.estimatedImprovement} pts
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <span className="text-xs text-gray-500">Impact:</span>
                              <span className={`text-xs font-medium capitalize ${getImpactColor(suggestion.impact)}`}>
                                {suggestion.impact}
                              </span>
                            </div>
                          </div>
                          <h5 className="text-sm font-semibold text-gray-900 mb-2">{suggestion.title}</h5>
                          <p className="text-sm text-gray-600">{suggestion.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
