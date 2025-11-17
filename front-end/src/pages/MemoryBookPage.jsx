import React, { useState, useEffect } from "react";
import "./MemoryBookPage.css";
import "../components/Button.css";
import AddMemoryPopup from "./AddMemoryPopup";
import Header from "../components/Header";
import Button from "../components/Button";
import { Pencil, Trash2 } from "lucide-react";

const API_BASE = "http://localhost:8000/api/groups/group-syd-id/activities/activity-lorem-cafe-id/memories";

export default function MemoryBookPage() {
  const [showPopup, setShowPopup] = useState(false);
  const [memories, setMemories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    fetch(API_BASE)
      .then((res) => res.json())
      .then((data) => setMemories(data))
      .catch((err) => console.error("Error fetching memories:", err));
  }, []);

  const handleAddMemory = async (newMemory) => {
  const datedMemory = {
    ...newMemory,
    dateAdded: new Date().toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
  };

  try {
    if (editingIndex !== null) {
      const memoryId = memories[editingIndex]._id;
      const res = await fetch(
        `${API_BASE}/${memoryId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ images: datedMemory.photos, title: datedMemory.title }),
        }
      );
      if (!res.ok) throw new Error("Failed to edit memory");
      const updated = await res.json();

      const updatedMemories = [...memories];
      updatedMemories[editingIndex] = updated;
      setMemories(updatedMemories);
      setEditingIndex(null);
    } else {
      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images: datedMemory.photos, title: datedMemory.title }),
      });
      if (!res.ok) throw new Error("Failed to add memory");
      const created = await res.json();
      setMemories((prev) => [...prev, created]);
    }
  } catch (err) {
    console.error(err);
  }

  setShowPopup(false);
};

  // Delete memory
  const handleDeleteMemory = async (index) => {
  if (window.confirm("Are you sure you want to delete this memory?")) {
    const memoryId = memories[index]._id;
    try {
      await fetch(`${API_BASE}/${memoryId}`, { method: "DELETE" });
      setMemories(memories.filter((_, i) => i !== index));
    } catch (err) {
      console.error("Failed to delete memory:", err);
    }
  }
};

  // Edit memory
  const handleEditMemory = (index) => {
    setEditingIndex(index);
    setShowPopup(true);
  };

  //Filter memories based on search input
  const filteredMemories = memories.filter((memory) =>
    memory.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="memory-container">
      {/* <h1 className="memory-header">Our Memories</h1>
      <hr className="memory-divider" /> */}
      <Header backPath={"/bucket-list"} title="Our Memories" />

      {/* Search bar */}
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search memories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

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
                {memory.images?.map((photo, i) => (
                  <div key={i} className="photo-item">
                    <img src={photo} alt={`Memory ${i}`} />
                  </div>
                ))}
              </div>

              {/* Edit & Delete Icons */}
              <div className="memory-actions-icons">
                <Pencil
                  size={18}
                  className="icon edit-icon"
                  onClick={() => handleEditMemory(index)}
                  title="Edit Memory"
                />
                <Trash2
                  size={18}
                  className="icon delete-icon"
                  onClick={() => handleDeleteMemory(index)}
                  title="Delete Memory"
                />
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
          onClose={() => {
            setEditingIndex(null);
            setShowPopup(false);
          }}
          onAdd={handleAddMemory}
          memoryToEdit={editingIndex !== null ? memories[editingIndex] : null}
        />
      )}
    </div>
  );
}