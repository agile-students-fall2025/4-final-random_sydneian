import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import "./Login.css";

function Login() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleLogin = async (e) => {
		e.preventDefault();

		try {
			const backendURL = import.meta.env.VITE_BACKEND_ORIGIN || "http://localhost:8000";

			const response = await fetch(`${backendURL}/api/login`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ username, password }),
			});

			const responseData = await response.json();

			if (responseData.redirect) {
				sessionStorage.setItem("username", username);
				navigate(responseData.redirect);
				return;
			}

			if (!response.ok) {
				throw new Error(responseData.error || "Failed to login (network error)");
			}

			localStorage.setItem("JWT", responseData.JWT);

			navigate("/dashboard");
		} catch (err) {
			setError(err.message);
		}
	};

	return (
		<div className="login-container">
			<h1 className="login-title">Rendezvous</h1>
			<p className="login-subtitle">Plan together, decide faster</p>

			{error && <p className="login-error">{error}</p>}

			<form className="login-form" onSubmit={handleLogin}>
				<input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
				<input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
				<Button text="Log in" buttonType="primary" onClick={handleLogin} />
			</form>

			<p className="login-bottom-text">
				Don’t have an account? <a href="/register">Sign up</a>
			</p>
		</div>
	);
}

export default Login;
