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
		e.target.value = '';
	};

	const handleProfileUploadClick = () => {
		fileInputRef.current?.click();
	};

	const handleCreateGroup = () => {
		if (!groupName.trim()) {
			alert("Please enter a group name");
			return;
		}

		// Get existing groups from localStorage
		const existingGroups = JSON.parse(localStorage.getItem('userGroups') || '[]');
		
		// Create new group
		const newGroup = {
			id: Date.now(), // Use timestamp as unique ID
			name: groupName,
			img: profileImage,
			description: groupDescription,
			inviteFriends: inviteFriends
		};

		// Add new group to the list
		const updatedGroups = [...existingGroups, newGroup];
		
		// Save to localStorage
		localStorage.setItem('userGroups', JSON.stringify(updatedGroups));

		// Navigate back to dashboard
		onNavigate("/dashboard");
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
						style={{ display: 'none' }}
					/>
					<div className="profile-upload" onClick={handleProfileUploadClick}>
						{profileImage !== "https://placehold.co/48" ? (
							<img src={profileImage} alt="Profile preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
						) : (
							'+ Add Profile Picture'
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
