import React, { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import Button from "../components/Button";
import "./AddMemoryPopup.css";

export default function AddMemoryPopup({ onClose, onAdd, memoryToEdit }) {
	const [selectedPlace, setSelectedPlace] = useState(memoryToEdit?.title || "");
	const [photos, setPhotos] = useState(memoryToEdit?.photos || []);
	const [error, setError] = useState("");
	const [activities, setActivities] = useState([]);
	const fileInputRef = useRef(null);

	const BACKEND = import.meta.env.VITE_BACKEND_ORIGIN || "http://localhost:8000";

	useEffect(() => {
		const fetchActivities = async () => {
			try {
				const res = await fetch(`${BACKEND}/api/groups/group-syd-id`, {
					headers: {
						// Include JWT
						Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
						"Content-Type": "application/json",
					},
				});

				if (!res.ok) {
					throw new Error(`Failed to fetch activities. Status: ${res.status}`);
				}

				const data = await res.json();
				if (data.activities) setActivities(data.activities);
			} catch (err) {
				console.error("Failed to load activities:", err);
				setError("Could not load available places. Please try again.");
			}
		};

		fetchActivities();
	}, [BACKEND]);

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
			title: selectedPlace,
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
							<option key={activity._id} value={activity.name}>
								{activity.name}
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
