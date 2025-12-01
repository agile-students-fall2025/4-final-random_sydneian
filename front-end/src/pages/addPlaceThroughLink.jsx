import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button";
import "./addPlaceThroughLink.css";
import Header from "../components/Header";

export default function AddPlaceThroughLink() {
	const navigate = useNavigate();
	const { groupId } = useParams();
	const [link, setLink] = useState("https://tiktok.com/@rickastleyofficial/vide...");
	const [tags, setTags] = useState("#aesthetic, #matcha, #brunch");

	const handleImportDetails = () => {
		// Mock import functionality
		console.log("Importing details from:", link);
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
						name: link || "New place from link",
						category: "Uncategorised",
						tags,
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
			<Header backPath={"/add-place"} title="Import From Link" />

			{/* Main Content */}
			<div className="add-place-link-content">
				<div className="section">
					<h2 className="section-heading">Paste TikTok or Instagram Link.</h2>
					<input type="text" value={link} onChange={(e) => setLink(e.target.value)} className="form-input" />
					<div className="import-button-container">
						<Button text="Import Details" buttonType="primary" onClick={handleImportDetails} />
					</div>
				</div>

				<div className="section">
					<h2 className="section-heading">Preview.</h2>
					<div className="preview-box">
						<span className="preview-text">Photo</span>
					</div>
				</div>

				<div className="section">
					<h3 className="place-name">Moonlight Cafe</h3>
					<p className="place-location">Brooklyn, NY</p>
				</div>

				<div className="section">
					<h3 className="section-heading">Highlights</h3>
					<ul className="highlights-list">
						<li>Aesthetic Interior</li>
						<li>Famous for matcha</li>
						<li>Great brunch spot</li>
					</ul>
				</div>

				<div className="section">
					<h3 className="section-heading">Add Tags (Optional).</h3>
					<input type="text" value={tags} onChange={(e) => setTags(e.target.value)} className="form-input" />
				</div>

				<div className="submit-button-container">
					<Button text="Add to Bucket List" buttonType="primary" onClick={handleAddToBucketList} />
				</div>
			</div>
		</div>
	);
}
