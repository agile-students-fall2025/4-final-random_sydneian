import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Dashboard from "./pages/dashboard";
import CreateGroup from "./pages/createGroup";
import JoinGroup from "./pages/joinGroup";

function App() {
	return (
		<Routes>
			<Route path="/dashboard" element={<Dashboard />} />
			<Route path="/group/create" element={<CreateGroup />} />
			<Route path="/group/join" element={<JoinGroup />} />
		</Routes>
	);
}

export default App;
