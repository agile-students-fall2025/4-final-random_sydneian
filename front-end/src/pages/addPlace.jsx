import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import Button from "../components/Button";
import { getRecentAdditions } from "../data/mockData";
import "./addPlace.css";
import Header from "../components/Header";

export default function AddPlace() {
	const navigate = useNavigate();
	const recentAdditions = getRecentAdditions();

	const handleNavigateToLink = () => {
		navigate("/add-place/link");
	};

	const handleNavigateToManually = () => {
		navigate("/add-place/manually");
	};

	// Navigation handlers (for future use)
	const _handleNavigateToDecide = () => {
		navigate("/decide");
	};

	const _handleNavigateToMemories = () => {
		navigate("/memorybook");
	};

	const _handleNavigateToBucketList = () => {
		navigate("/bucket-list");
	};

	return (
		<div className="add-place-container">
			{/* Header */}
			<Header backPath={"/"} title="Add Place" />

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
