import { useEffect, useRef, useState } from "react";
import Button from "../components/Button";
import "./Decide.css";

const placeChosenPhrases = ["The wheel has spoken, the universe has chosen..."]; // I might need a better name for this. It's the message that displays in the pop up after you spin the wheel

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
		ctx,
		center = { x: 0, y: 0 },
		radius = 100,
		places = [{}],
		colors = ["lightgray", "gray"],
		placeSelectedCb,
	) {
		this.ctx = ctx;
		this.center = center;
		this.radius = radius;
		this.places = places;
		this.colors = colors;
		this.angle = 0;
		this.speed = 0;
		this.placeSelectedCb = placeSelectedCb;
	}

	update() {
		this.angle += this.speed;
		if (0 < this.speed && this.speed < 0.001) {
			this.speed = 0;

			// Normalize angle to be within 0 - 2 PI, adjusting for clockwise rotation. Also, offset by -90 deg, as 0 deg is horizontal instead of vertical (E vs N)
			const normalizedAngle = (3.5 * Math.PI - (this.angle % (2 * Math.PI))) % (2 * Math.PI);
			this.placeSelectedCb(this.places[Math.floor(normalizedAngle / ((2 * Math.PI) / this.places.length))]);
		} else {
			this.speed *= 0.995;
		}
	}

	draw() {
		// this.ctx.globalAlpha = 0.1;
		if (this.speed === 0) this.ctx.globalAlpha = 1;
		// else this.ctx.globalAlpha = Math.min(Math.max(1 / this.speed, 0.1), 1);
		else this.ctx.globalAlpha = mapRange(this.speed, 0.05, 0, 0.1, 0.5, true);

		this.ctx.translate(this.center.x, this.center.y);

		// Background circle
		this.ctx.beginPath();
		this.ctx.arc(0, 0, this.radius + 8, 0, 2 * Math.PI);
		this.ctx.strokeStyle = "black";
		this.ctx.lineWidth = 4;
		this.ctx.stroke();
		this.ctx.lineWidth = 1;

		this.ctx.save();
		this.ctx.rotate(this.angle);
		// Draw each segment
		for (let i = 0; i < this.places.length; i++) {
			// Background
			this.ctx.beginPath();
			this.ctx.moveTo(0, 0);
			this.ctx.arc(0, 0, this.radius, 0, 2 * Math.PI * (1 / this.places.length));
			this.ctx.fillStyle = this.colors[i % this.colors.length];
			this.ctx.fill();

			// Text
			this.ctx.save();

			this.ctx.rotate(Math.PI / this.places.length);
			this.ctx.fillStyle = "black";
			this.ctx.globalAlpha = 1;
			this.ctx.font = "16px Inter";
			this.ctx.fillText(this.places[i].name, 32, 16 / 3, this.radius * 0.75);
			this.ctx.restore();

			this.ctx.rotate((2 * Math.PI) / this.places.length);
		}
		this.ctx.restore();

		// Center parts
		this.ctx.globalAlpha = 1;

		this.ctx.beginPath();
		this.ctx.arc(0, 0, 20, 0, 2 * Math.PI);
		this.ctx.fillStyle = "white";
		this.ctx.fill();

		this.ctx.beginPath();
		this.ctx.arc(0, 0, 16, 0, 2 * Math.PI);
		this.ctx.fillStyle = "black";
		this.ctx.fill();

		this.ctx.beginPath();
		this.ctx.moveTo(-8, -14);
		this.ctx.lineTo(0, -30);
		this.ctx.lineTo(8, -14);
		this.ctx.closePath();
		this.ctx.fillStyle = "black";
		this.ctx.fill();

		this.ctx.resetTransform();
	}
}

export default function Decide(props) {
	const canvasRef = useRef();
	const dialogRef = useRef();
	const drawables = useRef([]);
	const animId = useRef();
	const places = useRef([]);
	const [place, setPlace] = useState({});

	useEffect(() => {
		(async () => {
			// Fetch places

			places.current = (await (await fetch("/api/groups/syd-id.json")).json()).places;
			console.log(places.current);

			// Wheel

			const canvas = canvasRef.current;
			drawables.current = [
				new Wheel(
					canvas.getContext("2d"),
					{ x: canvas.width / 2, y: canvas.height / 2 },
					256 / 2,
					places.current,
					["lightgray", "gray"],
					(place) => {
						setPlace(place);
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
			cancelAnimationFrame(animId);
		};
	}, []);

	return (
		<>
			<canvas
				style={{ margin: "auto", outline: "2px solid black", display: "block" }}
				width="300"
				height="300"
				ref={canvasRef}
			>
				A spinning wheel to get a random place {/* Alt text */}
			</canvas>
			<Button text="Spin" onClick={() => (drawables.current[0].speed = Math.random() / 4 - 0.25 / 2 + 0.5)} />
			<dialog className="placeSelectedPopup" ref={dialogRef} closedby="any">
				<div className="section-title">{placeChosenPhrases[Math.floor(Math.random() * placeChosenPhrases.length)]}</div>
				<img width="300" height="150" src={place.images ? place.images[0] : null} />
				<div className="placeName">{place.name}</div>
			</dialog>
		</>
	);
}
