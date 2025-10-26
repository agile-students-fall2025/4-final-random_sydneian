import Button from "./Button";

export default function InviteModal ({ group, onClose, onAccept, onReject }) {
    return (
      <>
        <style>{`
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
          }
  
          .modal-content {
            background: #fff;
            border: 2px solid #000;
            border-radius: 12px;
            padding: 32px;
            max-width: 400px;
            width: 90%;
            position: relative;
          }
  
          .modal-photo img {
            border-radius: 128px;
            margin-right: 24pt;
          }
  
          .modal-group-name {
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 8px;
          }
  
          .modal-by {
            font-size: 16px;
            color: #666;
            margin-bottom: 24px;
          }
  
          .modal-description {
            font-size: 16px;
            color: #333;
            margin-bottom: 32px;
          }
  
          .modal-buttons {
            display: flex;
            gap: 16px;
          }
  
          .modal-button-half {
            flex: 1;
          }

          .modal-layout {
            display: flex;
            flex-direction: row;
          }
        `}</style>
  
        <div className="modal-overlay" onClick={onClose}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-layout">
              <div className="modal-photo">
                <img src="https://placehold.co/128"/>
              </div>
              <div>
                <div className="modal-group-name">{group.name}</div>
                <div className="modal-by">By {group.by}</div>
                <div className="modal-description">{group.description}</div>
              </div>
            </div>
            <div className="modal-buttons">
              <div className="modal-button-half">
                <Button 
                  text="Reject" 
                  buttonType="secondary"
                  onClick={onReject}
                />
              </div>
              <div className="modal-button-half">
                <Button 
                  text="Accept" 
                  buttonType="primary"
                  onClick={onAccept}
                />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };