import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Dashboard from "./pages/dashboard";
import CreateGroup from "./pages/createGroup";
import JoinGroup from "./pages/joinGroup";
import BucketList from "./pages/bucketList";
import AddPlace from "./pages/addPlace";
import AddPlaceManually from "./pages/addPlaceManually";
import AddPlaceThroughLink from "./pages/addPlaceThroughLink";

function App() {
	return (
		<Routes>
			<Route path="/" element={<Dashboard />} />
			<Route path="/dashboard" element={<Dashboard />} />
			<Route path="/bucket-list" element={<BucketList />} />
			<Route path="/add-place" element={<AddPlace />} />
			<Route path="/add-place/manual" element={<AddPlaceManually />} />
			<Route path="/add-place/link" element={<AddPlaceThroughLink />} />
			<Route path="/group/create" element={<CreateGroup />} />
			<Route path="/group/join" element={<JoinGroup />} />
		</Routes>
	);
}

export default App;
