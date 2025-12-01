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

		// Create user "Nur"
		const hashedPassword = bcrypt.hashSync("password123", 10);
		
		let nur = await User.findOne({ username: "Nur" });
		if (!nur) {
			nur = new User({
				username: "Nur",
				password: hashedPassword,
				email: "nur@example.com",
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
			await nur.save();
			console.log("Created user:", nur.username, "with ID:", nur._id.toString());
		} else {
			console.log("User already exists:", nur.username, "with ID:", nur._id.toString());
		}

		// Create groups with Nur as a member
		const group1 = await Group.findOne({ name: "Nur's Group 1" });
		if (!group1) {
			const newGroup1 = new Group({
				name: "Nur's Group 1",
				desc: "First group for Nur",
				icon: "https://picsum.photos/64",
				members: [nur._id],
				invitedMembers: [],
				activities: [],
			});
			await newGroup1.save();
			console.log("Created group:", newGroup1.name, "with ID:", newGroup1._id.toString());
		}

		const group2 = await Group.findOne({ name: "Nur's Group 2" });
		if (!group2) {
			const newGroup2 = new Group({
				name: "Nur's Group 2",
				desc: "Second group for Nur",
				icon: "https://picsum.photos/64",
				members: [nur._id],
				invitedMembers: [],
				activities: [],
			});
			await newGroup2.save();
			console.log("Created group:", newGroup2.name, "with ID:", newGroup2._id.toString());
		}

		// Create a group where Nur is invited
		const invitedGroup = await Group.findOne({ name: "Invited Group for Nur" });
		if (!invitedGroup) {
			const newInvitedGroup = new Group({
				name: "Invited Group for Nur",
				desc: "A group where Nur is invited",
				icon: "https://picsum.photos/64",
				members: [],
				invitedMembers: [nur._id],
				activities: [],
			});
			await newInvitedGroup.save();
			console.log("Created invited group:", newInvitedGroup.name, "with ID:", newInvitedGroup._id.toString());
		}

		console.log("\n✅ Database seeded successfully!");
		console.log("You can now login with:");
		console.log("  Username: Nur");
		console.log("  Password: password123");
		console.log("\nUser ID (for JWT):", nur._id.toString());
		
		process.exit(0);
	} catch (error) {
		console.error("Error seeding database:", error);
		process.exit(1);
	}
}

seedDatabase();

