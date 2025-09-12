import React from "react";
import { useState } from "react";
import { summarizeText } from "../utils/api";
import { saveActivity } from '../pages/Dashboard';
import { saveAsPdf } from "../utils/pdfExport";

export default function Summarizer() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    setWordCount(newText.trim() ? newText.trim().split(/\s+/).length : 0);
  };

  // Function to clean markdown formatting
  const cleanMarkdownFormatting = (text) => {
    return text
      .replace(/\*\*\*([^*]+)\*\*\*/g, '$1') // remove ***
      .replace(/\*\*([^*]+)\*\*/g, '$1')    // remove **
      .replace(/^\* /gm, '• ')              // replace * bullets with •
      .replace(/\n{2,}/g, '\n\n')           // normalize spacing
      .trim();
  };

  const handleSummarize = async () => {
    if (!text.trim()) return;
    setLoading(true);

    try {
      const result = await summarizeText(text);
      // Clean the summary immediately when received
      const cleanedSummary = cleanMarkdownFormatting(result);
      setSummary(cleanedSummary);
      
      // Enhanced activity saving with more detailed information
      const activityTitle = `Summary of "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`;
      const fullActivityContent = `**Original Text** (${wordCount} words):\n\n${text}\n\n---\n\n**AI-Generated Summary** (${cleanedSummary.trim().split(/\s+/).length} words, ${Math.round((cleanedSummary.length / text.length) * 100)}% compression):\n\n${cleanedSummary}`;
      
      saveActivity('summary', activityTitle, fullActivityContent);
      
      // Store in memory instead of localStorage for Claude.ai compatibility
      window.lastSummary = cleanedSummary;
    } catch (error) {
      console.error("Error summarizing text:", error);
      alert("Failed to summarize text. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setText("");
    setSummary("");
    setWordCount(0);
    setCopySuccess(false);
  };

  const handleCopySummary = async () => {
    try {
      // Summary is already cleaned, so we can copy it directly
      await navigator.clipboard.writeText(summary);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error("Failed to copy text:", error);
      alert("Failed to copy summary to clipboard");
    }
  };

  const handlePdfDownload = async () => {
    if (!summary || !text) return;

    setPdfLoading(true);
    try {
      // Summary is already cleaned, so we can use it directly
      const pdfContent = `
# Text Summary Report

---

## Original Text
- **Word Count:** ${wordCount} words  
- **Character Count:** ${text.length} characters  

${text}

---

## AI-Generated Summary
- **Compression Ratio:** ${Math.round((summary.length / text.length) * 100)}% of original length  
- **Summary Word Count:** ${summary.trim().split(/\s+/).length} words

${summary}
      `;

      await new Promise(resolve => setTimeout(resolve, 500));
      await saveAsPdf("Text Summary Report", pdfContent);
    } catch (error) {
      console.error("PDF generation failed:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-500 rounded-2xl shadow-lg mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400">
            Smart Text Summarizer
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
            Transform lengthy content into concise, meaningful summaries
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      Original Text
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {wordCount} words
                    </p>
                  </div>
                </div>
                
                {text && (
                  <button
                    onClick={handleClear}
                    className="flex items-center space-x-2 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span className="text-sm">Clear</span>
                  </button>
                )}
              </div>

              <div className="relative">
                <textarea
                  placeholder="Paste your long text, article, or document here... 

Examples:
• Research papers and articles
• Meeting notes and reports  
• Blog posts and essays
• Legal documents
• Technical documentation"
                  className="w-full h-80 p-6 text-base border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/20 dark:focus:ring-emerald-400/20 outline-none transition-all duration-200 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                  value={text}
                  onChange={handleTextChange}
                />
                
                {/* Character limit indicator */}
                <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg px-3 py-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {text.length} characters
                  </span>
                </div>
              </div>

              <button
                onClick={handleSummarize}
                disabled={loading || !text.trim() || wordCount < 10}
                className="w-full mt-6 relative overflow-hidden bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 disabled:from-gray-400 disabled:via-gray-400 disabled:to-gray-400 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none disabled:hover:shadow-lg transition-all duration-200 text-lg group"
              >
                <div className="flex items-center justify-center space-x-3">
                  {loading ? (
                    <>
                      <svg className="animate-spin w-6 h-6 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Creating Summary...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span>Summarize Text</span>
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </div>
                
                {/* Shimmer effect */}
                <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:animate-pulse group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>

              {wordCount < 10 && text.length > 0 && (
                <p className="text-amber-600 dark:text-amber-400 text-sm mt-2 flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>Please enter at least 10 words for a meaningful summary</span>
                </p>
              )}
            </div>
          </div>

          {/* Summary Section */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50">
            {summary ? (
              <>
                {/* Header */}
                <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 dark:from-emerald-500/20 dark:via-teal-500/20 dark:to-cyan-500/20 px-8 py-6 border-b border-gray-200/50 dark:border-gray-700/50 rounded-t-2xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 2h8a1 1 0 110 2H6a1 1 0 110-2zm0 4h8a1 1 0 110 2H6a1 1 0 110-2z" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                          AI Summary
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Condensed from {wordCount} words • {Math.round((summary.length / text.length) * 100)}% compression
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handleCopySummary}
                        className={`flex items-center space-x-2 font-semibold px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 group ${
                          copySuccess 
                            ? 'bg-green-600 hover:bg-green-700 text-white' 
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        }`}
                      >
                        {copySuccess ? (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="hidden sm:inline">Copied!</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            <span className="hidden sm:inline">Copy</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={handlePdfDownload}
                        disabled={pdfLoading}
                        className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none transition-all duration-200 group"
                      >
                        {pdfLoading ? (
                          <>
                            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span className="hidden sm:inline">PDF...</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="hidden sm:inline">PDF</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-li:text-gray-700 dark:prose-li:text-gray-300">
                    <div className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 leading-relaxed">
                      {summary}
                    </div>
                  </div>

                  {/* Summary Statistics */}
                  <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4">
                        <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                          {wordCount}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Original Words
                        </div>
                      </div>
                      
                      <div className="bg-teal-50 dark:bg-teal-900/20 rounded-xl p-4">
                        <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                          {summary.trim().split(/\s+/).length}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Summary Words
                        </div>
                      </div>
                      
                      <div className="bg-cyan-50 dark:bg-cyan-900/20 rounded-xl p-4">
                        <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
                          {Math.round((summary.length / text.length) * 100)}%
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Compression
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              /* Empty State */
              <div className="h-full flex items-center justify-center p-16">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-12 h-12 text-emerald-400 dark:text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Your Summary Will Appear Here
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 max-w-sm mx-auto">
                    Paste your text on the left and click "Summarize" to get an intelligent, concise summary.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}