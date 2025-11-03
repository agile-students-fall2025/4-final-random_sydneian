import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import "./Login.css";

function Login() {
const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");
const navigate = useNavigate();

const handleLogin = (e) => {
    e.preventDefault();
    
    // Check against registered users in localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.username === username && u.password === password);

    // Fallback to hardcoded test user for demo purposes
    if (!user && (username !== "testuser" || password !== "password123")) {
        setError("Incorrect username or password");
        return;
    }

    // Set current user
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
    } else if (username === "testuser" && password === "password123") {
        localStorage.setItem('currentUser', JSON.stringify({ 
            id: 'testuser-id', 
            username: 'testuser',
            email: 'test@example.com'
        }));
    }
    
    navigate("/dashboard");
};

return (
    <div className="login-container">
    <h1 className="login-title">Rendezvous</h1>
    <p className="login-subtitle">Plan together, decide faster</p>

    {error && <p className="login-error">{error}</p>}

    <form className="login-form" onSubmit={handleLogin}>
        <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
        />
        <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
        />
        <Button
            text="Log in"
            buttonType="primary"
            onClick={handleLogin}
        />
    </form>

    <p className="login-bottom-text">
        Don’t have an account? <a href="/register">Sign up</a>
    </p>
    </div>
);
}

export default Login;
