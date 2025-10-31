import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Dashboard from "./pages/dashboard";
import CreateGroup from "./pages/createGroup";
import JoinGroup from "./pages/joinGroup";
import Decide from "./pages/Decide";
import Button from "./components/Button";

function App() {
	return (
		<Routes>
			<Route path="/dashboard" element={<Dashboard />} />
			<Route path="/group/create" element={<CreateGroup />} />
			<Route path="/group/join" element={<JoinGroup />} />
			<Route path="/decide" element={<Decide />} />
			<Route path="/decide2" element={<Button href="/decide" text="Go to decide" />} />
		</Routes>
	);
}

export default App;
