import React, { useState, useEffect } from "react";
import { generateQuiz } from "../utils/api";
import { saveActivity } from '../pages/Dashboard';

export default function Quiz() {
  const [topic, setTopic] = useState("");
  const [quiz, setQuiz] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizMode, setQuizMode] = useState('practice'); // 'practice' or 'exam'
  const [quizCompleted, setQuizCompleted] = useState(false); // Track if quiz is completed

  const handleGenerateQuiz = async () => {
    if (!topic.trim()) return alert("Please enter a topic");
    setLoading(true);
    try {
      const result = await generateQuiz(topic, 10);
      setQuiz(result);
      localStorage.setItem("lastQuiz", JSON.stringify(result));
      setSelectedOptions({});
      setShowResults(false);
      setCurrentQuestionIndex(0);
      setQuizCompleted(false); // Reset completion status
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (qIndex, option) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [qIndex]: option,
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleGenerateQuiz();
    }
  };

  const calculateScore = () => {
    let correct = 0;
    quiz.forEach((q, index) => {
      if (selectedOptions[index] === q.answer) {
        correct++;
      }
    });
    return { correct, total: quiz.length, percentage: Math.round((correct / quiz.length) * 100) };
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600 dark:text-green-400';
    if (percentage >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreEmoji = (percentage) => {
    if (percentage >= 90) return '🏆';
    if (percentage >= 80) return '🎉';
    if (percentage >= 70) return '👍';
    if (percentage >= 60) return '😊';
    return '📚';
  };

  const resetQuiz = () => {
    setSelectedOptions({});
    setShowResults(false);
    setCurrentQuestionIndex(0);
    setQuizCompleted(false);
  };

  const answeredCount = Object.keys(selectedOptions).length;
  const score = calculateScore();

  // Save activity only when quiz is fully completed (all questions answered)
  useEffect(() => {
    if (quiz.length > 0 && answeredCount === quiz.length && !quizCompleted) {
      saveActivity('quiz', topic, `Quiz on ${topic}`, score.percentage);
      setQuizCompleted(true);
    }
  }, [answeredCount, quiz.length, topic, score.percentage, quizCompleted]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-500 rounded-2xl shadow-lg mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent dark:from-violet-400 dark:via-purple-400 dark:to-indigo-400">
            Interactive Quiz Generator
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
            Test your knowledge with AI-generated questions
          </p>
        </div>

        {/* Quiz Generation Section */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-8 mb-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Enter quiz topic
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter a topic to test your knowledge..."
                  className="w-full px-6 py-4 text-lg border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-violet-500 dark:focus:border-violet-400 focus:ring-4 focus:ring-violet-500/20 dark:focus:ring-violet-400/20 outline-none transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleGenerateQuiz}
                disabled={loading || !topic.trim()}
                className="flex-1 relative overflow-hidden bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-700 hover:via-purple-700 hover:to-indigo-700 disabled:from-gray-400 disabled:via-gray-400 disabled:to-gray-400 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none disabled:hover:shadow-lg transition-all duration-200 text-lg group"
              >
                <div className="flex items-center justify-center space-x-3">
                  {loading ? (
                    <>
                      <svg className="animate-spin w-6 h-6 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Generating Quiz...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-6 h-6 group-hover:rotate-12 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span>Generate Quiz (10 Questions)</span>
                    </>
                  )}
                </div>
                <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:animate-pulse group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>

              {quiz.length > 0 && (
                <button
                  onClick={resetQuiz}
                  className="px-6 py-4 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Quiz Progress Bar */}
        {quiz.length > 0 && (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Quiz Progress
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {answeredCount} of {quiz.length} questions answered
                  </p>
                </div>
              </div>

              <div className="text-right">
                <div className={`text-2xl font-bold ${getScoreColor(score.percentage)}`}>
                  {score.percentage}% {getScoreEmoji(score.percentage)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {score.correct}/{score.total} correct
                </div>
              </div>
            </div>

            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-violet-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(answeredCount / quiz.length) * 100}%` }}
              ></div>
            </div>

            {/* Quiz Completion Message */}
            {answeredCount === quiz.length && quiz.length > 0 && (
              <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-700">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-800 dark:text-green-200">
                      Quiz Completed! 🎉
                    </h4>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Great job! Your result has been saved to the dashboard.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Quiz Questions */}
        {quiz.length > 0 && (
          <div className="space-y-6">
            {quiz.map((q, i) => (
              <div key={i} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
                {/* Question Header */}
                <div className="bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-indigo-500/10 dark:from-violet-500/20 dark:via-purple-500/20 dark:to-indigo-500/20 px-8 py-6 border-b border-gray-200/50 dark:border-gray-700/50">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-lg">{i + 1}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white leading-relaxed">
                        {q.question}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Options */}
                <div className="p-8">
                  <div className="space-y-3">

                    {q.options.map((opt, idx) => {
                      // If options are just the text without letters, add letters dynamically
                      const optionLetter = String.fromCharCode(65 + idx); // A, B, C, D
                      const optionText = opt.includes(":") ? opt : `${optionLetter}: ${opt}`;
                      const displayLetter = opt.includes(":") ? opt.split(":")[0].trim() : optionLetter;

                      const isSelected = selectedOptions[i] === displayLetter;
                      const isCorrect = displayLetter === q.answer;
                      const showAnswer = selectedOptions[i] !== undefined;

                      let optionStyle = "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700/50 hover:border-violet-300 dark:hover:border-violet-400";

                      if (showAnswer) {
                        if (isCorrect) {
                          optionStyle = "border-green-500 bg-green-50 dark:bg-green-900/20";
                        } else if (isSelected && !isCorrect) {
                          optionStyle = "border-red-500 bg-red-50 dark:bg-red-900/20";
                        }
                      } else if (isSelected) {
                        optionStyle = "border-violet-500 bg-violet-50 dark:bg-violet-900/20";
                      }

                      return (
                        <label key={idx} className={`relative flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 group ${optionStyle}`}>
                          <input
                            type="radio"
                            name={`question-${i}`}
                            value={displayLetter}
                            checked={isSelected}
                            onChange={() => handleOptionSelect(i, displayLetter)}
                            className="sr-only"
                          />

                          {/* Custom Radio Button */}
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 transition-all duration-200 ${isSelected
                            ? showAnswer && isCorrect
                              ? 'border-green-500 bg-green-500'
                              : showAnswer && !isCorrect
                                ? 'border-red-500 bg-red-500'
                                : 'border-violet-500 bg-violet-500'
                            : 'border-gray-400 group-hover:border-violet-400'
                            }`}>
                            {isSelected && (
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            )}
                          </div>

                          <span className="text-gray-900 dark:text-white text-lg flex-1">
                            {optionText}
                          </span>

                          {/* Answer Indicator */}
                          {showAnswer && isCorrect && (
                            <div className="ml-4 text-green-600 dark:text-green-400">
                              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                          {showAnswer && isSelected && !isCorrect && (
                            <div className="ml-4 text-red-600 dark:text-red-400">
                              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </label>
                      );
                    })}
                  </div>

                  {/* Feedback */}
                  {selectedOptions[i] && (
                    <div className={`mt-6 p-4 rounded-xl border-l-4 ${selectedOptions[i] === q.answer
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-500'
                      : 'bg-red-50 dark:bg-red-900/20 border-red-500'
                      }`}>
                      <div className="flex items-center space-x-3">
                        {selectedOptions[i] === q.answer ? (
                          <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        )}
                        <p className={`font-semibold text-lg ${selectedOptions[i] === q.answer
                          ? 'text-green-800 dark:text-green-200'
                          : 'text-red-800 dark:text-red-200'
                          }`}>
                          {selectedOptions[i] === q.answer
                            ? "Excellent! That's correct!"
                            : `Incorrect. The correct answer is: ${q.answer}`
                          }
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <h2 className="text-2xl font-bold text-center italic bg-gradient-to-r from-blue-600 via-pink-600 to-violet-600 bg-clip-text text-transparent  mb-4">
          Complete your test to see results on the dashboard!
        </h2>
        {/* Empty State */}
        {quiz.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-violet-400 dark:text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Ready to Test Your Knowledge?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              Enter any topic above and generate a personalized 10-question quiz to challenge yourself and track your progress.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}