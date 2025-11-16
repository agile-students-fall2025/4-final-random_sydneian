import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Heart } from "lucide-react";
import { getMockActivities, getCompletedActivities } from "../data/mockData";
import "./bucketList.css";
import Header from "../components/Header";

export default function BucketList() {
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState("todo");
	const [searchQuery, setSearchQuery] = useState("");

	const allActivities = getMockActivities();
	const completedActivities = getCompletedActivities();

	const getDaysAgoText = (days) => {
		if (days === 1) return "1 day ago";
		if (days === 7) return "1 week ago";
		if (days === 14) return "2 weeks ago";
		if (days === 21) return "3 weeks ago";
		return `${days} days ago`;
	};

	const filteredActivities = allActivities.filter(
		(activity) =>
			activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			activity.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
			activity.location.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	const filteredCompletedActivities = completedActivities.filter(
		(activity) =>
			activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			activity.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
			activity.location.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	const handleAddPlace = () => {
		// Navigate to add place page when implemented
		navigate("/add-place");
	};

	const handleNavigateToDecide = () => {
		// Navigate to decide page when implemented
		navigate("/decide");
	};

	const handleNavigateToMemories = () => {
		// Navigate to memories page
		navigate("/memorybook");
	};

	return (
		<div className="bucket-list-container">
			{/* Header */}
			<div className="bucket-list-header">
				{/* <div className="bucket-list-header-content">
          <button 
            className="back-button"
            onClick={() => navigate(-1)}
            aria-label="Back"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="bucket-list-title">Sydneian</h1>
          <div className="header-spacer"></div>
        </div> */}
				<Header backPath={"/dashboard"} title="Bucket List" />

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
					{activeTab === "todo" ? (
						filteredActivities.length > 0 ? (
							filteredActivities.map((activity) => (
								<div key={activity.id} className="activity-card">
									{/* Title and Likes Row */}
									<div className="card-header">
										<h3 className="card-title">{activity.title}</h3>
										<div className="likes-container">
											<Heart size={16} fill="currentColor" />
											<span className="likes-count">{activity.likes}</span>
										</div>
									</div>

									{/* Type and Location */}
									<p className="card-type-location">
										{activity.type} - {activity.location}
									</p>

									{/* Added By Info */}
									<p className="card-added-info">
										Added {getDaysAgoText(activity.daysAgo)} by {activity.addedBy}
									</p>

									{/* Tags */}
									<div className="card-tags">
										{activity.tags.map((tag, index) => (
											<span key={index} className="tag">
												#{tag}
											</span>
										))}
									</div>
								</div>
							))
						) : (
							<div className="empty-state">No activities found</div>
						)
					) : filteredCompletedActivities.length > 0 ? (
						filteredCompletedActivities.map((activity) => (
							<div key={activity.id} className="activity-card">
								{/* Title and Likes Row */}
								<div className="card-header">
									<h3 className="card-title completed">{activity.title}</h3>
									<div className="likes-container">
										<Heart size={16} fill="currentColor" />
										<span className="likes-count">{activity.likes}</span>
									</div>
								</div>

								{/* Type and Location */}
								<p className="card-type-location">
									{activity.type} - {activity.location}
								</p>

								{/* Added By Info */}
								<p className="card-added-info">
									Added {getDaysAgoText(activity.daysAgo)} by {activity.addedBy}
								</p>

								{/* Tags */}
								<div className="card-tags">
									{activity.tags.map((tag, index) => (
										<span key={index} className="tag">
											#{tag}
										</span>
									))}
								</div>
							</div>
						))
					) : (
						<div className="empty-state">No completed activities found</div>
					)}
				</div>
			</div>

			{/* Floating Action Button */}
			<button onClick={handleAddPlace} className="fab-button" aria-label="Add new item">
				+
			</button>

			{/* Bottom Navigation */}
			<div className="bottom-nav">
				<div className="bottom-nav-content">
					<button className="nav-button" onClick={() => {}}>
						<div className="nav-icon"></div>
						<span className="nav-label">List</span>
					</button>
					<button className="nav-button" onClick={handleNavigateToDecide}>
						<div className="nav-icon-outlined"></div>
						<span className="nav-label">Decide</span>
					</button>
					<button className="nav-button" onClick={handleNavigateToMemories}>
						<div className="nav-icon-outlined"></div>
						<span className="nav-label">Memories</span>
					</button>
				</div>
			</div>
		</div>
	);
}
