import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
	console.error("Error: GEMINI_API_KEY is not set in .env file");
	process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
	try {
		console.log("Checking available models for your API key...");
		// Note: The simple client doesn't always expose listModels directly in all versions,
		// so we will try a direct fetch if the SDK helper isn't clear,
		// but let's try a simple generation first to see if the key is valid at all.

		const model = genAI.getGenerativeModel({ model: "gemini-pro" });
		console.log("Attempting to access 'gemini-pro'...");
		try {
			await model.generateContent("Hello");
			console.log("✅ SUCCESS: 'gemini-pro' is working!");
		} catch (e) {
			console.log("❌ 'gemini-pro' failed:", e.message);
		}

		const model2 = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
		console.log("Attempting to access 'gemini-1.5-flash'...");
		try {
			await model2.generateContent("Hello");
			console.log("✅ SUCCESS: 'gemini-1.5-flash' is working!");
		} catch (e) {
			console.log("❌ 'gemini-1.5-flash' failed:", e.message);
		}
	} catch (error) {
		console.error("Global Error:", error);
	}
}

listModels();
