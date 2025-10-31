import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import "./Register.css";

function Register() {
const [username, setUsername] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");
const navigate = useNavigate();

const handleSignUp = (e) => {
    e.preventDefault();

    if (password.length < 8) {
    setError("Please enter a stronger password (min 8 chars)");
    return;
    }

    // normally: send data to backend
    navigate("/verify-email");
};

return (
    <div className="register-container">
    <h1 className="register-title">Rendezvous</h1>
    <p className="register-subtitle">Plan together, decide faster</p>

    {error && <p className="error-text">{error}</p>}

    <form className="register-form" onSubmit={handleSignUp}>
        <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        />
        <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        />
        <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        />
        <Button
            text="Sign up"
            buttonType="primary"
            onClick={handleSignUp}
        />
    </form>

    <p className="bottom-text">
        Already have an account? <a href="/login">Log in</a>
    </p>
    </div>
);
}

export default Register;
