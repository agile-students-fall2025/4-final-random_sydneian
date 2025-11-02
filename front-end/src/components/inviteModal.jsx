import Button from "./Button";
import "./InviteModal.css";

export default function InviteModal({ group, onClose, onAccept, onReject }) {
	return (
		<div className="modal-overlay" onClick={onClose}>
				<div className="modal-content" onClick={(e) => e.stopPropagation()}>
					<div className="modal-layout">
						<div className="modal-photo">
							<img src="https://placehold.co/128" />
						</div>
						<div>
							<div className="modal-group-name">{group.name}</div>
							<div className="modal-by">By {group.by}</div>
							<div className="modal-description">{group.description}</div>
						</div>
					</div>
					<div className="modal-buttons">
						<div className="modal-button-half">
							<Button text="Reject" buttonType="secondary" onClick={onReject} />
						</div>
						<div className="modal-button-half">
							<Button text="Accept" buttonType="primary" onClick={onAccept} />
						</div>
					</div>
				</div>
			</div>
	);
}
