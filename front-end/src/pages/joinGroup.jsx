import Button from "../components/Button";
import InviteModal from "../components/inviteModal";
import { useNavigate } from 'react-router-dom';
import { useState } from "react"
import { ChevronLeft } from "lucide-react"

export default function JoinGroupPage () {
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const navigate = useNavigate();

    const onNavigate = (path) => {
        navigate(path);
    }
  
    const invites = [
      { name: 'Syndeian2', by: 'Sarah', description: 'Wanna join our awesome group?' },
      { name: 'The Teapot Society', by: 'Jimmy', description: 'Wanna join our awesome group?' },
      { name: 'Agile Friends', by: 'Mike', description: 'Wanna join our awesome group?' },
    ];

    const publics = [
        { name: 'NYC Pizza', by: 'PizzaTom', description: 'Wanna join our awesome group?' },
      ];

    // Filter function
    const filterGroups = (groups) => {
      if (!searchQuery.trim()) return groups;
      
      const query = searchQuery.toLowerCase();
      return groups.filter(group => 
        group.name.toLowerCase().includes(query) ||
        group.by.toLowerCase().includes(query) ||
        group.description.toLowerCase().includes(query)
      );
    };

    const filteredInvites = filterGroups(invites);
    const filteredPublics = filterGroups(publics);
  
    const handleAccept = () => {
        if (selectedGroup) {
          console.log('Accepted invite to:', selectedGroup.name);
        }
        setSelectedGroup(null);
      };
      
      const handleReject = () => {
        if (selectedGroup) {
          console.log('Rejected invite to:', selectedGroup.name);
        }
        setSelectedGroup(null);
      };
      
  
    return (
      <>
        <style>{`
          .join-container {
            max-width: 400px;
            margin: 0 auto;
            padding: 24px;
            font-family: system-ui, -apple-system, sans-serif;
          }
  
          .join-header {
            display: flex;
            align-items: center;
            margin-bottom: 32px;
            padding-bottom: 16px;
            border-bottom: 3px solid #000;
          }
  
          .join-back-button {
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
  
          .join-title {
            position: relative;
            left: 42%;
            transform: translateX(-50%);
            font-size: 24px;
            font-weight: 700;
            margin: 0;
          }
  
          .search-input {
            width: 100%;
            padding: 16px;
            border: 2px solid #000;
            border-radius: 8px;
            font-size: 16px;
            margin-bottom: 16px;
            font-family: system-ui, -apple-system, sans-serif;
            box-sizing: border-box;
          }
  
          .search-input::placeholder {
            color: #999;
          }
  
          .invites-section {
            display: flex;
            flex-direction: column;
            gap: 16px;
            margin-bottom: 16px;
          }
  
          .invites-title {
            font-size: 18px;
            font-weight: 700;
          }

          .public-title {
            font-size: 18px;
            font-weight: 700;
            margin-top: 18pt;
          }
  
          .invite-item {
            display: flex;
            align-items: center;
            padding: 16px;
            border: 2px solid #000;
            border-radius: 8px;
            margin-bottom: 12px;
            cursor: pointer;
            background: #fff;
          }
  
          .invite-pic {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: #e5e5e5;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 16px;
            font-size: 12px;
            color: #666;
          }
  
          .invite-name {
            flex: 1;
            font-size: 16px;
            font-weight: 600;
          }
  
          .invite-arrow {
            color: #000;
          }
  
          .group-button {
            width: 100%;
            padding: 16px;
            border: 2px solid #000;
            border-radius: 8px;
            background: #fff;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            font-family: system-ui, -apple-system, sans-serif;
          }

          .no-results {
            color: #666;
            font-size: 14px;
            text-align: center;
            padding: 16px;
          }
        `}</style>
  
        <div className="join-container">
          <div className="join-header">
            <button className="join-back-button" onClick={() => onNavigate('/dashboard')}>
              <ChevronLeft size={24} />
            </button>
            <h1 className="join-title">Join Existing Group</h1>
          </div>
  
          <input
            type="text"
            className="search-input"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
  
          <h2 className="invites-title">Invites</h2>
          <div className="invites-section">
            {filteredInvites.length > 0 ? (
              filteredInvites.map((invite, index) => (
                <Button 
                  key={index}
                  img="https://placehold.co/128" 
                  buttonType="secondary" 
                  text={invite.name} 
                  arrowType="forward" 
                  onClick={() => setSelectedGroup(invite)}
                />
              ))
            ) : (
              <div className="no-results">No invites found</div>
            )}
          </div>
  
            
          <h2 className="public-title">Public</h2>
          <div className="invites-section">
            {filteredPublics.length > 0 ? (
              filteredPublics.map((publicEach, index) => (
                <Button 
                  key={index}
                  img="https://placehold.co/128" 
                  buttonType="secondary" 
                  text={publicEach.name} 
                  arrowType="forward" 
                  onClick={() => setSelectedGroup(publicEach)}
                />
              ))
            ) : (
              <div className="no-results">No public groups found</div>
            )}
          </div>
        </div>
  
        {selectedGroup && (
          <InviteModal
            group={selectedGroup}
            onClose={() => setSelectedGroup(null)}
            onAccept={handleAccept}
            onReject={handleReject}
          />
        )}
      </>
    );
  };