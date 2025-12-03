import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Heart, Plus } from "lucide-react";
import "./bucketList.css";
import Header from "../components/Header";
import Button from "../components/Button";

export default function BucketList() {
	const navigate = useNavigate();
	const { groupId } = useParams();
	const [activeTab, setActiveTab] = useState("todo");
	const [searchQuery, setSearchQuery] = useState("");
	const [activities, setActivities] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [showAddPopup, setShowAddPopup] = useState(false);

	useEffect(() => {
		const fetchActivities = async () => {
			const JWT = localStorage.getItem("JWT");
			if (!JWT) {
				console.log("Not authenticated, please login or register");
				navigate("/login");
				return;
			}

			if (!groupId) {
				console.error("No groupId present in route params");
				setError("No group selected.");
				setLoading(false);
				return;
			}

			try {
				const backendURL = import.meta.env.VITE_BACKEND_ORIGIN || "http://localhost:8000";
				const response = await fetch(`${backendURL}/api/groups/${groupId}`, {
					headers: { Authorization: `Bearer ${JWT}` },
				});

				if (!response.ok) {
					if (response.status >= 400 && response.status < 500) {
						const responseData = await response.json();
						if (responseData.redirect) navigate(responseData.redirect);
						throw new Error(responseData.error || "Client side error");
					}
					throw new Error("Network error");
				}

				const group = await response.json();
				setActivities(group.activities || []);
			} catch (err) {
				console.error("Failed to get activities. Error:", err.message);
				setError("Couldn't get activities :(");
			} finally {
				setLoading(false);
			}
		};

		fetchActivities();
	}, [navigate, groupId]);

	const getDaysAgoText = (days) => {
		if (days === 1) return "1 day ago";
		if (days === 7) return "1 week ago";
		if (days === 14) return "2 weeks ago";
		if (days === 21) return "3 weeks ago";
		return `${days} days ago`;
	};

	const toDoActivities = activities.filter((activity) => !activity.done);
	const doneActivities = activities.filter((activity) => activity.done);

	const filteredActivities = toDoActivities.filter(
		(activity) =>
			(activity.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
			(activity.category || "").toLowerCase().includes(searchQuery.toLowerCase()),
	);

	const filteredCompletedActivities = doneActivities.filter(
		(activity) =>
			(activity.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
			(activity.category || "").toLowerCase().includes(searchQuery.toLowerCase()),
	);

	const handleAddPlace = () => {
		if (!groupId) {
			navigate("/");
			return;
		}
		setShowAddPopup(true);
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

	if (loading) {
		return (
			<div className="bucket-list-container">
				<Header backPath={"/"} title="Bucket List" />
				<div className="content-area">
					<div className="content-list">Loading...</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="bucket-list-container">
				<Header backPath={"/"} title="Bucket List" />
				<div className="content-area">
					<div className="content-list">Error: {error}</div>
				</div>
			</div>
		);
	}

	return (
		<div className="bucket-list-container">
			{/* Header */}
			<div className="bucket-list-header">
				<Header
					backPath={"/"}
					title="Bucket List"
					// menuItems={[
					// 	{ text: "Add Place", action: () => navigate(`/groups/${groupId}/activities/add`) },
					// 	{ text: "Memory Book", action: () => navigate(`/groups/${groupId}/memories`) },
					// 	{ text: "Decide!", action: () => navigate(`/groups/${groupId}/decide`) },
					// 	{ text: "Group Settings", action: () => navigate(`/groups/${groupId}/settings`) },
					// ]}
				/>

				{/* Search Bar */}
				<div className="search-container">
					<input
						type="text"
						placeholder="Search..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="search-input"
					/>
				</div>
			</div>

			{/* Tabs */}
			<div className="tabs-container">
				<div className="tabs-wrapper">
					<button
						onClick={() => setActiveTab("todo")}
						className={`tab-button ${activeTab === "todo" ? "todo-active" : "todo-inactive"}`}
					>
						To Do
					</button>
					<button
						onClick={() => setActiveTab("done")}
						className={`tab-button ${activeTab === "done" ? "done-active" : "done-inactive"}`}
					>
						Done
					</button>
				</div>
			</div>

			{/* Content Area */}
			<div className="content-area">
				<div className="content-list">
					{(activeTab === "todo" ? filteredActivities : filteredCompletedActivities).length > 0 ? (
						(activeTab === "todo" ? filteredActivities : filteredCompletedActivities).map((activity) => (
							<div key={activity._id} className="activity-card">
								{/* Title and Likes Row */}
								<div className="card-header">
									<h3 className={"card-title" + (activeTab === "done" ? " completed" : "")}>{activity.name}</h3>
									<div className="likes-container">
										<Heart size={16} fill="currentColor" />
										<span className="likes-count">{activity.likes?.length || 0}</span>
									</div>
								</div>

								{/* Type and Location */}
								<p className="card-type-location">{activity.category}</p>

								{/* Added By Info */}
								{/* Placeholder added-by info until we track creator */}
								<p className="card-added-info">Added recently</p>

								{/* Tags */}
								<div className="card-tags">
									{(activity.tags || []).map((tag, index) => (
										<span key={index} className="tag">
											#{tag}
										</span>
									))}
								</div>
							</div>
						))
					) : (
						<div className="empty-state">No activities found</div>
					)}
				</div>
			</div>

			{/* Floating Action Button */}
			<button onClick={handleAddPlace} className="fab-button" aria-label="Add new item">
				<Plus size={24} />
			</button>

			{/* Add Activity Popup */}
			{showAddPopup && (
				<div
					className="modal-overlay"
					style={{
						position: "fixed",
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						backgroundColor: "rgba(0,0,0,0.5)",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						zIndex: 2000,
					}}
					onClick={() => setShowAddPopup(false)}
				>
					<div
						className="modal-content"
						style={{
							backgroundColor: "white",
							padding: "20px",
							borderRadius: "15px",
							width: "85%",
							maxWidth: "350px",
							display: "flex",
							flexDirection: "column",
							gap: "15px",
						}}
						onClick={(e) => e.stopPropagation()}
					>
						<h3 style={{ textAlign: "center", margin: "0 0 10px 0" }}>Add New Activity</h3>

						<Button
							text="Paste Link"
							buttonType="primary"
							onClick={() => navigate(`/groups/${groupId}/activities/add/link`)}
						/>

						<Button
							text="Add Manually"
							buttonType="secondary"
							onClick={() => navigate(`/groups/${groupId}/activities/add/manual`)}
						/>

						<div style={{ marginTop: "10px" }}>
							<Button text="Cancel" buttonType="danger" onClick={() => setShowAddPopup(false)} />
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
