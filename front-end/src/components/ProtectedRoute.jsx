import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, requireEmailVerification = false }) {
	const JWT = localStorage.getItem("JWT");

	if (!JWT) {
		return <Navigate to="/login" replace />;
	}

	if (requireEmailVerification) {
		const emailVerified = localStorage.getItem("emailVerified");
		if (emailVerified !== "true") {
			return <Navigate to="/verify-email" replace />;
		}
	}

	return children;
}
