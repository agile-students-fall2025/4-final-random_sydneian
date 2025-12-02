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

	const handleVerify = (e) => {
		e.preventDefault();
		const isComplete = otp.every((digit) => digit !== "");
		if (isComplete) {
			navigate("/login");
		} else {
			alert("Please enter all 6 digits.");
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
					Didn’t receive it? Check spam, otherwise <span className="resend-link">click to resend</span>
				</p>
			</div>
		</div>
	);
}

export default EmailVerification;
