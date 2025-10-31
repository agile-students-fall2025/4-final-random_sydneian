import React, { useState } from "react";
import "./ProfileSettings.css";
import Button from "../components/Button";

function ProfileSettings() {
const [notif1, setNotif1] = useState(true);
const [notif2, setNotif2] = useState(true);
const [notif3, setNotif3] = useState(false);

const [theme, setTheme] = useState("light");

return (
    <div className="profile-container">
    <h2 className="profile-header">Profile & Settings</h2>

      {/* Account Info */}
    <div className="account-section">
        <div className="profile-pic">Profile Picture</div>
        <div>
        <p className="profile-name">Lynda</p>
        <p className="profile-email">lynda25@gmail.com</p>
        </div>
    </div>

      {/* Notifications */}
    <div className="section">
        <h3>Notifications</h3>
        <div className="toggle-group">
        <label>
            <input
            type="checkbox"
            checked={notif1}
            onChange={() => setNotif1(!notif1)}
            />{" "}
            When an event is 1 day away
        </label>
        <label>
            <input
            type="checkbox"
            checked={notif2}
            onChange={() => setNotif2(!notif2)}
            />{" "}
            When a new event is added
        </label>
        <label>
            <input
            type="checkbox"
            checked={notif3}
            onChange={() => setNotif3(!notif3)}
            />{" "}
            When an existing event is modified
        </label>
        </div>
    </div>

      {/* Theme */}
    <div className="section">
        <h3>Theme</h3>
        <select
            className="theme-select"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
        >
        <option value="light">Light Mode</option>
        <option value="dark">Dark Mode</option>
        <option value="pastel">Pastel</option>
        <option value="high-contrast">High Contrast</option>
        </select>
    </div>

      {/* Misc */}
    <div className="section">
        <h3>Misc</h3>
        <Button
            text="Rate our app"
            arrowType="forward"
            buttonType="secondary"
            onClick={() => console.log("Rate app clicked")}
            />
        <Button
            text="About"
            arrowType="forward"
            buttonType="secondary"
            onClick={() => console.log("About clicked")}
        />
    </div>
    </div>
);
}

export default ProfileSettings;
