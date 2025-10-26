import "./App.css";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/dashboard";


function App() {
	return (
		<Routes>
			<Route path="/dashboard" element={<Dashboard />} />
		</Routes>
	);
}

export default App;
