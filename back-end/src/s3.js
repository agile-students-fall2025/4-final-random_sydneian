import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "node:crypto";

const s3Client = new S3Client({
	region: process.env.AWS_REGION,
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	},
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

/**
 * Generate a unique filename for S3
 * @param {string} originalName - Original filename
 * @param {string} folder - Folder path in S3 (e.g., 'profiles', 'groups', 'activities', 'memories')
 * @returns {string} Unique filename with path
 */
export function generateUniqueFileName(originalName, folder = "") {
	const timestamp = Date.now();
	const randomString = crypto.randomBytes(8).toString("hex");
	const extension = originalName.split(".").pop();
	const safeName = originalName.replace(/[^a-zA-Z0-9.]/g, "_");
	const fileName = `${timestamp}-${randomString}-${safeName}`;
	return folder ? `${folder}/${fileName}` : fileName;
}

export async function uploadToS3(fileBuffer, fileName, mimeType) {
	const command = new PutObjectCommand({
		Bucket: BUCKET_NAME,
		Key: fileName,
		Body: fileBuffer,
		ContentType: mimeType,
		ACL: "public-read",
	});

	try {
		await s3Client.send(command);
		const url = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
		return url;
	} catch (error) {
		console.error("S3 upload error:", error);
		throw new Error("Failed to upload file to S3");
	}
}

export async function deleteFromS3(fileUrl) {
	try {
		let key = fileUrl;
		if (fileUrl.includes("amazonaws.com/")) {
			key = fileUrl.split("amazonaws.com/")[1];
		}

		const command = new DeleteObjectCommand({
			Bucket: BUCKET_NAME,
			Key: key,
		});

		await s3Client.send(command);
	} catch (error) {
		console.error("S3 delete error:", error);
		throw new Error("Failed to delete file from S3");
	}
}

export async function getPresignedUrl(key, expiresIn = 3600) {
	try {
		const command = new GetObjectCommand({
			Bucket: BUCKET_NAME,
			Key: key,
		});

		const url = await getSignedUrl(s3Client, command, { expiresIn });
		return url;
	} catch (error) {
		console.error("Presigned URL error:", error);
		throw new Error("Failed to generate presigned URL");
	}
}

export async function uploadMultipleToS3(files, folder = "") {
	try {
		const uploadPromises = files.map((file) => {
			const fileName = generateUniqueFileName(file.originalName, folder);
			return uploadToS3(file.buffer, fileName, file.mimeType);
		});

		const urls = await Promise.all(uploadPromises);
		return urls;
	} catch (error) {
		console.error("Multiple upload error:", error);
		throw new Error("Failed to upload files to S3");
	}
}

export async function deleteMultipleFromS3(fileUrls) {
	try {
		const deletePromises = fileUrls.map((url) => deleteFromS3(url));
		await Promise.all(deletePromises);
	} catch (error) {
		console.error("Multiple delete error:", error);
		throw new Error("Failed to delete files from S3");
	}
}
