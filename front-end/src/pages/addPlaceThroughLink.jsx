import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button";
import "./addPlaceThroughLink.css";
import Header from "../components/Header";

export default function AddPlaceThroughLink() {
	const [showErrorModal, setShowErrorModal] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const navigate = useNavigate();
	const { groupId } = useParams();
	const [link, setLink] = useState("https://www.statueofliberty.org/visit/...");
	const [isLoading, setIsLoading] = useState(false);
	const [previewData, setPreviewData] = useState({
		name: "Moonlight Cafe",
		location: "Brooklyn, NY",
		highlights: ["Aesthetic Interior", "Famous for matcha", "Great brunch spot"],
		photo: null,
		tags: "#aesthetic, #matcha, #brunch"
	});

	const handleImportDetails = async () => {
		if (!link) {
			setErrorMessage("Please paste a link first.");
			setShowErrorModal(true);
			return;
		}
		
		setIsLoading(true);
		try {
			const JWT = localStorage.getItem("JWT");
			const backendURL = import.meta.env.VITE_BACKEND_ORIGIN || "http://localhost:8000";
			
			const headers = { "Content-Type": "application/json" };
			if (JWT) headers["Authorization"] = `Bearer ${JWT}`;

			const response = await fetch(`${backendURL}/api/extract-link-details`, {
				method: "POST",
				headers,
				body: JSON.stringify({ link })
			});

			const data = await response.json();

			if (!response.ok) {
				// Set error message for the modal instead of alert
				setErrorMessage(
					(data.error && data.error.includes("not parsable"))
						? "We couldn't find a specific place in that link. Please fill in the details manually."
						: (data.error || "Failed to fetch details")
				);
				setShowErrorModal(true);
				return;
			}
			
			setPreviewData({
				name: data.name || "Unknown Place",
				location: data.location || "Unknown Location",
				highlights: data.highlights || [],
				photo: data.photo || null,
				tags: data.hashtags || ""
			});
			
		} catch (error) {
			console.error(error);
			setErrorMessage("Could not extract details. Try entering them manually.");
			setShowErrorModal(true);
		} finally {
			setIsLoading(false);
		}
	};

	const handleAddToBucketList = () => {
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
						name: previewData.name, // changed from link
						category: "Uncategorised",
						tags: previewData.tags, // changed from tags
						locationDescription: previewData.location // added location
					}),
				});

				if (!response.ok) {
					const errorData = await response.json().catch(() => ({}));
					throw new Error(errorData.error || "Failed to add activity from link");
				}

				navigate(`/groups/${groupId}/activities`);
			} catch (err) {
				console.error("Error adding activity from link:", err);
				alert(err.message || "Failed to add activity");
			}
		})();
	};

	// Navigation handlers (for future use)
	const _handleNavigateToDecide = () => {
		if (!groupId) return;
		navigate(`/groups/${groupId}/decide`);
	};

	const _handleNavigateToMemories = () => {
		if (!groupId) return;
		navigate(`/groups/${groupId}/memories`);
	};

	const _handleNavigateToBucketList = () => {
		if (!groupId) return navigate("/");
		navigate(`/groups/${groupId}/activities`);
	};

	return (
		<div className="add-place-link-container">
			<Header backPath={`/groups/${groupId}/activities`} title="Import From Link" />

			<div className="add-place-link-content">
				<div className="section">
					<h2 className="section-heading">Paste Article or Website Link.</h2>
					<input type="text" value={link} onChange={(e) => setLink(e.target.value)} className="form-input" />
					<div className="import-button-container">
						<Button 
							text={isLoading ? "Importing..." : "Import Details"} 
							buttonType="primary" 
							onClick={handleImportDetails}
							disabled={isLoading}
						/>
					</div>
				</div>

				<div className="section">
					<h2 className="section-heading">Preview.</h2>
					{/* Dynamic Photo */}
					<div 
						className="preview-box" 
						style={previewData.photo ? { 
							backgroundImage: `url(${previewData.photo})`,
							backgroundSize: 'cover',
							backgroundPosition: 'center' 
						} : {}}
					>
						{!previewData.photo && <span className="preview-text">Photo</span>}
					</div>
				</div>

				<div className="section">
					{/* Dynamic Name and Location */}
					<h3 className="place-name">{previewData.name}</h3>
					<p className="place-location">{previewData.location}</p>
				</div>

				<div className="section">
					<h3 className="section-heading">Highlights</h3>
					<ul className="highlights-list">
						{/* Dynamic Highlights */}
						{previewData.highlights.map((item, index) => (
							<li key={index}>{item}</li>
						))}
					</ul>
				</div>

				<div className="section">
					<h3 className="section-heading">Add Tags (Optional).</h3>
					{/* Dynamic Tags Input */}
					<input 
						type="text" 
						value={previewData.tags} 
						onChange={(e) => setPreviewData({...previewData, tags: e.target.value})} 
						className="form-input" 
					/>
				</div>

				<div className="submit-button-container">
					<Button text="Add to Bucket List" buttonType="primary" onClick={handleAddToBucketList} />
				</div>
			</div>

			{/* Error Modal */}
			{showErrorModal && (
				<div className="modal-overlay" style={{
					position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
					backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', 
					justifyContent: 'center', alignItems: 'center', zIndex: 1000
				}}>
					<div className="modal-content" style={{
						backgroundColor: 'white', padding: '2rem', borderRadius: '12px',
						maxWidth: '90%', width: '400px', textAlign: 'center',
						boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
					}}>
						<h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Import Failed</h3>
						<p style={{ marginBottom: '1.5rem', color: '#666' }}>{errorMessage}</p>
						<Button 
							text="Close" 
							buttonType="primary" 
							onClick={() => setShowErrorModal(false)} 
						/>
					</div>
				</div>
			)}
		</div>
	);
}
