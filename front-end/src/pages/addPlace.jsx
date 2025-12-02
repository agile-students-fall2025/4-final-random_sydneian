import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import Button from "../components/Button";
import { getRecentAdditions } from "../data/mockData";
import "./addPlace.css";
import Header from "../components/Header";

export default function AddPlace() {
	const navigate = useNavigate();
	const { groupId } = useParams();
	const recentAdditions = getRecentAdditions();

	const handleNavigateToLink = () => {
		if (!groupId) return navigate("/");
		navigate(`/groups/${groupId}/activities/add/link`);
	};

	const handleNavigateToManually = () => {
		if (!groupId) return navigate("/");
		navigate(`/groups/${groupId}/activities/add/manual`);
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
		<div className="add-place-container">
			{/* Header */}
			<Header backPath={groupId ? `/groups/${groupId}/activities` : "/"} title="Add Place" />

			{/* Main Content */}
			<div className="add-place-content">
				<h2 className="question-text">How would you like to add?</h2>

				<div className="button-container">
					<Button text="Paste Link" buttonType="primary" onClick={handleNavigateToLink} />
					<Button text="Add Manually" buttonType="secondary" onClick={handleNavigateToManually} />
				</div>

				{/* Recent Additions Section */}
				<div className="recent-additions-section">
					<h3 className="section-title">Recent Additions</h3>
					<ul className="recent-additions-list">
						{recentAdditions.map((item) => (
							<li key={item.id} className="recent-addition-item">
								{item.title} ({item.addedBy})
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
}
