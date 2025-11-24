import path from "node:path";
import crypto from "node:crypto";
import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { users, groups } from "./mockData.js"; // Deprecated
import { User, Memory, Activity, Group } from "./db.js";

const app = express();

// --- Middleware ---

app.use(express.static(path.join(import.meta.dirname, "../public")));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(express.json({ limit: "10mb" }));
app.use(
	cors({
		origin: process.env.FRONTEND_ORIGIN,
		allowedHeaders: "Origin,Content-Type,Authorization",
		credentials: true,
	}),
);

// --- Routes ---

app.post("/api/login", (req, res) => {
	// Ensure required fields are present
	if (!req.body?.username || !req.body?.password) {
		return res.status(400).json({ error: "Missing required fields" });
	}

	// Get user from db
	const user = users.find((user) => user.username === req.body.username);

	// Ensure user exists, and password matches
	if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
		return res.status(404).json({ error: "Invalid username or password" });
	}

	// Ensure email is verified
	if (!user.emailVerified) {
		return res.json({ redirect: "/verify-email" });
	}

	// Send JWT on successful authentication
	res.json({
		JWT: jwt.sign(
			{ subject: user._id, username: user.username, profilePicture: user.profilePicture },
			process.env.JWT_SECRET,
			{ expiresIn: "1d" },
		),
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
		password: bcrypt.hashSync(req.body.password),
		email: req.body.email,
		emailVerified: false,
		OTP: "000000", // Store OTP and generation time temporarily (should this be an in memory obj instead?)
		OTPTimestamp: Date.now(),
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
	res.status(201).json({
		JWT: jwt.sign(
			{ subject: user._id, username: user.username, profilePicture: user.profilePicture },
			process.env.JWT_SECRET,
			{ expiresIn: "1d" },
		),
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

	// Generate and save new OTP
	user.OTP = "000000";
	user.OTPTimestamp = Date.now();

	// Successful response, indicating OTP has been renewed
	res.send();
});

// Note: All APIs henceforth require authentication

// Verify JWT & put user id into req.user
app.use((req, res, next) => {
	const JWT = req.headers.authorization?.replace("Bearer ", "");
	if (!JWT) return res.status(401).json();

	jwt.verify(JWT, process.env.JWT_SECRET, (err, user) => {
		if (err) return res.send(401).json();
		req.user = user;
		next();
	});
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
app.get("/api/invites/:id", (req, res) => {
	res.json(groups.filter((group) => group.invitedMembers.includes(req.user._id)).map((group) => group._id));
});

// Get a list of group ids user is a member of
app.get("/api/groups/:id", (req, res) => {
	res.json(groups.filter((group) => group.members.includes(req.user._id)).map((group) => group._id));
});

// Create a new group
app.post("/api/group", (req, res) => {
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

// Leave a group
app.post("/api/groups/:id/leave", (req, res) => {
	const group = groups.find((group) => group._id === req.params.id);

	// Error if group doesn't exist
	if (!group) return res.status(404).json({ error: "Group not found" });

	// Check if user is a member
	if (!group.members.includes(req.user._id)) {
		return res.status(400).json({ error: "User is not a member of this group" });
	}

	// Remove user from members
	group.members = group.members.filter((id) => id !== req.user._id);
	group.updatedAt = new Date().toISOString();

	res.json({ message: "Left group successfully" });
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

// Add item to group bucket list
app.post("/api/group/:groupId/activities", (req, res) => {
	const group = groups.find((g) => g._id === req.params.groupId);
	if (!group) {
		return res.status(404).json({ error: "Group not found" });
	}

	const { title, location, description, image } = req.body;
	if (!title) {
		return res.status(400).json({ error: "Title is required" });
	}

	const newItem = {
		id: crypto.randomUUID(),
		title,
		location,
		description,
		image,
		done: false,
		createdAt: new Date().toISOString(),
	};

	group.activities.push(newItem);

	res.status(201).json(newItem);
});

// Update group details
app.put("/api/groups/:id", (req, res) => {
	const group = groups.find((group) => group._id === req.params.id);

	// Error if group doesn't exist
	if (!group) return res.status(404).json({ error: "Group not found" });

	// Only members can update group details
	if (!group.members.includes(req.user._id)) {
		return res.status(403).json({ error: "Only members can update group details" });
	}

	// Update allowed fields
	if (req.body.name !== undefined) {
		if (!req.body.name.trim()) {
			return res.status(400).json({ error: "Group name cannot be empty" });
		}
		group.name = req.body.name;
	}

	if (req.body.desc !== undefined) {
		group.desc = req.body.desc;
	}

	if (req.body.icon !== undefined) {
		group.icon = req.body.icon;
	}

	// Update timestamp
	group.updatedAt = new Date().toISOString();

	// Return updated group
	res.json(group);
});

// Delete a group (only if user is the last member)
app.delete("/api/groups/:id", (req, res) => {
	const groupIndex = groups.findIndex((group) => group._id === req.params.id);

	// Error if group doesn't exist
	if (groupIndex === -1) return res.status(404).json({ error: "Group not found" });

	const group = groups[groupIndex];

	// Only members can delete
	if (!group.members.includes(req.user._id)) {
		return res.status(403).json({ error: "Only members can delete the group" });
	}

	// Can only delete if user is the last member
	if (group.members.length > 1) {
		return res.status(400).json({
			error: "Cannot delete group with multiple members. Please leave the group instead.",
		});
	}

	// Remove group from array
	groups.splice(groupIndex, 1);

	res.json({ message: "Group deleted successfully" });
});

// Invite users to a group
app.post("/api/groups/:id/invite", (req, res) => {
	const group = groups.find((group) => group._id === req.params.id);

	// Error if group doesn't exist
	if (!group) return res.status(404).json({ error: "Group not found" });

	// Only members can invite
	if (!group.members.includes(req.user._id)) {
		return res.status(403).json({ error: "Only members can invite users" });
	}

	// Ensure userId is provided
	if (!req.body?.userId) {
		return res.status(400).json({ error: "Missing required field: userId" });
	}

	const userToInvite = users.find((user) => user._id === req.body.userId);

	// Check if user exists
	if (!userToInvite) {
		return res.status(404).json({ error: "User not found" });
	}

	// Check if user is already a member
	if (group.members.includes(req.body.userId)) {
		return res.status(409).json({ error: "User is already a member" });
	}

	// Check if user is already invited
	if (group.invitedMembers.includes(req.body.userId)) {
		return res.status(409).json({ error: "User is already invited" });
	}

	// Add user to invited members
	group.invitedMembers.push(req.body.userId);
	group.updatedAt = new Date().toISOString();

	res.json({ message: "User invited successfully", group });
});

app.get("/api/groups/:groupId/activities/:activityId/memories", (req, res) => {
	const group = groups.find((g) => g._id === req.params.groupId);
	if (!group) return res.status(404).json({ error: "Group not found" });

	const activity = group.activities.find((a) => a._id === req.params.activityId);
	if (!activity) return res.status(404).json({ error: "Activity not found" });

	res.json(activity.memories || []);
});

app.post("/api/groups/:groupId/activities/:activityId/memories", (req, res) => {
	const { images, title } = req.body;

	if (!images || !Array.isArray(images) || images.length === 0) {
		return res.status(400).json({ error: "Missing images array" });
	}

	const group = groups.find((g) => g._id === req.params.groupId);
	if (!group) return res.status(404).json({ error: "Group not found" });

	const activity = group.activities.find((a) => a._id === req.params.activityId);
	if (!activity) return res.status(404).json({ error: "Activity not found" });

	const newMemory = {
		_id: crypto.randomUUID(),
		title: title || "Untitled Memory",
		images,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	};

	if (!activity.memories) activity.memories = [];
	activity.memories.push(newMemory);
	activity.updatedAt = new Date().toISOString();
	group.updatedAt = new Date().toISOString();

	res.status(201).json(newMemory);
});

app.put("/api/groups/:groupId/activities/:activityId/memories/:memoryId", (req, res) => {
	const group = groups.find((g) => g._id === req.params.groupId);
	if (!group) return res.status(404).json({ error: "Group not found" });

	const activity = group.activities.find((a) => a._id === req.params.activityId);
	if (!activity) return res.status(404).json({ error: "Activity not found" });

	const memory = activity.memories.find((m) => m._id === req.params.memoryId);
	if (!memory) return res.status(404).json({ error: "Memory not found" });

	if (req.body.images && Array.isArray(req.body.images)) {
		memory.images = req.body.images;
	}
	if (req.body.title) {
		memory.title = req.body.title;
	}
	memory.updatedAt = new Date().toISOString();

	res.json(memory);
});

app.delete("/api/groups/:groupId/activities/:activityId/memories/:memoryId", (req, res) => {
	const group = groups.find((g) => g._id === req.params.groupId);
	if (!group) return res.status(404).json({ error: "Group not found" });

	const activity = group.activities.find((a) => a._id === req.params.activityId);
	if (!activity) return res.status(404).json({ error: "Activity not found" });

	const index = activity.memories.findIndex((m) => m._id === req.params.memoryId);
	if (index === -1) return res.status(404).json({ error: "Memory not found" });

	activity.memories.splice(index, 1);
	activity.updatedAt = new Date().toISOString();
	group.updatedAt = new Date().toISOString();

	res.sendStatus(204);
});

// Catchall for unspecified routes (Express sends 404 anyways, but changing HTML for JSON with error property)
app.use((req, res, next) => {
	res.status(404).json({ error: "Path not found" });
	next();
});

app.listen(process.env.PORT || 8000, () => {
	console.log(`Express app listening at http://localhost:${process.env.PORT || 8000}`);
});
