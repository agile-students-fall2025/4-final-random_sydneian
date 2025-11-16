import path from "node:path";
import crypto from "node:crypto";
import express from "express";
import { users, groups } from "./mockData.js";

const app = express();

// --- Middleware ---

// Enable CORS for frontend
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
	res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
	if (req.method === "OPTIONS") {
		return res.sendStatus(200);
	}
	next();
});

app.use(express.static(path.join(import.meta.dirname, "../public")));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(express.json({ limit: "10mb" }));

// --- Routes ---

app.post("/api/login", (req, res) => {
	// Ensure required fields are present
	if (!req.body?.username || !req.body?.password) {
		return res.status(400).json({ error: "Missing required fields" });
	}

	// Get user from db
	const user = users.find((user) => user.username === req.body.username);

	// Ensure user exists, and password matches
	if (!user || user.password !== req.body.password) {
		return res.status(404).json({ error: "Invalid username or password" });
	}

	// Ensure email is verified
	if (!user.emailVerified) {
		return res.json({ redirect: "/verify-email" });
	}

	// Send JWT on successful authentication
	res.json({
		JWT:
			"eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0." + // { "alg": "none", "typ": "JWT" }
			Buffer.from(
				JSON.stringify({
					iat: Math.floor(Date.now() / 1000),
					exp: Math.floor(Date.now() / 1000) + 15 * 60, // in 15 mins
					sub: user._id,
				}),
			).toString("base64url") +
			".",
	});
});

app.post("/api/register", (req, res) => {
	// Ensure required fields are present
	if (!req.body?.username || !req.body?.password || !req.body?.email) {
		return res.status(400).json({ error: "Missing required fields" });
	}

	// Check if username already taken
	if (users.find((user) => user.username === req.body.username)) {
		return res.status(409).json({ error: "Username taken" });
	}

	// Check if email already used
	if (users.find((user) => user.email === req.body.email)) {
		return res.status(409).json({ error: "Email taken" });
	}

	const newUser = {
		_id: crypto.randomUUID(),
		username: req.body.username,
		password: req.body.password, // should be salted and hashed
		email: req.body.email,
		emailVerified: false,
		OTP: "000000", // Store OTP and generation time temporarily (should this be an in memory obj instead?)
		OTPTimestamp: Math.floor(new Date().getTime() / 1000),
		profilePicture: undefined,
		preferences: {
			notifications: {
				eventNextDay: true,
				newEventAdded: true,
			},
			theme: "light",
		},
	};

	// Save new user to db
	users.push(newUser);

	// If no errors, send successful response, which indicates client should move onto OTP
	res.status(201).json({ redirect: "/verify-email" });

	// TODO: Send OTP over email
});

app.post("/api/register/verify-email", (req, res) => {
	// Ensure required fields are present
	if (!req.body?.username || !req.body?.otp) {
		return res.status(400).json({ error: "Missing required fields" });
	}

	// Get user from db
	const user = users.find((user) => user.username === req.body.username && !user.emailVerified);

	// Ensure user exists
	if (!user) return res.status(404).json({ error: "Invalid username" });

	// Ensure OTP matches and is still valid (created <= 10 mins ago)
	if (req.body.otp !== user.OTP || Date.now() - new Date(user.OTPTimestamp).getTime() > 10 * 60 * 1000) {
		return res.status(401).json({ error: "OTP invalid or expired" });
	}

	user.emailVerified = true;
	delete user.OTP;
	delete user.OTPTimestamp;

	// Send JWT on successful authentication
	res.json({
		JWT:
			"eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0." + // { "alg": "none", "typ": "JWT" }
			Buffer.from(
				JSON.stringify({
					iat: Math.floor(Date.now() / 1000),
					exp: Math.floor(Date.now() / 1000) + 15 * 60, // in 15 mins
					sub: user._id,
				}),
			).toString("base64url") +
			".",
	});
});

app.post("/api/register/renew-otp", (req, res) => {
	// Ensure required fields are present
	if (!req.body?.username) { 
		return res.status(400).json({ error: "Missing required fields" });
	}

	// Get user from db
	const user = users.find((user) => user.username === req.body.username && !user.emailVerified);

	// Ensure user exists & email is unverified
	if (!user || user.emailVerified) return res.status(404).json({ error: "Username invalid or already verified" });

	user.OTP = "000000";
	user.OTPTimestamp = Math.floor(new Date().getTime() / 1000);

	// Successful response, indicating OTP has been renewed
	res.send();
});

// Note: All APIs henceforth require authentication

// Mock: Put user id into req.user (in actual usage, this will be handled in a Passport callback, after validating and verifying the JWT)
app.use((req, res, next) => {
	// Temporarily disabled for testing - using mock user
	req.user = { _id: "user1-id" };
	next();

	// const JWT = req.headers.authorization?.replace("Bearer ", "");
	// if (!JWT) return res.status(401).json({ redirect: "/login" });

	// try {
	// 	req.user = { _id: JSON.parse(Buffer.from(JWT.split(".")[1], "base64url").toString()).sub };
	// } catch {
	// 	return res.status(400).json({ error: "Malformed JWT" });
	// }

	// next();
});

// Get user details
app.get("/api/users/:id", (req, res) => {
	// Get user from db
	const userDb = users.find((user) => user._id === req.params.id);

	// If user exists/found
	if (userDb) {
		// Send full details for same user, otherwise only basic details
		if (req.user._id === req.params.id) {
			delete userDb.password; // Password, though salted and hashed, should never be sent to the client
			res.json(userDb);
		} else {
			res.json({
				_id: userDb._id,
				username: userDb.username,
				email: userDb.email,
				profilePicture: userDb.profilePicture,
			});
		}
	} else res.status(404).json({ error: "User not found" });
});

// Get a list of group ids user is invited to
app.get("/api/invites", (req, res) => {
	res.json(groups.filter((group) => group.invitedMembers.includes(req.user._id)).map((group) => group._id));
});

// Get a list of group ids user is a member of
app.get("/api/groups", (req, res) => {
	res.json(groups.filter((group) => group.members.includes(req.user._id)).map((group) => group._id));
});

// Create a new group
app.post("/api/groups", (req, res) => {
	// Ensure required fields are present
	if (!req.body?.name) {
		return res.status(400).json({ error: "Missing required fields" });
	}

	const newGroup = {
		_id: crypto.randomUUID(),
		name: req.body.name,
		desc: req.body.desc || "",
		icon: req.body.icon || undefined,
		members: [req.user._id],
		invitedMembers: req.body.invitedMembers || [],
		activities: [],
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	};

	// Save new group to db
	groups.push(newGroup);

	// Return the created group
	res.status(201).json(newGroup);
});

// Accept a group invite
app.post("/api/groups/:id/accept", (req, res) => {
	const group = groups.find((group) => group._id === req.params.id);

	// Error if group doesn't exist
	if (!group) return res.status(404).json({ error: "Group not found" });

	// Check if user is invited
	if (!group.invitedMembers.includes(req.user._id)) {
		return res.status(403).json({ error: "User not invited to this group" });
	}

	// Check if user is already a member
	if (group.members.includes(req.user._id)) {
		return res.status(409).json({ error: "User already a member of this group" });
	}

	// Add user to members and remove from invited
	group.members.push(req.user._id);
	group.invitedMembers = group.invitedMembers.filter((id) => id !== req.user._id);
	group.updatedAt = new Date().toISOString();

	// Return updated group
	res.json(group);
});

// Get group details
app.get("/api/groups/:id", (req, res) => {
	const group = groups.find((group) => group._id === req.params.id);

	// Error if group doesn't exist
	if (!group) return res.status(404).json({ error: "Group not found" });

	// Send full info if user is a member
	if (group.members.includes(req.user._id)) {
		res.json(group);

		// Send basic details if user is invited
	} else if (group.invitedMembers.includes(req.user._id)) {
		res.json({
			_id: group._id,
			name: group.name,
			desc: group.desc,
			icon: group.icon,
			members: group.members,
		});

		// Disallow if user is neither a member nor invited
	} else res.status(403).json({ error: "User isn't a part of, nor invited to, this group" });
});

// Catchall for unspecified routes (Express sends 404 anyways, but changing HTML for JSON with error property)
app.use((req, res, next) => {
	res.status(404).json({ error: "Path not found" });
	next();
});

app.listen(process.env.PORT || 8000, () => {
	console.log(`Express app listening at http://localhost:${process.env.PORT || 8000}`);
});
