import React, { useState } from "react";
import "./MemoryBookPage.css";
import "../components/Button.css";
import AddMemoryPopup from "./AddMemoryPopup";

export default function MemoryBookPage() {
  const [showPopup, setShowPopup] = useState(false);
  const [memories, setMemories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleAddMemory = (newMemory) => {
    const datedMemory = {
      ...newMemory,
      dateAdded: new Date().toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    };
    setMemories((prev) => [...prev, datedMemory]);
    setShowPopup(false);
  };

  //Filter memories based on search input
  const filteredMemories = memories.filter((memory) =>
    memory.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="memory-container">
      <h1 className="memory-header">Our Memories</h1>
      <hr className="memory-divider" />

      {/* Search bar */}
      <input
        type="text"
        className="search-input"
        placeholder="Search memories..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {filteredMemories.length === 0 ? (
        <div className="memory-empty">
          <p>No memories found.</p>
        </div>
      ) : (
        <div className="memory-list">
          {filteredMemories.map((memory, index) => (
            <div key={index} className="memory-card">
              <div className="memory-card-header">
                <h2 className="memory-title">{memory.title}</h2>
                <p className="memory-date">Added on {memory.dateAdded}</p>
              </div>
              <div className="memory-photo-grid">
                {memory.photos.map((photo, i) => (
                  <div key={i} className="photo-item">
                    <img src={photo} alt={`Memory ${i}`} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        className="add-memory-btn"
        onClick={() => setShowPopup(true)}
        aria-label="Add memory"
      >
        +
      </button>

      {showPopup && (
        <AddMemoryPopup
          onClose={() => setShowPopup(false)}
          onAdd={handleAddMemory}
        />
      )}
    </div>
  );
}