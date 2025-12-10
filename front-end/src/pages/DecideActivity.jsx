import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import Button from "../components/Button";
import "./DecideActivity.css";
import { ImageIcon } from "lucide-react";

const activityChosenPhrases = ["The wheel has spoken, the universe has chosen..."];
const palette = ["#e37c7c", "#f0e2c9", "#f9d77e"]; // coral, light beige, soft yellow
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
	constructor(ctx, center = { x: 0, y: 0 }, radius = 100, activities = [{}], weights = [], colors = palette, activitySelectedCb) {
		this.ctx = ctx;
		this.center = center;
		this.radius = radius;
		this.activities = activities;
		this.weights = weights.length ? weights : activities.map(() => 1);
		this.colors = colors;
		this.angle = 0;
		this.speed = 0;
		this.activitySelectedCb = activitySelectedCb;
		this._buildSegments();
	}

	_buildSegments() {
		const usable = this.activities
			.map((a, idx) => ({ activity: a, weight: this.weights[idx] || 0 }))
			.filter((x) => x.weight > 0);

		const list = usable.length > 0 ? usable : this.activities.map((a) => ({ activity: a, weight: 1 }));

		const total = list.reduce((sum, w) => sum + w.weight, 0) || 1;
		let start = 0;
		const colorSeq = list.map((_, idx) => this.colors[idx % this.colors.length]);
		if (colorSeq.length > 1 && colorSeq[colorSeq.length - 1] === colorSeq[0]) {
			colorSeq[colorSeq.length - 1] = this.colors[(this.colors.indexOf(colorSeq[colorSeq.length - 1]) + 1) % this.colors.length];
		}

		this.segments = list.map((entry, idx) => {
			const slice = (entry.weight / total) * Math.PI * 2;
			const seg = {
				activity: entry.activity,
				start,
				end: start + slice,
				color: colorSeq[idx],
			};
			start += slice;
			return seg;
		});
	}

	_pickActivity(normalizedAngle) {
		for (const seg of this.segments) {
			if (normalizedAngle >= seg.start && normalizedAngle < seg.end) return seg.activity;
		}
		return this.activities[0];
	}

	update() {
		if (0 < this.speed && this.speed < 0.00025) {
			this.speed = 0;
			const normalizedAngle = (3.5 * Math.PI - (this.angle % (2 * Math.PI))) % (2 * Math.PI);
			this.activitySelectedCb(this._pickActivity(normalizedAngle));
		} else this.speed *= 0.990;

		this.angle += this.speed;
	}

	draw() {
		this.ctx.setTransform(1, 0, 0, 1, 0, 0);
		this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
		this.ctx.globalAlpha = 1;
		this.ctx.translate(this.center.x, this.center.y);

		this.ctx.save();
		this.ctx.rotate(this.angle);

		for (const seg of this.segments) {
			this.ctx.beginPath();
			this.ctx.moveTo(0, 0);
			this.ctx.arc(0, 0, this.radius, seg.start, seg.end);
			this.ctx.closePath();
			this.ctx.fillStyle = seg.color;
			this.ctx.fill();
			this.ctx.strokeStyle = "#4a3325"; 
			this.ctx.lineWidth = 2;
			this.ctx.stroke();

			const mid = (seg.start + seg.end) / 2;
			this.ctx.save();
			this.ctx.rotate(mid);
			this.ctx.fillStyle = "#3b2b2b";
			this.ctx.globalAlpha = 1;
			this.ctx.font = "20px Inter";
			this.ctx.textAlign = "center";
			this.ctx.textBaseline = "middle";
			const text = (seg.activity.name || "").slice(0, 22);
			this.ctx.fillText(text, this.radius * 0.55, 0, this.radius * 0.9);
			this.ctx.restore();
		}
		this.ctx.restore();

		this.ctx.globalAlpha = 1;

		this.ctx.beginPath();
		this.ctx.arc(0, 0, 40, 0, 2 * Math.PI);
		this.ctx.fillStyle = "#f2e8da";
		this.ctx.fill();

		this.ctx.beginPath();
		this.ctx.arc(0, 0, 32, 0, 2 * Math.PI);
		this.ctx.fillStyle = "#3f3a32";
		this.ctx.fill();

		this.ctx.beginPath();
		this.ctx.moveTo(-16, -28);
		this.ctx.lineTo(0, -60);
		this.ctx.lineTo(16, -28);
		this.ctx.closePath();
		this.ctx.fillStyle = "#e89b9b";
		this.ctx.fill();

		this.ctx.resetTransform();
	}
}

export default function DecideActivity() {
	const navigate = useNavigate();
	const { groupId } = useParams();
	const canvasRef = useRef();
	const dialogRef = useRef();
	const drawables = useRef([]);
	const animId = useRef();
	const baseActivitiesRef = useRef([]);
	const [activity, setActivity] = useState({});
	const [mode, setMode] = useState("equal"); // "equal" or "likes"
	const confettiInstanceRef = useRef(null);
	const confettiCanvasRef = useRef(null);

	const backendURL = import.meta.env.VITE_BACKEND_ORIGIN || "http://localhost:8000";
	const jwt = localStorage.getItem("JWT");
	const userPayload = jwt ? JSON.parse(atob(jwt.split(".")[1])) : null;

	useEffect(() => {
		(async () => {
			if (!jwt) {
				console.log("Not authenticated, please login or register");
				return navigate("/login");
			}

			if (!groupId) {
				console.error("No groupId present in route params");
				alert("No group selected.");
				return navigate("/");
			}

			try {
				const response = await fetch(`${backendURL}/api/groups/${groupId}`, {
					headers: { Authorization: `Bearer ${jwt}` },
				});

				if (!response.ok) {
					if (response.status >= 400 && response.status < 500) {
						const responseData = await response.json();
						if (responseData.redirect) navigate(responseData.redirect);
						throw new Error(responseData.error || "Client side error");
					}
					throw new Error("Network error");
				}

				const group = await response.json();
				const baseActivities = (group.activities || []).filter((activity) => !activity.done);
				if (!baseActivities.length) {
					alert("No activities to decide between yet. Try adding some first.");
					return;
				}
				baseActivitiesRef.current = baseActivities;
				buildWheel(baseActivitiesRef.current, mode);
			} catch (err) {
				console.error("Failed to get activities. Error:", err.message);
				alert("Couldn't get activities :(");
				return;
			}
		})();

		return () => {
			cancelAnimationFrame(animId.current);
		};
	}, [navigate, groupId, backendURL, jwt, mode]);

	useEffect(() => {
		if (!baseActivitiesRef.current.length) return;
		buildWheel(baseActivitiesRef.current, mode);
	}, [mode]);

	function buildWheel(baseActivities, mode) {
		if (!canvasRef.current) return;
		cancelAnimationFrame(animId.current);
		const rawWeights =
			mode === "likes" ? baseActivities.map((a) => Math.max(0, (a.likes || []).length)) : baseActivities.map(() => 1);
		const total = rawWeights.reduce((s, w) => s + w, 0);
		const weights = total === 0 ? baseActivities.map(() => 1) : rawWeights;

		drawables.current = [
			new Wheel(
				canvasRef.current.getContext("2d"),
				{ x: canvasRef.current.width / 2, y: canvasRef.current.height / 2 },
				256,
				baseActivities,
				weights,
				palette,
				(activity) => {
					setActivity(activity);
					dialogRef.current.showModal();
					triggerConfetti();
				},
			),
		];

		function updateLoop() {
			animId.current = requestAnimationFrame(updateLoop);
			drawables.current.forEach((e) => e.update());
			drawables.current.forEach((e) => e.draw());
		}

		updateLoop();
	}

	async function triggerConfetti() {
		const { default: confetti } = await import("canvas-confetti");
		
		let canvas = confettiCanvasRef.current;
		if (!canvas) {
			canvas = document.createElement("canvas");
			canvas.className = "confetti-canvas";
			confettiCanvasRef.current = canvas;
		}
		
		Object.assign(canvas.style, {
			position: "fixed",
			inset: "0",
			width: "100%",
			height: "100%",
			pointerEvents: "none",
			zIndex: "2147483647",
		});
		
		if (canvas.parentElement) {
			canvas.parentElement.removeChild(canvas);
		}
		document.body.appendChild(canvas);
		
		const ci = confetti.create(canvas, { resize: true, useWorker: true });
		const burst = (x) =>
			ci({
				particleCount: 70,
				spread: 75,
				startVelocity: 38,
				origin: { x, y: 0.35 },
				colors: ["#e37c7c", "#f0e2c9", "#f9d77e", "#ffffff"],
				scalar: 1.1,
			});
		burst(0.25);
		burst(0.75);
	}

	return (
		<>
			<div className="decision-container">
				<Header backPath={`/groups/${groupId}/activities`} title="Decision Wheel" />
				<div className="mode-row">
					<div className="mode-buttons">
						<Button
							text="Equal Chance"
							buttonType={mode === "equal" ? "primary" : "secondary"}
							onClick={() => setMode("equal")}
						/>
						<Button
							text="Weighted by Likes"
							buttonType={mode === "likes" ? "primary" : "secondary"}
							onClick={() => setMode("likes")}
						/>
					</div>
				</div>
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
