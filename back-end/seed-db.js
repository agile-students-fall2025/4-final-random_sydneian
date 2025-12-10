import { User, Group } from "./src/db.js";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import mongoose from "mongoose";
import https from "node:https";
import { uploadToS3, generateUniqueFileName } from "./src/s3.js";

const COMMON_PASSWORD = "password123";

async function downloadImage(url) {
	return new Promise((resolve, reject) => {
		https
			.get(url, (res) => {
				if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307 || res.statusCode === 308) {
					downloadImage(res.headers.location).then(resolve).catch(reject);
					return;
				}
				if (res.statusCode !== 200) {
					reject(new Error(`Failed to download: ${res.statusCode}`));
					return;
				}
				const chunks = [];
				res.on("data", (chunk) => chunks.push(chunk));
				res.on("end", () => resolve(Buffer.concat(chunks)));
			})
			.on("error", reject);
	});
}

async function uploadImageToS3(imageUrl, folder) {
	try {
		console.log(`  Downloading ${imageUrl}...`);
		const buffer = await downloadImage(imageUrl);
		const fileName = generateUniqueFileName("image.jpg", folder);
		const s3Url = await uploadToS3(buffer, fileName, "image/jpeg");
		console.log(`  ✓ Uploaded to S3`);
		return s3Url;
	} catch (error) {
		console.error(`  ✗ Failed to upload ${imageUrl}:`, error.message);
		throw error;
	}
}

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

const activityImages = [
	"https://picsum.photos/seed/act1/640/480",
	"https://picsum.photos/seed/act2/640/480",
	"https://picsum.photos/seed/act3/640/480",
	"https://picsum.photos/seed/act4/640/480",
	"https://picsum.photos/seed/act5/640/480",
	"https://picsum.photos/seed/act6/640/480",
	"https://picsum.photos/seed/act7/640/480",
	"https://picsum.photos/seed/act8/640/480",
	"https://picsum.photos/seed/act9/640/480",
	"https://picsum.photos/seed/act10/640/480",
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

		console.log("Connected to MongoDB\n");

		// await User.deleteMany({});
		// await Group.deleteMany({});
		// console.log("Cleared users and groups\n");

		const hashedPassword = bcrypt.hashSync(COMMON_PASSWORD, 10);
		const createdUsers = [];

		console.log("=== SEEDING USERS ===\n");
		for (const userData of users) {
			let user = await User.findOne({ email: userData.email });

			console.log(`Processing user: ${userData.username}`);
			const s3ProfilePic = await uploadImageToS3(userData.pic, "profiles");

			if (user) {
				user.username = userData.username;
				user.password = hashedPassword;
				user.emailVerified = true;
				user.profilePicture = s3ProfilePic;
				if (!user.preferences) {
					user.preferences = {
						notifications: {
							eventNextDay: true,
							newEventAdded: true,
						},
						theme: ["light", "dark", "pastel"][getRandomInt(0, 2)],
					};
				}
				await user.save();
				console.log(`✓ Updated: ${user.username}\n`);
			} else {
				user = new User({
					username: userData.username,
					password: hashedPassword,
					email: userData.email,
					emailVerified: true,
					profilePicture: s3ProfilePic,
					preferences: {
						notifications: {
							eventNextDay: true,
							newEventAdded: true,
						},
						theme: ["light", "dark", "pastel"][getRandomInt(0, 2)],
					},
				});
				await user.save();
				console.log(`✓ Created: ${user.username}\n`);
			}
			createdUsers.push(user);
		}

		console.log("\n=== SEEDING GROUPS ===\n");

		const existingGroups = await Group.find({});
		let updatedCount = 0;

		for (const group of existingGroups) {
			let needsUpdate = false;

			if (!group.owner && group.members.length > 0) {
				group.owner = group.members[0];
				needsUpdate = true;
			}

			if (!group.admins || group.admins.length === 0) {
				if (group.owner) {
					group.admins = [group.owner];
					needsUpdate = true;
				} else if (group.members.length > 0) {
					group.admins = [group.members[0]];
					needsUpdate = true;
				}
			}

			if (group.owner && (!group.admins || !group.admins.some((a) => a.toString() === group.owner.toString()))) {
				if (!group.admins) {
					group.admins = [];
				}
				group.admins.push(group.owner);
				needsUpdate = true;
			}

			if (needsUpdate) {
				await group.save();
				updatedCount++;
			}
		}

		if (updatedCount > 0) {
			console.log(`Updated ${updatedCount} existing groups\n`);
		}

		const createdGroups = [];

		for (let i = 0; i < 5; i++) {
			const template = groupTemplates[i];
			let group = await Group.findOne({ name: template.name });

			const numMembers = getRandomInt(2, 4);
			const memberUsers = getRandomItems(createdUsers, numMembers);
			const memberIds = memberUsers.map((u) => u._id);
			const ownerId = memberIds[0];

			const numInvited = getRandomInt(0, 2);
			const invitedUsers = getRandomItems(
				createdUsers.filter((u) => !memberIds.includes(u._id)),
				numInvited,
			);
			const invitedIds = invitedUsers.map((u) => u._id);

			console.log(`\nProcessing group: ${template.name}`);
			const groupIconUrl = `https://picsum.photos/seed/group${i}/128/128`;
			const s3GroupIcon = await uploadImageToS3(groupIconUrl, "groups");

			if (group) {
				if (!group.desc) group.desc = template.desc;
				group.icon = s3GroupIcon;
				group.members = memberIds;
				group.invitedMembers = invitedIds;

				if (!group.owner) {
					group.owner = ownerId;
				}

				if (!group.admins || group.admins.length === 0) {
					group.admins = [group.owner];
				} else if (!group.admins.some((a) => a.toString() === group.owner.toString())) {
					group.admins.push(group.owner);
				}

				if (!group.inviteCode) {
					group.inviteCode = crypto.randomBytes(4).toString("hex").toUpperCase();
				}

				if (!group.activities || group.activities.length === 0) {
					group.activities = [];
				}

				console.log(`✓ Updated: ${group.name}`);
			} else {
				group = new Group({
					name: template.name,
					desc: template.desc,
					icon: s3GroupIcon,
					owner: ownerId,
					members: memberIds,
					admins: [ownerId],
					invitedMembers: invitedIds,
					inviteCode: crypto.randomBytes(4).toString("hex").toUpperCase(),
					activities: [],
				});

				console.log(`✓ Created: ${group.name}`);
			}

			console.log(`  Owner: ${memberUsers[0].username}`);
			console.log(`  Members: ${memberUsers.map((u) => u.username).join(", ")}`);
			if (invitedUsers.length > 0) {
				console.log(`  Invited: ${invitedUsers.map((u) => u.username).join(", ")}`);
			}
			console.log(`  Invite Code: ${group.inviteCode}`);

			if (!group.activities || group.activities.length === 0) {
				console.log(`\n  Seeding activities...`);
				const groupActivities = getRandomItems(activities, 10);

				for (let j = 0; j < groupActivities.length; j++) {
					const actTemplate = groupActivities[j];
					const isDone = Math.random() > 0.6;

					console.log(`    Activity ${j + 1}/${groupActivities.length}: ${actTemplate.name}`);
					const numActivityImages = getRandomInt(1, 3);
					const selectedImages = getRandomItems(activityImages, numActivityImages);
					const activityImageUrls = [];
					for (const imgUrl of selectedImages) {
						const s3ImgUrl = await uploadImageToS3(imgUrl, "activities");
						activityImageUrls.push(s3ImgUrl);
					}

					const activity = {
						name: actTemplate.name,
						images: activityImageUrls,
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
							console.log(`      Memory ${k + 1} for ${actTemplate.name}`);
							const numImages = getRandomInt(1, 4);
							const selectedMemImages = getRandomItems(memoryImages, numImages);
							const memImageUrls = [];
							for (const memUrl of selectedMemImages) {
								const s3MemUrl = await uploadImageToS3(memUrl, "memories");
								memImageUrls.push(s3MemUrl);
							}

							activity.memories.push({
								title: memoryTitles[getRandomInt(0, memoryTitles.length - 1)],
								images: memImageUrls,
								createdAt: new Date(Date.now() - getRandomInt(1, 30) * 24 * 60 * 60 * 1000),
								updatedAt: new Date(Date.now() - getRandomInt(1, 30) * 24 * 60 * 60 * 1000),
							});
						}
					}

					group.activities.push(activity);
				}
			} else {
				console.log(`  Checking existing activities for missing images...`);
				for (let j = 0; j < group.activities.length; j++) {
					const activity = group.activities[j];
					
					if (!activity.images || activity.images.length === 0) {
						console.log(`    Adding images to ${activity.name}`);
						const numActImages = getRandomInt(1, 3);
						const selectedImages = getRandomItems(activityImages, numActImages);
						const activityImageUrls = [];
						for (const imgUrl of selectedImages) {
							const s3ImgUrl = await uploadImageToS3(imgUrl, "activities");
							activityImageUrls.push(s3ImgUrl);
						}
						activity.images = activityImageUrls;
					}

					if (activity.done && activity.memories.length === 0 && Math.random() > 0.5) {
						const numMemories = getRandomInt(1, 3);
						for (let k = 0; k < numMemories; k++) {
							console.log(`      Adding memory ${k + 1} to ${activity.name}`);
							const numImages = getRandomInt(1, 4);
							const selectedMemImages = getRandomItems(memoryImages, numImages);
							const memImageUrls = [];
							for (const memUrl of selectedMemImages) {
								const s3MemUrl = await uploadImageToS3(memUrl, "memories");
								memImageUrls.push(s3MemUrl);
							}

							activity.memories.push({
								title: memoryTitles[getRandomInt(0, memoryTitles.length - 1)],
								images: memImageUrls,
								createdAt: new Date(Date.now() - getRandomInt(1, 30) * 24 * 60 * 60 * 1000),
								updatedAt: new Date(Date.now() - getRandomInt(1, 30) * 24 * 60 * 60 * 1000),
							});
						}
					}
				}
			}

			await group.save();
			createdGroups.push(group);

			const totalActivities = group.activities.length;
			const totalMemories = group.activities.reduce((sum, act) => sum + act.memories.length, 0);
			console.log(`  ✓ ${totalActivities} activities, ${totalMemories} memories`);
		}

		const allGroups = await Group.find({});

		console.log("\n=== SEEDING COMPLETE ===\n");
		console.log("Users:");
		for (const user of createdUsers) {
			const memberOfGroups = allGroups.filter((g) => g.members.some((m) => m.toString() === user._id.toString()));
			const invitedToGroups = allGroups.filter((g) =>
				g.invitedMembers.some((m) => m.toString() === user._id.toString()),
			);
			const ownedGroups = allGroups.filter((g) => g.owner && g.owner.toString() === user._id.toString());
			console.log(
				`  ${user.username} - ${memberOfGroups.length} groups, ${invitedToGroups.length} invites, ${ownedGroups.length} owned`,
			);
		}

		console.log(`\nTotal users: ${createdUsers.length}`);
		console.log(`Total groups: ${allGroups.length}`);
		const totalActivities = allGroups.reduce((sum, g) => sum + g.activities.length, 0);
		console.log(`Total activities: ${totalActivities}`);
		const totalMemories = allGroups.reduce(
			(sum, g) => sum + g.activities.reduce((s, a) => s + a.memories.length, 0),
			0,
		);
		console.log(`Total memories: ${totalMemories}`);

		console.log("\nGroups with owners:");
		for (const group of allGroups) {
			const owner = createdUsers.find((u) => u._id.toString() === group.owner?.toString());
			const ownerName = owner ? owner.username : "Unknown";
			console.log(`  ${group.name} - Owner: ${ownerName}`);
		}

		process.exit(0);
	} catch (error) {
		console.error("Error seeding database:", error);
		process.exit(1);
	}
}

seedDatabase();
