import { useId, useRef, useState } from "react";
import { LoaderCircle, Pencil, Plus, X } from "lucide-react";
import "./EditableTagsField.css";

export default function EditableTagsField({ groupId, activities, selectedActivity, onUpdate }) {
	const [isEditing, setIsEditing] = useState(false);
	const [isLoading, setIsLoading] = useState([]);
	const inputRef = useRef();
	const autosuggestListId = useId();

	let tagAutosuggestions = activities.flatMap((activity) => activity.tags);
	tagAutosuggestions = tagAutosuggestions
		.filter((tag, index) => tagAutosuggestions.map((c) => c.toLowerCase()).indexOf(tag.toLowerCase()) === index)
		.filter((tag) => !selectedActivity?.tags?.includes(tag));

	return (
		<>
			<div className="editable-tags-field" onClick={() => setIsEditing(true)}>
				{!isEditing ? (
					<Pencil className="edit-icon" size="20" color="#666" />
				) : (
					<>
						<input
							type="text"
							placeholder="Add tags..."
							list={autosuggestListId}
							disabled={isLoading.includes("adding tag")}
							ref={inputRef}
						/>
						<datalist id={autosuggestListId}>
							{tagAutosuggestions.map((value) => (
								<option key={value} value={value}></option>
							))}
						</datalist>
						<button
							className="edit-field-save"
							onClick={async (evt) => {
								evt.stopPropagation();
								if (inputRef.current.value.length === 0) return alert("Please enter something, it cannot be blank");
								if (selectedActivity.tags.includes(inputRef.current.value)) return alert("That tag is already added");

								setIsLoading([...isLoading, "adding tag"]);

								const res = await fetch(
									`${import.meta.env.VITE_BACKEND_ORIGIN}/api/groups/${groupId}/activities/${selectedActivity._id}`,
									{
										headers: {
											Authorization: `Bearer ${localStorage.getItem("JWT")}`,
											"Content-Type": "application/json",
										},
										method: "PATCH",
										body: JSON.stringify({ tags: [...selectedActivity.tags, inputRef.current.value] }),
									},
								);

								if (!res.ok) return alert("Failed to add tag");
								else onUpdate(await res.json());
								inputRef.current.value = "";

								setIsLoading(isLoading.filter((x) => x !== "adding tag"));
							}}
						>
							{isLoading.includes("adding tag") ? (
								<LoaderCircle className="spin-loader" color="#07a287" />
							) : (
								<Plus color="#07a287" />
							)}
						</button>
						<button
							disabled={isLoading.includes("adding tag")}
							className="edit-field-discard"
							onClick={(evt) => {
								evt.stopPropagation();
								setIsEditing(false);
							}}
						>
							<X color={isLoading.includes("adding tag") ? undefined : "#f12f55"} />
						</button>
					</>
				)}
			</div>

			<div className="card-tags">
				{selectedActivity?.tags?.map((tag) => (
					<span
						key={tag}
						className="tag"
						onClick={async (evt) => {
							if (!isEditing) return;

							setIsLoading([...isLoading, `removing tag: ${tag}`]);

							const res = await fetch(
								`${import.meta.env.VITE_BACKEND_ORIGIN}/api/groups/${groupId}/activities/${selectedActivity._id}`,
								{
									headers: {
										Authorization: `Bearer ${localStorage.getItem("JWT")}`,
										"Content-Type": "application/json",
									},
									method: "PATCH",
									body: JSON.stringify({ tags: selectedActivity.tags.filter((actTag) => actTag !== tag) }),
								},
							);

							if (!res.ok) return alert("Failed to remove tag");
							else onUpdate(await res.json());

							setIsLoading(isLoading.filter((x) => x !== `removing tag: ${tag}`));
						}}
					>
						#{tag}{" "}
						{isEditing &&
							(isLoading.includes(`removing tag: ${tag}`) ? (
								<LoaderCircle className="spin-loader" size="16" />
							) : (
								<X size="16" />
							))}
					</span>
				))}
			</div>
		</>
	);
}
