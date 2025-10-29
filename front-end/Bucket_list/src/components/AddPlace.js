import React, { useState } from 'react';
import { getRecentAdditions } from '../data/mockData';
import AddPlaceThroughLink from './AddPlaceThroughLink';
import AddPlaceManually from './AddPlaceManually';
import './AddPlace.css';

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
    <div className="add-place-container">
      {/* Header */}
      <div className="add-place-header">
        <div className="add-place-header-content">
          <button 
            onClick={handleBack}
            className="add-place-back-button"
            aria-label="Back"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="add-place-title">Add Place</h1>
          <div className="add-place-spacer"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="add-place-content">
        {/* Question */}
        <p className="add-place-question">How would you like to add?</p>

        {/* Add Options */}
        <div className="add-options">
          {/* Paste Link Button */}
          <button 
            onClick={() => setCurrentView('link')}
            className="btn-paste-link"
          >
            Paste Link
          </button>

          {/* Add Manually Button */}
          <button 
            onClick={() => setCurrentView('manual')}
            className="btn-add-manually"
          >
            Add Manually
          </button>
        </div>

        {/* Recent Additions Section */}
        <div className="recent-additions">
          <h2 className="recent-additions-title">Recent Additions</h2>
          <ul className="recent-additions-list">
            {recentAdditions.map((item) => (
              <li key={item.id} className="recent-additions-item">
                <span className="recent-additions-item-bullet">•</span>
                <span>{item.title} ({item.addedBy})</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bottom-nav">
        <div className="bottom-nav-content">
          <button className="nav-button">
            <div className="nav-icon"></div>
            <span className="nav-label">List</span>
          </button>
          <button className="nav-button">
            <div className="nav-icon-outlined"></div>
            <span className="nav-label">Decide</span>
          </button>
          <button className="nav-button">
            <div className="nav-icon-outlined"></div>
            <span className="nav-label">Memories</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddPlace;
