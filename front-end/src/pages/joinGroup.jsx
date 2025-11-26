import Button from "../components/Button";
import Header from "../components/Header";
import { useRef, useState, useEffect } from "react";
import "./JoinGroup.css";
import "../components/Dialog.css";

export default function JoinGroupPage() {
	const [selectedGroup, setSelectedGroup] = useState(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [invites, setInvites] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const dialogRef = useRef(null);

	// Fetch invites from backend on mount
	useEffect(() => {
		const fetchInvites = async () => {
			try {
				// Get list of invite IDs
				const inviteIdsResponse = await fetch("http://localhost:8000/api/invites");

				if (!inviteIdsResponse.ok) {
					throw new Error("Failed to fetch invites");
				}

				const inviteIds = await inviteIdsResponse.json();

				// Fetch full details for each invite
				const inviteDetails = await Promise.all(
					inviteIds.map(async (id) => {
						const response = await fetch(`http://localhost:8000/api/groups/${id}`);
						if (response.ok) {
							return response.json();
						}
						return null;
					}),
				);

				setInvites(inviteDetails.filter((invite) => invite !== null));
			} catch (err) {
				setError(err.message);
				console.error("Error fetching invites:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchInvites();
	}, []);

	// Filter function
	const filterGroups = (groups) => {
		if (!searchQuery.trim()) return groups;

		const query = searchQuery.toLowerCase();
		return groups.filter(
			(group) => group.name.toLowerCase().includes(query) || (group.desc && group.desc.toLowerCase().includes(query)),
		);
	};

	const filteredInvites = filterGroups(invites);

	const handleAccept = async () => {
		if (selectedGroup) {
			try {
				const response = await fetch(`http://localhost:8000/api/groups/${selectedGroup._id}/accept`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
				});

				if (!response.ok) {
					throw new Error("Failed to accept invite");
				}

				console.log("Accepted invite to:", selectedGroup.name);

				// Refresh invites list
				setInvites(invites.filter((invite) => invite._id !== selectedGroup._id));
			} catch (error) {
				console.error("Error accepting invite:", error);
				alert("Failed to accept invite. Please try again.");
			}
		}
		setSelectedGroup(null);
		dialogRef.current?.close();
	};

	const handleReject = () => {
		if (selectedGroup) {
			console.log("Rejected invite to:", selectedGroup.name);
		}
		setSelectedGroup(null);
		dialogRef.current?.close();
	};

	const openDialog = (group) => {
		setSelectedGroup(group);
		dialogRef.current?.showModal();
	};

	if (loading) {
		return (
			<div className="join-container">
				<Header title="Join Existing Group" backPath="/" />
				<div>Loading...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="join-container">
				<Header title="Join Existing Group" backPath="/" />
				<div>Error: {error}</div>
			</div>
		);
	}

	return (
		<div className="join-container">
			<Header title="Join Existing Group" backPath="/" />

			<div className="search-container">
				<input
					type="text"
					className="search-input"
					placeholder="Search..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
				/>
			</div>

			<h2 className="invites-title">Invites</h2>
			<div className="invites-section">
				{filteredInvites.length > 0 ? (
					filteredInvites.map((invite) => (
						<Button
							key={invite._id}
							img={invite.icon || "https://placehold.co/128"}
							buttonType="secondary"
							text={invite.name}
							arrowType="forward"
							onClick={() => openDialog(invite)}
						/>
					))
				) : (
					<div className="no-results">No invites found</div>
				)}
			</div>

			<dialog ref={dialogRef} className="invite-dialog">
				<div className="dialog-content">
					<div className="dialog-layout">
						<div className="dialog-photo">
							<img src={selectedGroup?.icon || "https://placehold.co/128"} alt="Group icon" />
						</div>
						<div>
							<div className="dialog-group-name">{selectedGroup?.name}</div>
							<div className="dialog-description">{selectedGroup?.desc}</div>
						</div>
					</div>
					<div className="dialog-buttons">
						<div className="dialog-button-half">
							<Button text="Reject" buttonType="secondary" onClick={handleReject} />
						</div>
						<div className="dialog-button-half">
							<Button text="Accept" buttonType="primary" onClick={handleAccept} />
						</div>
					</div>
				</div>
			</dialog>
		</div>
	);
}
