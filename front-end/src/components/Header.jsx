import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import "./Header.css";

export default function Header({ title, backPath }) {
	const navigate = useNavigate();

	const onNavigate = (path) => {
		navigate(path);
	};

	return (
		<div className="header">
			<button className="header-back-button" onClick={() => onNavigate(backPath)}>
				<ChevronLeft size={24} />
			</button>
			<h1 className="header-title">{title}</h1>
		</div>
	);
}
