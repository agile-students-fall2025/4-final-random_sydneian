import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Dashboard from "./pages/dashboard";
import CreateGroup from "./pages/createGroup";
import JoinGroup from "./pages/joinGroup";
import Register from "./pages/Register";
import EmailVerification from "./pages/EmailVerification";
import Login from "./pages/Login";
import ProfileSettings from "./pages/ProfileSettings";
import Decide from "./pages/Decide";
import Button from "./components/Button";

function App() {
	return (
		<Routes>
			<Route path="/dashboard" element={<Dashboard />} />
			<Route path="/group/create" element={<CreateGroup />} />
			<Route path="/group/join" element={<JoinGroup />} />
			<Route path="/register" element={<Register />} />
			<Route path="/verify-email" element={<EmailVerification />} />
			<Route path="/login" element={<Login />} />
			<Route path="/profile-settings" element={<ProfileSettings />} />
			<Route path="/decide" element={<Decide />} />
			<Route path="/decide2" element={<Button href="/decide" text="Go to decide" />} />
		</Routes>
	);
}

export default App;
