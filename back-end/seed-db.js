import { User, Group } from "./src/db.js";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import mongoose from "mongoose";

const COMMON_PASSWORD = "password123";

const users = [
	{ username: "Alice", email: "alice@example.com", pic: "https://i.pravatar.cc/150?img=1" },
	{ username: "Bob", email: "bob@example.com", pic: "https://i.pravatar.cc/150?img=12" },
	{ username: "Charlie", email: "charlie@example.com", pic: "https://i.pravatar.cc/150?img=13" },
	{ username: "Diana", email: "diana@example.com", pic: "https://i.pravatar.cc/150?img=5" },
	{ username: "Eve", email: "eve@example.com", pic: "https://i.pravatar.cc/150?img=9" },
];

const groupTemplates = [
	{ name: "NYC Explorers", desc: "Discovering the best spots in New York City" },
	{ name: "Foodies United", desc: "Restaurant hopping and culinary adventures" },
	{ name: "Weekend Warriors", desc: "Making the most of every weekend" },
	{ name: "Coffee Enthusiasts", desc: "Finding the best coffee shops in town" },
	{ name: "Art & Culture", desc: "Museums, galleries, and cultural events" },
	{ name: "Night Owls", desc: "Late night adventures and activities" },
	{ name: "Fitness Friends", desc: "Staying active and healthy together" },
	{ name: "Music Lovers", desc: "Concerts, shows, and live music venues" },
	{ name: "Book Club Hangouts", desc: "Cozy spots for reading and discussing books" },
	{ name: "Adventure Seekers", desc: "Trying new and exciting experiences" },
];

const activities = [
	{ name: "Brooklyn Bridge Walk", category: "Outdoor", tags: ["scenic", "exercise", "iconic"] },
	{ name: "Central Park Picnic", category: "Outdoor", tags: ["relaxing", "nature", "food"] },
	{ name: "MoMA Visit", category: "Cultural", tags: ["art", "indoor", "educational"] },
	{ name: "Joe's Pizza", category: "Restaurant", tags: ["casual", "famous", "cheap-eats"] },
	{ name: "Levain Bakery", category: "Cafe", tags: ["dessert", "cookies", "sweet"] },
	{ name: "Times Square Night", category: "Entertainment", tags: ["touristy", "lights", "bustling"] },
	{ name: "High Line Stroll", category: "Outdoor", tags: ["urban", "park", "modern"] },
	{ name: "Smorgasburg", category: "Food Market", tags: ["variety", "outdoor", "weekend"] },
	{ name: "Comedy Cellar", category: "Entertainment", tags: ["standup", "nightlife", "fun"] },
	{ name: "Whitney Museum", category: "Cultural", tags: ["art", "contemporary", "views"] },
	{ name: "Shake Shack", category: "Restaurant", tags: ["burgers", "casual", "popular"] },
	{ name: "Brooklyn Brewery", category: "Bar", tags: ["craft-beer", "tours", "industrial"] },
	{ name: "Coney Island", category: "Outdoor", tags: ["beach", "rides", "summer"] },
	{ name: "Grand Central Terminal", category: "Landmark", tags: ["architecture", "historic", "indoor"] },
	{ name: "Katz's Delicatessen", category: "Restaurant", tags: ["deli", "iconic", "pastrami"] },
	{ name: "Bryant Park", category: "Outdoor", tags: ["park", "events", "relaxing"] },
	{ name: "The Met", category: "Cultural", tags: ["museum", "art", "huge"] },
	{ name: "Chelsea Market", category: "Food Market", tags: ["indoor", "shopping", "variety"] },
	{ name: "Williamsburg Flea", category: "Shopping", tags: ["vintage", "outdoor", "unique"] },
	{ name: "Top of the Rock", category: "Landmark", tags: ["views", "observation", "expensive"] },
];

const memoryTitles = [
	"Best Day Ever!",
	"What a View!",
	"So Much Fun",
	"Can't Believe We Did This",
	"Making Memories",
	"Perfect Weather",
	"Had to Come Back",
	"Group Photo!",
	"Sunset Vibes",
	"Amazing Experience",
	"Worth the Wait",
	"Unexpected Surprise",
	"Beautiful Moment",
	"Great Company",
	"Picture Perfect",
];

const memoryImages = [
	"https://picsum.photos/seed/mem1/800/600",
	"https://picsum.photos/seed/mem2/800/600",
	"https://picsum.photos/seed/mem3/800/600",
	"https://picsum.photos/seed/mem4/800/600",
	"https://picsum.photos/seed/mem5/800/600",
	"https://picsum.photos/seed/mem6/800/600",
	"https://picsum.photos/seed/mem7/800/600",
	"https://picsum.photos/seed/mem8/800/600",
	"https://picsum.photos/seed/mem9/800/600",
	"https://picsum.photos/seed/mem10/800/600",
	"https://picsum.photos/seed/mem11/800/600",
	"https://picsum.photos/seed/mem12/800/600",
	"https://picsum.photos/seed/mem13/800/600",
	"https://picsum.photos/seed/mem14/800/600",
	"https://picsum.photos/seed/mem15/800/600",
	"https://picsum.photos/seed/mem16/800/600",
	"https://picsum.photos/seed/mem17/800/600",
	"https://picsum.photos/seed/mem18/800/600",
	"https://picsum.photos/seed/mem19/800/600",
	"https://picsum.photos/seed/mem20/800/600",
];

function getRandomItems(array, count) {
	const shuffled = [...array].sort(() => 0.5 - Math.random());
	return shuffled.slice(0, count);
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function seedDatabase() {
	try {
		await new Promise((resolve) => {
			if (mongoose.connection.readyState === 1) {
				resolve();
			} else {
				mongoose.connection.once("connected", resolve);
			}
		});

		console.log("Connected to MongoDB");
		console.log("Cleaning database...\n");

		await User.deleteMany({});
		await Group.deleteMany({});

		console.log("Database cleaned\n");
		console.log("Creating 5 users...\n");

		const hashedPassword = bcrypt.hashSync(COMMON_PASSWORD, 10);
		const createdUsers = [];

		for (const userData of users) {
			const user = new User({
				username: userData.username,
				password: hashedPassword,
				email: userData.email,
				emailVerified: true,
				profilePicture: userData.pic,
				preferences: {
					notifications: {
						eventNextDay: true,
						newEventAdded: true,
					},
					theme: ["light", "dark", "pastel"][getRandomInt(0, 2)],
				},
			});
			await user.save();
			createdUsers.push(user);
			console.log(`${user.username} (${user.email})`);
		}

		console.log("\n📦 Creating 5 groups (with overlapping members)...\n");

		const createdGroups = [];

		for (let i = 0; i < 5; i++) {
			const template = groupTemplates[i];

			const numMembers = getRandomInt(2, 4);
			const memberUsers = getRandomItems(createdUsers, numMembers);
			const memberIds = memberUsers.map((u) => u._id);

			const numInvited = getRandomInt(0, 2);
			const invitedUsers = getRandomItems(
				createdUsers.filter((u) => !memberIds.includes(u._id)),
				numInvited,
			);
			const invitedIds = invitedUsers.map((u) => u._id);

			const group = new Group({
				name: template.name,
				desc: template.desc,
				icon: `https://picsum.photos/seed/group${i}/128/128`,
				members: memberIds,
				invitedMembers: invitedIds,
				inviteCode: crypto.randomBytes(4).toString("hex").toUpperCase(),
				activities: [],
			});

			console.log(`${group.name}`);
			console.log(`Members: ${memberUsers.map((u) => u.username).join(", ")}`);
			if (invitedUsers.length > 0) {
				console.log(`Invited: ${invitedUsers.map((u) => u.username).join(", ")}`);
			}
			console.log(`Invite Code: ${group.inviteCode}`);

			const groupActivities = getRandomItems(activities, 10);

			for (let j = 0; j < groupActivities.length; j++) {
				const actTemplate = groupActivities[j];
				const isDone = Math.random() > 0.6;

				const activity = {
					name: actTemplate.name,
					category: actTemplate.category,
					tags: actTemplate.tags,
					likes: getRandomItems(memberIds, getRandomInt(0, memberIds.length)),
					location: {
						type: "Point",
						coordinates: [-74.006 + Math.random() * 0.1, 40.7128 + Math.random() * 0.1],
					},
					memories: [],
					done: isDone,
				};

				if (isDone && Math.random() > 0.5) {
					const numMemories = getRandomInt(1, 3);
					for (let k = 0; k < numMemories; k++) {
						const numImages = getRandomInt(1, 4);
						activity.memories.push({
							title: memoryTitles[getRandomInt(0, memoryTitles.length - 1)],
							images: getRandomItems(memoryImages, numImages),
							createdAt: new Date(Date.now() - getRandomInt(1, 30) * 24 * 60 * 60 * 1000),
							updatedAt: new Date(Date.now() - getRandomInt(1, 30) * 24 * 60 * 60 * 1000),
						});
					}
				}

				group.activities.push(activity);
			}

			await group.save();
			createdGroups.push(group);
			console.log(`      ✓ Added ${group.activities.length} activities`);
			const totalMemories = group.activities.reduce((sum, act) => sum + act.memories.length, 0);
			if (totalMemories > 0) {
				console.log(`      ✓ Added ${totalMemories} memories\n`);
			} else {
				console.log("");
			}
		}

		console.log("Database seeded successfully!\n");
		console.log("Users:");
		for (const user of createdUsers) {
			const memberOfGroups = createdGroups.filter((g) => g.members.some((m) => m.toString() === user._id.toString()));
			const invitedToGroups = createdGroups.filter((g) =>
				g.invitedMembers.some((m) => m.toString() === user._id.toString()),
			);
			console.log(`${user.username} - ${memberOfGroups.length} groups, ${invitedToGroups.length} invites`);
		}

		console.log(`Total users: ${createdUsers.length}`);
		console.log(`Total groups: ${createdGroups.length}`);
		const totalActivities = createdGroups.reduce((sum, g) => sum + g.activities.length, 0);
		console.log(`Total activities: ${totalActivities}`);
		const totalMemories = createdGroups.reduce(
			(sum, g) => sum + g.activities.reduce((s, a) => s + a.memories.length, 0),
			0,
		);
		console.log(`Total memories: ${totalMemories}`);

		process.exit(0);
	} catch (error) {
		console.error("Error seeding database:", error);
		process.exit(1);
	}
}

seedDatabase();
