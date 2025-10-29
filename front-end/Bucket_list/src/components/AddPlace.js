import React, { useState } from 'react';
import { getRecentAdditions } from '../data/mockData';
import AddPlaceThroughLink from './AddPlaceThroughLink';
import AddPlaceManually from './AddPlaceManually';

function AddPlace({ onBack }) {
  const [currentView, setCurrentView] = useState('main'); // 'main', 'link', 'manual'
  const recentAdditions = getRecentAdditions();

  const handleBack = () => {
    if (currentView !== 'main') {
      setCurrentView('main');
    } else {
      onBack();
    }
  };

  // Render different views based on current state
  if (currentView === 'link') {
    return <AddPlaceThroughLink onBack={handleBack} />;
  }

  if (currentView === 'manual') {
    return <AddPlaceManually onBack={handleBack} />;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="w-full bg-white border-b border-black">
        <div className="flex items-center justify-between px-4 py-3">
          <button 
            onClick={handleBack}
            className="w-6 h-6 flex items-center justify-center cursor-pointer"
            aria-label="Back"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold">Add Place</h1>
          <div className="w-6"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6 pb-24">
        {/* Question */}
        <p className="text-base mb-6 text-black">How would you like to add?</p>

        {/* Add Options */}
        <div className="space-y-4 mb-8">
          {/* Paste Link Button */}
          <button 
            onClick={() => setCurrentView('link')}
            className="w-full bg-black text-white py-4 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Paste Link
          </button>

          {/* Add Manually Button */}
          <button 
            onClick={() => setCurrentView('manual')}
            className="w-full bg-white text-black border border-black py-4 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Add Manually
          </button>
        </div>

        {/* Recent Additions Section */}
        <div>
          <h2 className="text-lg font-bold mb-4 text-black">Recent Additions</h2>
          <ul className="space-y-2">
            {recentAdditions.map((item) => (
              <li key={item.id} className="text-sm text-black flex items-start">
                <span className="mr-2">•</span>
                <span>{item.title} ({item.addedBy})</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="w-full bg-white border-t border-black fixed bottom-0 left-0 right-0">
        <div className="flex justify-around items-center py-2">
          <button className="flex flex-col items-center space-y-1">
            <div className="w-5 h-5 bg-black rounded-sm"></div>
            <span className="text-xs font-medium">List</span>
          </button>
          <button className="flex flex-col items-center space-y-1">
            <div className="w-5 h-5 border-2 border-black rounded-sm"></div>
            <span className="text-xs font-medium">Decide</span>
          </button>
          <button className="flex flex-col items-center space-y-1">
            <div className="w-5 h-5 border-2 border-black rounded-sm"></div>
            <span className="text-xs font-medium">Memories</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddPlace;
