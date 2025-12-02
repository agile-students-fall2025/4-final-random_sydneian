import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import Button from "../components/Button";
import Header from "../components/Header";
import "./createGroup.css";

export default function CreateGroupPage() {
	const navigate = useNavigate();
	const [groupName, setGroupName] = useState("");
	const [groupDescription, setGroupDescription] = useState("");
	const [inviteFriends, setInviteFriends] = useState("");
	const [profileImage, setProfileImage] = useState("https://placehold.co/48");
	const [searchQuery, setSearchQuery] = useState("");
	const [userSuggestions, setUserSuggestions] = useState([]);
	const [selectedUsers, setSelectedUsers] = useState([]);
	const [showSuggestions, setShowSuggestions] = useState(false);
	const fileInputRef = useRef(null);
	const suggestionsRef = useRef(null);

	const onNavigate = (path) => {
		navigate(path);
	};

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
				setShowSuggestions(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	useEffect(() => {
		const searchUsers = async () => {
			if (searchQuery.length < 2) {
				setUserSuggestions([]);
				return;
			}

			try {
				const JWT = localStorage.getItem("JWT");
				const backendURL = import.meta.env.VITE_BACKEND_ORIGIN || "http://localhost:8000";
				const response = await fetch(`${backendURL}/api/users/search/${encodeURIComponent(searchQuery)}`, {
					headers: {
						Authorization: `Bearer ${JWT}`,
					},
				});

				if (response.ok) {
					const users = await response.json();
					const filteredUsers = users.filter(
						(user) => !selectedUsers.some((selected) => selected._id === user._id),
					);
					setUserSuggestions(filteredUsers);
				}
			} catch (error) {
				console.error("Error searching users:", error);
			}
		};

		const timeoutId = setTimeout(searchUsers, 300);
		return () => clearTimeout(timeoutId);
	}, [searchQuery, selectedUsers]);

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				setProfileImage(e.target.result);
			};
			reader.readAsDataURL(file);
		}
		e.target.value = "";
	};

	const handleProfileUploadClick = () => {
		fileInputRef.current?.click();
	};

	const handleSelectUser = (user) => {
		setSelectedUsers([...selectedUsers, user]);
		setSearchQuery("");
		setUserSuggestions([]);
		setShowSuggestions(false);
	};

	const handleRemoveUser = (userId) => {
		setSelectedUsers(selectedUsers.filter((user) => user._id !== userId));
	};

	const handleCreateGroup = async () => {
		if (!groupName.trim()) {
			alert("Please enter a group name");
			return;
		}

		try {
			const JWT = localStorage.getItem("JWT");
			if (!JWT) {
				alert("Please login first");
				return;
			}

			const backendURL = import.meta.env.VITE_BACKEND_ORIGIN || "http://localhost:8000";
			const response = await fetch(`${backendURL}/api/groups`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${JWT}`,
				},
				body: JSON.stringify({
					name: groupName,
					desc: groupDescription,
					icon: profileImage !== "https://placehold.co/48" ? profileImage : undefined,
					invitedMembers: selectedUsers.map((user) => user.username),
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to create group");
			}

			// Navigate back to dashboard
			onNavigate("/");
		} catch (error) {
			console.error("Error creating group:", error);
			alert("Failed to create group. Please try again.");
		}
	};

	return (
		<div className="create-container">
			<Header backPath={"/"} title="Create New Group" />

			<div className="create-content">
				<input
					type="file"
					ref={fileInputRef}
					onChange={handleFileChange}
					accept="image/*"
					style={{ display: "none" }}
				/>
				<div className="profile-upload" onClick={handleProfileUploadClick}>
					{profileImage !== "https://placehold.co/48" ? (
						<img
							src={profileImage}
							alt="Profile preview"
							style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }}
						/>
					) : (
						"+ Add Profile Picture"
					)}
				</div>

				<input
					type="text"
					className="form-input"
					placeholder="Group name"
					value={groupName}
					onChange={(e) => setGroupName(e.target.value)}
				/>

				<textarea
					className="form-textarea"
					placeholder="Group description"
					value={groupDescription}
					onChange={(e) => setGroupDescription(e.target.value)}
				/>

				<div className="invite-section">
					<div className="selected-users">
						{selectedUsers.map((user) => (
							<div key={user._id} className="selected-user-tag">
								<span>{user.username}</span>
								<button type="button" onClick={() => handleRemoveUser(user._id)} className="remove-user-btn">
									×
								</button>
							</div>
						))}
					</div>
					<div className="autocomplete-wrapper" ref={suggestionsRef}>
						<input
							type="text"
							className="form-input"
							placeholder="Search and invite friends"
							value={searchQuery}
							onChange={(e) => {
								setSearchQuery(e.target.value);
								setShowSuggestions(true);
							}}
							onFocus={() => setShowSuggestions(true)}
						/>
						{showSuggestions && userSuggestions.length > 0 && (
							<div className="suggestions-dropdown">
								{userSuggestions.map((user) => (
									<div key={user._id} className="suggestion-item" onClick={() => handleSelectUser(user)}>
										<img
											src={user.profilePicture || "https://placehold.co/32"}
											alt={user.username}
											className="suggestion-avatar"
										/>
										<span>{user.username}</span>
									</div>
								))}
							</div>
						)}
					</div>
				</div>

				<Button text="Create Group" buttonType="primary" onClick={handleCreateGroup} />
			</div>
		</div>
	);
}
