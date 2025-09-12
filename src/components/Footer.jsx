export default function Footer() {
  return (
    <footer className="mt-12 bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
      {/* Top Section */}
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center md:items-start justify-between">
        
        {/* Brand */}
        <div className="flex items-center space-x-3">
            {/* Animated Logo Icon */}
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-200">
                <div className="w-6 h-6 bg-white/20 rounded-lg backdrop-blur-sm flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              {/* Glow effect */}
              <div className="absolute inset-0 w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-xl blur-lg opacity-30 animate-pulse"></div>
            </div>
            
            {/* Brand Text */}
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent dark:from-blue-400 dark:via-purple-400 dark:to-pink-400">
                Study Buddy
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                Smart Learning
              </p>
            </div>
          </div>

        {/* About Section */}
        <div className="mt-6 md:mt-0 text-center md:text-left max-w-sm">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            About
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Study Buddy is your personal AI-powered notes & quiz generator. 
            Create summaries, quizzes, and learn smarter every day.
          </p>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-300 dark:border-gray-700 py-4 text-center text-xs">
        <p>© {new Date().getFullYear()} Study Buddy. All rights reserved.</p>
        <p>
          Made with <span className="text-red-500">❤️</span> by 
          <a href="https://github.com/yourgithub" target="_blank" rel="noopener noreferrer" className="ml-1 text-indigo-500 hover:underline">
            Your Name
          </a>
        </p>
      </div>
    </footer>
  );
}
