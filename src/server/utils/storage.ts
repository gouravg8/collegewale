import {
    DeleteObjectCommand,
    GetObjectCommand,
    PutObjectCommand,
    S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { existsSync } from "fs";
import { mkdir, unlink, writeFile } from "fs/promises";
import { join } from "path";

const STORAGE_MODE = process.env.STORAGE_MODE || "local";
const LOCAL_STORAGE_PATH = process.env.LOCAL_STORAGE_PATH || "./uploads";

// Cloudflare R2 client (for production)
const r2Client =
    STORAGE_MODE === "r2" &&
        process.env.R2_ACCOUNT_ID &&
        process.env.R2_ACCESS_KEY_ID &&
        process.env.R2_SECRET_ACCESS_KEY
        ? new S3Client({
            region: "auto",
            endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
            credentials: {
                accessKeyId: process.env.R2_ACCESS_KEY_ID,
                secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
            },
        })
        : null;

export interface UploadFileOptions {
    key: string;
    file: Buffer;
    contentType: string;
    metadata?: Record<string, string>;
}

export interface UploadResult {
    success: boolean;
    key?: string;
    url?: string;
    error?: string;
}

// Upload file to storage (R2 or local FS)
export async function uploadFile(
    options: UploadFileOptions,
): Promise<UploadResult> {
    try {
        if (STORAGE_MODE === "r2" && r2Client && process.env.R2_BUCKET_NAME) {
            // Upload to Cloudflare R2
            const command = new PutObjectCommand({
                Bucket: process.env.R2_BUCKET_NAME,
                Key: options.key,
                Body: options.file,
                ContentType: options.contentType,
                Metadata: options.metadata,
            });

            await r2Client.send(command);

            const url = process.env.R2_PUBLIC_URL
                ? `${process.env.R2_PUBLIC_URL}/${options.key}`
                : undefined;

            return { success: true, key: options.key, url };
        } else {
            // Upload to local filesystem
            const uploadDir = LOCAL_STORAGE_PATH;

            // Create upload directory if it doesn't exist
            if (!existsSync(uploadDir)) {
                await mkdir(uploadDir, { recursive: true });
            }

            const filePath = join(uploadDir, options.key);

            // Ensure subdirectories exist
            const dir = join(uploadDir, ...options.key.split("/").slice(0, -1));
            if (!existsSync(dir)) {
                await mkdir(dir, { recursive: true });
            }

            await writeFile(filePath, options.file);

            return {
                success: true,
                key: options.key,
                url: `/uploads/${options.key}`,
            };
        }
    } catch (error) {
        console.error("File upload error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}

// Generate signed URL for file download (R2 only, local FS returns regular path)
export async function getFileUrl(
    key: string,
    expiresIn: number = 3600,
): Promise<string | null> {
    try {
        if (STORAGE_MODE === "r2" && r2Client && process.env.R2_BUCKET_NAME) {
            // Generate signed URL for R2
            const command = new GetObjectCommand({
                Bucket: process.env.R2_BUCKET_NAME,
                Key: key,
            });

            const url = await getSignedUrl(r2Client, command, { expiresIn });
            return url;
        } else {
            // Return local path
            return `/uploads/${key}`;
        }
    } catch (error) {
        console.error("Get file URL error:", error);
        return null;
    }
}

// Delete file from storage
export async function deleteFile(key: string): Promise<boolean> {
    try {
        if (STORAGE_MODE === "r2" && r2Client && process.env.R2_BUCKET_NAME) {
            // Delete from R2
            const command = new DeleteObjectCommand({
                Bucket: process.env.R2_BUCKET_NAME,
                Key: key,
            });

            await r2Client.send(command);
            return true;
        } else {
            // Delete from local filesystem
            const filePath = join(LOCAL_STORAGE_PATH, key);
            if (existsSync(filePath)) {
                await unlink(filePath);
            }
            return true;
        }
    } catch (error) {
        console.error("File delete error:", error);
        return false;
    }
}

// Validate file type and size
export function validateFile(
    file: { size: number; type: string },
    allowedTypes: string[],
    maxSizeBytes: number = 5 * 1024 * 1024, // 5MB default
): { valid: boolean; error?: string } {
    if (file.size > maxSizeBytes) {
        return {
            valid: false,
            error: `File size exceeds maximum of ${maxSizeBytes / 1024 / 1024}MB`,
        };
    }

    if (!allowedTypes.includes(file.type)) {
        return {
            valid: false,
            error: `File type ${file.type} not allowed. Allowed types: ${allowedTypes.join(", ")}`,
        };
    }

    return { valid: true };
}
