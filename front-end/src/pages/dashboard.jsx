import Button from "../components/Button";
import { MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
	const navigate = useNavigate();

	const onNavigate = (path) => {
		navigate(path);
	};

	return (
		<>
			<style>{`
          .dashboard-container {
            max-width: 400px;
            margin: 0 auto;
            padding: 24px;
            font-family: system-ui, -apple-system, sans-serif;
          }
  
          .dashboard-header {
            position: relative;
            display: flex;
            align-items: center;
            margin-bottom: 32px;
            padding-bottom: 16px;
            border-bottom: 3px solid #000;
            }

          .dashboard-title {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            font-size: 24px;
            font-weight: 700;
            margin: 0;
            }

  
          .menu-icon {
            position: relative;
            left: 96%;
            transform: translateX(-50%);
            cursor: pointer;
            padding-top: 2px;
            padding-left: 3.5px;
            padding-right: 3.5px;
            border: 2px solid #000;
            border-radius: 4px;
          }
  
          .section-title {
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 16px;
          }
  
          .quick-actions {
            margin-bottom: 40px;
          }
  
          .button-spacing {
            display: flex;
            flex-direction: column;
            gap: 16px;
          }
  
        `}</style>

			<div className="dashboard-container">
				<div className="dashboard-header">
					<h1 className="dashboard-title">Dashboard</h1>
					<div className="menu-icon"
            onClick={() => onNavigate("/profile-settings")} 
            role = "button"
            tabIndex = {0}>
						<MoreVertical size={20} />
					</div>
				</div>

				<div className="quick-actions">
					<h2 className="section-title">Quick Actions</h2>
					<div className="button-spacing">
						<Button text="Create New Group" buttonType="primary" onClick={() => onNavigate("/group/create")} />
						<Button text="Join Existing Group" buttonType="secondary" onClick={() => onNavigate("/group/join")} />
					</div>
				</div>

				<div className="my-groups">
					<h2 className="section-title">My Groups</h2>
					<div className="button-spacing">
						<Button img="https://placehold.co/48" buttonType="secondary" text="Syndeian" arrowType="forward" />
						<Button img="https://placehold.co/48" buttonType="secondary" text="Third North" arrowType="forward" />
						<Button img="https://placehold.co/48" buttonType="secondary" text="NYU" arrowType="forward" />
					</div>
				</div>
			</div>
		</>
	);
}
