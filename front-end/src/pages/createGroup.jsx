import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import Button from "../components/Button";
import Header from "../components/Header";
import "./createGroup.css";

export default function CreateGroupPage() {
	const navigate = useNavigate();
	const [groupName, setGroupName] = useState("");
	const [groupDescription, setGroupDescription] = useState("");
	const [inviteFriends, setInviteFriends] = useState("");
	const [profileImage, setProfileImage] = useState("https://placehold.co/48");
	const fileInputRef = useRef(null);

	const onNavigate = (path) => {
		navigate(path);
	};

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				setProfileImage(e.target.result);
			};
			reader.readAsDataURL(file);
		}
		e.target.value = "";
	};

	const handleProfileUploadClick = () => {
		fileInputRef.current?.click();
	};

	const handleCreateGroup = async () => {
		if (!groupName.trim()) {
			alert("Please enter a group name");
			return;
		}

		try {
			const response = await fetch("http://localhost:8000/api/groups", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name: groupName,
					desc: groupDescription,
					icon: profileImage !== "https://placehold.co/48" ? profileImage : undefined,
					invitedMembers: inviteFriends
						.split(",")
						.map((f) => f.trim())
						.filter((f) => f.length > 0),
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to create group");
			}

			// Navigate back to dashboard
			onNavigate("/dashboard");
		} catch (error) {
			console.error("Error creating group:", error);
			alert("Failed to create group. Please try again.");
		}
	};

	return (
		<div className="create-container">
			<Header backPath={"/dashboard"} title="Create New Group" />

			<div className="create-content">
				<input
					type="file"
					ref={fileInputRef}
					onChange={handleFileChange}
					accept="image/*"
					style={{ display: "none" }}
				/>
				<div className="profile-upload" onClick={handleProfileUploadClick}>
					{profileImage !== "https://placehold.co/48" ? (
						<img
							src={profileImage}
							alt="Profile preview"
							style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }}
						/>
					) : (
						"+ Add Profile Picture"
					)}
				</div>

				<input
					type="text"
					className="form-input"
					placeholder="Group name"
					value={groupName}
					onChange={(e) => setGroupName(e.target.value)}
				/>

				<textarea
					className="form-textarea"
					placeholder="Group description"
					value={groupDescription}
					onChange={(e) => setGroupDescription(e.target.value)}
				/>

				<input
					type="text"
					className="form-input"
					placeholder="Invite friends"
					value={inviteFriends}
					onChange={(e) => setInviteFriends(e.target.value)}
				/>

				<Button text="Create Group" buttonType="primary" onClick={handleCreateGroup} />
			</div>
		</div>
	);
}
