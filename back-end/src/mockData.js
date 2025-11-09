// Notes:
// - Do not make any assumptions about ids. Treat them as opaque strings.
// - Image URLs should point to copies stored on this filesystem, but currently they are picsum URLs.
// - Check other notes (comments starting with "Note:")

export let users = [
	{
		_id: "user1-id",
		username: "user1",
		email: "user1@example.com",
		// Note: Password is also present in db (salted and hashed), but we never send that
		profilePicture: "https://picsum.photos/64",
		preferences: {
			notifications: {
				eventNextDay: true,
				newEventAdded: true,
				eventNextDay: true,
			},
			theme: "light", // or dark, pastel, high-contrast
		},
	},
	{
		_id: "user2-id",
		username: "user2",
		email: "user2@example.com",
		profilePicture: "https://picsum.photos/64",
		preferences: {
			notifications: {
				eventNextDay: true,
				newEventAdded: true,
				eventNextDay: true,
			},
			theme: "light",
		},
	},
	{
		_id: "user3-id",
		username: "user3",
		email: "user3@example.com",
		profilePicture: "https://picsum.photos/64",
		preferences: {
			notifications: {
				eventNextDay: true,
				newEventAdded: true,
				eventNextDay: true,
			},
			theme: "light",
		},
	},
];

export let groups = [
	{
		_id: "group-syd-id",
		name: "Sydneian",
		desc: "Not actually Sydneians",
		icon: "https://picsum.photos/64",
		members: ["user1-id", "user2-id"],
		invitedMembers: ["user3-id"],
		activities: [
			{
				_id: "activity-rooftop-trivia-id",
				name: "Rooftop Trivia",
				images: ["https://picsum.photos/640/360", "https://picsum.photos/640/360"],
				category: "Restaurant",
				tags: ["sunset", "views"],
				likes: 9,
				location: {
					// GeoJSON (natively supported location format in MongoDB)
					type: "Point",
					coordinates: [0, 0],
				},
				memories: [],
				done: false,
				createdAt: "2025-11-09T00:00:00.000Z",
				updatedAt: "2025-11-09T00:00:00.000Z",
			},
			{
				_id: "activity-pizza-disco-id",
				name: "Pizza Disco",
				images: ["https://picsum.photos/640/360"],
				category: "Pizza",
				tags: ["novel", "interesting"],
				likes: 8,
				location: {
					type: "Point",
					coordinates: [0, 0],
				},
				memories: [],
				done: false,
				createdAt: "2025-10-24T00:00:00.000Z",
				updatedAt: "2025-10-24T00:00:00.000Z",
			},
			{
				// Note: this one is intentionally missing optional fields, to ensure we handle them correctly
				_id: "activity-silent-party-id",
				name: "Silent Party",
				images: [],
				// category: "Restaurant",
				// tags: ["aesthetic", "matcha"],
				likes: 12,
				// location: {
				// 	type: "Point",
				// 	coordinates: [0, 0],
				// },
				memories: [],
				done: false,
				createdAt: "2025-10-18T00:00:00.000Z",
				updatedAt: "2025-10-18T00:00:00.000Z",
			},
			{
				_id: "activity-lorem-cafe-id",
				name: "Lorem Cafe",
				images: ["https://picsum.photos/640/360"],
				category: "Bakery",
				tags: ["aesthetic", "matcha"],
				likes: 10,
				location: {
					type: "Point",
					coordinates: [0, 0],
				},
				memories: [
					{
						_id: "memory-lorem-cafe-id",
						images: ["https://picsum.photos/640/360", "https://picsum.photos/640/360"],
						createdAt: "2025-11-09T00:00:00.000Z",
						updatedAt: "2025-11-09T00:00:00.000Z",
					},
				],
				done: true,
				createdAt: "2025-10-14T00:00:00.000Z",
				updatedAt: "2025-10-14T00:00:00.000Z",
			},
		],
		createdAt: "2025-10-01T00:00:00.000Z",
		updatedAt: "2025-11-09T00:00:00.000Z",
	},
	{
		_id: "group-nyu-id",
		name: "NYU",
		desc: "Certainly one of the unis in the world",
		icon: "https://picsum.photos/64",
		members: ["user1-id"],
		invitedMembers: [],
		activities: [
			// Note: We should handle an empty list of activities too (maybe show an illustration about no activities and encourage adding one)
		],
		createdAt: "2025-11-09T00:00:00.000Z",
		updatedAt: "2025-11-09T00:00:00.000Z",
	},
	{
		_id: "group-third-north-id",
		name: "Third North",
		desc: "A cool place",
		icon: "https://picsum.photos/64",
		members: ["user1-id"],
		invitedMembers: [],
		activities: [],
		createdAt: "2025-11-09T00:00:00.000Z",
		updatedAt: "2025-11-09T00:00:00.000Z",
	},
	{
		_id: "group-sydneian2-id",
		name: "Sydneian2",
		desc: "Another Sydneian wannabe",
		icon: "https://picsum.photos/64",
		members: ["user2-id"],
		invitedMembers: ["user1-id"],
		activities: [
			// Note: Invited members should only be able to see basic group details (name, desc, icon, and maybe members). NOT stuff like activities or their memories.
			{
				_id: "activity-lorem-cafe-id",
				name: "Lorem Cafe",
				images: ["https://picsum.photos/640/360"],
				category: "Bakery",
				tags: ["aesthetic", "matcha"],
				likes: 10,
				location: {
					type: "Point",
					coordinates: [0, 0],
				},
				memories: [
					{
						_id: "memory-lorem-cafe-id",
						images: ["https://picsum.photos/640/360", "https://picsum.photos/640/360"],
						createdAt: "2025-11-09T00:00:00.000Z",
						updatedAt: "2025-11-09T00:00:00.000Z",
					},
				],
				done: true,
				createdAt: "2025-10-14T00:00:00.000Z",
				updatedAt: "2025-10-14T00:00:00.000Z",
			},
		],
		createdAt: "2025-11-09T00:00:00.000Z",
		updatedAt: "2025-11-09T00:00:00.000Z",
	},
	{
		_id: "group-teapots-id",
		name: "The Teapot Society",
		desc: "Only for the poshest, tea loving people",
		icon: "https://picsum.photos/64",
		members: ["user2-id"],
		invitedMembers: ["user1-id"],
		activities: [],
		createdAt: "2025-11-09T00:00:00.000Z",
		updatedAt: "2025-11-09T00:00:00.000Z",
	},
	{
		_id: "group-agilities-id",
		name: "Agile Friends",
		desc: "Friends who are very agile? Idk",
		icon: "https://picsum.photos/64",
		members: ["user2-id"],
		invitedMembers: ["user1-id"],
		activities: [],
		createdAt: "2025-11-09T00:00:00.000Z",
		updatedAt: "2025-11-09T00:00:00.000Z",
	},
];
