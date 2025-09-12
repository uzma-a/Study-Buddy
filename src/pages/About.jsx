import React from "react";

export default function About() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-200 px-6 py-12">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    About Study Buddy
                </h1>

                <p className="text-lg text-gray-700 dark:text-gray-300 mb-10 text-center">
                    Study Buddy is your AI-powered learning companion. It helps you
                    generate notes, summarize texts, and test your knowledge with quizzes —
                    all in one place.
                </p>

                <div className="space-y-10">
                    {/* Notes Section */}
                    <div className="mb-8">
                        <p className="text-xl font-semibold text-indigo-500">📝 Notes Generator</p>

                        {/* Short tagline / highlight */}
                        <p className="text-gray-800 dark:text-gray-200 text-lg font-bold mt-1">
                            Quickly turn any topic into clear, bullet-point notes with key terms highlighted.
                        </p>

                        {/* Why it's useful */}
                        <p className="text-gray-600 dark:text-gray-400 mt-3">
                            <strong>Why it’s useful:</strong> Saves time by breaking down complex topics
                            into concise, easy-to-understand points that you can study at a glance.
                        </p>

                        {/* How to use */}
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            <strong>How to use:</strong> Go to the <span className="font-medium">Notes</span> tab,
                            type a topic (e.g., <em>Photosynthesis</em>), and click
                            <span className="font-medium"> Generate</span>. The app will instantly produce
                            structured notes for you.
                        </p>
                    </div>


                    {/* Summarizer Section */}
                    <div>
                        <p className="text-xl font-semibold text-purple-500">📄 Text Summarizer</p>
                        <p className="text-gray-800 dark:text-gray-200 text-lg font-bold mt-1">
                            Paste long texts and get a short, easy-to-read summary in seconds.
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            <strong>Why it’s useful:</strong> Helps you quickly understand large
                            chunks of text (articles, essays, reports) without reading
                            everything word-for-word.
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            <strong>How to use:</strong> Open the <span className="font-medium">Summarizer</span>{" "}
                            tab, paste your text, and click <span className="font-medium">Summarize</span>.
                            The app will create a short, easy-to-read summary for you.
                        </p>
                    </div>

                    {/* Quiz Section */}
                    <div>
                        <p className="text-xl font-semibold text-pink-500">❓ Quiz Generator</p>
                        <p className="text-gray-800 dark:text-gray-200 text-lg font-bold mt-1">
                            Test yourself with AI-generated multiple-choice questions based on your study topics.
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            <strong>Why it’s useful:</strong> Reinforces learning by testing your
                            knowledge and helping you identify weak areas.
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            <strong>How to use:</strong> Select the <span className="font-medium">Quiz</span>{" "}
                            tab, enter a topic (e.g., “JavaScript Basics”), and click
                            <span className="font-medium"> Generate Quiz</span>. Answer the
                            multiple-choice questions and see your score instantly.
                        </p>
                    </div>

                    {/* Dashboard Section */}
                    <div className="mb-8">
                        <p className="text-2xl text-center font-bold text-green-500">📊 Study Dashboard</p>

                        {/* Short tagline / highlight */}
                        <p className="text-gray-800 dark:text-gray-200 text-lg font-bold mt-1">
                            Track your learning journey with a personalized study dashboard.
                        </p>

                        {/* Why it's useful */}
                        <p className="text-gray-600 dark:text-gray-400 mt-3">
                            <strong>Why it’s useful:</strong> The dashboard keeps a history of all your
                            notes, quizzes, and summaries, so you can review your progress over time
                            and measure how much you’ve learned.
                        </p>

                        {/* How to use */}
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            <strong>How to use:</strong> First, <span className="font-medium">sign up</span>
                            for an account. Once logged in, you’ll have access to your
                            <span className="font-medium"> Dashboard</span> where you can revisit
                            past notes, check your quiz scores, and track your study activity.
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}
