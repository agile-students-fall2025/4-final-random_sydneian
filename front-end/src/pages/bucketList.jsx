import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Heart, Plus, MapPin, LoaderCircle } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Header from "../components/Header";
import Button from "../components/Button";
import ActivityDetailsModal from "../components/ActivityDetailsModal";
import "./bucketList.css";

// Register GSAP plugin
gsap.registerPlugin(ScrollTrigger);

export default function BucketList() {
	const navigate = useNavigate();
	const { groupId } = useParams();
	const [activeTab, setActiveTab] = useState("todo");
	const [searchQuery, setSearchQuery] = useState("");
	const [activities, setActivities] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [showAddPopup, setShowAddPopup] = useState(false);
	const [isXLoading, setIsXLoading] = useState([]);
	const [selectedActivity, setSelectedActivity] = useState({});
	const activityDetailsModalRef = useRef();
	const containerRef = useRef(null);
	const cardRefs = useRef([]);
	const currentExpandedCardRef = useRef(null);
	const lastScrollTopRef = useRef(0);

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
				const backendURL = import.meta.env.VITE_DOCKER_PRODUCTION
					? ""
					: import.meta.env.VITE_BACKEND_ORIGIN || "http://localhost:8000";
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

	useLayoutEffect(() => {
		let rafId = null;
		let scrollHandler = null;
		let contentArea = null;

		const updateExpandedCard = () => {
			if (rafId) return;

			rafId = requestAnimationFrame(() => {
				const viewportCenter = window.innerHeight * 0.5;
				let bestCard = null;
				let bestDistance = Infinity;

				const validCards = cardRefs.current.filter((card) => card !== null && card !== undefined);
				const firstCard = validCards[0];
				const lastCard = validCards[validCards.length - 1];

				const contentArea = containerRef.current?.querySelector(".content-area");
				const scrollTop = contentArea?.scrollTop || window.scrollY;
				const scrollHeight = contentArea?.scrollHeight || document.documentElement.scrollHeight;
				const clientHeight = contentArea?.clientHeight || window.innerHeight;

				const isScrollingDown = scrollTop > lastScrollTopRef.current;
				lastScrollTopRef.current = scrollTop;

				const cardData = [];
				cardRefs.current.forEach((card, idx) => {
					if (!card) return;

					const rect = card.getBoundingClientRect();

					const visibleTop = Math.max(0, rect.top);
					const visibleBottom = Math.min(window.innerHeight, rect.bottom);
					const visibleHeight = Math.max(0, visibleBottom - visibleTop);
					const visibilityRatio = visibleHeight / rect.height;

					const isFirst = card === firstCard;
					const isLast = card === lastCard;
					const minVisibility = isFirst || isLast ? 0.15 : 0.2;

					if (visibilityRatio < minVisibility) return;

					const cardCenter = rect.top + rect.height / 2;
					const rawDistance = Math.abs(cardCenter - viewportCenter);

					cardData.push({ card, rawDistance, visibilityRatio, isFirst, isLast });
				});

				// Second pass: apply bonuses and select winner
				cardData.forEach(({ card, rawDistance, visibilityRatio, isFirst, isLast }) => {
					let distance = rawDistance;

					// Hysteresis when scrolling down
					if (card === currentExpandedCardRef.current && isScrollingDown) {
						distance = distance * 0.9;
					}

					// First card bonus
					if (isFirst && scrollTop < 50) {
						distance = distance * 0.1;
					}
					// Last card bonus - only when at absolute bottom and second-to-last isn't closer
					else if (isLast && scrollTop + clientHeight > scrollHeight - 5 && isScrollingDown && visibilityRatio > 0.5) {
						// Check if second-to-last card is closer to center (without bonuses)
						const secondToLastData = cardData[cardData.length - 2];
						if (secondToLastData && secondToLastData.rawDistance < rawDistance * 0.7) {
							// Second-to-last is significantly closer, don't apply bonus
							// This prevents last card from stealing focus
						} else {
							distance = distance * 0.15;
						}
					}

					if (distance < bestDistance) {
						bestDistance = distance;
						bestCard = card;
					}
				});

				// Update all cards
				cardRefs.current.forEach((card) => {
					if (card) {
						if (card === bestCard && bestCard) {
							card.classList.add("in-view");
							currentExpandedCardRef.current = card; // Track current expanded card
						} else {
							card.classList.remove("in-view");
						}
					}
				});

				rafId = null;
			});
		};

		// Wait for cards to be rendered
		const timer = setTimeout(() => {
			// Clear existing ScrollTriggers
			ScrollTrigger.getAll().forEach((st) => st.kill());

			// Create a single ScrollTrigger that updates on scroll
			ScrollTrigger.create({
				trigger: containerRef.current || document.body,
				start: "top top",
				end: "bottom bottom",
				onUpdate: updateExpandedCard,
			});

			// Also listen to scroll events directly for more reliable updates
			scrollHandler = () => updateExpandedCard();
			contentArea = containerRef.current?.querySelector(".content-area");
			if (contentArea) {
				contentArea.addEventListener("scroll", scrollHandler, { passive: true });
			}
			window.addEventListener("scroll", scrollHandler, { passive: true });

			// Initial check
			updateExpandedCard();

			ScrollTrigger.refresh();
		}, 100);

		return () => {
			clearTimeout(timer);
			if (rafId) cancelAnimationFrame(rafId);
			if (scrollHandler) {
				if (contentArea) {
					contentArea.removeEventListener("scroll", scrollHandler);
				}
				window.removeEventListener("scroll", scrollHandler);
			}
			ScrollTrigger.getAll().forEach((st) => st.kill());
		};
	}, [activities, activeTab, loading]);

	const getTimeAgo = (dateString) => {
		const date = new Date(dateString);
		const now = new Date();
		const seconds = Math.floor((now - date) / 1000);

		if (seconds < 60) return "just now";
		const minutes = Math.floor(seconds / 60);
		if (minutes < 60) return `${minutes}m ago`;
		const hours = Math.floor(minutes / 60);
		if (hours < 24) return `${hours}h ago`;
		const days = Math.floor(hours / 24);
		if (days < 7) return `${days}d ago`;
		if (days < 30) return `${Math.floor(days / 7)}w ago`;

		return date.toLocaleDateString(); // Fallback to date for older items
	};

	const userId = JSON.parse(atob(localStorage.getItem("JWT").split(".")[1])).id;
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
		<div ref={containerRef} className="bucket-list-container">
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
						(activeTab === "todo" ? filteredActivities : filteredCompletedActivities).map((activity, index) => (
							<div
								key={activity._id}
								ref={(el) => (cardRefs.current[index] = el)}
								className="activity-card"
								onClick={(evt) => {
									setSelectedActivity(activity);
									activityDetailsModalRef.current.showModal();
								}}
							>
								{/* Image container - expands when in view */}
								<div className="card-image-container">
									{activity.images && activity.images.length > 0 ? (
										<img src={activity.images[0]} alt={activity.name} className="card-image" />
									) : (
										<div className="card-image-placeholder">
											<MapPin size={24} />
										</div>
									)}
								</div>

								{/* Title and Likes Row */}
								<div className="card-header">
									<h3 className={"card-title" + (activeTab === "done" ? " completed" : "")}>{activity.name}</h3>
									<div
										className={`likes-container ${activity.likes.some((user) => user._id === userId) ? "liked" : ""}`}
										onClick={async (evt) => {
											evt.stopPropagation();
											setIsXLoading([...isXLoading, `${activity._id}-like`]);

											const res = await fetch(
												`${import.meta.env.VITE_BACKEND_ORIGIN}/api/groups/${groupId}/activities/${activity._id}`,
												{
													headers: {
														Authorization: `Bearer ${localStorage.getItem("JWT")}`,
														"Content-Type": "application/json",
													},
													method: "PATCH",
													body: JSON.stringify({ liked: !activity.likes.some((user) => user._id === userId) }),
												},
											);

											if (!res.ok) return alert("Failed to like activity");

											const updatedActivity = await res.json();

											setActivities(
												activities.map((activity) =>
													activity._id === updatedActivity._id ? updatedActivity : activity,
												),
											);

											setIsXLoading(isXLoading.filter((x) => x !== `${activity._id}-like`));
										}}
									>
										<Heart size={16} className="heart-icon" />
										{isXLoading.includes(`${activity._id}-like`) ? (
											<LoaderCircle strokeWidth="6" color="currentColor" size="8" className="spin-loader" />
										) : (
											<span className="likes-count">{activity.likes?.length || 0}</span>
										)}
									</div>
								</div>

								{/* Type and Location */}
								<p className="card-type-location">{activity.category}</p>

								{/* Added By Info */}
								{activity.addedBy ? (
									<p className="card-added-info">
										Added by {activity.addedBy.username} • {getTimeAgo(activity.createdAt)}
									</p>
								) : (
									<p className="card-added-info">
										Added {activity.createdAt ? getTimeAgo(activity.createdAt) : "recently"}
									</p>
								)}

								{/* Tags */}
								<div className="card-tags">
									{(activity.tags || []).map((tag, idx) => (
										<span key={idx} className="tag">
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

						{/* <div style={{ marginTop: "10px" }}>
							<Button text="Cancel" buttonType="danger" onClick={() => setShowAddPopup(false)} />
						</div> */}
					</div>
				</div>
			)}

			{/* Activity details & editing popup */}
			<ActivityDetailsModal
				groupId={groupId}
				activities={activities}
				selectedActivity={selectedActivity}
				ref={activityDetailsModalRef}
				onUpdate={(updatedActivity) => {
					setActivities(
						activities.map((activity) => (activity._id === updatedActivity._id ? updatedActivity : activity)),
					);
					setSelectedActivity(updatedActivity);
				}}
			/>
		</div>
	);
}
