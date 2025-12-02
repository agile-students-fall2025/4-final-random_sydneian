import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import EmailVerification from "./pages/EmailVerification";
import Dashboard from "./pages/dashboard";
import ProfileSettings from "./pages/ProfileSettings";
import JoinGroup from "./pages/joinGroup";
import CreateGroup from "./pages/createGroup";
import BucketList from "./pages/bucketList";
import AddPlace from "./pages/addPlace";
import AddPlaceManually from "./pages/addPlaceManually";
import AddPlaceThroughLink from "./pages/addPlaceThroughLink";
import DecideActivity from "./pages/DecideActivity";
import MemoryBookPage from "./pages/MemoryBookPage";
import GroupSettings from "./pages/GroupSettings";

import NavBar from "./components/NavBar";
import ProtectedRoute from "./components/ProtectedRoute";

import "./App.css";

function App() {
	return (
		<Routes>
			<Route path="login" element={<Login />} />
			<Route path="register" element={<Register />} />
			<Route path="/verify-email" element={<EmailVerification />} />
			<Route
				path="/"
				element={
					<ProtectedRoute requireEmailVerification={true}>
						<Dashboard />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/profile-settings"
				element={
					<ProtectedRoute>
						<ProfileSettings />
					</ProtectedRoute>
				}
			/>
			<Route path="groups">
				<Route index element={<Navigate to="/" />} />
				<Route
					path="join"
					element={
						<ProtectedRoute>
							<JoinGroup />
						</ProtectedRoute>
					}
				/>
				<Route
					path="create"
					element={
						<ProtectedRoute>
							<CreateGroup />
						</ProtectedRoute>
					}
				/>
				<Route
					path=":groupId"
					element={
						<ProtectedRoute>
							<NavBar />
						</ProtectedRoute>
					}
				>
					<Route index element={<Navigate to="activities" />} />
					<Route path="activities">
						<Route index element={<BucketList />} />
						<Route path="add">
							<Route index element={<AddPlace />} />
							<Route path="manual" element={<AddPlaceManually />} />
							<Route path="link" element={<AddPlaceThroughLink />} />
						</Route>
					</Route>
					<Route path="decide" element={<DecideActivity />} />
					<Route path="memories" element={<MemoryBookPage />} />
					<Route path="settings" element={<GroupSettings />} />
				</Route>
			</Route>
		</Routes>
	);
}

export default App;
