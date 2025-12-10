import path from "node:path";
import crypto from "node:crypto";
import express from "express";
import { body, validationResult } from "express-validator";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User, Memory, Activity, Group } from "./db.js";
import { sendEmail } from "./sendEmail.js";
import OpenAI from "openai";
import puppeteer from "puppeteer";
import { uploadToS3, generateUniqueFileName, deleteFromS3 } from "./s3.js";
const app = express();

const dataUriRegex = /^data:([^;]+);base64,(.+)$/;

async function uploadIfDataUri(value, folder) {
	if (typeof value !== "string") return value;
	const match = value.match(dataUriRegex);
	if (!match) return value;
	const mimeType = match[1];
	const base64Data = match[2];
	const extension = mimeType.split("/")[1] || "bin";
	const fileName = generateUniqueFileName(`upload.${extension}`, folder);
	const buffer = Buffer.from(base64Data, "base64");
	return uploadToS3(buffer, fileName, mimeType);
}

async function uploadArrayDataUris(values, folder) {
	if (!Array.isArray(values)) return values;
	return Promise.all(values.map((item) => uploadIfDataUri(item, folder)));
}


// --- Middleware ---

app.use(express.static(path.join(import.meta.dirname, "../public")));
app.use(express.urlencoded({ limit: "15mb", extended: true }));
app.use(express.json({ limit: "15mb" }));
app.use(
	cors({
		origin: process.env.FRONTEND_ORIGIN || "http://localhost:3000",
		allowedHeaders: "Origin,Content-Type,Authorization",
		credentials: true,
	}),
);

// --- Routes ---

app.post("/api/login", [body("username").notEmpty(), body("password").notEmpty()], async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ error: "Missing required fields" });
	}

	try {
		// Get user from MongoDB
		const user = await User.findOne({ username: req.body.username });

		// Ensure user exists, and password matches
		if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
			return res.status(404).json({ error: "Invalid username or password" });
		}

		res.json({
			JWT: jwt.sign({ id: user._id.toString(), username: user.username }, process.env.JWT_SECRET, { expiresIn: "1d" }),
		});
	} catch (error) {
		console.error("Login error:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

app.post(
	"/api/register",
	[
		body("username").notEmpty(),
		body("email").notEmpty().isEmail(),
		body("password")
			.notEmpty()
			.isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 0, minNumbers: 0, minSymbols: 0 }),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ error: "Missing required fields, or invalid email/password" });
		}

		try {
			// Check if username already taken
			const existingUsername = await User.findOne({ username: req.body.username });
			if (existingUsername) {
				return res.status(409).json({ error: "Username taken" });
			}

			// Check if email already used
			const existingEmail = await User.findOne({ email: req.body.email });
			if (existingEmail) {
				return res.status(409).json({ error: "Email taken" });
			}

			const otp = Math.floor(100000 + Math.random() * 900000).toString();

			// Create new user in MongoDB
			const newUser = new User({
				username: req.body.username,
				password: bcrypt.hashSync(req.body.password),
				email: req.body.email,
				emailVerified: false,
				OTP: otp,
				OTPTimestamp: Date.now(),
				profilePicture: undefined,
				preferences: {
					notifications: {
						eventNextDay: true,
						newEventAdded: true,
					},
					theme: "light",
				},
			});

			// Save user
			await newUser.save();

			// Send OTP email
			await sendEmail(
				newUser.email,
				"Your Rendezvous OTP",
				`Your verification code is: ${otp}\n\nThis code expires in 10 minutes.`,
			);

			// If no errors, send successful response, which indicates client should move onto OTP
			res.status(201).json({ redirect: "/verify-email" });
		} catch (error) {
			console.error("Register error:", error);
			res.status(500).json({ error: "Internal server error" });
		}
	},
);

app.post("/api/register/verify-email", [body("username").notEmpty(), body("otp").notEmpty()], async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ error: "Missing required fields" });
	}

	try {
		// Get user from MongoDB
		const user = await User.findOne({ username: req.body.username, emailVerified: false });

		// Ensure user exists
		if (!user) {
			return res.status(404).json({ error: "Invalid username or already verified" });
		}

		// Ensure OTP matches and is still valid (created <= 10 mins ago)
		if (req.body.otp !== user.OTP || Date.now() - new Date(user.OTPTimestamp).getTime() > 10 * 60 * 1000) {
			return res.status(401).json({ error: "OTP invalid or expired" });
		}

		// Update user to verified
		user.emailVerified = true;
		user.OTP = undefined;
		user.OTPTimestamp = undefined;
		await user.save();

		// Send JWT on successful authentication (using MongoDB ObjectId)
		res.status(201).json({
			JWT: jwt.sign({ id: user._id.toString(), username: user.username }, process.env.JWT_SECRET, { expiresIn: "1d" }),
		});
	} catch (error) {
		console.error("Verify email error:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

app.post("/api/register/renew-otp", [body("username").notEmpty()], async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ error: "Missing required field" });
	}

	try {
		// Get user from MongoDB
		const user = await User.findOne({ username: req.body.username, emailVerified: false });

		// Ensure user exists & email is unverified
		if (!user) {
			return res.status(404).json({ error: "Username invalid or already verified" });
		}

		// Generate new OTP
		const otp = Math.floor(100000 + Math.random() * 900000).toString();

		user.OTP = otp;
		user.OTPTimestamp = Date.now();
		await user.save();

		// Send email
		await sendEmail(
			user.email,
			"Your new Rendezvous OTP",
			`Your new verification code is: ${otp}\n\nThis code expires in 10 minutes.`,
		);

		// Successful response, indicating OTP has been renewed
		res.send();
	} catch (error) {
		console.error("Renew OTP error:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// Note: All APIs henceforth require authentication

// Verify JWT & put user id into req.user
app.use((req, res, next) => {
	const JWT = req.headers.authorization?.replace("Bearer ", "");
	if (!JWT) return res.status(401).json();

	jwt.verify(JWT, process.env.JWT_SECRET, (err, user) => {
		if (err) return res.status(401).json();
		req.user = user;
		next();
	});
});

// Get user details
app.get("/api/users/:id", async (req, res) => {
	try {
		const userDb = await User.findById(req.params.id).lean();

		if (!userDb) {
			return res.status(404).json({ error: "User not found" });
		}

		if (req.user.id === req.params.id) {
			const userObj = { ...userDb };
			delete userObj.password;
			res.json(userObj);
		} else {
			res.json({
				_id: userDb._id,
				username: userDb.username,
				email: userDb.email,
				profilePicture: userDb.profilePicture,
			});
		}
	} catch (error) {
		console.error("Get user error:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

app.put("/api/users/:id", async (req, res) => {
	try {
		const userId = req.params.id;

		// Verify user is updating their own profile
		if (req.user.id !== userId) {
			return res.status(403).json({ error: "You can only update your own profile" });
		}

		const { username, email, profilePicture } = req.body;
	const user = await User.findById(userId);

	if (!user) {
		return res.status(404).json({ error: "User not found" });
	}

	if (username) user.username = username;
	if (email) user.email = email;
	if (profilePicture !== undefined) {
		const newProfileUrl = await uploadIfDataUri(profilePicture, "profiles");
		if (newProfileUrl && newProfileUrl !== user.profilePicture && user.profilePicture?.includes("amazonaws.com")) {
			try {
				await deleteFromS3(user.profilePicture);
			} catch (err) {
				console.error("Failed to delete old profile picture:", err);
			}
		}
		user.profilePicture = newProfileUrl;
	}

	await user.save();

	const sanitized = user.toObject();
	delete sanitized.password;
	delete sanitized.OTP;
	delete sanitized.OTPTimestamp;

	res.json(sanitized);
	} catch (error) {
		console.error("Update user error:", error);
		if (error.code === 11000) {
			return res.status(409).json({ error: "Username or email already exists" });
		}
		res.status(500).json({ error: "Internal server error" });
	}
});

app.get("/api/users/search/:query", async (req, res) => {
	try {
		const query = req.params.query.trim();
		if (query.length < 2) {
			return res.json([]);
		}

		const users = await User.find({
			username: { $regex: query, $options: "i" },
		})
			.select("username profilePicture")
			.limit(10)
			.lean();

		res.json(users);
	} catch (error) {
		console.error("Search users error:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// Get a list of group ids user is invited to (for dashboard)
app.get("/api/invites", async (req, res) => {
	try {
		const groupsList = await Group.find({ invitedMembers: req.user.id }).select("_id").lean();
		res.json(groupsList.map((group) => group._id.toString()));
	} catch (error) {
		console.error("Get invites error:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// Get a list of group ids user is a member of (for dashboard)
app.get("/api/groups", async (req, res) => {
	try {
		const groupsList = await Group.find({ members: req.user.id }).select("_id").lean();
		res.json(groupsList.map((group) => group._id.toString()));
	} catch (error) {
		console.error("Get groups error:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

app.post("/api/groups", async (req, res) => {
	if (!req.body?.name) {
		return res.status(400).json({ error: "Missing required fields" });
	}

	try {
		let invitedMemberIds = [];
		if (req.body.invitedMembers && Array.isArray(req.body.invitedMembers) && req.body.invitedMembers.length > 0) {
			const invitedUsers = await User.find({ username: { $in: req.body.invitedMembers } }).select("_id");
			invitedMemberIds = invitedUsers.map((user) => user._id);
		}

		const newGroup = new Group({
			name: req.body.name,
			desc: req.body.desc || "",
		icon: req.body.icon ? await uploadIfDataUri(req.body.icon, "groups") : undefined,
			owner: req.user.id,
			members: [req.user.id],
			admins: [req.user.id],
			invitedMembers: invitedMemberIds,
			activities: [],
		});

		await newGroup.save();

		await newGroup.populate("owner", "username profilePicture");
		await newGroup.populate("members", "username profilePicture");
		await newGroup.populate("admins", "username profilePicture");
		await newGroup.populate("invitedMembers", "username profilePicture");

		res.status(201).json(newGroup);
	} catch (error) {
		console.error("Create group error:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

app.post("/api/groups/:id/accept", async (req, res) => {
	try {
		const group = await Group.findById(req.params.id);

		if (!group) {
			return res.status(404).json({ error: "Group not found" });
		}

		const isInvited = group.invitedMembers.some((memberId) => memberId.toString() === req.user.id);
		if (!isInvited) {
			return res.status(403).json({ error: "User not invited to this group" });
		}

		const isMember = group.members.some((memberId) => memberId.toString() === req.user.id);
		if (isMember) {
			return res.status(409).json({ error: "User already a member of this group" });
		}

		group.members.push(req.user.id);
		group.invitedMembers = group.invitedMembers.filter((memberId) => memberId.toString() !== req.user.id);
		await group.save();

		await group.populate("owner", "username profilePicture");
		await group.populate("members", "username profilePicture");
		await group.populate("admins", "username profilePicture");
		await group.populate("invitedMembers", "username profilePicture");

		res.json(group);
	} catch (error) {
		console.error("Accept invite error:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// Leave a group
app.post("/api/groups/:id/leave", async (req, res) => {
	try {
		const group = await Group.findById(req.params.id);

		if (!group) {
			return res.status(404).json({ error: "Group not found" });
		}

		const isMember = group.members.some((memberId) => memberId.toString() === req.user.id);
		if (!isMember) {
			return res.status(400).json({ error: "User is not a member of this group" });
		}

		// Owner cannot leave the group, they must delete it instead
		const isOwner = group.owner.toString() === req.user.id;
		if (isOwner) {
			return res
				.status(400)
				.json({ error: "Group owner cannot leave. Please delete the group or transfer ownership." });
		}

		group.members = group.members.filter((memberId) => memberId.toString() !== req.user.id);
		group.admins = group.admins.filter((adminId) => adminId.toString() !== req.user.id);
		await group.save();

		res.json({ message: "Left group successfully" });
	} catch (error) {
		console.error("Leave group error:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// Remove a member from the group (admin only)
app.post("/api/groups/:id/remove-member", async (req, res) => {
	try {
		const group = await Group.findById(req.params.id);

		if (!group) {
			return res.status(404).json({ error: "Group not found" });
		}

		// Check if requester is an admin
		const isAdmin = group.admins.some((adminId) => adminId.toString() === req.user.id);
		if (!isAdmin) {
			return res.status(403).json({ error: "Only admins can remove members" });
		}

		if (!req.body?.userId) {
			return res.status(400).json({ error: "Missing required field: userId" });
		}

		// Prevent removing yourself (use leave endpoint instead)
		if (req.body.userId === req.user.id) {
			return res.status(400).json({ error: "Cannot remove yourself. Use leave endpoint instead" });
		}

		// Prevent removing the owner
		if (req.body.userId === group.owner.toString()) {
			return res.status(400).json({ error: "Cannot remove the group owner" });
		}

		const isMember = group.members.some((memberId) => memberId.toString() === req.body.userId);
		if (!isMember) {
			return res.status(400).json({ error: "User is not a member of this group" });
		}

		// Remove from both members and admins arrays
		group.members = group.members.filter((memberId) => memberId.toString() !== req.body.userId);
		group.admins = group.admins.filter((adminId) => adminId.toString() !== req.body.userId);
		await group.save();

		await group.populate("owner", "username profilePicture");
		await group.populate("members", "username profilePicture");
		await group.populate("admins", "username profilePicture");
		await group.populate("invitedMembers", "username profilePicture");

		res.json({ message: "Member removed successfully", group });
	} catch (error) {
		console.error("Remove member error:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// Promote a member to admin (admin only)
app.post("/api/groups/:id/promote-admin", async (req, res) => {
	try {
		const group = await Group.findById(req.params.id);

		if (!group) {
			return res.status(404).json({ error: "Group not found" });
		}

		// Check if requester is an admin
		const isAdmin = group.admins.some((adminId) => adminId.toString() === req.user.id);
		if (!isAdmin) {
			return res.status(403).json({ error: "Only admins can promote members" });
		}

		if (!req.body?.userId) {
			return res.status(400).json({ error: "Missing required field: userId" });
		}

		const isMember = group.members.some((memberId) => memberId.toString() === req.body.userId);
		if (!isMember) {
			return res.status(400).json({ error: "User is not a member of this group" });
		}

		const isAlreadyAdmin = group.admins.some((adminId) => adminId.toString() === req.body.userId);
		if (isAlreadyAdmin) {
			return res.status(400).json({ error: "User is already an admin" });
		}

		group.admins.push(req.body.userId);
		await group.save();

		await group.populate("owner", "username profilePicture");
		await group.populate("members", "username profilePicture");
		await group.populate("admins", "username profilePicture");
		await group.populate("invitedMembers", "username profilePicture");

		res.json({ message: "User promoted to admin successfully", group });
	} catch (error) {
		console.error("Promote admin error:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// Demote an admin to regular member (owner only)
app.post("/api/groups/:id/demote-admin", async (req, res) => {
	try {
		const group = await Group.findById(req.params.id);

		if (!group) {
			return res.status(404).json({ error: "Group not found" });
		}

		// Check if requester is the owner
		const isOwner = group.owner.toString() === req.user.id;
		if (!isOwner) {
			return res.status(403).json({ error: "Only the group owner can demote admins" });
		}

		if (!req.body?.userId) {
			return res.status(400).json({ error: "Missing required field: userId" });
		}

		// Cannot demote the owner
		if (req.body.userId === group.owner.toString()) {
			return res.status(400).json({ error: "Cannot demote the group owner" });
		}

		const isTargetAdmin = group.admins.some((adminId) => adminId.toString() === req.body.userId);
		if (!isTargetAdmin) {
			return res.status(400).json({ error: "User is not an admin" });
		}

		group.admins = group.admins.filter((adminId) => adminId.toString() !== req.body.userId);
		await group.save();

		await group.populate("owner", "username profilePicture");
		await group.populate("members", "username profilePicture");
		await group.populate("admins", "username profilePicture");
		await group.populate("invitedMembers", "username profilePicture");

		res.json({ message: "Admin demoted successfully", group });
	} catch (error) {
		console.error("Demote admin error:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// Get group details
app.get("/api/groups/:id", async (req, res) => {
	try {
		const group = await Group.findById(req.params.id)
			.populate("owner", "username profilePicture")
			.populate("members", "username profilePicture")
			.populate("admins", "username profilePicture")
			.populate("invitedMembers", "username profilePicture")
			.populate("activities.likes", "username profilePicture")
			.populate("activities.addedBy", "username profilePicture");

		// Error if group doesn't exist
		if (!group) return res.status(404).json({ error: "Group not found" });

		// Convert to plain object for easier manipulation
		const groupObj = group.toObject();
		const userId = req.user.id;

		// Check if user is a member (compare as strings)
		const isMember = group.members.some((member) => {
			return member._id.toString() === userId;
		});

		if (isMember) {
			// Send full info if user is a member
			res.json(groupObj);
		} else {
			// Check if user is invited
			const isInvited = group.invitedMembers.some((member) => {
				return member._id.toString() === userId;
			});

			if (isInvited) {
				// Send basic details if user is invited
				res.json({
					_id: groupObj._id,
					name: groupObj.name,
					desc: groupObj.desc,
					icon: groupObj.icon,
					members: groupObj.members,
				});
			} else {
				// Disallow if user is neither a member nor invited
				res.status(403).json({ error: "User isn't a part of, nor invited to, this group" });
			}
		}
	} catch (error) {
		console.error("Get group details error:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// Add item to group bucket list (MongoDB)
app.post("/api/groups/:groupId/activities", async (req, res) => {
	try {
		const group = await Group.findById(req.params.groupId);
		if (!group) {
			return res.status(404).json({ error: "Group not found" });
		}

		const isMember = group.members.some((memberId) => memberId.toString() === req.user.id);
		if (!isMember) {
			return res.status(403).json({ error: "Only group members can add activities" });
		}

		const { name, category, tags, locationDescription, latitude, longitude } = req.body;
		if (!name) {
			return res.status(400).json({ error: "Name is required" });
		}

		const newActivity = {
			name,
			category: category || "Uncategorised",
			tags: Array.isArray(tags)
				? tags
				: typeof tags === "string"
					? tags
							.split(",")
							.map((t) => t.trim())
							.filter((t) => t.length > 0)
					: [],
			likes: [],
			location: {
				type: "Point",
				coordinates: [longitude || 0, latitude || 0],
			},
			memories: [],
			done: false,
			addedBy: req.user.id,
		};

		group.activities.push(newActivity);
		await group.save();

		const createdActivity = group.activities[group.activities.length - 1];
		res.status(201).json(createdActivity);
	} catch (error) {
		console.error("Add activity error:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// Update group details
app.put("/api/groups/:id", async (req, res) => {
	try {
		const group = await Group.findById(req.params.id);

		if (!group) {
			return res.status(404).json({ error: "Group not found" });
		}

		const isMember = group.members.some((memberId) => memberId.toString() === req.user.id);
		if (!isMember) {
			return res.status(403).json({ error: "Only members can update group details" });
		}

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
		const newIcon = await uploadIfDataUri(req.body.icon, "groups");
		if (newIcon && newIcon !== group.icon && group.icon?.includes("amazonaws.com")) {
			try {
				await deleteFromS3(group.icon);
			} catch (err) {
				console.error("Failed to delete old group icon:", err);
			}
		}
		group.icon = newIcon;
		}

		await group.save();

		await group.populate("owner", "username profilePicture");
		await group.populate("members", "username profilePicture");
		await group.populate("admins", "username profilePicture");
		await group.populate("invitedMembers", "username profilePicture");

		res.json(group);
	} catch (error) {
		console.error("Update group error:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// Delete a group (owner only)
app.delete("/api/groups/:id", async (req, res) => {
	try {
		const group = await Group.findById(req.params.id);

		if (!group) {
			return res.status(404).json({ error: "Group not found" });
		}

		// Only the owner can delete the group
		const isOwner = group.owner.toString() === req.user.id;
		if (!isOwner) {
			return res.status(403).json({ error: "Only the group owner can delete the group" });
		}

		await Group.findByIdAndDelete(req.params.id);

		res.json({ message: "Group deleted successfully" });
	} catch (error) {
		console.error("Delete group error:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// Invite users to a group
app.post("/api/groups/:id/invite", async (req, res) => {
	try {
		const group = await Group.findById(req.params.id);

		if (!group) {
			return res.status(404).json({ error: "Group not found" });
		}

		const isMember = group.members.some((memberId) => memberId.toString() === req.user.id);
		if (!isMember) {
			return res.status(403).json({ error: "Only members can invite users" });
		}

		if (!req.body?.userId) {
			return res.status(400).json({ error: "Missing required field: userId" });
		}

		const userToInvite = await User.findById(req.body.userId);

		if (!userToInvite) {
			return res.status(404).json({ error: "User not found" });
		}

		const isAlreadyMember = group.members.some((memberId) => memberId.toString() === req.body.userId);
		if (isAlreadyMember) {
			return res.status(409).json({ error: "User is already a member" });
		}

		const isAlreadyInvited = group.invitedMembers.some((memberId) => memberId.toString() === req.body.userId);
		if (isAlreadyInvited) {
			return res.status(409).json({ error: "User is already invited" });
		}

		group.invitedMembers.push(req.body.userId);
		await group.save();

		await group.populate("owner", "username profilePicture");
		await group.populate("members", "username profilePicture");
		await group.populate("admins", "username profilePicture");
		await group.populate("invitedMembers", "username profilePicture");

		res.json({ message: "User invited successfully", group });
	} catch (error) {
		console.error("Invite user error:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

app.post("/api/groups/:id/invite-code/generate", async (req, res) => {
	try {
		const group = await Group.findById(req.params.id);

		if (!group) {
			return res.status(404).json({ error: "Group not found" });
		}

		const isMember = group.members.some((memberId) => memberId.toString() === req.user.id);
		if (!isMember) {
			return res.status(403).json({ error: "Only members can generate invite codes" });
		}

		const code = crypto.randomBytes(4).toString("hex").toUpperCase();
		group.inviteCode = code;
		await group.save();

		res.json({ inviteCode: code });
	} catch (error) {
		console.error("Generate invite code error:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

app.post("/api/groups/join-by-code", async (req, res) => {
	try {
		if (!req.body?.inviteCode) {
			return res.status(400).json({ error: "Missing required field: inviteCode" });
		}

		const group = await Group.findOne({ inviteCode: req.body.inviteCode.toUpperCase() });

		if (!group) {
			return res.status(404).json({ error: "Invalid invite code" });
		}

		const isMember = group.members.some((memberId) => memberId.toString() === req.user.id);
		if (isMember) {
			return res.status(409).json({ error: "Already a member of this group" });
		}

		group.members.push(req.user.id);
		group.invitedMembers = group.invitedMembers.filter((memberId) => memberId.toString() !== req.user.id);
		await group.save();

		await group.populate("owner", "username profilePicture");
		await group.populate("members", "username profilePicture");
		await group.populate("admins", "username profilePicture");
		await group.populate("invitedMembers", "username profilePicture");

		res.json(group);
	} catch (error) {
		console.error("Join by code error:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

app.get("/api/groups/:groupId/memories", async (req, res) => {
	try {
		const group = await Group.findById(req.params.groupId).select("activities");
		if (!group) return res.status(404).json({ error: "Group not found" });

		const allMemories = [];
		for (const activity of group.activities || []) {
			for (const mem of activity.memories || []) {
				const memObj = mem.toObject ? mem.toObject() : mem;
				allMemories.push({
					...memObj,
					activityId: activity._id.toString(),
				});
			}
		}

		res.json(allMemories);
	} catch (error) {
		console.error("Get group memories error:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// Add a memory to a specific activity in a group
app.post("/api/groups/:groupId/memories", async (req, res) => {
	const { activityId, images, title } = req.body;

	if (!activityId) {
		return res.status(400).json({ error: "Missing required field: activityId" });
	}
	if (!images || !Array.isArray(images) || images.length === 0) {
		return res.status(400).json({ error: "Missing images array" });
	}

	try {
		const uploadedImages = await uploadArrayDataUris(images, "memories");
		const group = await Group.findById(req.params.groupId);
		if (!group) return res.status(404).json({ error: "Group not found" });

		const activity = group.activities.id(activityId);
		if (!activity) return res.status(404).json({ error: "Activity not found" });

		const newMemory = {
			title: title || "Untitled Memory",
			images: uploadedImages,
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		activity.memories.push(newMemory);
		await group.save();

		const created = activity.memories[activity.memories.length - 1];
		const createdObj = created.toObject ? created.toObject() : created;

		res.status(201).json({
			...createdObj,
			activityId: activity._id.toString(),
		});
	} catch (error) {
		console.error("Add memory error:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// Update a memory (search across all activities within the group)
app.put("/api/groups/:groupId/memories/:memoryId", async (req, res) => {
	try {
		const group = await Group.findById(req.params.groupId);
		if (!group) return res.status(404).json({ error: "Group not found" });

		let foundActivity = null;
		let foundMemory = null;

		for (const activity of group.activities || []) {
			const mem = activity.memories.id(req.params.memoryId);
			if (mem) {
				foundActivity = activity;
				foundMemory = mem;
				break;
			}
		}

		if (!foundMemory) return res.status(404).json({ error: "Memory not found" });

		if (req.body.images && Array.isArray(req.body.images)) {
		foundMemory.images = await uploadArrayDataUris(req.body.images, "memories");
		}
		if (req.body.title) {
			foundMemory.title = req.body.title;
		}
		foundMemory.updatedAt = new Date();

		await group.save();

		const memObj = foundMemory.toObject ? foundMemory.toObject() : foundMemory;
		res.json({
			...memObj,
			activityId: foundActivity._id.toString(),
		});
	} catch (error) {
		console.error("Update memory error:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// Delete a memory (search across all activities within the group)
app.delete("/api/groups/:groupId/memories/:memoryId", async (req, res) => {
	try {
		const group = await Group.findById(req.params.groupId);
		if (!group) return res.status(404).json({ error: "Group not found" });

		let removed = false;

		for (const activity of group.activities || []) {
			const mem = activity.memories.id(req.params.memoryId);
			if (mem) {
				mem.deleteOne();
				removed = true;
				break;
			}
		}

		if (!removed) return res.status(404).json({ error: "Memory not found" });

		await group.save();
		res.sendStatus(204);
	} catch (error) {
		console.error("Delete memory error:", error);
		res.status(500).json({ error: "Internal server error" });
	}
});
/*
// Catchall for unspecified routes (Express sends 404 anyways, but changing HTML for JSON with error property)
app.use((req, res, next) => {
	res.status(404).json({ error: "Path not found" });
});
*/
app.post("/api/extract-link-details", async (req, res) => {
	const { link } = req.body;
	if (!link) return res.status(400).json({ error: "Link is required" });

	let browser = null;
	try {
		// 1. Launch Browser
		browser = await puppeteer.launch({ headless: "new" });
		const page = await browser.newPage();

		// Set timeout to 15s to be faster, and realistic user agent
		await page.setUserAgent(
			"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36",
		);

		// Go to page
		await page.goto(link, { waitUntil: "domcontentloaded", timeout: 15000 });

		// 2. Extract clean text and Main Image
		const pageData = await page.evaluate(() => {
			// Get main visible text
			const text = document.body.innerText || "";

			// Try to find the best "preview" image
			const ogImage = document.querySelector('meta[property="og:image"]')?.content;
			const twitterImage = document.querySelector('meta[name="twitter:image"]')?.content;
			const firstImg = document.querySelector("img")?.src;

			return {
				text: text.substring(0, 15000), // Get first 15k chars
				image: ogImage || twitterImage || firstImg || "",
			};
		});

		// If text is too short, it might be unparseable or blocked
		if (pageData.text.length < 50) {
			throw new Error("Page content empty or blocked");
		}

		// 3. Send to OpenAI
		const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

		const prompt = `
            You are an assistant that extracts travel/place details from article text.
            
            Task: Analyze the text below.
            If the text describes a specific place (restaurant, cafe, park, museum, etc.), extract:
            - "name": The name of the place.
            - "location": The city/address.
            - "highlights": Array of 3 short highlights (max 5 words each).
            - "hashtags": A comma-separated string of tags.
            
            If the text is NOT about a place or you cannot extract these details, return JSON with "error": "link not parsable".

            Raw Text:
            ${pageData.text}
        `;

		const completion = await openai.chat.completions.create({
			messages: [
				{ role: "system", content: "You are a helpful assistant that extracts structured JSON data." },
				{ role: "user", content: prompt },
			],
			model: "gpt-4o-mini",
			response_format: { type: "json_object" },
		});

		const content = completion.choices[0].message.content;
		const data = JSON.parse(content);

		if (data.error) {
			return res.status(422).json({ error: "Link not parsable (no place found)" });
		}

		res.json({
			...data,
			photo: pageData.image,
		});
	} catch (error) {
		console.error("Extraction error:", error);
		res.status(500).json({ error: "Could not parse link. Website might be private or blocking access." });
	} finally {
		if (browser) await browser.close();
	}
});

// Catchall for unspecified routes (Express sends 404 anyways, but changing HTML for JSON with error property)
app.use((req, res, next) => {
	res.status(404).json({ error: "Path not found" });
});

app.listen(process.env.PORT || 8000, () => {
	console.log(`Express app listening at http://localhost:${process.env.PORT || 8000}`);
});
