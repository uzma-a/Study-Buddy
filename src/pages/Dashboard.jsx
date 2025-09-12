import React, { useState, useEffect } from 'react';

export default function Dashboard() {
  const [history, setHistory] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [stats, setStats] = useState({
    totalNotes: 0,
    totalSummaries: 0,
    totalQuizzes: 0,
    averageQuizScore: 0
  });

  // Load data from localStorage on component mount
  useEffect(() => {
    loadHistoryData();
    calculateStats();
  }, []);

  const loadHistoryData = () => {
    const savedHistory = localStorage.getItem('studyHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  };

  const calculateStats = () => {
    const savedHistory = localStorage.getItem('studyHistory');
    if (savedHistory) {
      const historyData = JSON.parse(savedHistory);
      
      const notes = historyData.filter(item => item.type === 'note');
      const summaries = historyData.filter(item => item.type === 'summary');
      const quizzes = historyData.filter(item => item.type === 'quiz');
      
      const avgScore = quizzes.length > 0 
        ? Math.round(quizzes.reduce((sum, quiz) => sum + (quiz.score || 0), 0) / quizzes.length)
        : 0;

      setStats({
        totalNotes: notes.length,
        totalSummaries: summaries.length,
        totalQuizzes: quizzes.length,
        averageQuizScore: avgScore
      });
    }
  };

  const deleteActivity = (id, e) => {
    e?.stopPropagation(); // Prevent opening detail view when deleting
    const updatedHistory = history.filter(item => item.id !== id);
    setHistory(updatedHistory);
    localStorage.setItem('studyHistory', JSON.stringify(updatedHistory));
    calculateStats();
    
    // Close detail view if deleted item was selected
    if (selectedItem?.id === id) {
      setSelectedItem(null);
    }
  };

  const clearAllHistory = () => {
    if (window.confirm('Are you sure you want to clear all history?')) {
      localStorage.removeItem('studyHistory');
      setHistory([]);
      setSelectedItem(null);
      setStats({
        totalNotes: 0,
        totalSummaries: 0,
        totalQuizzes: 0,
        averageQuizScore: 0
      });
    }
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'note':
        return (
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        );
      case 'summary':
        return (
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'quiz':
        return (
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'note':
        return 'from-blue-500 to-purple-600';
      case 'summary':
        return 'from-emerald-500 to-teal-600';
      case 'quiz':
        return 'from-violet-500 to-indigo-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  // Detail Modal Component
  const DetailModal = ({ item, onClose }) => {
    if (!item) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className={`bg-gradient-to-r ${getActivityColor(item.type)}/10 dark:${getActivityColor(item.type)}/20 px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br ${getActivityColor(item.type)} rounded-xl flex items-center justify-center text-white`}>
                  {getActivityIcon(item.type)}
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                    {item.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)} • {item.date}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            <div className="prose prose-sm sm:prose dark:prose-invert max-w-none 
              prose-headings:text-gray-900 dark:prose-headings:text-white 
              prose-p:text-gray-700 dark:prose-p:text-gray-300 
              prose-li:text-gray-700 dark:prose-li:text-gray-300 
              prose-strong:text-gray-900 dark:prose-strong:text-white 
              prose-code:text-purple-600 dark:prose-code:text-purple-400 
              prose-pre:bg-gray-100 dark:prose-pre:bg-gray-900">
              
              {/* Display full content with proper formatting */}
              <div className="space-y-4">
                {(item.fullContent || item.content).split('\n').map((paragraph, index) => {
                  // Handle headers
                  if (paragraph.startsWith('## ')) {
                    return (
                      <h2 key={index} className="text-xl font-bold text-gray-900 dark:text-white mt-6 mb-3">
                        {paragraph.replace('## ', '')}
                      </h2>
                    );
                  }
                  if (paragraph.startsWith('# ')) {
                    return (
                      <h1 key={index} className="text-2xl font-bold text-gray-900 dark:text-white mt-6 mb-4">
                        {paragraph.replace('# ', '')}
                      </h1>
                    );
                  }
                  
                  // Handle bullet points
                  if (paragraph.trim().startsWith('* ') || paragraph.trim().startsWith('- ')) {
                    return (
                      <div key={index} className="flex items-start space-x-2 ml-4">
                        <span className="text-blue-500 dark:text-blue-400 mt-2">•</span>
                        <p className="text-gray-700 dark:text-gray-300 flex-1">
                          {paragraph.trim().replace(/^[*-] /, '')}
                        </p>
                      </div>
                    );
                  }
                  
                  // Handle numbered lists
                  if (/^\d+\.\s/.test(paragraph.trim())) {
                    return (
                      <div key={index} className="flex items-start space-x-2 ml-4">
                        <span className="text-blue-500 dark:text-blue-400 font-medium">
                          {paragraph.trim().match(/^\d+/)[0]}.
                        </span>
                        <p className="text-gray-700 dark:text-gray-300 flex-1">
                          {paragraph.trim().replace(/^\d+\.\s/, '')}
                        </p>
                      </div>
                    );
                  }
                  
                  // Handle bold text **text**
                  const formatText = (text) => {
                    return text.split(/(\*\*.*?\*\*)/).map((part, i) => {
                      if (part.startsWith('**') && part.endsWith('**')) {
                        return (
                          <strong key={i} className="font-bold text-gray-900 dark:text-white">
                            {part.slice(2, -2)}
                          </strong>
                        );
                      }
                      return part;
                    });
                  };
                  
                  // Regular paragraphs
                  if (paragraph.trim()) {
                    return (
                      <p key={index} className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {formatText(paragraph)}
                      </p>
                    );
                  }
                  
                  // Empty lines for spacing
                  return <div key={index} className="h-2"></div>;
                })}
              </div>
            </div>

            {item.type === 'quiz' && item.score !== null && (
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900 dark:text-white">Quiz Score:</span>
                  <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                    item.score >= 80 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      : item.score >= 60
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                  }`}>
                    {item.score}%
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 sm:px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <div className="flex justify-between items-center">
              <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                Created: {new Date(item.timestamp).toLocaleString()}
              </div>
              <button
                onClick={(e) => {
                  deleteActivity(item.id, e);
                  onClose();
                }}
                className="flex items-center space-x-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-slate-500 via-blue-600 to-indigo-500 rounded-2xl shadow-lg mb-3 sm:mb-4">
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-slate-400 dark:via-blue-400 dark:to-indigo-400">
            Study Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-base sm:text-lg px-4">
            Track your learning progress and review your study activities
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-4 sm:p-6">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{stats.totalNotes}</p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Notes</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-4 sm:p-6">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{stats.totalSummaries}</p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Summaries</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-4 sm:p-6">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{stats.totalQuizzes}</p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Quizzes</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-4 sm:p-6">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{stats.averageQuizScore}%</p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Avg Score</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-500/10 via-blue-500/10 to-indigo-500/10 dark:from-slate-500/20 dark:via-blue-500/20 dark:to-indigo-500/20 px-4 sm:px-8 py-4 sm:py-6 border-b border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-slate-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                    Recent Activity
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Your latest study sessions
                  </p>
                </div>
              </div>
              
              {history.length > 0 && (
                <button
                  onClick={clearAllHistory}
                  className="flex items-center space-x-1 sm:space-x-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
                >
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span className="text-xs sm:text-sm">Clear All</span>
                </button>
              )}
            </div>
          </div>

          <div className="p-4 sm:p-8">
            {history.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {history.map((item) => (
                  <div 
                    key={item.id} 
                    onClick={() => handleItemClick(item)}
                    className="flex items-start space-x-3 sm:space-x-4 p-4 sm:p-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-all duration-200 cursor-pointer group"
                  >
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br ${getActivityColor(item.type)} rounded-xl flex items-center justify-center text-white flex-shrink-0`}>
                      {getActivityIcon(item.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1 sm:mb-2">
                        <h3 className="text-sm sm:text-lg font-semibold text-gray-900 dark:text-white truncate pr-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {item.title}
                        </h3>
                        <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
                          {item.type === 'quiz' && item.score !== null && (
                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                              item.score >= 80 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                : item.score >= 60
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                                : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                            }`}>
                              {item.score}%
                            </div>
                          )}
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {item.date}
                          </span>
                          <button
                            onClick={(e) => deleteActivity(item.id, e)}
                            className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors duration-200 p-1"
                          >
                            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm line-clamp-2 mb-2">
                        {item.content}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                          item.type === 'note' 
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                            : item.type === 'summary'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400'
                            : 'bg-violet-100 text-violet-800 dark:bg-violet-900/20 dark:text-violet-400'
                        }`}>
                          {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                        </span>
                        <span className="text-xs text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          Click to view →
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 sm:py-16">
                <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <svg className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No Activity Yet
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-md mx-auto px-4">
                  Start creating notes, summarizing text, or taking quizzes to see your activity here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <DetailModal 
        item={selectedItem} 
        onClose={() => setSelectedItem(null)} 
      />
    </div>
  );
}

// Helper function to save activities (use this in your other components)
export const saveActivity = (type, title, content, score = null) => {
  const activity = {
    id: Date.now(),
    type, // 'note', 'summary', 'quiz'
    title,
    content: content.substring(0, 200) + (content.length > 200 ? '...' : ''),
    fullContent: content, // Store full content for detail view
    score, // For quiz scores
    timestamp: new Date().toISOString(),
    date: new Date().toLocaleDateString()
  };

  const savedHistory = localStorage.getItem('studyHistory');
  const currentHistory = savedHistory ? JSON.parse(savedHistory) : [];
  const updatedHistory = [activity, ...currentHistory].slice(0, 50); // Keep last 50 items
  
  localStorage.setItem('studyHistory', JSON.stringify(updatedHistory));
};