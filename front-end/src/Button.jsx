import { Link } from "react-router-dom";
import "./Button.css";

function SharedInternals({ img, text, arrowType }) {
	return (
		<>
			<div className="icon-text">
				{img && <img src={img} width="48" height="48" />}
				{text}
			</div>

			{arrowType === "forward" && (
				<svg height="24px" width="24px" viewBox="0 -960 960 960" fill="#000" className="arrow">
					<path d="M647-440H200q-17 0-28.5-11.5T160-480q0-17 11.5-28.5T200-520h447L451-716q-12-12-11.5-28t12.5-28q12-11 28-11.5t28 11.5l264 264q6 6 8.5 13t2.5 15q0 8-2.5 15t-8.5 13L508-188q-11 11-27.5 11T452-188q-12-12-12-28.5t12-28.5l195-195Z" />
				</svg>
			)}

			{arrowType === "outward" && (
				<svg height="24px" width="24px" viewBox="0 -960 960 960" fill="#000" className="arrow">
					<path d="M640-624 284-268q-11 11-28 11t-28-11q-11-11-11-28t11-28l356-356H280q-17 0-28.5-11.5T240-720q0-17 11.5-28.5T280-760h400q17 0 28.5 11.5T720-720v400q0 17-11.5 28.5T680-280q-17 0-28.5-11.5T640-320v-304Z" />
				</svg>
			)}
		</>
	);
}

/**
 * Customisable button component that supports multiple configurations, and returns a Link or button element where appropriate (if href present).
 *
 * @param {Object} props - The props for this component.
 * @param {string} [props.img] The image to display.
 * @param {string} [props.text] - The text to display.
 * @param {"forward" | "outward"} [props.arrowType] - The type of arrow to display (either "forward" or "outward").
 * @param {"primary" | "secondary"} [props.buttonType] - The type of button style (either "primary" or "secondary").
 * @param {string} [props.href] - The URL to navigate to. This will cause a Link element to be returned.
 * @param {function} [props.onClick] - The click event handler. This will not be used if `href` is defined.
 * @param {...any} [props.rest] - Any additional props will be passed to the button or Link element.
 *
 * @returns {JSX.Element} Link if href is provided, otherwise a button.
 *
 * @example // As a link
 * <Button href="https://example.com" />
 *
 * @example // As a button
 * <Button
 * 	onClick={() => console.log("Clicked")}
 * />
 *
 */
export default function Button({ img, text, arrowType, buttonType, href, onClick, ...rest }) {
	if (href) {
		return (
			<Link to={href ?? "#"} {...rest} className={"Button " + (buttonType ?? "primary")}>
				<SharedInternals {...{ img, text, arrowType }} />
			</Link>
		);
	} else {
		return (
			<button onClick={onClick} {...rest} className={"Button " + (buttonType ?? "primary")}>
				<SharedInternals {...{ img, text, arrowType }} />
			</button>
		);
	}
}
