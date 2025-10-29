import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

export default function CreateGroupPage() {
	const navigate = useNavigate();

	const onNavigate = (path) => {
		navigate(path);
	};

	return (
		<>
			<style>{`
          .create-container {
            max-width: 400px;
            margin: 0 auto;
            padding: 24px;
            font-family: system-ui, -apple-system, sans-serif;
          }
  
          .create-header {
            display: flex;
            align-items: center;
            margin-bottom: 32px;
            padding-bottom: 16px;
            border-bottom: 3px solid #000;
          }
  
          .back-button {
            cursor: pointer;
            padding: 0;
            background: none;
            border: none;
            padding-top: 2px;
            padding-left: 2px;
            padding-right: 2px;
            border: 2px solid #000;
            border-radius: 4px;
          }
  
          .create-title {
            position: relative;
            left: 42%;
            transform: translateX(-50%);
            font-size: 24px;
            font-weight: 700;
            margin: 0;
          }
  
          .profile-upload {
            border: 2px dashed #ccc;
            border-radius: 8px;
            padding: 60px 24px;
            text-align: center;
            margin-bottom: 24px;
            cursor: pointer;
            color: #999;
            font-size: 16px;
          }
  
          .form-input {
            width: 100%;
            padding: 16px;
            border: 2px solid #000;
            border-radius: 8px;
            font-size: 16px;
            margin-bottom: 24px;
            font-family: system-ui, -apple-system, sans-serif;
            box-sizing: border-box;
          }
  
          .form-textarea {
            width: 100%;
            padding: 16px;
            border: 2px solid #000;
            border-radius: 8px;
            font-size: 16px;
            margin-bottom: 24px;
            font-family: system-ui, -apple-system, sans-serif;
            min-height: 120px;
            resize: vertical;
            box-sizing: border-box;
          }
  
          .form-input::placeholder,
          .form-textarea::placeholder {
            color: #999;
          }
  
        `}</style>

			<div className="create-container">
				<div className="create-header">
					<button className="back-button" onClick={() => onNavigate("/dashboard")}>
						<ChevronLeft size={24} />
					</button>
					<h1 className="create-title">Create New Group</h1>
				</div>

				<div className="profile-upload">+ Add Profile Picture</div>

				<input type="text" className="form-input" placeholder="Group name" />

				<textarea className="form-textarea" placeholder="Group description" />

				<input type="text" className="form-input" placeholder="Invite friends" />

				<Button text="Create Group" buttonType="primary" onClick={() => onNavigate("/dashboard")} />
			</div>
		</>
	);
}
