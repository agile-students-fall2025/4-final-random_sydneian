import multer from "multer";

// Configure multer to store files in memory
const storage = multer.memoryStorage();

// File filter to only accept images
const fileFilter = (req, file, cb) => {
	const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];

	if (allowedMimeTypes.includes(file.mimetype)) {
		cb(null, true);
	} else {
		cb(new Error("Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed."), false);
	}
};

// Configure multer
const upload = multer({
	storage: storage,
	fileFilter: fileFilter,
	limits: {
		fileSize: 10 * 1024 * 1024, // 10MB limit
	},
});

// Export different upload configurations
export const uploadSingle = upload.single("image"); // For single image upload
export const uploadMultiple = upload.array("images", 10); // For multiple images (max 10)
export const uploadFields = upload.fields([
	{ name: "profilePicture", maxCount: 1 },
	{ name: "groupIcon", maxCount: 1 },
	{ name: "activityImages", maxCount: 5 },
	{ name: "memoryImages", maxCount: 10 },
]);

// Error handler middleware for multer errors
export const handleUploadError = (err, req, res, next) => {
	if (err instanceof multer.MulterError) {
		if (err.code === "LIMIT_FILE_SIZE") {
			return res.status(400).json({ error: "File too large. Maximum size is 10MB." });
		}
		if (err.code === "LIMIT_FILE_COUNT") {
			return res.status(400).json({ error: "Too many files." });
		}
		return res.status(400).json({ error: `Upload error: ${err.message}` });
	} else if (err) {
		return res.status(400).json({ error: err.message });
	}
	next();
};
