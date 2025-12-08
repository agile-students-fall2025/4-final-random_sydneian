import React, { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import "./GalleryModal.css";

export default function GalleryModal({ photos = [], startIndex = 0, onClose }) {
	const [currentIndex, setCurrentIndex] = useState(startIndex);
	const [animClass, setAnimClass] = useState("");

	if (!photos || photos.length === 0) return null;

	const slideTo = (direction) => {
		// Step 1: add animation class
		setAnimClass(direction);

		// Step 2: wait for animation to finish before changing photo
		setTimeout(() => {
			setCurrentIndex((prev) => {
				if (direction === "slide-left") {
					return (prev + 1) % photos.length;
				}
				return (prev - 1 + photos.length) % photos.length;
			});

			// Step 3: remove animation class so new image fades in
			setAnimClass("");
		}, 300); // match CSS animation duration
	};

	return (
		<div className="gallery-modal-overlay" onClick={onClose}>
			<button className="gallery-close-btn" onClick={onClose}>
				<X size={32} color="white" />
			</button>

			<button
				className="gallery-nav-btn left"
				onClick={(e) => {
					e.stopPropagation();
					slideTo("slide-right");
				}}
			>
				<ChevronLeft size={48} color="white" />
			</button>

			<div className="gallery-content" onClick={(e) => e.stopPropagation()}>
				<img src={photos[currentIndex]} alt={`Gallery ${currentIndex}`} className={`gallery-main-image ${animClass}`} />

				<div className="gallery-counter">
					{currentIndex + 1} / {photos.length}
				</div>
			</div>

			<button
				className="gallery-nav-btn right"
				onClick={(e) => {
					e.stopPropagation();
					slideTo("slide-left");
				}}
			>
				<ChevronRight size={48} color="white" />
			</button>
		</div>
	);
}
