import React, { useState, useEffect } from "react";
import "./MemoryBookPage.css";
import "../components/Button.css";
import AddMemoryPopup from "./AddMemoryPopup";
import Header from "../components/Header";
import { Pencil, Trash2 } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import GalleryModal from "../components/GalleryModal";

const normalizeMemory = (m) => ({
    ...m,
    photos: m.images,
    dateAdded: new Date(m.createdAt).toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
    }),
});

export default function MemoryBookPage() {
    const [showPopup, setShowPopup] = useState(false);
    const [memories, setMemories] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [editingIndex, setEditingIndex] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    
    // Gallery State
    const [openGallery, setOpenGallery] = useState(false);
    const [galleryPhotos, setGalleryPhotos] = useState([]);
    const [galleryStartIndex, setGalleryStartIndex] = useState(0); // New State

    const { groupId } = useParams();
    const navigate = useNavigate();

    const backendURL = import.meta.env.VITE_BACKEND_ORIGIN || "http://localhost:8000";
    const API_BASE = `${backendURL}/api/groups/${groupId}/memories`;

    useEffect(() => {
        const JWT = localStorage.getItem("JWT");
        if (!JWT) {
            navigate("/login");
            return;
        }

        (async () => {
            try {
                const res = await fetch(API_BASE, {
                    headers: { Authorization: `Bearer ${JWT}` },
                });

                if (!res.ok) throw new Error("Failed to fetch memories");

                const data = await res.json();
                setMemories(data.map(normalizeMemory));
            } catch (err) {
                console.error(err);
                setError("Couldn't load memories");
            } finally {
                setLoading(false);
            }
        })();
    }, [API_BASE, groupId, navigate]);

    // ... (handleAddMemory and handleDeleteMemory logic remains exactly the same) ... 
    // I am omitting them here to save space, but keep your existing functions!
    // Just ensure handleAddMemory and handleDeleteMemory are still in your file.
    
    // Placeholder for your existing functions so code doesn't break if you copy-paste
    const handleAddMemory = async (newMemory) => { /* Your existing logic */ };
    const handleDeleteMemory = async (index) => { /* Your existing logic */ };
    
    const handleEditMemory = (index) => {
        setEditingIndex(index);
        setShowPopup(true);
    };

    const openGalleryHandler = (photos, index = 0) => {
        setGalleryPhotos(photos);
        setGalleryStartIndex(index);
        setOpenGallery(true);
    };

    const filteredMemories = memories.filter((memory) =>
        (memory.title || "").toLowerCase().includes(searchTerm.toLowerCase()),
    );

    if (loading) return <div className="memory-empty">Loading...</div>;

    return (
    <>
        <div className="memory-container">
            <Header backPath={`/groups/${groupId}/activities`} title="Our Memories" />

            <div className="search-container">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search memories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {error ? (
                <div className="memory-empty"><p>Error: {error}</p></div>
            ) : filteredMemories.length === 0 ? (
                <div className="memory-empty"><p>No memories found.</p></div>
            ) : (
                <div className="memory-list">
                    {filteredMemories.map((memory, index) => (
                        <div key={index} className="memory-card">
                            <div className="memory-card-header">
                                <h2 className="memory-title">{memory.title}</h2>
                                <p className="memory-date">Added on {memory.dateAdded}</p>
                            </div>

                            <div className="memory-photo-grid">
                                {memory.photos.slice(0, 3).map((photo, i) => (
                                    <div 
                                        key={i} 
                                        className="photo-item"
                                        onClick={() => openGalleryHandler(memory.photos, i)}
                                    >
                                        <img src={photo} alt={`Memory ${i}`} />
                                    </div>
                                ))}

                                {memory.photos.length > 3 && (
                                    <div
                                        className="photo-item more-photos-btn"
                                        onClick={() => openGalleryHandler(memory.photos, 3)}
                                    >
                                        +{memory.photos.length - 3} more
                                    </div>
                                )}
                            </div>

                            <div className="memory-actions-icons">
                                <Pencil size={18} className="icon edit-icon" onClick={() => handleEditMemory(index)} />
                                <Trash2 size={18} className="icon delete-icon" onClick={() => handleDeleteMemory(index)} />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showPopup && (
                <AddMemoryPopup
                    onClose={() => { setEditingIndex(null); setShowPopup(false); }}
                    onAdd={handleAddMemory}
                    memoryToEdit={editingIndex !== null ? memories[editingIndex] : null}
                />
            )}

            {openGallery && (
                <GalleryModal
                    photos={galleryPhotos}
                    startIndex={galleryStartIndex}
                    onClose={() => setOpenGallery(false)}
                />
            )}
        </div>

        {/* ← Now the button is OUTSIDE the scroll container */}
        <button className="add-memory-btn" onClick={() => setShowPopup(true)}>+</button>
    </>
);
}