import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Dashboard from "./pages/dashboard";
import CreateGroup from "./pages/createGroup";
import JoinGroup from "./pages/joinGroup";
import MemoryBookPage from "./pages/MemoryBookPage";
import Register from "./pages/Register";
import EmailVerification from "./pages/EmailVerification";
import Login from "./pages/Login";
import ProfileSettings from "./pages/ProfileSettings";

function App() {
	return (
		<Routes>
			<Route path="/dashboard" element={<Dashboard />} />
			<Route path="/group/create" element={<CreateGroup />} />
			<Route path="/group/join" element={<JoinGroup />} />
			<Route path="/memorybook" element={<MemoryBookPage />} />
			<Route path="/register" element={<Register />} />
			<Route path="/verify-email" element={<EmailVerification />} />
			<Route path="/login" element={<Login />} />
			<Route path="/profile-settings" element={<ProfileSettings />} />
		</Routes>
	);
}

export default App;
