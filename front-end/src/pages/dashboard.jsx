import Button from "../components/Button";
import { MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
    const navigate = useNavigate();

    const onNavigate = (path) => {
        navigate(path);
    }

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
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 32px;
            padding-bottom: 16px;
            border-bottom: 3px solid #000;
          }
  
          .dashboard-title {
            font-size: 24px;
            font-weight: 700;
            margin: 0;
          }
  
          .menu-icon {
            cursor: pointer;
            padding: 8px;
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
            <div className="menu-icon">
              <MoreVertical size={24} />
            </div>
          </div>
  
          <div className="quick-actions">
            <h2 className="section-title">Quick Actions</h2>
            <div className="button-spacing">
              <Button 
                text="Create New Group" 
                buttonType="primary" 
                onClick={() => onNavigate('/group/create')}
              />
                <Button 
                text="Join Existing Group" 
                buttonType="secondary"
                onClick={() => onNavigate('/group/join')}
                />
            </div>
          </div>
  
          <div className="my-groups">
            <h2 className="section-title">My Groups</h2>
            <div className="button-spacing">
                <Button img="https://placehold.co/48" buttonType="secondary" text ="Syndeian" arrowType="forward"/>
                <Button img="https://placehold.co/48" buttonType="secondary" text ="Third North" arrowType="forward"/>
                <Button img="https://placehold.co/48" buttonType="secondary" text ="NYU" arrowType="forward"/>
            </div>
          </div>
		</div>
		</>
	);
}