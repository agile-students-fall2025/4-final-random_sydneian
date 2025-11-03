import Button from "../components/Button";
import Header from "../components/Header";
import { useRef, useState } from "react";
import "./JoinGroup.css";
import "../components/Dialog.css";

export default function JoinGroupPage() {
	const [selectedGroup, setSelectedGroup] = useState(null);
	const [searchQuery, setSearchQuery] = useState("");
	const dialogRef = useRef(null);

	const invites = [
		{ id: 1001, name: "Syndeian2", by: "Sarah", description: "Wanna join our awesome group?" },
		{ id: 1002, name: "The Teapot Society", by: "Jimmy", description: "Wanna join our awesome group?" },
		{ id: 1003, name: "Agile Friends", by: "Mike", description: "Wanna join our awesome group?" },
	];

	// Filter function
	const filterGroups = (groups) => {
		if (!searchQuery.trim()) return groups;

		const query = searchQuery.toLowerCase();
		return groups.filter(
			(group) =>
				group.name.toLowerCase().includes(query) ||
				group.by.toLowerCase().includes(query) ||
				group.description.toLowerCase().includes(query),
		);
	};

	const filteredInvites = filterGroups(invites);

	const handleAccept = () => {
		if (selectedGroup) {
			// Get existing groups from localStorage
			const existingGroups = JSON.parse(localStorage.getItem('userGroups') || '[]');
			
			// Check if group already exists
			const groupExists = existingGroups.some(g => g.id === selectedGroup.id);
			
			if (!groupExists) {
				// Create group object
				const newGroup = {
					id: selectedGroup.id || Date.now(),
					name: selectedGroup.name,
					img: "https://placehold.co/128",
					description: selectedGroup.description,
					by: selectedGroup.by
				};

				// Add new group to the list
				const updatedGroups = [...existingGroups, newGroup];
				
				// Save to localStorage
				localStorage.setItem('userGroups', JSON.stringify(updatedGroups));
			}
			
			console.log("Accepted invite to:", selectedGroup.name);
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

	return (
		<div className="join-container">
			<Header title="Join Existing Group" backPath="/dashboard" />

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
					filteredInvites.map((invite, index) => (
						<Button
							key={index}
							img="https://placehold.co/128"
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
							<img src="https://placehold.co/128" />
						</div>
						<div>
							<div className="dialog-group-name">{selectedGroup?.name}</div>
							<div className="dialog-by">By {selectedGroup?.by}</div>
							<div className="dialog-description">{selectedGroup?.description}</div>
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
