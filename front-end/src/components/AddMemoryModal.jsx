import React, { useState } from 'react';
import './AddMemoryModal.css';

function AddMemoryModal({ isOpen, onClose }) {
  const [selectedPlace, setSelectedPlace] = useState('');

  if (!isOpen) return null;

  return (
    <dialog className="memory-dialog" open={isOpen}>
      <div className="memory-dialog-content">
        <h2 className="memory-dialog-title">Add memory</h2>
        
        {/* Select Place Dropdown */}
        <div className="memory-form-field">
          <div className="memory-select-wrapper">
            <select
              value={selectedPlace}
              onChange={(e) => setSelectedPlace(e.target.value)}
              className="memory-select"
            >
              <option value="">Select place</option>
              <option value="1">Rooftop Trivia</option>
              <option value="2">Pizza Disco</option>
              <option value="3">Silent Party</option>
            </select>
          </div>
        </div>

        {/* Add Photos */}
        <div className="memory-photo-upload">
          <div className="memory-photo-upload-content">
            <svg className="memory-photo-upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="memory-photo-upload-text">Add Photos</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="memory-dialog-buttons">
          <button onClick={onClose} className="memory-btn-cancel">
            Cancel
          </button>
          <button className="memory-btn-add">
            Add memory
          </button>
        </div>
      </div>
    </dialog>
  );
}

export default AddMemoryModal;

