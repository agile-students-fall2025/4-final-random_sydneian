import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer = null;

async function connectDB() {
    try {
        // If in test mode, use in-memory MongoDB
        if (process.env.NODE_ENV === "test") {
            mongoServer = await MongoMemoryServer.create();
            const uri = mongoServer.getUri();

            await mongoose.connect(uri);
            console.log("Connected to In-Memory MongoDB for testing");
            return;
        }

        // Otherwise connect to real Mongo Atlas
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB Atlas");
    } catch (err) {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    }
}

async function disconnectDB() {
    await mongoose.connection.dropDatabase().catch(() => {});
    await mongoose.connection.close();

    if (mongoServer) {
        await mongoServer.stop();
    }
}

const UserSchema = new mongoose.Schema(
	{
		username: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		emailVerified: { type: Boolean, default: false },
		OTP: String,
		OTPTimestamp: Date,
		profilePicture: String,
		preferences: {
			notifications: {
				eventNextDay: { type: Boolean, default: true },
				newEventAdded: { type: Boolean, default: true },
			},
			theme: { type: String, enum: ["light", "dark", "pastel", "high-contrast"], default: "light" },
		},
	},
	{ timestamps: true },
);

const MemorySchema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		images: [String],
	},
	{ timestamps: true },
);

const ActivitySchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		images: [String],
		category: { type: String, required: true, default: "Uncategorised" },
		tags: [String],
		likes: [{ type: mongoose.ObjectId, ref: "User" }],
		addedBy: { type: mongoose.ObjectId, ref: "User", required: false },
		location: {
			type: { type: String, enum: ["Point"], required: true, default: "Point" },
			coordinates: [Number],
		},
		memories: [MemorySchema],
		done: { type: Boolean, required: true, default: false },
	},
	{ timestamps: true },
);

const GroupSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		desc: String,
		icon: String,
		owner: { type: mongoose.ObjectId, ref: "User", required: true },
		members: [{ type: mongoose.ObjectId, ref: "User" }],
		admins: [{ type: mongoose.ObjectId, ref: "User" }],
		invitedMembers: [{ type: mongoose.ObjectId, ref: "User" }],
		activities: [ActivitySchema],
		inviteCode: { type: String, unique: true, sparse: true },
	},
	{ timestamps: true },
);

const User = mongoose.model("User", UserSchema);
const Memory = mongoose.model("Memory", MemorySchema);
const Activity = mongoose.model("Activity", ActivitySchema);
const Group = mongoose.model("Group", GroupSchema);

export { User, Memory, Activity, Group, connectDB, disconnectDB };
