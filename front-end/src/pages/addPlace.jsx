import React from 'react';
import { Link } from 'react-router-dom';
import { getRecentAdditions } from '../data/mockData';
import './addPlace.css';

function AddPlace() {
  const recentAdditions = getRecentAdditions();

  return (
    <div className="add-place-container">
      {/* Header */}
      <div className="add-place-header">
        <div className="add-place-header-content">
          <Link to="/bucket-list" className="add-place-back-button" aria-label="Back">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
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
          <Link to="/add-place/link" className="btn-paste-link">
            Paste Link
          </Link>

          {/* Add Manually Button */}
          <Link to="/add-place/manual" className="btn-add-manually">
            Add Manually
          </Link>
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

