import Button from "../components/Button";
import { MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./dashboard.css";

export default function DashboardPage() {
	const navigate = useNavigate();
	const [groups, setGroups] = useState([]);

	// Load groups from localStorage on mount
	useEffect(() => {
		const savedGroups = localStorage.getItem('userGroups');
		if (savedGroups) {
			setGroups(JSON.parse(savedGroups));
		} else {
			// Default groups for initial load
			const defaultGroups = [
				{ id: 1, name: "Syndeian", img: "https://placehold.co/48" },
				{ id: 2, name: "Third North", img: "https://placehold.co/48" },
				{ id: 3, name: "NYU", img: "https://placehold.co/48" }
			];
			setGroups(defaultGroups);
			localStorage.setItem('userGroups', JSON.stringify(defaultGroups));
		}
	}, []);

	const onNavigate = (path) => {
		navigate(path);
	};

	return (
		<div className="dashboard-container">
				<div className="dashboard-header">
					<h1 className="dashboard-title">Dashboard</h1>
					<div className="menu-icon"
            onClick={() => onNavigate("/profile-settings")} 
            role = "button"
            tabIndex = {0}>
						<MoreVertical size={20} />
					</div>
				</div>

				<div className="quick-actions">
					<h2 className="section-title">Quick Actions</h2>
					<div className="button-spacing">
						<Button text="Create New Group" buttonType="primary" onClick={() => onNavigate("/group/create")} />
						<Button text="Join Existing Group" buttonType="secondary" onClick={() => onNavigate("/group/join")} />
					</div>
				</div>

				<div className="my-groups">
					<h2 className="section-title">My Groups</h2>
					<div className="button-spacing">
						{groups.map((group) => (
							<Button 
								key={group.id}
								img={group.img} 
								buttonType="secondary" 
								text={group.name} 
								arrowType="forward"  
								onClick={() => onNavigate("/bucket-list")}
							/>
						))}
					</div>
				</div>
			</div>
	);
}
