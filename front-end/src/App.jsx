import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Dashboard from "./pages/dashboard";
import CreateGroup from "./pages/createGroup";
import JoinGroup from "./pages/joinGroup";
import MemoryBookPage from "./pages/MemoryBookPage";
import Register from "./pages/Register";
import EmailVerification from "./pages/EmailVerification";
import Login from "./pages/Login";
import ProfileSettings from "./pages/ProfileSettings";
import DecideActivity from "./pages/DecideActivity";
import Button from "./components/Button";
import BucketList from "./pages/bucketList";
import AddPlace from "./pages/addPlace";
import AddPlaceManually from "./pages/addPlaceManually";
import AddPlaceThroughLink from "./pages/addPlaceThroughLink";

function App() {
	return (
		<Routes>
			<Route path="/" element={<Navigate to="/login" replace />} />
			<Route path="/dashboard" element={<Dashboard />} />
			<Route path="/group/create" element={<CreateGroup />} />
			<Route path="/group/join" element={<JoinGroup />} />
			<Route path="/memorybook" element={<MemoryBookPage />} />
			<Route path="/bucket-list" element={<BucketList />} />
			<Route path="/add-place" element={<AddPlace />} />
			<Route path="/add-place/manually" element={<AddPlaceManually />} />
			<Route path="/add-place/link" element={<AddPlaceThroughLink />} />
			<Route path="/register" element={<Register />} />
			<Route path="/verify-email" element={<EmailVerification />} />
			<Route path="/login" element={<Login />} />
			<Route path="/profile-settings" element={<ProfileSettings />} />
			<Route path="/decide" element={<DecideActivity />} />
		</Routes>
	);
}

export default App;
