import React from 'react';
import './BottomNavigation.css';

function BottomNavigation({ activeTab = 'list' }) {
  return (
    <div className="bottom-nav">
      <div className="bottom-nav-content">
        <button className={`nav-button ${activeTab === 'list' ? 'active' : ''}`}>
          <div className={`nav-icon ${activeTab === 'list' ? 'filled' : 'outlined'}`}></div>
          <span className="nav-label">List</span>
        </button>
        <button className={`nav-button ${activeTab === 'decide' ? 'active' : ''}`}>
          <div className={`nav-icon ${activeTab === 'decide' ? 'filled' : 'outlined'}`}></div>
          <span className="nav-label">Decide</span>
        </button>
        <button className={`nav-button ${activeTab === 'memories' ? 'active' : ''}`}>
          <div className={`nav-icon ${activeTab === 'memories' ? 'filled' : 'outlined'}`}></div>
          <span className="nav-label">Memories</span>
        </button>
      </div>
    </div>
  );
}

export default BottomNavigation;

