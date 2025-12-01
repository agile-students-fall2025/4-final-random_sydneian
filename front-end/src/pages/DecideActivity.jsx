import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Button from "../components/Button";
import "./DecideActivity.css";
import { ImageIcon } from "lucide-react";

const activityChosenPhrases = ["The wheel has spoken, the universe has chosen..."]; // I might need a better name for this. It's the message that displays in the pop up after you spin the wheel

// From p5js
function mapRange(n, start1, stop1, start2, stop2, withinBounds) {
	const newval = ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
	if (!withinBounds) {
		return newval;
	}
	if (start2 < stop2) {
		return Math.max(Math.min(newval, stop2), start2);
	} else {
		return Math.max(Math.min(newval, start2), stop2);
	}
}

class Wheel {
	constructor(
		/** @type CanvasRenderingContext2D */
		ctx,
		center = { x: 0, y: 0 },
		radius = 100,
		activities = [{}],
		colors = ["lightgray", "gray"],
		activitySelectedCb,
	) {
		this.ctx = ctx;
		this.center = center;
		this.radius = radius;
		this.activities = activities;
		this.colors = colors;
		this.angle = 0;
		this.speed = 0;
		this.activitySelectedCb = activitySelectedCb;
	}

	update() {
		// If wheel has spun and (nearly) stopped
		if (0 < this.speed && this.speed < 0.00025) {
			this.speed = 0;

			// Normalize angle to be within 0 - 2 PI, adjusting for clockwise rotation. Also, offset by -90 deg, as 0 deg is horizontal instead of vertical (E vs N)
			const normalizedAngle = (3.5 * Math.PI - (this.angle % (2 * Math.PI))) % (2 * Math.PI);
			this.activitySelectedCb(this.activities[Math.floor(normalizedAngle / ((2 * Math.PI) / this.activities.length))]);
		} else this.speed *= 0.995;

		this.angle += this.speed;
	}

	draw() {
		this.ctx.globalAlpha = mapRange(this.speed, 0.05, 0, 0.1, 0.5, true);
		this.ctx.translate(this.center.x, this.center.y);

		// Background circle
		this.ctx.beginPath();
		this.ctx.arc(0, 0, this.radius + 8, 0, 2 * Math.PI);
		this.ctx.strokeStyle = "#0072B2"; // --color-primary
		this.ctx.lineWidth = 4;
		this.ctx.stroke();
		this.ctx.lineWidth = 1;

		this.ctx.save();
		this.ctx.rotate(this.angle);
		// Draw each segment
		for (let i = 0; i < this.activities.length; i++) {
			// Background
			this.ctx.beginPath();
			this.ctx.moveTo(0, 0);
			this.ctx.arc(0, 0, this.radius, 0, 2 * Math.PI * (1 / this.activities.length));
			this.ctx.fillStyle =
				this.colors[
					this.activities.length % this.colors.length === 1 && i === this.activities.length - 1
						? 1
						: i % this.colors.length // Avoid 2 adjacent slices having the same colours
				];
			this.ctx.fill();

			// Text
			this.ctx.save();
			this.ctx.rotate(Math.PI / this.activities.length);
			this.ctx.fillStyle = "black";
			this.ctx.globalAlpha = 1;
			this.ctx.font = "32px Inter";
			this.ctx.fillText(this.activities[i].name, 64, 8, this.radius * 0.75);
			this.ctx.restore();

			this.ctx.rotate((2 * Math.PI) / this.activities.length);
		}
		this.ctx.restore();

		// Center parts
		this.ctx.globalAlpha = 1;

		this.ctx.beginPath();
		this.ctx.arc(0, 0, 40, 0, 2 * Math.PI);
		this.ctx.fillStyle = "white";
		this.ctx.fill();

		this.ctx.beginPath();
		this.ctx.arc(0, 0, 32, 0, 2 * Math.PI);
		this.ctx.fillStyle = "black";
		this.ctx.fill();

		this.ctx.beginPath();
		this.ctx.moveTo(-16, -28);
		this.ctx.lineTo(0, -60);
		this.ctx.lineTo(16, -28);
		this.ctx.closePath();
		this.ctx.fillStyle = "black";
		this.ctx.fill();

		this.ctx.resetTransform();
	}
}

export default function DecideActivity() {
	const navigate = useNavigate();
	const canvasRef = useRef();
	const dialogRef = useRef();
	const drawables = useRef([]);
	const animId = useRef();
	const [activity, setActivity] = useState({});

	useEffect(() => {
		(async () => {
			let activities;

			// Fetch activities

			const JWT = localStorage.getItem("JWT");
			if (!JWT) {
				console.log("Not authenticated, please login or register");
				return navigate("/login");
			}

			try {
				const response = await fetch(
					`${import.meta.env.VITE_BACKEND_ORIGIN || "http://localhost:8000"}/api/groups/group-syd-id`,
					{ headers: { Authorization: `Bearer ${JWT}` } },
				);

				// Should probably consolidate and abstract normal fetch checks (JWT, .ok, JSON redirects and errors) into a wrapper
				if (!response.ok) {
					if (response.status >= 400 && response.status < 500) {
						const responseData = await response.json();
						if (responseData.redirect) navigate(responseData.redirect);
						throw new Error(responseData.error || "Client side error");
					} else throw new Error("Network error");
				}

				activities = (await response.json()).activities.filter((activity) => !activity.done);
			} catch (err) {
				console.error("Failed to get activities. Error:", err.message);
				alert("Couldn't get activities :("); // Strongly dislike using alert, but there's no custom app-wide notification/toast system yet
			}

			// Initialise objects to draw, and start update loop

			drawables.current = [
				new Wheel(
					canvasRef.current.getContext("2d"),
					{ x: canvasRef.current.width / 2, y: canvasRef.current.height / 2 },
					256,
					activities,
					["#0072B2", "#9ad2f2", "hsl(202, 80%, 50%)"], // primary, accent, and in between colors (need min 3 to avoid 2 adjacent slices having the same colours)
					(activity) => {
						setActivity(activity);
						dialogRef.current.showModal();
					},
				),
			];

			function updateLoop() {
				animId.current = requestAnimationFrame(updateLoop);
				drawables.current.forEach((e) => {
					e.update();
				});
				drawables.current.forEach((e) => {
					e.draw();
				});
			}

			updateLoop();
		})();

		return () => {
			cancelAnimationFrame(animId.current);
		};
	}, [navigate]);

	return (
		<>
			<div className="decision-container">
				<Header backPath={"/bucket-list"} title="Decision Wheel" />
				<canvas width="600" height="600" ref={canvasRef} className="decision-wheel">
					A spinning wheel to get a random activity {/* Alt text */}
				</canvas>
				<div className="decision-wheel-button">
					<Button text="Spin" onClick={() => (drawables.current[0].speed = Math.random() / 4 - 0.25 / 2 + 0.5)} />
				</div>
				<dialog className="decided-activity-popup" ref={dialogRef} closedby="any">
					<div className="section-title">
						{activityChosenPhrases[Math.floor(Math.random() * activityChosenPhrases.length)]}
					</div>
					{activity.images?.at(0) ? (
						<img width="300" height="150" src={activity.images ? activity.images[0] : null} />
					) : (
						<ImageIcon width="300" height="150" color="#AAA" />
					)}
					<div className="decided-activity-name">{activity.name}</div>
				</dialog>
			</div>
		</>
	);
}
