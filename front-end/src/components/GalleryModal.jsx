import React, { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react"; // Assuming you have lucide-react installed
import "./GalleryModal.css";

export default function GalleryModal({ photos = [], startIndex = 0, onClose }) {
    const [currentIndex, setCurrentIndex] = useState(startIndex);

    if (!photos || photos.length === 0) return null;

    const handleNext = (e) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % photos.length);
    };

    const handlePrev = (e) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
    };

    return (
        <div className="gallery-modal-overlay" onClick={onClose}>
            
            {/* Close Button */}
            <button className="gallery-close-btn" onClick={onClose}>
                <X size={32} color="white" />
            </button>

            {/* Left Arrow */}
            <button className="gallery-nav-btn left" onClick={handlePrev}>
                <ChevronLeft size={48} color="white" />
            </button>

            {/* Main Image Container */}
            <div className="gallery-content" onClick={(e) => e.stopPropagation()}>
                <img 
                    src={photos[currentIndex]} 
                    alt={`Gallery ${currentIndex}`} 
                    className="gallery-main-image" 
                />
                
                {/* Optional: Counter at bottom */}
                <div className="gallery-counter">
                    {currentIndex + 1} / {photos.length}
                </div>
            </div>

            {/* Right Arrow */}
            <button className="gallery-nav-btn right" onClick={handleNext}>
                <ChevronRight size={48} color="white" />
            </button>

        </div>
    );
}