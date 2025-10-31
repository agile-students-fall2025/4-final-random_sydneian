import React, { useState } from "react";
import "./AddMemoryPopup.css";
import "../components/Button.css";

export default function AddMemoryPopup({ onClose, onAdd }) {
  const [title, setTitle] = useState("");
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState(""); 

  const handleAddPhoto = () => {
    const randomId = Math.floor(Math.random() * 1000);
    const newPhoto = `https://picsum.photos/seed/${randomId}/400/300`;
    setPhotos((prev) => [...prev, newPhoto]);
  };

  const handleRemovePhoto = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      setError("Please enter a title before adding a memory.");
      return;
    }

    if (photos.length === 0) {
      setError("Please add at least one photo.");
      return;
    }

    setError("");
    const newMemory = { title, photos };
    onAdd(newMemory);
    setTitle("");
    setPhotos([]);
    onClose();
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Add New Memory</h2>

        <label htmlFor="memoryTitle">Outing Title:</label>
        <input
          id="memoryTitle"
          type="text"
          placeholder="e.g., Beach Day with Friends"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setError("");
          }}
        />

        {/*red error message below input */}
        {error && <p className="error-text">{error}</p>}

        <div className="photo-preview-container">
          {photos.length === 0 ? (
            <p className="no-photos-text">No photos added yet.</p>
          ) : (
            <div className="photo-grid">
              {photos.map((photo, index) => (
                <div key={index} className="photo-item">
                  <img src={photo} alt={`Preview ${index}`} />
                  <button
                    className="remove-btn"
                    onClick={() => handleRemovePhoto(index)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="popup-buttons">
          <button className="Button secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="Button secondary" onClick={handleAddPhoto}>
            + Add Photo
          </button>
          <button className="Button" onClick={handleSubmit}>
            Add to Memory Book
          </button>
        </div>
      </div>
    </div>
  );
}