import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './addPlaceThroughLink.css';

function AddPlaceThroughLink() {
  const [link, setLink] = useState('');
  const [tags, setTags] = useState('');

  const suggestedLink = 'https://tiktok.com/@rickastleyofficial/video/1234567890';

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      if (!link) {
        setLink(suggestedLink);
      }
    }
  };

  return (
    <div className="add-link-container">
      {/* Header */}
      <div className="add-link-header">
        <div className="add-link-header-content">
          <Link to="/add-place" className="add-link-back-button" aria-label="Back">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="add-link-title">Import From Link</h1>
          <div className="add-link-spacer"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="add-link-content">
        {/* Paste Link Section */}
        <div className="section">
          <h2 className="section-title">Paste TikTok or Instagram Link.</h2>
          <input
            type="text"
            placeholder="https://tiktok.com/@rickastleyofficial/vide..."
            value={link}
            onChange={(e) => setLink(e.target.value)}
            onKeyDown={handleKeyDown}
            className="link-input"
          />
          <button className="btn-import">
            Import Details
          </button>
        </div>

        {/* Preview Section */}
        <div className="section">
          <h2 className="section-title">Preview.</h2>
          <div className="preview-image">
            <span className="preview-image-text">Photo</span>
          </div>
          <h3 className="preview-name">Moonlight Cafe</h3>
          <p className="preview-location">Brooklyn, NY</p>
        </div>

        {/* Highlights Section */}
        <div className="section">
          <h2 className="section-title">Highlights.</h2>
          <ul className="highlights-list">
            <li className="highlight-item">
              <span className="highlight-bullet">•</span>
              <span className="highlight-text">Aesthetic Interior</span>
            </li>
            <li className="highlight-item">
              <span className="highlight-bullet">•</span>
              <span className="highlight-text">Famous for matcha</span>
            </li>
            <li className="highlight-item">
              <span className="highlight-bullet">•</span>
              <span className="highlight-text">Great brunch spot</span>
            </li>
          </ul>
        </div>

        {/* Add Tags Section */}
        <div className="section">
          <h2 className="section-title">Add Tags (Optional).</h2>
          <input
            type="text"
            placeholder="#aesthetic, #matcha, #brunch"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="tags-input"
          />
        </div>

        {/* Action Button */}
        <button className="btn-add-to-list">
          Add to Bucket List
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

export default AddPlaceThroughLink;

