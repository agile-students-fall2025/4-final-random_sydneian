import Button from "../components/Button";
import { MoreVertical, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./dashboard.css";

export default function DashboardPage() {
	const navigate = useNavigate();
	const [groups, setGroups] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [swipedGroupId, setSwipedGroupId] = useState(null);
	const [touchStart, setTouchStart] = useState(null);
	const [touchEnd, setTouchEnd] = useState(null);

	// Fetch groups from backend on mount
	useEffect(() => {
		const fetchGroups = async () => {
			const JWT = localStorage.getItem("JWT");
			if (!JWT) {
				navigate("/login");
				return;
			}

			const backendURL = import.meta.env.VITE_BACKEND_ORIGIN || "http://localhost:8000";

			try {
				const JWT = localStorage.getItem("JWT");
				if (!JWT) {
					setError("Not authenticated. Please login.");
					setLoading(false);
					return;
				}

				const backendURL = "http://localhost:8000";

				// Get list of group IDs
				const groupIdsResponse = await fetch(`${backendURL}/api/groups`, {
					headers: {
						Authorization: `Bearer ${JWT}`,
					},
				});

				if (!groupIdsResponse.ok) {
					if (groupIdsResponse.status === 401) {
						setError("Authentication failed. Please login again.");
						localStorage.removeItem("JWT");
						return;
					}
					throw new Error("Failed to fetch groups");
				}

				const groupIds = await groupIdsResponse.json();

				// Get list of group IDs user is invited to
				const inviteIdsResponse = await fetch(`${backendURL}/api/invites`, {
					headers: {
						Authorization: `Bearer ${JWT}`,
					},
				});

				if (inviteIdsResponse.status === 401) {
					navigate("/login");
					return;
				}

				if (!inviteIdsResponse.ok) {
					throw new Error("Failed to fetch invites");
				}

				const inviteIds = await inviteIdsResponse.json();

				// Fetch full details for each group and invite
				const groupDetails = await Promise.all(
					groupIds.map(async (id) => {
						const response = await fetch(`${backendURL}/api/groups/${id}`, {
							headers: {
								Authorization: `Bearer ${JWT}`,
							},
						});
						if (response.ok) {
							return response.json();
						}
						return null;
					}),
				);

				// Filter out null groups and sort by updatedAt (newest first)
				const validGroups = groupDetails.filter((group) => group !== null);
				validGroups.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

				setGroups(validGroups);
			} catch (err) {
				setError(err.message);
				console.error("Error fetching groups:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchGroups();
	}, [navigate]);

	const onNavigate = (path) => {
		navigate(path);
	};

	const handleLeaveGroup = async (groupId) => {
		try {
			const JWT = localStorage.getItem("JWT");
			const backendURL = "http://localhost:8000";

			const response = await fetch(`${backendURL}/api/groups/${groupId}/leave`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${JWT}`,
				},
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "Failed to leave group");
			}

			// Remove the group from the local state
			setGroups((prevGroups) => prevGroups.filter((group) => group._id !== groupId));
		} catch (err) {
			setError(err.message);
			console.error("Error leaving group:", err);
			alert(`Error: ${err.message}`);
		}
	};

	const handleDeleteGroup = async (groupId, e) => {
		if (e) {
			e.stopPropagation(); // Prevent navigation when clicking delete
		}

		// Close swipe menu
		setSwipedGroupId(null);

		if (!window.confirm("Are you sure you want to delete this group?")) {
			return;
		}

		try {
			const JWT = localStorage.getItem("JWT");
			const backendURL = import.meta.env.VITE_BACKEND_ORIGIN || "http://localhost:8000";

			const response = await fetch(`${backendURL}/api/groups/${groupId}`, {
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${JWT}`,
				},
			});

			if (!response.ok) {
				const errorData = await response.json();
				const errorMessage = errorData.error || "Failed to delete group";

				// If group has multiple members, offer to leave instead
				if (errorMessage.includes("multiple members")) {
					const leaveGroup = window.confirm(
						"Cannot delete group with multiple members. Would you like to leave the group instead?",
					);
					if (leaveGroup) {
						await handleLeaveGroup(groupId);
					}
					return;
				}

				throw new Error(errorMessage);
			}

			// Remove the group from the local state
			setGroups((prevGroups) => prevGroups.filter((group) => group._id !== groupId));
		} catch (err) {
			setError(err.message);
			console.error("Error deleting group:", err);
			alert(`Error: ${err.message}`);
		}
	};

	const minSwipeDistance = 50;

	const onTouchStart = (e) => {
		setTouchEnd(null);
		setTouchStart(e.targetTouches[0].clientX);
	};

	const onTouchMove = (e) => {
		setTouchEnd(e.targetTouches[0].clientX);
	};

	const onTouchEnd = (groupId) => {
		if (!touchStart || !touchEnd) return;

		const distance = touchStart - touchEnd;
		const isLeftSwipe = distance > minSwipeDistance;
		const isRightSwipe = distance < -minSwipeDistance;

		if (isLeftSwipe) {
			setSwipedGroupId(groupId);
		} else if (isRightSwipe) {
			setSwipedGroupId(null);
		}

		// Reset touch positions
		setTouchStart(null);
		setTouchEnd(null);
	};

	const onMouseDown = (e) => {
		setTouchEnd(null);
		setTouchStart(e.clientX);
	};

	const onMouseMove = (e) => {
		if (touchStart !== null) {
			setTouchEnd(e.clientX);
		}
	};

	const onMouseUp = (groupId) => {
		if (!touchStart || !touchEnd) {
			setTouchStart(null);
			setTouchEnd(null);
			return;
		}

		const distance = touchStart - touchEnd;
		const isLeftSwipe = distance > minSwipeDistance;
		const isRightSwipe = distance < -minSwipeDistance;

		if (isLeftSwipe) {
			setSwipedGroupId(groupId);
		} else if (isRightSwipe) {
			setSwipedGroupId(null);
		}

		// Reset positions
		setTouchStart(null);
		setTouchEnd(null);
	};

	const handleGroupClick = (groupId, e) => {
		// Don't close if clicking the delete button (it handles its own click)
		if (e?.target?.closest(".delete-group-button")) {
			return;
		}

		// If swiped open, close it instead of navigating
		if (swipedGroupId === groupId) {
			setSwipedGroupId(null);
			return;
		}

		// Close any other swiped group
		if (swipedGroupId && swipedGroupId !== groupId) {
			setSwipedGroupId(null);
		}

		// Otherwise navigate to this group's bucket list page
		onNavigate(`/groups/${groupId}/activities`);
	};

	if (loading) {
		return <div className="dashboard-container">Loading...</div>;
	}

	if (error) {
		return <div className="dashboard-container">Error: {error}</div>;
	}

	return (
		<div className="dashboard-container">
			<div className="dashboard-header">
				<h1 className="dashboard-title">Dashboard</h1>
				<div className="menu-icon" onClick={() => onNavigate("/profile-settings")} role="button" tabIndex={0}>
					<MoreVertical size={20} />
				</div>
			</div>

			<div className="quick-actions">
				<h2 className="section-title">Quick Actions</h2>
				<div className="button-spacing">
					<Button text="Create New Group" buttonType="primary" onClick={() => onNavigate("/groups/create")} />
					<Button text="Join Existing Group" buttonType="secondary" onClick={() => onNavigate("/groups/join")} />
				</div>
			</div>

			<div className="my-groups">
				<h2 className="section-title">My Groups</h2>
				<div className="button-spacing">
					{groups.map((group) => (
						<div
							key={group._id}
							className="group-item-wrapper"
							onTouchStart={onTouchStart}
							onTouchMove={onTouchMove}
							onTouchEnd={() => onTouchEnd(group._id)}
							onMouseDown={onMouseDown}
							onMouseMove={onMouseMove}
							onMouseUp={() => onMouseUp(group._id)}
							onMouseLeave={() => {
								if (touchStart !== null) {
									setTouchStart(null);
									setTouchEnd(null);
								}
							}}
							onClick={(e) => handleGroupClick(group._id, e)}
						>
							<button
								className="delete-group-button"
								onClick={(e) => handleDeleteGroup(group._id, e)}
								aria-label="Delete group"
								title="Delete group"
							>
								<Trash2 size={18} />
							</button>
							<div className={`group-item-container ${swipedGroupId === group._id ? "swiped" : ""}`}>
								<Button
									img={group.icon || "https://placehold.co/48"}
									buttonType="secondary"
									text={group.name}
									arrowType="forward"
									onClick={(e) => handleGroupClick(group._id, e)}
								/>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
