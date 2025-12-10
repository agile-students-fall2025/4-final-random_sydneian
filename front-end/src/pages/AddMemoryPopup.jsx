import React, { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import "./AddMemoryPopup.css";
import { useParams, useNavigate } from "react-router-dom";

// Simple internal Button component to avoid import errors
const Button = ({ text, onClick, buttonType }) => {
	const className = buttonType === "primary" ? "btn-base btn-primary" : "btn-base btn-secondary";
	return (
		<button className={className} onClick={onClick}>
			{text}
		</button>
	);
};

export default function AddMemoryPopup({ onClose, onAdd, onEdit, memoryToEdit }) {
	const [selectedPlace, setSelectedPlace] = useState(memoryToEdit?.title || "");
	const [photos, setPhotos] = useState(memoryToEdit?.photos || []);
	const [error, setError] = useState("");
	const [activities, setActivities] = useState([]);
	const fileInputRef = useRef(null);
	const isEditing = !!memoryToEdit;

	const { groupId } = useParams();
	const navigate = useNavigate();
	const backendURL = import.meta.env.VITE_DOCKER_PRODUCTION ? "" : (import.meta.env.VITE_BACKEND_ORIGIN || "http://localhost:8000");

	useEffect(() => {
		const fetchActivities = async () => {
			const JWT = localStorage.getItem("JWT");
			if (!JWT) {
				console.log("Not authenticated, please login or register");
				navigate("/login");
				return;
			}

			if (!groupId) {
				setError("No group selected.");
				return;
			}

			try {
				const res = await fetch(`${backendURL}/api/groups/${groupId}`, {
					headers: {
						Authorization: `Bearer ${JWT}`,
					},
				});

				if (!res.ok) {
					const responseData = await res.json().catch(() => ({}));
					throw new Error(responseData.error || `Failed to fetch activities. Status: ${res.status}`);
				}

				const data = await res.json();
				if (data.activities) setActivities(data.activities);
			} catch (err) {
				console.error("Failed to load activities:", err);
				setError("Could not load available places. Please try again.");
			}
		};

		fetchActivities();
	}, [backendURL, groupId, navigate]);

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
		e.target.value = "";
		setError("");
	};

	const handleRemovePhoto = (index) => {
		// Confirmation dialog added here
		if (window.confirm("Are you sure you want to delete this photo?")) {
			setPhotos((prev) => prev.filter((_, i) => i !== index));
		}
	};

	const handleSubmit = () => {
		// Only require selecting a place when ADDING
		if (!isEditing && !selectedPlace.trim()) {
			setError("Please select a place before adding a memory.");
			return;
		}

		// Always require at least one photo
		if (photos.length === 0) {
			setError("Please add at least one photo.");
			return;
		}

		// Find the activity only when *adding*
		let activityId;
		if (!isEditing) {
			const selectedActivity = activities.find((a) => a.name === selectedPlace);
			if (!selectedActivity) {
				setError("Selected place is invalid.");
				return;
			}
			activityId = selectedActivity._id;
		} else {
			// Reuse old activityId for editing
			activityId = memoryToEdit.activityId;
		}

		const payload = {
			title: selectedPlace,
			images: photos,
			activityId,
		};

		if (isEditing) {
			payload.memoryId = memoryToEdit._id;
			onEdit(payload);
		} else {
			onAdd(payload);
		}

		// Reset & close
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
						className="select-place-dropdown form-input"
						value={selectedPlace}
						onChange={(e) => {
							setSelectedPlace(e.target.value);
							setError("");
						}}
					>
						<option value="">Select activity</option>
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
				<div className={`add-photos-container ${photos.length > 0 ? "has-photos" : ""}`}>
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
									<button
										className="remove-btn"
										onClick={(e) => {
											e.stopPropagation();
											handleRemovePhoto(index);
										}}
									>
										✕
									</button>
								</div>
							))}

							{/* This is the small square button that appears at the end of the list */}
							<div className="add-more-photos-tile" onClick={handleAddPhoto}>
								<span className="add-photos-plus small">+</span>
								<span className="add-photos-text small">Add</span>
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
