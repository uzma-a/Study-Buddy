import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from '@clerk/clerk-react';

export default function Navbar({ darkMode, setDarkMode }) {
  const navigate = useNavigate();
  const { user } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('.mobile-menu-container')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Main Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/90 dark:bg-gray-900/90 border-b border-gray-200/50 dark:border-gray-700/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo Section */}
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
              <div className='cursor-pointer' onClick={() => handleNavigation("/")}>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent dark:from-blue-400 dark:via-purple-400 dark:to-pink-400">
                  Study Buddy
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium hidden sm:block">
                  Smart Learning
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => navigate("/about")}
                className="relative overflow-hidden group cursor-pointer text-white hover:text-gray-200 bg-gradient-to-br from-blue-500 via-purple-600 to-violet-500 rounded-2xl py-2 px-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              >
                <span className="relative z-10">About</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </button>
              
              {/* Dashboard button - only show when signed in */}
              <SignedIn>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="relative overflow-hidden group cursor-pointer text-white hover:text-gray-200 bg-gradient-to-br from-blue-500 via-purple-600 to-violet-500 rounded-2xl py-2 px-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                >
                  <span className="relative z-10">Dashboard</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </button>
              </SignedIn>

              {/* Dark Mode Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="relative inline-flex items-center justify-center w-14 h-8 bg-gray-200 dark:bg-gray-700 rounded-full p-1 transition-all duration-300 ease-in-out hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 group"
                aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-400 to-yellow-400 dark:from-indigo-600 dark:to-purple-600 opacity-0 dark:opacity-100 transition-opacity duration-300"></div>
                <div className={`relative w-6 h-6 bg-white rounded-full shadow-lg transform transition-transform duration-300 ease-in-out flex items-center justify-center ${darkMode ? 'translate-x-6' : 'translate-x-0'}`}>
                  <svg
                    className={`absolute w-3 h-3 text-orange-500 transition-all duration-300 ${darkMode ? 'opacity-0 rotate-180 scale-0' : 'opacity-100 rotate-0 scale-100'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <svg
                    className={`absolute w-3 h-3 text-indigo-400 transition-all duration-300 ${darkMode ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-180 scale-0'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                </div>
              </button>

              <span className="text-sm font-medium text-gray-600 dark:text-gray-300 hidden lg:inline-block">
                {darkMode ? 'Dark' : 'Light'}
              </span>

              {/* Authentication Buttons */}
              <div className="flex items-center space-x-3">
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="relative overflow-hidden group cursor-pointer text-white hover:text-gray-200 bg-gradient-to-br from-green-500 via-emerald-600 to-teal-500 rounded-2xl py-2 px-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
                      <span className="relative z-10">Sign In</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                    </button>
                  </SignInButton>
                </SignedOut>
                
                <SignedIn>
                  <div className="flex items-center space-x-2">
                    {/* {user && (
                      <span className="text-sm text-gray-600 dark:text-gray-300 hidden lg:block">
                        Hi, {user.firstName || user.username}
                      </span>
                    )} */}
                    <UserButton 
                      appearance={{
                        elements: {
                          avatarBox: "w-8 h-8 rounded-full border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 transition-colors duration-200"
                        }
                      }}
                    />
                  </div>
                </SignedIn>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden mobile-menu-container">
              <button
                onClick={toggleMobileMenu}
                className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-500/30"
                aria-label="Toggle mobile menu"
              >
                {/* Animated Hamburger Icon */}
                <div className="w-5 h-5 flex flex-col justify-center items-center">
                  <span className={`w-4 h-0.5 bg-white rounded-full transition-all duration-300 transform origin-center ${isMobileMenuOpen ? 'rotate-45 translate-y-0.5' : ''}`}></span>
                  <span className={`w-4 h-0.5 bg-white rounded-full transition-all duration-300 mt-1 ${isMobileMenuOpen ? 'opacity-0 scale-0' : ''}`}></span>
                  <span className={`w-4 h-0.5 bg-white rounded-full transition-all duration-300 mt-1 transform origin-center ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
                </div>
              </button>

              {/* Mobile Menu Overlay */}
              <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} style={{ zIndex: 40 }}>
              </div>

              {/* Mobile Menu Panel */}
              <div className={`fixed top-16 right-4 w-72 max-w-[calc(100vw-2rem)] bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 transform transition-all duration-300 origin-top-right ${isMobileMenuOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`} style={{ zIndex: 50 }}>
                
                {/* User Info in Mobile Menu */}
                <SignedIn>
                  <div className="p-4 border-b border-gray-200/50 dark:border-gray-700/50">
                    <div className="flex items-center space-x-3">
                      <UserButton 
                        appearance={{
                          elements: {
                            avatarBox: "w-10 h-10 rounded-full"
                          }
                        }}
                      />
                      {user && (
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {user.firstName || user.username}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {user.primaryEmailAddress?.emailAddress}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </SignedIn>

                {/* Menu Items */}
                <div className="p-4 space-y-3">
                  <button
                    onClick={() => handleNavigation("/about")}
                    className="w-full group flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-800/30 dark:hover:to-purple-800/30 transition-all duration-200"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-gray-900 dark:text-white">About</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Learn about Study Buddy</p>
                    </div>
                  </button>

                  {/* Dashboard button in mobile - only show when signed in */}
                  <SignedIn>
                    <button
                      onClick={() => handleNavigation("/dashboard")}
                      className="w-full group flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-800/30 dark:hover:to-pink-800/30 transition-all duration-200"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-gray-900 dark:text-white">Dashboard</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">View your progress</p>
                      </div>
                    </button>
                  </SignedIn>

                  {/* Sign In button in mobile - only show when signed out */}
                  <SignedOut>
                    <SignInButton mode="modal">
                      <button className="w-full group flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 hover:from-green-100 hover:to-emerald-100 dark:hover:from-green-800/30 dark:hover:to-emerald-800/30 transition-all duration-200">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                          </svg>
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-medium text-gray-900 dark:text-white">Sign In</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Access your account</p>
                        </div>
                      </button>
                    </SignInButton>
                  </SignedOut>

                  {/* Dark Mode Toggle in Mobile */}
                  <div className="w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/50">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        {darkMode ? (
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">Theme</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{darkMode ? 'Dark mode' : 'Light mode'}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setDarkMode(!darkMode)}
                      className="relative inline-flex items-center justify-center w-12 h-6 bg-gray-300 dark:bg-gray-600 rounded-full p-0.5 transition-all duration-300"
                    >
                      <div className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform duration-300 flex items-center justify-center ${darkMode ? 'translate-x-6' : 'translate-x-0'}`}>
                        <div className="w-2 h-2 rounded-full bg-gradient-to-br from-blue-500 to-purple-600"></div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Menu Footer */}
                <div className="p-4 pt-2 border-t border-gray-200/50 dark:border-gray-700/50">
                  <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                    Study Buddy • Smart Learning Platform
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}