import { NavLink, Outlet } from "react-router-dom";
import { BookOpen, Home, List, LoaderPinwheel } from "lucide-react";
import "./NavBar.css";

export default function NavBar() {
	return (
		<>
			<nav className="navbar">
				{/* <NavLink to="/">
					<Home />
					Dashboard
				</NavLink> */}
				<NavLink to="activities">
					<List />
					List
				</NavLink>
				<NavLink to="decide">
					<LoaderPinwheel />
					Decide
				</NavLink>
				<NavLink to="memories">
					<BookOpen />
					Memories
				</NavLink>
			</nav>
			<Outlet />
		</>
	);
}
