import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import Button from '../components/Button';
import './addPlaceThroughLink.css';

export default function AddPlaceThroughLink() {
  const navigate = useNavigate();
  const [link, setLink] = useState('https://tiktok.com/@rickastleyofficial/vide...');
  const [tags, setTags] = useState('#aesthetic, #matcha, #brunch');

  const handleImportDetails = () => {
    // Mock import functionality
    console.log('Importing details from:', link);
  };

  const handleAddToBucketList = () => {
    // Handle adding to bucket list
    console.log('Adding to bucket list with tags:', tags);
    navigate('/bucket-list');
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
    <div className="add-place-link-container">
      {/* Header */}
      <div className="add-place-link-header">
        <div className="add-place-link-header-content">
          <button 
            className="back-button"
            onClick={() => navigate(-1)}
            aria-label="Back"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="add-place-link-title">Import From Link</h1>
          <div className="header-spacer"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="add-place-link-content">
        <div className="section">
          <h2 className="section-heading">Paste TikTok or Instagram Link.</h2>
          <input
            type="text"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="form-input"
          />
          <div className="import-button-container">
            <Button
              text="Import Details"
              buttonType="primary"
              onClick={handleImportDetails}
            />
          </div>
        </div>

        <div className="section">
          <h2 className="section-heading">Preview.</h2>
          <div className="preview-box">
            <span className="preview-text">Photo</span>
          </div>
        </div>

        <div className="section">
          <h3 className="place-name">Moonlight Cafe</h3>
          <p className="place-location">Brooklyn, NY</p>
        </div>

        <div className="section">
          <h3 className="section-heading">Highlights</h3>
          <ul className="highlights-list">
            <li>Aesthetic Interior</li>
            <li>Famous for matcha</li>
            <li>Great brunch spot</li>
          </ul>
        </div>

        <div className="section">
          <h3 className="section-heading">Add Tags (Optional).</h3>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="form-input"
          />
        </div>

        <div className="submit-button-container">
          <Button
            text="Add to Bucket List"
            buttonType="primary"
            onClick={handleAddToBucketList}
          />
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
