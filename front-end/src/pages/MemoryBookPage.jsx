import React, { useState, useEffect } from "react";
import "./MemoryBookPage.css";
import "../components/Button.css";
import AddMemoryPopup from "./AddMemoryPopup";
import Header from "../components/Header";
import { Pencil, Trash2, Star, MessageCircle } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import GalleryModal from "../components/GalleryModal";
import CommentsModal from "./CommentsModal";

const normalizeMemory = (m) => ({
	...m,
	photos: m.images,
	rating: m.rating || 0,
	comments: m.comments || [],
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

	// Gallery State
	const [openGallery, setOpenGallery] = useState(false);
	const [galleryPhotos, setGalleryPhotos] = useState([]);
	const [galleryStartIndex, setGalleryStartIndex] = useState(0);

	// Comments State
	const [openComments, setOpenComments] = useState(false);
	const [selectedMemory, setSelectedMemory] = useState(null);

	const { groupId } = useParams();
	const navigate = useNavigate();

	const backendURL = import.meta.env.VITE_BACKEND_ORIGIN || "http://localhost:8000";
	const API_BASE = `${backendURL}/api/groups/${groupId}/memories`;

	useEffect(() => {
		const JWT = localStorage.getItem("JWT");
		if (!JWT) {
			navigate("/login");
			return;
		}

		(async () => {
			try {
				const res = await fetch(API_BASE, {
					headers: { Authorization: `Bearer ${JWT}` },
				});

				if (!res.ok) throw new Error("Failed to fetch memories");

				const data = await res.json();
				setMemories(data.map(normalizeMemory));
			} catch (err) {
				console.error(err);
				setError("Couldn't load memories");
			} finally {
				setLoading(false);
			}
		})();
	}, [API_BASE, groupId, navigate]);

	const handleAddMemory = async (newMemory) => {
		const JWT = localStorage.getItem("JWT");
		if (!JWT) {
			navigate("/login");
			return;
		}

		try {
			const res = await fetch(API_BASE, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${JWT}`,
				},
				body: JSON.stringify(newMemory),
			});

			if (!res.ok) {
				const data = await res.json().catch(() => ({}));
				console.error("Add memory error:", data.error);
				return;
			}

			const createdMemory = await res.json();
			const normalized = normalizeMemory(createdMemory);

			setMemories((prev) => [...prev, normalized]);
		} catch (err) {
			console.error("Add memory request failed:", err);
		}
	};

	const handleDeleteMemory = async (index) => {
		const target = memories[index];
		if (!target || !target._id) {
			console.error("Memory not found or missing ID.");
			return;
		}

		if (!window.confirm("Are you sure you want to delete this memory?")) return;

		const JWT = localStorage.getItem("JWT");
		if (!JWT) return navigate("/login");

		try {
			const res = await fetch(`${API_BASE}/${target._id}`, {
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${JWT}`,
				},
			});

			if (!res.ok) {
				console.error("Delete failed", await res.json().catch(() => ({})));
				return;
			}

			// Remove from React state
			setMemories((prev) => prev.filter((_, i) => i !== index));
		} catch (err) {
			console.error("Delete memory request failed:", err);
		}
	};

	const handleEditMemorySave = async (edited) => {
		const JWT = localStorage.getItem("JWT");
		if (!JWT) {
			navigate("/login");
			return;
		}

		try {
			const res = await fetch(`${API_BASE}/${edited.memoryId}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${JWT}`,
				},
				body: JSON.stringify({
					title: edited.title,
					images: edited.images,
				}),
			});

			if (!res.ok) {
				const errData = await res.json().catch(() => ({}));
				console.error("Edit memory error:", errData.error);
				return;
			}

			const updated = await res.json();
			const normalized = normalizeMemory(updated);

			setMemories((prev) => prev.map((m, i) => (i === editingIndex ? normalized : m)));

			setEditingIndex(null);
		} catch (err) {
			console.error("Edit memory request failed:", err);
		}
	};

	const handleEditMemory = (index) => {
		setEditingIndex(index);
		setShowPopup(true);
	};

	const openGalleryHandler = (photos, index = 0) => {
		setGalleryPhotos(photos);
		setGalleryStartIndex(index);
		setOpenGallery(true);
	};

	const openCommentsHandler = (memory) => {
		setSelectedMemory(memory);
		setOpenComments(true);
	};

	const handleCommentAdded = (memoryId, newComment) => {
		setMemories((prev) =>
			prev.map((m) =>
				m._id === memoryId ? { ...m, comments: [...m.comments, newComment] } : m
			)
		);
	};

	const handleCommentDeleted = (memoryId, commentId) => {
		setMemories((prev) =>
			prev.map((m) =>
				m._id === memoryId ? { ...m, comments: m.comments.filter((c) => c._id !== commentId) } : m
			)
		);
	};

	const filteredMemories = memories.filter((memory) =>
		(memory.title || "").toLowerCase().includes(searchTerm.toLowerCase()),
	);

	const renderStars = (rating) => {
		return (
			<div className="star-rating-display">
				{[1, 2, 3, 4, 5].map((star) => (
					<Star
						key={star}
						size={16}
						className={star <= rating ? "star-filled" : "star-empty"}
						fill={star <= rating ? "currentColor" : "none"}
					/>
				))}
			</div>
		);
	};

	if (loading) return <div className="memory-empty">Loading...</div>;

	return (
		<>
			<div className="memory-container">
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
									<div>
									<h2 className="memory-title">{memory.title}</h2>
									{memory.rating > 0 && renderStars(memory.rating)}
									</div>
									<p className="memory-date">Added on {memory.dateAdded}</p>
								</div>

								<div className="memory-photo-grid">
									{memory.photos.slice(0, 3).map((photo, i) => (
										<div key={i} className="photo-item" onClick={() => openGalleryHandler(memory.photos, i)}>
											<img src={photo} alt={`Memory ${i}`} />
										</div>
									))}

									{memory.photos.length > 3 && (
										<div className="photo-item more-photos-btn" onClick={() => openGalleryHandler(memory.photos, 3)}>
											+{memory.photos.length - 3} more
										</div>
									)}
								</div>

								<div className="memory-footer">
									<button className="comments-btn" onClick={() => openCommentsHandler(memory)}>
										<MessageCircle size={18} />
										<span>{memory.comments.length} {memory.comments.length === 1 ? 'comment' : 'comments'}</span>
									</button>
								</div>

								<div className="memory-actions-icons">
									<Pencil size={18} className="icon edit-icon" onClick={() => handleEditMemory(index)} />
									<Trash2 size={18} className="icon delete-icon" onClick={() => handleDeleteMemory(index)} />
								</div>
							</div>
						))}
					</div>
				)}

				{showPopup && (
					<AddMemoryPopup
						onClose={() => {
							setEditingIndex(null);
							setShowPopup(false);
						}}
						onAdd={handleAddMemory}
						onEdit={handleEditMemorySave}
						memoryToEdit={editingIndex !== null ? memories[editingIndex] : null}
					/>
				)}

				{openGallery && (
					<GalleryModal photos={galleryPhotos} startIndex={galleryStartIndex} onClose={() => setOpenGallery(false)} />
				)}

				{openComments && selectedMemory && (
					<CommentsModal
						memory={selectedMemory}
						groupId={groupId}
						onClose={() => {
							setOpenComments(false);
							setSelectedMemory(null);
						}}
						onCommentAdded={handleCommentAdded}
						onCommentDeleted={handleCommentDeleted}
					/>
				)}
			</div>

			<button className="add-memory-btn" onClick={() => setShowPopup(true)}>
				+
			</button>
		</>
	);
}
