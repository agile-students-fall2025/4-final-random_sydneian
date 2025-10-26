import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Button from "./Button.jsx";
import img from "./assets/img.png";

function App() {
	return (
		<>
			{/* TEMP: For testing */}
			<div>APP</div>

			<Router>
				<Routes>
					<Route
						path="/"
						element={
							<>
								{/* Testing all variations of Button */}
								{/* <div style={{ display: "flex", width: "300px" }}> */}
								<div style={{ padding: "16px" }}>
									{/* Links: Primary */}
									<Button img={img} text="Text" arrowType="forward" buttonType="primary" href="/test" />
									<Button text="Text" arrowType="forward" buttonType="primary" href="/test" />
									<Button img={img} arrowType="forward" buttonType="primary" href="/test" />
									<Button img={img} text="Text" buttonType="primary" href="/test" />
									<Button arrowType="forward" href="/test" />
									<Button img={img} href="/test" />
									<Button text="Text" href="/test" />
									<br />
									{/* Links: Secondary */}
									<Button img={img} text="Text" arrowType="forward" buttonType="secondary" href="/test" />
									<Button text="Text" arrowType="forward" buttonType="secondary" href="/test" />
									<Button img={img} arrowType="forward" buttonType="secondary" href="/test" />
									<Button img={img} text="Text" buttonType="secondary" href="/test" />
									<Button arrowType="forward" buttonType="secondary" href="/test" />
									<Button img={img} buttonType="secondary" href="/test" />
									<Button text="Text" buttonType="secondary" href="/test" />
									<br />
									{/* Buttons: Primary */}
									<Button img={img} text="Text" arrowType="forward" buttonType="primary" />
									<Button text="Text" arrowType="forward" buttonType="primary" />
									<Button img={img} arrowType="forward" buttonType="primary" />
									<Button img={img} text="Text" buttonType="primary" />
									<Button arrowType="forward" />
									<Button img={img} />
									<Button text="Text" />
									<br />
									{/* Buttons: Secondary */}
									<Button img={img} text="Text" arrowType="forward" buttonType="secondary" />
									<Button text="Text" arrowType="forward" buttonType="secondary" />
									<Button img={img} arrowType="forward" buttonType="secondary" />
									<Button img={img} text="Text" buttonType="secondary" />
									<Button arrowType="forward" buttonType="secondary" />
									<Button img={img} buttonType="secondary" />
									<Button text="Text" buttonType="secondary" />
								</div>
							</>
						}
					/>
					<Route path="/test" element={<Button href="/" text="Home" />} />
				</Routes>
			</Router>
		</>
	);
}

export default App;
