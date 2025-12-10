import { useId, useRef, useState } from "react";
import { Check, LoaderCircle, Pencil, X } from "lucide-react";
import "./EditableTextField.css";

export default function EditableTextField({ value, placeholder, autosuggestList, onEdit }) {
	const [isEditing, setIsEditing] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const inputRef = useRef();
	const autosuggestListId = useId();

	return (
		<div className="editable-text-field" onClick={() => setIsEditing(true)}>
			{!isEditing ? (
				<>
					{value}
					<Pencil className="edit-icon" size="20" color="#666" />
				</>
			) : (
				<>
					<input
						type="text"
						defaultValue={value}
						placeholder={placeholder}
						list={autosuggestListId}
						disabled={isLoading}
						ref={inputRef}
					/>

					{autosuggestList && (
						<datalist id={autosuggestListId}>
							{autosuggestList.map((value) => (
								<option key={value} value={value}></option>
							))}
						</datalist>
					)}

					<button
						className="edit-field-save"
						onClick={async (evt) => {
							evt.stopPropagation();
							if (inputRef.current.value.length === 0) return alert("Please enter something, it cannot be blank");
							setIsLoading(true);
							await onEdit(inputRef.current.value);
							setIsLoading(false);
							setIsEditing(false);
						}}
					>
						{isLoading ? <LoaderCircle className="spin-loader" color="#07a287" /> : <Check color="#07a287" />}
					</button>

					<button
						disabled={isLoading}
						className="edit-field-discard"
						onClick={(evt) => {
							evt.stopPropagation();
							setIsEditing(false);
						}}
					>
						<X color={isLoading ? undefined : "#f12f55"} />
					</button>
				</>
			)}
		</div>
	);
}
