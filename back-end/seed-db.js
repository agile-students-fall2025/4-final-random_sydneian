import "./src/db.js";
import { User, Group } from "./src/db.js";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

async function seedDatabase() {
	try {
		// Wait for MongoDB connection
		await new Promise((resolve) => {
			if (mongoose.connection.readyState === 1) {
				resolve();
			} else {
				mongoose.connection.once("connected", resolve);
			}
		});

		console.log("Connected to MongoDB");

		// Create test user
		const hashedPassword = bcrypt.hashSync("random_sydneian", 10);
		
		let user = await User.findOne({ username: "user" });
		if (!user) {
			user = new User({
				username: "user",
				password: hashedPassword,
				email: "user@example.com",
				emailVerified: true,
				profilePicture: "https://picsum.photos/64",
				preferences: {
					notifications: {
						eventNextDay: true,
						newEventAdded: true,
					},
					theme: "light",
				},
			});
			await user.save();
			console.log("Created user:", user.username, "with ID:", user._id.toString());
		} else {
			console.log("User already exists:", user.username, "with ID:", user._id.toString());
		}

		// Create test groups with this user as a member
		const group1 = await Group.findOne({ name: "Test Group 1" });
		if (!group1) {
			const newGroup1 = new Group({
				name: "Test Group 1",
				desc: "A test group for user",
				icon: "https://picsum.photos/64",
				members: [user._id],
				invitedMembers: [],
				activities: [],
			});
			await newGroup1.save();
			console.log("Created group:", newGroup1.name, "with ID:", newGroup1._id.toString());
		}

		const group2 = await Group.findOne({ name: "Test Group 2" });
		if (!group2) {
			const newGroup2 = new Group({
				name: "Test Group 2",
				desc: "Another test group",
				icon: "https://picsum.photos/64",
				members: [user._id],
				invitedMembers: [],
				activities: [],
			});
			await newGroup2.save();
			console.log("Created group:", newGroup2.name, "with ID:", newGroup2._id.toString());
		}

		// Create a group where user is invited
		const invitedGroup = await Group.findOne({ name: "Invited Group" });
		if (!invitedGroup) {
			const newInvitedGroup = new Group({
				name: "Invited Group",
				desc: "A group where user is invited",
				icon: "https://picsum.photos/64",
				members: [],
				invitedMembers: [user._id],
				activities: [],
			});
			await newInvitedGroup.save();
			console.log("Created invited group:", newInvitedGroup.name, "with ID:", newInvitedGroup._id.toString());
		}

		console.log("\n✅ Database seeded successfully!");
		console.log("You can now login with:");
		console.log("  Username: user");
		console.log("  Password: random_sydneian");
		
		process.exit(0);
	} catch (error) {
		console.error("Error seeding database:", error);
		process.exit(1);
	}
}

seedDatabase();

