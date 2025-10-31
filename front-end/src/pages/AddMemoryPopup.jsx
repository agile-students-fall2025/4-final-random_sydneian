import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import Button from "../components/Button";
import "./AddMemoryPopup.css";

export default function AddMemoryPopup({ onClose, onAdd }) {
  const [selectedPlace, setSelectedPlace] = useState("");
  const [photos, setPhotos] = useState([]);

  const handleAddPhoto = () => {
    const randomId = Math.floor(Math.random() * 1000);
    const newPhoto = `https://picsum.photos/seed/${randomId}/400/300`;
    setPhotos((prev) => [...prev, newPhoto]);
  };

  const handleRemovePhoto = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!selectedPlace.trim()) {
      // Could add an error message here if desired
      return;
    }

    if (photos.length === 0) {
      return;
    }

    const newMemory = { 
      place: selectedPlace, 
      photos,
      title: selectedPlace // For compatibility with existing code
    };
    onAdd(newMemory);
    setSelectedPlace("");
    setPhotos([]);
    onClose();
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        {/* Select place dropdown */}
        <div className="select-place-container">
          <input
            type="text"
            placeholder="Select place"
            value={selectedPlace}
            onChange={(e) => setSelectedPlace(e.target.value)}
            className="select-place-input"
            readOnly
          />
          <ChevronDown className="select-place-chevron" size={20} />
        </div>

        {/* Add Photos Area */}
        <div className="add-photos-container">
          {photos.length === 0 ? (
            <div className="add-photos-placeholder" onClick={handleAddPhoto}>
              <span className="add-photos-plus">+</span>
              <span className="add-photos-text">Add Photos</span>
            </div>
          ) : (
            <div className="photos-grid">
              {photos.map((photo, index) => (
                <div key={index} className="photo-item">
                  <img src={photo} alt={`Preview ${index}`} />
                  
                  {/* Replace raw button with <Button /> */}
                  <Button
                    text="✕"
                    buttonType="secondary"
                    onClick={() => handleRemovePhoto(index)}
                  />
                </div>
              ))}
              <div className="add-more-photos" onClick={handleAddPhoto}>
                <span className="add-photos-plus">+</span>
                <span className="add-photos-text">Add Photos</span>
              </div>
            </div>
          )}
        </div>

        {/* Popup action buttons */}
        <div className="popup-buttons">
          <Button
            text="ADD MEMORY"
            buttonType="primary"
            onClick={handleSubmit}
          />
          <Button
            text="CANCEL"
            buttonType="secondary"
            onClick={onClose}
          />
        </div>
      </div>
    </div>
  );
}