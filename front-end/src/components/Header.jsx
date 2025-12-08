import { useNavigate } from "react-router-dom";
import { ChevronLeft, MoreVertical } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import "./Header.css";

export default function Header({ title, backPath, menuItems = [] }) {
	const navigate = useNavigate();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);
	const menuRef = useRef(null);
	const menuButtonRef = useRef(null);

	const onNavigate = (path) => {
		navigate(path);
	};

	const toggleMenu = () => {
		setIsMenuOpen((prev) => !prev);
	};

	const handleMenuItemClick = (action) => {
		action();
		setIsMenuOpen(false);
	};

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				menuRef.current &&
				!menuRef.current.contains(event.target) &&
				menuButtonRef.current &&
				!menuButtonRef.current.contains(event.target)
			) {
				setIsMenuOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 10);
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	return (
		<>
			<div className={`header ${isScrolled ? "scrolled" : ""}`}>
				<button className="header-back-button" onClick={() => onNavigate(backPath)}>
					<ChevronLeft size={24} />
				</button>
				<h1 className={`header-title ${menuItems.length > 0 ? "has-menu" : ""}`}>{title}</h1>
				{menuItems.length > 0 && (
					<div className="header-menu-container">
						<button ref={menuButtonRef} className="header-menu-button" onClick={toggleMenu}>
							<MoreVertical size={24} />
						</button>
						{isMenuOpen && (
							<div ref={menuRef} className="header-dropdown-menu">
								{menuItems.map((item, index) => (
									<button key={index} className="dropdown-item" onClick={() => handleMenuItemClick(item.action)}>
										{item.text}
									</button>
								))}
							</div>
						)}
					</div>
				)}
			</div>
			<div className="header-spacer" />
		</>
	);
}
