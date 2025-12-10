import { useState, useEffect } from "react";
import { Heart, LoaderCircle, Trash2 } from "lucide-react";
import EditableTextField from "./EditableTextField";
import EditableTagsField from "./EditableTagsField";
import "./ActivityDetailsModal.css";

export default function ActivityDetailsModal({ groupId, activities, selectedActivity, onUpdate, onDelete, ref }) {
	const [isLoading, setIsLoading] = useState([]);
	const backendURL = import.meta.env.VITE_DOCKER_PRODUCTION
		? ""
		: import.meta.env.VITE_BACKEND_ORIGIN || "http://localhost:8000";

	// Reset loading state when activity changes
	useEffect(() => {
		setIsLoading([]);
	}, [selectedActivity._id]);

	const userId = JSON.parse(atob(localStorage.getItem("JWT").split(".")[1])).id;
	let categories = activities.map((activity) => activity.category);
	categories = categories.filter(
		(category, index) => categories.map((c) => c.toLowerCase()).indexOf(category.toLowerCase()) === index,
	);

	return (
		<dialog className="activity-details-popup" ref={ref} closedby="any">
			<section>
				<h3>Name</h3>
				<EditableTextField
					value={selectedActivity.name}
					placeholder="Activity name"
					onEdit={async (newVal) => {
						const res = await fetch(`${backendURL}/api/groups/${groupId}/activities/${selectedActivity._id}`, {
							headers: {
								Authorization: `Bearer ${localStorage.getItem("JWT")}`,
								"Content-Type": "application/json",
							},
							method: "PATCH",
							body: JSON.stringify({ name: newVal }),
						});

						if (!res.ok) return alert("Failed to change name");
						else onUpdate(await res.json());
					}}
				/>
			</section>

			{/* Images */}
			{/* TODO: Use Deema's gallery, and add ability to add & remove pictures */}
			{/* I give up, for now. I'll just show a single image, and deal with multiple images, editing, etc, later */}
			<section>
				<h3>Image</h3>

				<img
					width="300"
					height="150"
					src={selectedActivity.images?.at(0) ? selectedActivity.images[0] : "https://placehold.co/300x150"}
				/>

				{/* <GalleryModal photos={galleryPhotos} startIndex={galleryStartIndex} onClose={() => setOpenGallery(false)} /> */}
			</section>

			{/* Category */}
			<section>
				<h3>Category</h3>

				<EditableTextField
					value={selectedActivity.category}
					placeholder="Category"
					autosuggestList={categories}
					onEdit={async (newVal) => {
						const res = await fetch(`${backendURL}/api/groups/${groupId}/activities/${selectedActivity._id}`, {
							headers: {
								Authorization: `Bearer ${localStorage.getItem("JWT")}`,
								"Content-Type": "application/json",
							},
							method: "PATCH",
							body: JSON.stringify({ category: newVal }),
						});

						if (!res.ok) return alert("Failed to change category");
						else onUpdate(await res.json());
					}}
				/>
			</section>

			{/* Tags */}
			<section>
				<h3>Tags</h3>

				<EditableTagsField {...{ groupId, activities, selectedActivity, onUpdate }} />
			</section>

			{/* Likes */}
			<section className="members-section">
				<h3>Likes ({selectedActivity.likes?.length})</h3>

				<ul className="members-list">
					{selectedActivity.likes
						?.toSorted((user1, user2) => (user1._id === userId ? -1 : user2._id === userId ? 1 : 0))
						.map((user) => (
							<li key={user._id}>
								<img src={user.profilePicture || "https://placehold.co/48"} />
								<span>{user._id === userId ? "You" : user.username}</span>
								<Heart color="red" fill="red" />
							</li>
						))}
				</ul>
			</section>

			{/* Location. Unsure about implementing rn, as we should probably switch to a string instead of coordinates to avoid having to deal with maps, etc */}
			{/* <section>
					<h3>Location</h3>

					{selectedActivity.location?.coordinates.map((coor) => coor.toFixed(2)).join(", ")}
				</section> */}

			{/* Done */}
			<section>
				{/* <h3>Completed</h3> */}

				<label className="activity-completed">
					{isLoading.includes("done") ? (
						<LoaderCircle size="32px" color="#666" className="spin-loader" />
					) : (
						<input
							type="checkbox"
							checked={selectedActivity.done}
							onChange={async (evt) => {
								setIsLoading([...isLoading, "done"]);

								// await new Promise((r) => setTimeout(r, 2000));
								const res = await fetch(`${backendURL}/api/groups/${groupId}/activities/${selectedActivity._id}`, {
									headers: {
										Authorization: `Bearer ${localStorage.getItem("JWT")}`,
										"Content-Type": "application/json",
									},
									method: "PATCH",
									body: JSON.stringify({ done: evt.target.checked }),
								});

								if (!res.ok) return alert("Failed to mark activity as done");
								else onUpdate(await res.json());

								setIsLoading(isLoading.filter((x) => x !== "done"));
							}}
						/>
					)}
					<div>
						<p>Completed?</p>
						<p>Save it in your memory book!</p>
					</div>
				</label>
			</section>

			{/* Delete Activity */}
			<section>
				<button
					className="delete-activity-btn"
					onClick={async () => {
						if (!window.confirm("Are you sure you want to delete this activity?")) return;

						setIsLoading([...isLoading, "delete"]);

						const res = await fetch(`${backendURL}/api/groups/${groupId}/activities/${selectedActivity._id}`, {
							headers: {
								Authorization: `Bearer ${localStorage.getItem("JWT")}`,
							},
							method: "DELETE",
						});

						if (!res.ok) {
							alert("Failed to delete activity");
							setIsLoading(isLoading.filter((x) => x !== "delete"));
							return;
						}

						// Clear loading state
						setIsLoading(isLoading.filter((x) => x !== "delete"));

						// Close modal and notify parent
						if (ref.current) ref.current.close();
						if (onDelete) onDelete(selectedActivity._id);
					}}
					disabled={isLoading.includes("delete")}
				>
					{isLoading.includes("delete") ? (
						<LoaderCircle className="spin-loader" size={20} />
					) : (
						<>
							<Trash2 size={20} />
							Delete Activity
						</>
					)}
				</button>
			</section>
		</dialog>
	);
}
