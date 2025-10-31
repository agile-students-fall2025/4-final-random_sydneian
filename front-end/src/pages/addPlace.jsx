import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import Button from '../components/Button';
import { getRecentAdditions } from '../data/mockData';
import './addPlace.css';

export default function AddPlace() {
  const navigate = useNavigate();
  const recentAdditions = getRecentAdditions();

  const handleNavigateToLink = () => {
    navigate('/add-place/link');
  };

  const handleNavigateToManually = () => {
    navigate('/add-place/manually');
  };

  const handleNavigateToDecide = () => {
    navigate('/decide');
  };

  const handleNavigateToMemories = () => {
    navigate('/memorybook');
  };

  const handleNavigateToBucketList = () => {
    navigate('/bucket-list');
  };

  return (
    <div className="add-place-container">
      {/* Header */}
      <div className="add-place-header">
        <div className="add-place-header-content">
          <button 
            className="back-button"
            onClick={() => navigate(-1)}
            aria-label="Back"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="add-place-title">Add Place</h1>
          <div className="header-spacer"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="add-place-content">
        <h2 className="question-text">How would you like to add?</h2>
        
        <div className="button-container">
          <Button
            text="Paste Link"
            buttonType="primary"
            onClick={handleNavigateToLink}
          />
          <Button
            text="Add Manually"
            buttonType="secondary"
            onClick={handleNavigateToManually}
          />
        </div>

        {/* Recent Additions Section */}
        <div className="recent-additions-section">
          <h3 className="section-title">Recent Additions</h3>
          <ul className="recent-additions-list">
            {recentAdditions.map((item) => (
              <li key={item.id} className="recent-addition-item">
                {item.title} ({item.addedBy})
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bottom-nav">
        <div className="bottom-nav-content">
          <button className="nav-button" onClick={handleNavigateToBucketList}>
            <div className="nav-icon"></div>
            <span className="nav-label">List</span>
          </button>
          <button className="nav-button" onClick={handleNavigateToDecide}>
            <div className="nav-icon-outlined"></div>
            <span className="nav-label">Decide</span>
          </button>
          <button className="nav-button" onClick={handleNavigateToMemories}>
            <div className="nav-icon-outlined"></div>
            <span className="nav-label">Memories</span>
          </button>
        </div>
      </div>
    </div>
  );
}
