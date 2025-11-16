import React, { useState, useRef } from "react";
import { ChevronDown } from "lucide-react";
import Button from "../components/Button";
import { getMockActivities, getCompletedActivities } from "../data/mockData";
import "./AddMemoryPopup.css";

export default function AddMemoryPopup({ onClose, onAdd, memoryToEdit }) {
	const [selectedPlace, setSelectedPlace] = useState(memoryToEdit?.title || "");
	const [photos, setPhotos] = useState(memoryToEdit?.photos || []);
	const [error, setError] = useState("");
	const fileInputRef = useRef(null);
	const activities = [...getMockActivities(), ...getCompletedActivities()];

	const handleAddPhoto = () => {
		fileInputRef.current?.click();
	};

	const handleFileChange = (e) => {
		const files = Array.from(e.target.files);
		files.forEach((file) => {
			const reader = new FileReader();
			reader.onload = (e) => {
				setPhotos((prev) => [...prev, e.target.result]);
			};
			reader.readAsDataURL(file);
		});
		// Reset file input so same file can be selected again
		e.target.value = "";
		setError("");
	};

	const handleRemovePhoto = (index) => {
		setPhotos((prev) => prev.filter((_, i) => i !== index));
	};

	const handleSubmit = () => {
		if (!selectedPlace.trim()) {
			setError("Please select a place before adding a memory.");
			return;
		}

		if (photos.length === 0) {
			setError("Please add at least one photo.");
			return;
		}

		const newMemory = {
			place: selectedPlace,
			photos,
			title: selectedPlace, // For compatibility with existing code
		};
		onAdd(newMemory);
		setSelectedPlace("");
		setPhotos([]);
		setError("");
		onClose();
	};

	return (
		<div className="popup-overlay">
			<div className="popup-content">
				<input
					type="file"
					ref={fileInputRef}
					onChange={handleFileChange}
					accept="image/*"
					multiple
					style={{ display: "none" }}
				/>
				{/* Select place dropdown */}
				<div className="select-place-container">
					<select
						className="select-place-dropdown"
						value={selectedPlace}
						onChange={(e) => {
							setSelectedPlace(e.target.value);
							setError("");
						}}
					>
						<option value="">Select place</option>
						{activities.map((activity) => (
							<option key={activity.id} value={activity.title}>
								{activity.title}
							</option>
						))}
					</select>
					<ChevronDown className="select-place-chevron" size={20} />
				</div>

				{/* Error message */}
				{error && <p className="error-text">{error}</p>}

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
									<Button text="✕" buttonType="secondary" onClick={() => handleRemovePhoto(index)} />
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
					<Button text="ADD MEMORY" buttonType="primary" onClick={handleSubmit} />
					<Button text="CANCEL" buttonType="secondary" onClick={onClose} />
				</div>
			</div>
		</div>
	);
}
