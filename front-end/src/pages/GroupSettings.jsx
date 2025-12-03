import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Copy, Check } from "lucide-react";
import Header from "../components/Header";
import Button from "../components/Button";
import "./GroupSettings.css";

export default function GroupSettings() {
	const { groupId } = useParams();
	const navigate = useNavigate();
	const [group, setGroup] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [copied, setCopied] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [userSuggestions, setUserSuggestions] = useState([]);
	const [showSuggestions, setShowSuggestions] = useState(false);
	const suggestionsRef = useRef(null);

	useEffect(() => {
		const fetchGroup = async () => {
			const JWT = localStorage.getItem("JWT");
			if (!JWT) {
				navigate("/login");
				return;
			}

			const backendURL = import.meta.env.VITE_BACKEND_ORIGIN || "http://localhost:8000";

			try {
				const response = await fetch(`${backendURL}/api/groups/${groupId}`, {
					headers: { Authorization: `Bearer ${JWT}` },
				});

				if (!response.ok) {
					throw new Error("Failed to fetch group");
				}

				const groupData = await response.json();
				setGroup(groupData);

				if (!groupData.inviteCode) {
					await handleGenerateInviteCode();
				}
			} catch (err) {
				console.error("Error fetching group:", err);
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchGroup();
	}, [groupId, navigate]);

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
					const memberIds = group?.members?.map((m) => m._id) || [];
					const invitedIds = group?.invitedMembers?.map((m) => m._id) || [];
					const filteredUsers = users.filter(
						(user) => !memberIds.includes(user._id) && !invitedIds.includes(user._id),
					);
					setUserSuggestions(filteredUsers);
				}
			} catch (error) {
				console.error("Error searching users:", error);
			}
		};

		const timeoutId = setTimeout(searchUsers, 300);
		return () => clearTimeout(timeoutId);
	}, [searchQuery, group]);

	const handleGenerateInviteCode = async () => {
		try {
			const JWT = localStorage.getItem("JWT");
			const backendURL = import.meta.env.VITE_BACKEND_ORIGIN || "http://localhost:8000";

			const response = await fetch(`${backendURL}/api/groups/${groupId}/invite-code/generate`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${JWT}`,
				},
			});

			if (!response.ok) {
				throw new Error("Failed to generate invite code");
			}

			const data = await response.json();
			setGroup((prev) => ({ ...prev, inviteCode: data.inviteCode }));
		} catch (error) {
			console.error("Error generating invite code:", error);
			alert("Failed to generate invite code");
		}
	};

	const handleCopyInviteCode = () => {
		if (group?.inviteCode) {
			navigator.clipboard.writeText(group.inviteCode);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		}
	};

	const handleInviteUser = async (userId) => {
		try {
			const JWT = localStorage.getItem("JWT");
			const backendURL = import.meta.env.VITE_BACKEND_ORIGIN || "http://localhost:8000";

			const response = await fetch(`${backendURL}/api/groups/${groupId}/invite`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${JWT}`,
				},
				body: JSON.stringify({ userId }),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "Failed to invite user");
			}

			const updatedGroup = await response.json();
			setGroup(updatedGroup.group);
			setSearchQuery("");
			setUserSuggestions([]);
			setShowSuggestions(false);
			alert("User invited successfully!");
		} catch (error) {
			console.error("Error inviting user:", error);
			alert(error.message);
		}
	};

	if (loading) {
		return (
			<div className="group-settings-container">
				<Header backPath={`/groups/${groupId}/activities`} title="Group Settings" />
				<div className="settings-content">Loading...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="group-settings-container">
				<Header backPath={`/groups/${groupId}/activities`} title="Group Settings" />
				<div className="settings-content">Error: {error}</div>
			</div>
		);
	}

	return (
		<div className="group-settings-container">
			<Header backPath={`/groups/${groupId}/activities`} title="Group Settings" />

			<div className="settings-content">
				<div className="settings-section">
					<div className="group-icon-display">
						<img src={group?.icon || "https://placehold.co/128"} alt={group?.name} />
					</div>
					<h2 className="group-name-display">{group?.name}</h2>
					<p className="group-desc-display">{group?.desc || "No description"}</p>
				</div>

				<div className="settings-section">
					<h3 className="section-title">Invite by Code</h3>
					<p className="section-description">Share this code with friends to let them join</p>
					<div className="invite-code-container">
						<div className="invite-code-display">
							<span className="invite-code-value">{group?.inviteCode || "LOADING..."}</span>
							<button
								className="icon-button"
								onClick={handleCopyInviteCode}
								title="Copy invite code"
								disabled={!group?.inviteCode}
							>
								{copied ? <Check size={20} /> : <Copy size={20} />}
							</button>
						</div>
					</div>
				</div>

				<div className="settings-section">
					<h3 className="section-title">Invite by Username</h3>
					<p className="section-description">Search and invite users directly</p>
					<div className="autocomplete-wrapper" ref={suggestionsRef}>
						<input
							type="text"
							className="search-input"
							placeholder="Search username..."
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
									<div
										key={user._id}
										className="suggestion-item"
										onClick={() => handleInviteUser(user._id)}
									>
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

				<div className="settings-section">
					<h3 className="section-title">Members ({group?.members?.length || 0})</h3>
					<div className="members-list">
						{group?.members?.map((member) => (
							<div key={member._id} className="member-item">
								<img
									src={member.profilePicture || "https://placehold.co/48"}
									alt={member.username}
									className="member-avatar"
								/>
								<span className="member-username">{member.username}</span>
							</div>
						))}
					</div>
				</div>

				{group?.invitedMembers && group.invitedMembers.length > 0 && (
					<div className="settings-section">
						<h3 className="section-title">Pending Invites ({group.invitedMembers.length})</h3>
						<div className="members-list">
							{group.invitedMembers.map((member) => (
								<div key={member._id} className="member-item">
									<img
										src={member.profilePicture || "https://placehold.co/48"}
										alt={member.username}
										className="member-avatar"
									/>
									<span className="member-username">{member.username}</span>
									<span className="pending-badge">Pending</span>
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

