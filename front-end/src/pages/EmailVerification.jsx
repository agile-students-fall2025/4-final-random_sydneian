import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./EmailVerification.css";
import Button from "../components/Button";

function EmailVerification() {
	const [otp, setOtp] = useState(["", "", "", "", "", ""]);
	const navigate = useNavigate();

	const handleChange = (value, index) => {
		const newOtp = [...otp];
		newOtp[index] = value.slice(-1);
		setOtp(newOtp);

		// automatically focus next input
		if (value && index < otp.length - 1) {
			const nextInput = document.getElementById(`otp-${index + 1}`);
			nextInput?.focus();
		}
	};

	const handleVerify = async (e) => {
		e.preventDefault();
		const isComplete = otp.every((digit) => digit !== "");
		if (!isComplete) {
			alert("Please enter all 6 digits.");
			return;
		}

		const otpCode = otp.join("");
		const username = sessionStorage.getItem("username");

		if (!username) {
			alert("Session expired. Please register again.");
			navigate("/register");
			return;
		}

		try {
			const backendURL = import.meta.env.VITE_BACKEND_ORIGIN || "http://localhost:8000";
			const response = await fetch(`${backendURL}/api/register/verify-email`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ username, otp: otpCode }),
			});

			const responseData = await response.json();

			if (!response.ok) {
				throw new Error(responseData.error || "Verification failed");
			}

			localStorage.setItem("JWT", responseData.JWT);
			localStorage.setItem("emailVerified", "true");
			sessionStorage.removeItem("username");
			navigate("/");
		} catch (error) {
			alert(error.message || "Verification failed. Please try again.");
		}
	};

	const handleResend = async () => {
		const username = sessionStorage.getItem("username");
		if (!username) {
			alert("Session expired. Please register again.");
			navigate("/register");
			return;
		}

		try {
			const backendURL = import.meta.env.VITE_BACKEND_ORIGIN || "http://localhost:8000";

			const response = await fetch(`${backendURL}/api/register/renew-otp`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ username }),
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || "Failed to resend OTP");
			}

			alert("A new OTP has been sent to your email.");
		} catch (err) {
			alert(err.message);
		}
	};

	return (
		<div className="verify-container">
			<div className="verify-box">
				<h2>Email Verification</h2>
				<p>Please enter the OTP code sent to your email</p>

				<div className="otp-inputs">
					{otp.map((digit, index) => (
						<input
							key={index}
							id={`otp-${index}`}
							type="text"
							maxLength="1"
							value={digit}
							onChange={(e) => handleChange(e.target.value, index)}
						/>
					))}
				</div>

				<Button text="Verify" buttonType="primary" onClick={handleVerify} />

				<p className="resend-text">
					Didn’t receive it? Check spam, otherwise{" "}
					<span className="resend-link" onClick={handleResend}>
						click to resend
					</span>
				</p>
			</div>
		</div>
	);
}

export default EmailVerification;
