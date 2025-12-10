import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Edit2 } from "lucide-react";
import "./ProfileSettings.css";
import Header from "../components/Header";
import Button from "../components/Button";

function ProfileSettings() {
	const navigate = useNavigate();
	const fileInputRef = useRef(null);
	const [profilePicture, setProfilePicture] = useState("");
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [message, setMessage] = useState("");

	useEffect(() => {
		const fetchUserData = async () => {
			const JWT = localStorage.getItem("JWT");
			if (!JWT) {
				navigate("/login");
				return;
			}

			try {
				const backendURL = import.meta.env.VITE_DOCKER_PRODUCTION ? "" : (import.meta.env.VITE_BACKEND_ORIGIN || "http://localhost:8000");

				// Decode JWT to get user ID
				const payload = JSON.parse(atob(JWT.split(".")[1]));
				const userId = payload.id;

				const response = await fetch(`${backendURL}/api/users/${userId}`, {
					headers: { Authorization: `Bearer ${JWT}` },
				});

				if (!response.ok) {
					throw new Error("Failed to fetch user data");
				}

				const userData = await response.json();
				setProfilePicture(userData.profilePicture || "");
				setUsername(userData.username || "");
				setEmail(userData.email || "");
			} catch (error) {
				console.error("Error fetching user data:", error);
				setMessage("Failed to load profile data");
			} finally {
				setLoading(false);
			}
		};

		fetchUserData();
	}, [navigate]);

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			// Convert to base64 or use FileReader to preview
			const reader = new FileReader();
			reader.onloadend = () => {
				setProfilePicture(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleEditClick = () => {
		fileInputRef.current?.click();
	};

	const handleSave = async () => {
		setSaving(true);
		setMessage("");

		const JWT = localStorage.getItem("JWT");
		if (!JWT) {
			navigate("/login");
			return;
		}

		try {
			const backendURL = import.meta.env.VITE_DOCKER_PRODUCTION ? "" : (import.meta.env.VITE_BACKEND_ORIGIN || "http://localhost:8000");

			// Decode JWT to get user ID
			const payload = JSON.parse(atob(JWT.split(".")[1]));
			const userId = payload.id;

			const response = await fetch(`${backendURL}/api/users/${userId}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${JWT}`,
				},
				body: JSON.stringify({
					profilePicture,
					username,
					email,
				}),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "Failed to update profile");
			}

			setMessage("Profile updated successfully!");
			setTimeout(() => setMessage(""), 1500);
		} catch (error) {
			console.error("Error updating profile:", error);
			setMessage(error.message || "Failed to update profile");
		} finally {
			setSaving(false);
		}
	};

	if (loading) {
		return (
			<>
				<Header backPath={"/"} title="Profile & Settings" />
				<div className="profile-container">
					<p>Loading...</p>
				</div>
			</>
		);
	}

	return (
		<>
			<Header backPath={"/"} title="Profile & Settings" />
			<div className="profile-container">
				{/* Account Info */}
				<div className="account-section">
					<div className="profile-pic-container">
						{profilePicture ? (
							<img src={profilePicture} alt="Profile" className="profile-pic" />
						) : (
							<div className="profile-pic profile-pic-empty">
								<span>No Image</span>
							</div>
						)}
						<button className="edit-pic-button" onClick={handleEditClick} aria-label="Edit profile picture">
							<Edit2 size={20} />
						</button>
						<input
							ref={fileInputRef}
							type="file"
							accept="image/*"
							onChange={handleFileChange}
							style={{ display: "none" }}
						/>
					</div>
					<div className="profile-info">
						<div className="form-group">
							<label htmlFor="username">Username</label>
							<input
								id="username"
								type="text"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								placeholder="Enter username"
							/>
						</div>
						<div className="form-group">
							<label htmlFor="email">Email</label>
							<input
								id="email"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="Enter email"
							/>
						</div>
					</div>
				</div>

				<Button
					text={message ? `${message}` : saving ? "Saving..." : "Save Changes"}
					buttonType={message ? "success" : "primary"}
					onClick={handleSave}
					disabled={saving}
				/>

				<button
					className="sign-out-button"
					onClick={() => {
						localStorage.removeItem("JWT");
						localStorage.removeItem("emailVerified");
						navigate("/login");
					}}
				>
					Sign Out
				</button>
			</div>
		</>
	);
}

export default ProfileSettings;
