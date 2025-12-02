import React from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import "./GalleryModal.css";

export default function GalleryModal({ photos, onClose }) {
    if (!photos) return null;

    const items = photos.map((p) => ({
        original: p,
        thumbnail: p,
    }));

    return (
        <div className="gallery-modal-overlay" onClick={onClose}>
            <div className="gallery-modal" onClick={(e) => e.stopPropagation()}>
                <button className="gallery-close-btn" onClick={onClose}>✕</button>
                <ImageGallery items={items} showPlayButton={false} />
            </div>
        </div>
    );
}