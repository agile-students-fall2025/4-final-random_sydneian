import mongoose from "mongoose";

mongoose.connect(process.env.MONGODB_URI).catch((err) => {
	console.error("MongoDB connection error:", err);
	process.exit(1);
});

mongoose.connection.on("connected", () => {
	console.log("Connected to MongoDB Atlas");
});

mongoose.connection.on("error", (err) => {
	console.error("MongoDB connection error:", err);
});

mongoose.connection.on("disconnected", () => {
	console.log("Disconnected from MongoDB");
});

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
		members: [{ type: mongoose.ObjectId, ref: "User" }],
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

export { User, Memory, Activity, Group };
