import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronDown } from 'lucide-react';
import Button from '../components/Button';
import './addPlaceManually.css';

export default function AddPlaceManually() {
  const navigate = useNavigate();
  const [placeName, setPlaceName] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');

  const handleSubmit = () => {
    // Handle form submission
    console.log({ placeName, location, category, description, tags });
    // Navigate back to bucket list or show success message
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
    <div className="add-place-manually-container">
      {/* Header */}
      <div className="add-place-manually-header">
        <div className="add-place-manually-header-content">
          <button 
            className="back-button"
            onClick={() => navigate(-1)}
            aria-label="Back"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="add-place-manually-title">Add Manually</h1>
          <div className="header-spacer"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="add-place-manually-content">
        <input
          type="text"
          placeholder="Place name"
          value={placeName}
          onChange={(e) => setPlaceName(e.target.value)}
          className="form-input"
        />

        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="form-input"
        />

        <div className="select-container">
          <input
            type="text"
            placeholder="Select category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="form-input select-input"
            readOnly
          />
          <ChevronDown className="select-chevron" size={20} />
        </div>

        <div className="form-section">
          <h3 className="section-heading">Description</h3>
          <textarea
            placeholder="Some notes..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-textarea"
            rows={4}
          />
        </div>

        <div className="form-section">
          <h3 className="section-heading">Tags</h3>
          <input
            type="text"
            placeholder="#tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="form-input"
          />
        </div>

        <div className="form-section">
          <div className="add-photos-area">
            <span className="add-photos-plus">+</span>
            <span className="add-photos-text">Add Photos</span>
          </div>
        </div>

        <div className="submit-button-container">
          <Button
            text="Add to your Bucket List!"
            buttonType="primary"
            onClick={handleSubmit}
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
