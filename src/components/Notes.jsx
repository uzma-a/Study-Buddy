import React from "react";
import { useState } from "react";
import { saveActivity } from '../pages/Dashboard';
import { generateNotes } from "../utils/api";
import { saveAsPdf } from "../utils/pdfExport";
import ReactMarkdown from "react-markdown";

export default function Notes() {
  const [topic, setTopic] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);

    try {
      const result = await generateNotes(topic);
      console.log("Generated Notes:", result);
      setNotes(result);
      
      // Fix: Pass the result (full content) as the third parameter
      saveActivity('note', topic, result);

      // Store in memory instead of localStorage for Claude.ai compatibility
      window.lastNotes = result;
    } catch (err) {
      console.error("Error generating notes:", err);
      alert("Failed to generate notes. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const handlePdfDownload = async () => {
    if (!notes || !topic) return;

    setPdfLoading(true);
    try {
      // Add a small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 500));
      await saveAsPdf(`Study Notes - ${topic}`, notes);
    } catch (error) {
      console.error("PDF generation failed:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setPdfLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleGenerate();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        {/* Header Section */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-2xl shadow-lg mb-3 sm:mb-4">
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent dark:from-blue-400 dark:via-purple-400 dark:to-pink-400">
            AI Notes Generator
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-base sm:text-lg px-4">
            Transform any topic into comprehensive study notes instantly
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
          <div className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                Enter your study topic
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter a topic to generate notes..."
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg border-2 border-gray-200 dark:border-gray-600 
             rounded-xl focus:border-blue-500 dark:focus:border-blue-400 
             focus:ring-4 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 
             outline-none transition-all duration-200 bg-white dark:bg-gray-700 
             text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  onKeyPress={handleKeyPress}
                />

                <div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || !topic.trim()}
              className="w-full relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:via-gray-400 disabled:to-gray-400 text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none disabled:hover:shadow-lg transition-all duration-200 text-base sm:text-lg group"
            >
              <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                {loading ? (
                  <>
                    <svg className="animate-spin w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-sm sm:text-base">Generating Amazing Notes...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-12 transition-transform duration-200" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    <span className="text-sm sm:text-base">Generate Study Notes</span>
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </div>

              {/* Shimmer effect */}
              <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:animate-pulse group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>

        {/* Notes Display */}
        {notes && (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 dark:from-blue-500/20 dark:via-purple-500/20 dark:to-pink-500/20 px-4 sm:px-8 py-4 sm:py-6 border-b border-gray-200/50 dark:border-gray-700/50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 2h8a1 1 0 110 2H6a1 1 0 110-2zm0 4h8a1 1 0 110 2H6a1 1 0 110-2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                      Study Notes: {topic}
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      Generated just now
                    </p>
                  </div>
                </div>

                <button
                  onClick={handlePdfDownload}
                  disabled={pdfLoading}
                  className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none transition-all duration-200 group text-sm sm:text-base"
                >
                  {pdfLoading ? (
                    <>
                      <svg className="animate-spin w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="hidden sm:inline">Creating PDF...</span>
                      <span className="sm:hidden">PDF...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="hidden sm:inline">Download PDF</span>
                      <span className="sm:hidden">PDF</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-8">
              <div className="prose prose-sm sm:prose-lg dark:prose-invert max-w-none 
                prose-headings:text-gray-900 dark:prose-headings:text-white 
                prose-headings:mb-6 prose-headings:mt-8 prose-headings:pb-3 prose-headings:border-b-2 prose-headings:border-blue-500/20
                prose-p:text-gray-700 dark:prose-p:text-gray-300 
                prose-p:mb-6 prose-p:pb-6 prose-p:leading-relaxed prose-p:border-b prose-p:border-gray-200/50 dark:prose-p:border-gray-700/30
                prose-p:last:border-b-0
                prose-li:text-gray-700 dark:prose-li:text-gray-300 
                prose-ul:mb-6 prose-ul:pb-6 prose-ul:border-b prose-ul:border-gray-200/50 dark:prose-ul:border-gray-700/30
                prose-ol:mb-6 prose-ol:pb-6 prose-ol:border-b prose-ol:border-gray-200/50 dark:prose-ol:border-gray-700/30
                prose-strong:text-gray-900 dark:prose-strong:text-white 
                prose-code:text-purple-600 dark:prose-code:text-purple-400 
                prose-pre:bg-gray-100 dark:prose-pre:bg-gray-900 prose-pre:mb-6">
                <ReactMarkdown>{notes}</ReactMarkdown>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!notes && !loading && (
          <div className="text-center py-12 sm:py-16 px-4">
            <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <svg className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Ready to Create Amazing Notes?
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              Enter any topic above and watch as AI transforms it into comprehensive, well-structured study notes.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
