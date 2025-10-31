import "./Decide.css";
import Button from "../components/Button";
import { useEffect, useRef } from "react";

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
		/** @type {CanvasRenderingContext2D} */ ctx,
		center = { x: 0, y: 0 },
		radius = 100,
		placeNames = [""],
		colors = ["lightgray", "gray"],
	) {
		this.ctx = ctx;
		this.center = center;
		this.radius = radius;
		this.placeNames = placeNames;
		this.colors = colors;
		this.angle = 0;
		this.speed = 0;
	}

	update() {
		this.angle += this.speed; // Math.min(this.speed, Math.PI / (4 * 5));
		if (this.speed < 0.001) {
			this.speed = 0;
		} else {
			this.speed *= 0.995;
		}
	}

	draw() {
		this.ctx.save();

		this.ctx.globalAlpha = 0.1;

		// if (this.speed === 0) this.ctx.globalAlpha = 1;
		// else this.ctx.globalAlpha = Math.min(Math.max(1 / this.speed, 0.1), 1);
		// else this.ctx.globalAlpha = mapRange(this.speed, 0.5, 0, 0.01, 0.5, true);
		// speed 0.5 -> 0
		// alpha 0.1 -> 1

		this.ctx.translate(this.center.x, this.center.y);
		this.ctx.rotate(this.angle);

		// Background circle
		this.ctx.beginPath();
		this.ctx.arc(0, 0, this.radius + 8, 0, 2 * Math.PI);
		this.ctx.strokeStyle = "black";
		this.ctx.lineWidth = 4;
		this.ctx.stroke();
		this.ctx.lineWidth = 1;

		// Draw each segment
		for (let i = 0; i < this.placeNames.length; i++) {
			this.ctx.rotate((2 * Math.PI) / this.placeNames.length);

			// Background
			this.ctx.beginPath();
			this.ctx.moveTo(0, 0);
			this.ctx.arc(0, 0, this.radius, 0, 2 * Math.PI * (1 / this.placeNames.length));
			this.ctx.fillStyle = this.colors[i % this.colors.length];
			this.ctx.fill();

			// Text
			this.ctx.save();

			this.ctx.rotate(Math.PI / this.placeNames.length);
			this.ctx.fillStyle = "black";
			this.ctx.globalAlpha = 1;
			this.ctx.font = "16px Inter";
			this.ctx.fillText(this.placeNames[i], 32, 16 / 3, this.radius * 0.75);
			this.ctx.restore();
		}
		this.ctx.restore();

		// Center part
		this.ctx.beginPath();
		this.ctx.arc(this.center.x, this.center.y, 20, 0, 2 * Math.PI);
		this.ctx.fillStyle = "white";
		this.ctx.fill();
		this.ctx.beginPath();
		this.ctx.arc(this.center.x, this.center.y, 16, 0, 2 * Math.PI);
		this.ctx.fillStyle = "black";
		this.ctx.fill();
	}
}

export default function Decide(props) {
	const canvasRef = useRef(null);
	const drawablesRef = useRef([]);
	const animId = useRef(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		drawablesRef.current = [new Wheel(canvas.getContext("2d"), { x: canvas.width / 2, y: canvas.height / 2 }, 256 / 2)];

		function updateLoop() {
			animId.current = requestAnimationFrame(updateLoop);
			drawablesRef.current.forEach((e) => {
				e.update();
			});
			drawablesRef.current.forEach((e) => {
				e.draw();
			});
		}

		updateLoop(); // Start updateLoop

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
				// onClick={}
			>
				A spinning wheel to get a random place
			</canvas>
			<Button text="SPIN!" onClick={() => (drawablesRef.current[0].speed = 0.5)} />
		</>
	);
}
