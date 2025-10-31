import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");
const navigate = useNavigate();

const handleLogin = (e) => {
    e.preventDefault();
    if (username !== "testuser" || password !== "password123") {
        setError("Incorrect username or password");
        return;
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
        <button type="submit" className="login-btn">
            Log in
        </button>
    </form>

    <p className="login-bottom-text">
        Don’t have an account? <a href="/register">Sign up</a>
    </p>
    </div>
);
}

export default Login;
