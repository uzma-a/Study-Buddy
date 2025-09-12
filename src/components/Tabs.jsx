import React from 'react'
import { useUser } from '@clerk/clerk-react' // Import useUser hook from Clerk

export default function Tabs({ activeTab, setActiveTab }) {
  const { isSignedIn } = useUser() // Get sign-in status from Clerk
  const tabs = ["Notes", "Summarizer", "Quiz"];
  
  return (
    <div className="flex flex-col items-center mt-4">
      {/* Conditional message for non-signed-in users */}
      {!isSignedIn && (
        <h1 className="text-2xl font-bold italic bg-gradient-to-r from-blue-600 via-pink-600 to-violet-600 bg-clip-text text-transparent mb-4 animate-pulse">
          Sign In to see your dashboard to track your search history
        </h1>
      )}
      
      {/* Tabs */}
      <div className="flex justify-center gap-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 hover:bg-gradient-to-r from-violet-600 to-blue-600 cursor-pointer rounded-lg ${
              activeTab === tab 
                ? "bg-gradient-to-r from-blue-600 to-pink-600 text-white" 
                : "bg-gray-300 dark:bg-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}