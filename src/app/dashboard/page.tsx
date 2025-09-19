'use client';

import Link from "next/link";
import { useState, useEffect } from "react";

interface CVAnalysis {
  overallScore: number;
  scoreInterpretation?: {
    level: string;
    description: string;
  };
  sections: {
    contactInfo: {
      score: number;
      found: string[];
      missing: string[];
      suggestions: string[];
    };
    summary: {
      score: number;
      hasObjective: boolean;
      isRelevant: boolean;
      suggestions: string[];
    };
    experience: {
      score: number;
      yearsOfExperience: number;
      hasQuantifiableAchievements: boolean;
      relevantRoles: number;
      suggestions: string[];
    };
    skills: {
      score: number;
      technicalSkills: string[];
      softSkills: string[];
      missingKeySkills: string[];
      suggestions: string[];
    };
    education: {
      score: number;
      degrees: string[];
      isRelevant: boolean;
      suggestions: string[];
    };
    formatting: {
      score: number;
      isATSFriendly: boolean;
      issues: string[];
      suggestions: string[];
    };
  };
  keywords: {
    found: string[];
    missing: string[];
    density: number;
  };
  recommendations: {
    immediate: string[];
    longTerm: string[];
    atsOptimization: string[];
  };
  matchScore: number;
}

interface AnalysisResult {
  success: boolean;
  analysis: CVAnalysis;
  metadata: {
    jobRole: string;
    fileName: string;
    fileSize: number;
    analyzedAt: string;
  };
}

export default function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    checkAuthStatus();
    loadAnalysisResult();
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

  const loadAnalysisResult = () => {
    const stored = sessionStorage.getItem('cvAnalysis');
    if (stored) {
      try {
        const result = JSON.parse(stored);
        setAnalysisResult(result);
      } catch (error) {
        console.error('Failed to parse analysis result:', error);
      }
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
    if (score >= 80) return 'Very Good';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Fair';
    if (score >= 50) return 'Needs Work';
    return 'Poor';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
                href="/chat-test"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>AI Chat</span>
              </Link>
              <Link
                href="/upload"
                className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-2 rounded-lg font-medium hover:from-emerald-700 hover:to-teal-700 transition-all duration-200"
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

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {!analysisResult ? (
          // No analysis results - show welcome message
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-12 max-w-2xl mx-auto">
              <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Your CV Dashboard</h1>
              <p className="text-xl text-gray-600 mb-8">
                Upload your first CV to get started with AI-powered analysis and ATS optimization recommendations.
              </p>
              <Link
                href="/upload"
                className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl inline-flex items-center space-x-2"
              >
                <span>Upload Your CV</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </Link>
            </div>
          </div>
        ) : (
          // Show analysis results
          <div className="space-y-8">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">CV Analysis Results</h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>📄 {analysisResult.metadata.fileName}</span>
                    <span>💼 {analysisResult.metadata.jobRole}</span>
                    <span>📅 {formatDate(analysisResult.metadata.analyzedAt)}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`px-4 py-2 rounded-full text-lg font-semibold ${getScoreColor(analysisResult.analysis.overallScore)}`}>
                    {analysisResult.analysis.overallScore}/100
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {analysisResult.analysis.scoreInterpretation?.level || getScoreLabel(analysisResult.analysis.overallScore)}
                  </div>
                  {analysisResult.analysis.scoreInterpretation && (
                    <div className="text-xs text-gray-500 mt-1 max-w-xs">
                      {analysisResult.analysis.scoreInterpretation.description}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Overall Score</h3>
                <div className="text-3xl font-bold text-gray-900 mb-2">{analysisResult.analysis.overallScore}/100</div>
                <div className="text-sm text-gray-600 mb-3">
                  {analysisResult.analysis.scoreInterpretation?.level || getScoreLabel(analysisResult.analysis.overallScore)}
                </div>
                {analysisResult.analysis.scoreInterpretation && (
                  <div className="text-xs text-gray-500 mb-3">
                    {analysisResult.analysis.scoreInterpretation.description}
                  </div>
                )}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${analysisResult.analysis.overallScore}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Job Match</h3>
                <div className="text-3xl font-bold text-gray-900 mb-2">{analysisResult.analysis.matchScore}/100</div>
                <div className={`text-xs px-2 py-1 rounded-full mt-2 inline-block ${getScoreColor(analysisResult.analysis.matchScore)}`}>
                  {getScoreLabel(analysisResult.analysis.matchScore)}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Keyword Density</h3>
                <div className="text-3xl font-bold text-gray-900 mb-2">{analysisResult.analysis.keywords.density}/100</div>
                <div className={`text-xs px-2 py-1 rounded-full mt-2 inline-block ${getScoreColor(analysisResult.analysis.keywords.density)}`}>
                  {getScoreLabel(analysisResult.analysis.keywords.density)}
                </div>
              </div>
            </div>

            {/* Section Scores */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Section Analysis</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(analysisResult.analysis.sections).map(([sectionName, section]) => (
                  <div key={sectionName} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 capitalize">
                      {sectionName.replace(/([A-Z])/g, ' $1').trim()}
                    </h3>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl font-bold text-gray-900">{section.score}/100</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(section.score)}`}>
                        {getScoreLabel(section.score)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-emerald-600 to-teal-600 h-2 rounded-full"
                        style={{ width: `${section.score}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Keywords Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Found Keywords</h2>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.analysis.keywords.found.slice(0, 20).map((keyword, index) => (
                    <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      {keyword}
                    </span>
                  ))}
                </div>
                {analysisResult.analysis.keywords.found.length > 20 && (
                  <p className="text-sm text-gray-600 mt-2">
                    +{analysisResult.analysis.keywords.found.length - 20} more keywords found
                  </p>
                )}
              </div>

              <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Missing Keywords</h2>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.analysis.keywords.missing.slice(0, 15).map((keyword, index) => (
                    <span key={index} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                      {keyword}
                    </span>
                  ))}
                </div>
                {analysisResult.analysis.keywords.missing.length > 15 && (
                  <p className="text-sm text-gray-600 mt-2">
                    +{analysisResult.analysis.keywords.missing.length - 15} more missing keywords
                  </p>
                )}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Recommendations</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 text-red-600">🚨 Immediate Actions</h3>
                  <ul className="space-y-2">
                    {analysisResult.analysis.recommendations.immediate.map((rec, index) => (
                      <li key={index} className="text-sm text-gray-700 border-l-4 border-red-300 pl-3 py-1">
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 text-blue-600">🎯 ATS Optimization</h3>
                  <ul className="space-y-2">
                    {analysisResult.analysis.recommendations.atsOptimization.map((rec, index) => (
                      <li key={index} className="text-sm text-gray-700 border-l-4 border-blue-300 pl-3 py-1">
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 text-green-600">📈 Long-term Goals</h3>
                  <ul className="space-y-2">
                    {analysisResult.analysis.recommendations.longTerm.map((rec, index) => (
                      <li key={index} className="text-sm text-gray-700 border-l-4 border-green-300 pl-3 py-1">
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="text-center">
              <div className="inline-flex space-x-4">
                <Link
                  href="/upload"
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Analyze Another CV
                </Link>
                <button
                  onClick={() => {
                    const dataStr = JSON.stringify(analysisResult, null, 2);
                    const dataBlob = new Blob([dataStr], {type: 'application/json'});
                    const url = URL.createObjectURL(dataBlob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `cv-analysis-${new Date().toISOString().split('T')[0]}.json`;
                    link.click();
                  }}
                  className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-all duration-200"
                >
                  Download Report
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
