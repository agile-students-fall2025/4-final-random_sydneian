import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './addPlaceManually.css';

function AddPlaceManually() {
  const [formData, setFormData] = useState({
    placeName: '',
    location: '',
    category: '',
    description: '',
    tags: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="add-manual-container">
      {/* Header */}
      <div className="add-manual-header">
        <div className="add-manual-header-content">
          <Link to="/add-place" className="add-manual-back-button" aria-label="Back">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="add-manual-title">Add Manually</h1>
          <div className="add-manual-spacer"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="add-manual-content">
        {/* Place Name */}
        <div className="form-field">
          <input
            type="text"
            name="placeName"
            placeholder="Place name"
            value={formData.placeName}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        {/* Location */}
        <div className="form-field">
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        {/* Select Category */}
        <div className="form-field">
          <div className="select-wrapper">
            <input
              type="text"
              name="category"
              placeholder="Select category"
              value={formData.category}
              onChange={handleChange}
              className="select-input"
            />
            <svg className="select-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Description */}
        <div className="form-field">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            placeholder="Some notes..."
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="form-textarea"
          />
        </div>

        {/* Tags */}
        <div className="form-field">
          <label className="form-label">Tags</label>
          <input
            type="text"
            name="tags"
            placeholder="#tags"
            value={formData.tags}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        {/* Add Photos */}
        <div className="form-field">
          <div className="photo-upload">
            <div className="photo-upload-content">
              <svg className="photo-upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="photo-upload-text">Add Photos</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button className="btn-submit">
          Add to your Bucket List!
        </button>
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

export default AddPlaceManually;

