import React, { useState, useEffect, useRef } from "react";
import { X, Send, Trash2 } from "lucide-react";
import "./CommentsModal.css";

export default function CommentsModal({ memory, groupId, onClose, onCommentAdded, onCommentDeleted }) {
	const [comments, setComments] = useState(memory.comments || []);
	const [newComment, setNewComment] = useState("");
	const [loading, setLoading] = useState(false);
	const [currentUserId, setCurrentUserId] = useState(null);
	const commentInputRef = useRef(null);
	const backendURL = import.meta.env.VITE_DOCKER_PRODUCTION ? "" : (import.meta.env.VITE_BACKEND_ORIGIN || "http://localhost:8000");

	useEffect(() => {
		// Get current user ID from JWT
		const JWT = localStorage.getItem("JWT");
		if (JWT) {
			try {
				const payload = JSON.parse(atob(JWT.split(".")[1]));
				setCurrentUserId(payload.id);
			} catch (err) {
				console.error("Failed to decode JWT:", err);
			}
		}

		// Focus input on mount
		commentInputRef.current?.focus();
	}, []);

	const handleAddComment = async () => {
		if (!newComment.trim()) return;

		const JWT = localStorage.getItem("JWT");
		if (!JWT) return;

		setLoading(true);
		try {
			const res = await fetch(
				`${backendURL}/api/groups/${groupId}/memories/${memory._id}/comments`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${JWT}`,
					},
					body: JSON.stringify({ text: newComment.trim() }),
				}
			);

			if (!res.ok) {
				const data = await res.json().catch(() => ({}));
				console.error("Add comment error:", data.error);
				return;
			}

			const createdComment = await res.json();
			setComments((prev) => [...prev, createdComment]);
			onCommentAdded(memory._id, createdComment);
			setNewComment("");
		} catch (err) {
			console.error("Add comment request failed:", err);
		} finally {
			setLoading(false);
		}
	};

	const handleDeleteComment = async (commentId) => {
		if (!window.confirm("Delete this comment?")) return;

		const JWT = localStorage.getItem("JWT");
		if (!JWT) return;

		try {
			const res = await fetch(
				`${backendURL}/api/groups/${groupId}/memories/${memory._id}/comments/${commentId}`,
				{
					method: "DELETE",
					headers: {
						Authorization: `Bearer ${JWT}`,
					},
				}
			);

			if (!res.ok) {
				console.error("Delete comment failed");
				return;
			}

			setComments((prev) => prev.filter((c) => c._id !== commentId));
			onCommentDeleted(memory._id, commentId);
		} catch (err) {
			console.error("Delete comment request failed:", err);
		}
	};

	const handleKeyPress = (e) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleAddComment();
		}
	};

	return (
		<div className="comments-modal-overlay" onClick={onClose}>
			<div className="comments-modal-content" onClick={(e) => e.stopPropagation()}>
				<div className="comments-modal-header">
					<h2>Comments</h2>
					<button className="close-btn" onClick={onClose}>
						<X size={24} />
					</button>
				</div>

				<div className="comments-list">
					{comments.length === 0 ? (
						<div className="no-comments">
							<p>No comments yet. Be the first to comment!</p>
						</div>
					) : (
						comments.map((comment) => (
							<div key={comment._id} className="comment-item">
								<div className="comment-avatar">
									{comment.user?.profilePicture ? (
										<img src={comment.user.profilePicture} alt={comment.user.username} />
									) : (
										<div className="avatar-placeholder">
											{comment.user?.username?.charAt(0).toUpperCase() || "?"}
										</div>
									)}
								</div>
								<div className="comment-content">
									<div className="comment-header">
										<span className="comment-username">{comment.user?.username || "Unknown"}</span>
										<span className="comment-time">
											{new Date(comment.createdAt).toLocaleDateString("en-US", {
												month: "short",
												day: "numeric",
												hour: "numeric",
												minute: "2-digit",
											})}
										</span>
									</div>
									<p className="comment-text">{comment.text}</p>
								</div>
								{currentUserId === comment.user?._id && (
									<button
										className="delete-comment-btn"
										onClick={() => handleDeleteComment(comment._id)}
									>
										<Trash2 size={16} />
									</button>
								)}
							</div>
						))
					)}
				</div>

				<div className="add-comment-section">
					<input
						ref={commentInputRef}
						type="text"
						className="comment-input"
						placeholder="Add a comment..."
						value={newComment}
						onChange={(e) => setNewComment(e.target.value)}
						onKeyPress={handleKeyPress}
						maxLength={500}
						disabled={loading}
					/>
					<button
						className="send-comment-btn"
						onClick={handleAddComment}
						disabled={!newComment.trim() || loading}
					>
						<Send size={20} />
					</button>
				</div>
			</div>
		</div>
	);
}