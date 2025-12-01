import React, { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, ChevronDown } from "lucide-react";
import Button from "../components/Button";
import "./addPlaceManually.css";
import Header from "../components/Header";

export default function AddPlaceManually() {
	const navigate = useNavigate();
	const { groupId } = useParams();
	const [placeName, setPlaceName] = useState("");
	const [location, setLocation] = useState("");
	const [category, setCategory] = useState("");
	const [description, setDescription] = useState("");
	const [tags, setTags] = useState("");
	const [photos, setPhotos] = useState([]);
	const fileInputRef = useRef(null);

	const handleSubmit = () => {
		const JWT = localStorage.getItem("JWT");
		if (!JWT) {
			alert("Please login first");
			return navigate("/login");
		}

		if (!groupId) {
			alert("No group selected");
			return navigate("/");
		}

		(async () => {
			try {
				const backendURL = import.meta.env.VITE_BACKEND_ORIGIN || "http://localhost:8000";
				const response = await fetch(`${backendURL}/api/groups/${groupId}/activities`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${JWT}`,
					},
					body: JSON.stringify({
						name: placeName,
						category: category || "Uncategorised",
						tags,
					}),
				});

				if (!response.ok) {
					const errorData = await response.json().catch(() => ({}));
					throw new Error(errorData.error || "Failed to add activity");
				}

				// Navigate back to this group's bucket list
				navigate(`/groups/${groupId}/activities`);
			} catch (err) {
				console.error("Error adding activity:", err);
				alert(err.message || "Failed to add activity");
			}
		})();
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
	};

	const handleRemovePhoto = (index) => {
		setPhotos((prev) => prev.filter((_, i) => i !== index));
	};

	const handleAddPhotoClick = () => {
		fileInputRef.current?.click();
	};

	// Navigation handlers (for future use)
	const _handleNavigateToDecide = () => {
		navigate("/decide");
	};

	const _handleNavigateToMemories = () => {
		navigate("/memorybook");
	};

	const _handleNavigateToBucketList = () => {
		if (!groupId) return navigate("/");
		navigate(`/groups/${groupId}/activities`);
	};

	return (
		<div className="add-place-manually-container">
			{/* Header */}
			<Header backPath={groupId ? `/groups/${groupId}/activities` : "/"} title="Add Place Manually" />

			{/* Main Content */}
			<div className="add-place-manually-content">
				<input
					type="file"
					ref={fileInputRef}
					onChange={handleFileChange}
					accept="image/*"
					multiple
					style={{ display: "none" }}
				/>
				<input
					type="text"
					placeholder="Place name"
					value={placeName}
					onChange={(e) => setPlaceName(e.target.value)}
					className="form-input"
				/>

				<input
					type="text"
					placeholder="Location"
					value={location}
					onChange={(e) => setLocation(e.target.value)}
					className="form-input"
				/>

				<div className="select-container">
					<input
						type="text"
						placeholder="Select category"
						value={category}
						onChange={(e) => setCategory(e.target.value)}
						className="form-input select-input"
						readOnly
					/>
					<ChevronDown className="select-chevron" size={20} />
				</div>

				<div className="form-section">
					<h3 className="section-heading">Description</h3>
					<textarea
						placeholder="Some notes..."
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						className="form-textarea"
						rows={4}
					/>
				</div>

				<div className="form-section">
					<h3 className="section-heading">Tags</h3>
					<input
						type="text"
						placeholder="#tags"
						value={tags}
						onChange={(e) => setTags(e.target.value)}
						className="form-input"
					/>
				</div>

				<div className="form-section">
					{photos.length === 0 ? (
						<div className="add-photos-area" onClick={handleAddPhotoClick}>
							<span className="add-photos-plus">+</span>
							<span className="add-photos-text">Add Photos</span>
						</div>
					) : (
						<div>
							<div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px", marginBottom: "8px" }}>
								{photos.map((photo, index) => (
									<div key={index} style={{ position: "relative", aspectRatio: "1" }}>
										<img
											src={photo}
											alt={`Preview ${index}`}
											style={{
												width: "100%",
												height: "100%",
												objectFit: "cover",
												borderRadius: "8px",
												border: "1px solid #000",
											}}
										/>
										<button
											onClick={() => handleRemovePhoto(index)}
											style={{
												position: "absolute",
												top: "8px",
												right: "8px",
												background: "#000",
												color: "#fff",
												border: "none",
												borderRadius: "50%",
												width: "24px",
												height: "24px",
												cursor: "pointer",
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
											}}
										>
											✕
										</button>
									</div>
								))}
							</div>
							<div className="add-photos-area" onClick={handleAddPhotoClick}>
								<span className="add-photos-plus">+</span>
								<span className="add-photos-text">Add More Photos</span>
							</div>
						</div>
					)}
				</div>

				<div className="submit-button-container">
					<Button text="Add to your Bucket List!" buttonType="primary" onClick={handleSubmit} />
				</div>
			</div>
		</div>
	);
}
