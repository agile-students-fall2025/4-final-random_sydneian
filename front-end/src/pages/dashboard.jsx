import Button from "../components/Button";
import { MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./dashboard.css";

export default function DashboardPage() {
	const navigate = useNavigate();
	const [groups, setGroups] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// Fetch groups from backend on mount
	useEffect(() => {
		const fetchGroups = async () => {
			try {
				// Get list of group IDs
				const groupIdsResponse = await fetch("http://localhost:8000/api/groups");

				if (!groupIdsResponse.ok) {
					throw new Error("Failed to fetch groups");
				}

				const groupIds = await groupIdsResponse.json();

				// Fetch full details for each group
				const groupDetails = await Promise.all(
					groupIds.map(async (id) => {
						const response = await fetch(`http://localhost:8000/api/groups/${id}`);
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
	}, []);

	const onNavigate = (path) => {
		navigate(path);
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
					<Button text="Create New Group" buttonType="primary" onClick={() => onNavigate("/group/create")} />
					<Button text="Join Existing Group" buttonType="secondary" onClick={() => onNavigate("/group/join")} />
				</div>
			</div>

			<div className="my-groups">
				<h2 className="section-title">My Groups</h2>
				<div className="button-spacing">
					{groups.map((group) => (
						<Button
							key={group._id}
							img={group.icon || "https://placehold.co/48"}
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
