import app from "./app.js";
import { connectDB } from "./db.js";

const PORT = process.env.PORT || 8000;

const startServer = async () => {
	await connectDB();
	app.listen(PORT, () => {
		console.log(`Express server running at http://localhost:${PORT}`);
	});
};

startServer();
