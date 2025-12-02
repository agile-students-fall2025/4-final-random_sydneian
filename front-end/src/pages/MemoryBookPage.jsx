import React, { useState, useEffect } from "react";
import "./MemoryBookPage.css";
import "../components/Button.css";
import AddMemoryPopup from "./AddMemoryPopup";
import Header from "../components/Header";
import Button from "../components/Button";
import { Pencil, Trash2, Plus } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

const normalizeMemory = (m) => ({
	...m,
	photos: m.images,
	dateAdded: new Date(m.createdAt).toLocaleDateString("en-US", {
		day: "numeric",
		month: "long",
		year: "numeric",
	}),
});

export default function MemoryBookPage() {
	const [showPopup, setShowPopup] = useState(false);
	const [memories, setMemories] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [editingIndex, setEditingIndex] = useState(null);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(true);
	const { groupId } = useParams();
	const navigate = useNavigate();

	const backendURL = import.meta.env.VITE_BACKEND_ORIGIN || "http://localhost:8000";
	const API_BASE = `${backendURL}/api/groups/${groupId}/memories`;

	useEffect(() => {
		const JWT = localStorage.getItem("JWT");
		if (!JWT) {
			console.log("Not authenticated, please login or register");
			navigate("/login");
			return;
		}

		if (!groupId) {
			setError("No group selected.");
			setLoading(false);
			return;
		}

		(async () => {
			try {
				const res = await fetch(API_BASE, {
					headers: {
						Authorization: `Bearer ${JWT}`,
					},
				});

				if (!res.ok) {
					if (res.status === 401) {
						setError("Unauthorized. Please login again.");
						navigate("/login");
						return;
					}
					const responseData = await res.json().catch(() => ({}));
					throw new Error(responseData.error || "Failed to fetch memories");
				}

				const data = await res.json();
				setMemories(data.map(normalizeMemory));
			} catch (err) {
				console.error("Error fetching memories:", err);
				setError(err.message || "Couldn't load memories");
			} finally {
				setLoading(false);
			}
		})();
	}, [API_BASE, groupId, navigate]);

	const handleAddMemory = async (newMemory) => {
		try {
			const JWT = localStorage.getItem("JWT");
			if (!JWT) {
				alert("Please login first");
				return navigate("/login");
			}

			if (editingIndex !== null) {
				// EDIT MEMORY
				const memoryId = memories[editingIndex]._id;

				const res = await fetch(`${API_BASE}/${memoryId}`, {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${JWT}`,
					},
					body: JSON.stringify({
						images: newMemory.photos,
						title: newMemory.title,
						activityId: memories[editingIndex].activityId,
					}),
				});

				if (!res.ok) throw new Error("Failed to edit memory");

				const updated = await res.json();

				const updatedMemories = [...memories];
				updatedMemories[editingIndex] = normalizeMemory(updated);
				setMemories(updatedMemories);
				setEditingIndex(null);
			} else {
				// ADD MEMORY
				const res = await fetch(API_BASE, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${JWT}`,
					},
					body: JSON.stringify({
						images: newMemory.photos,
						title: newMemory.title,
						activityId: newMemory.activityId,
					}),
				});

				if (!res.ok) throw new Error("Failed to add memory");

				const created = await res.json();
				setMemories((prev) => [...prev, normalizeMemory(created)]);
			}
		} catch (err) {
			console.error(err);
		}

		setShowPopup(false);
	};

	const handleDeleteMemory = async (index) => {
		if (window.confirm("Are you sure you want to delete this memory?")) {
			const memoryId = memories[index]._id;
			try {
				const JWT = localStorage.getItem("JWT");
				if (!JWT) {
					alert("Please login first");
					return navigate("/login");
				}

				await fetch(`${API_BASE}/${memoryId}`, {
					method: "DELETE",
					headers: {
						Authorization: `Bearer ${JWT}`,
					},
				});
				setMemories(memories.filter((_, i) => i !== index));
			} catch (err) {
				console.error("Failed to delete memory:", err);
			}
		}
	};

	const handleEditMemory = (index) => {
		setEditingIndex(index);
		setShowPopup(true);
	};

	const filteredMemories = memories.filter((memory) =>
		(memory.title || "").toLowerCase().includes(searchTerm.toLowerCase()),
	);

	if (loading) {
		return (
			<div className="memory-container">
				<Header backPath={`/groups/${groupId}/activities`} title="Our Memories" />
				<div className="memory-empty">
					<p>Loading...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="memory-container">
			{/* <h1 className="memory-header">Our Memories</h1>
      <hr className="memory-divider" /> */}
			<Header backPath={`/groups/${groupId}/activities`} title="Our Memories" />

			<div className="search-container">
				<input
					type="text"
					className="search-input"
					placeholder="Search memories..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
			</div>

			{error ? (
				<div className="memory-empty">
					<p>Error: {error}</p>
				</div>
			) : filteredMemories.length === 0 ? (
				<div className="memory-empty">
					<p>No memories found.</p>
				</div>
			) : (
				<div className="memory-list">
					{filteredMemories.map((memory, index) => (
						<div key={index} className="memory-card">
							<div className="memory-card-header">
								<h2 className="memory-title">{memory.title}</h2>
								<p className="memory-date">Added on {memory.dateAdded}</p>
							</div>
							<div className="memory-photo-grid">
								{memory.photos?.map((photo, i) => (
									<div key={i} className="photo-item">
										<img src={photo} alt={`Memory ${i}`} />
									</div>
								))}
							</div>

							{/* Edit & Delete Icons */}
							<div className="memory-actions-icons">
								<Pencil
									size={18}
									className="icon edit-icon"
									onClick={() => handleEditMemory(index)}
									title="Edit Memory"
								/>
								<Trash2
									size={18}
									className="icon delete-icon"
									onClick={() => handleDeleteMemory(index)}
									title="Delete Memory"
								/>
							</div>
						</div>
					))}
				</div>
			)}

			<button className="add-memory-btn" onClick={() => setShowPopup(true)} aria-label="Add memory">
				<Plus size={24} />
			</button>

			{showPopup && (
				<AddMemoryPopup
					onClose={() => {
						setEditingIndex(null);
						setShowPopup(false);
					}}
					onAdd={handleAddMemory}
					memoryToEdit={editingIndex !== null ? memories[editingIndex] : null}
				/>
			)}
		</div>
	);
}
