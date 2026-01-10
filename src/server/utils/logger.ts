import { db } from "../db";
import { activityLogs, type NewActivityLog } from "../db/schema";

export interface LogActivityOptions {
    userId?: string;
    collegeId?: string;
    action: string;
    entityType?: string;
    entityId?: string;
    details?: unknown;
    ipAddress?: string;
    userAgent?: string;
}

export async function logActivity(options: LogActivityOptions) {
    try {
        const logEntry: NewActivityLog = {
            userId: options.userId,
            collegeId: options.collegeId,
            action: options.action,
            entityType: options.entityType,
            entityId: options.entityId,
            details: options.details ? JSON.stringify(options.details) : undefined,
            ipAddress: options.ipAddress,
            userAgent: options.userAgent,
        };

        await db.insert(activityLogs).values(logEntry);
        return { success: true };
    } catch (error) {
        console.error("Activity log error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}

// Common activity actions
export const ActivityActions = {
    // Auth
    USER_LOGIN: "user.login",
    USER_LOGOUT: "user.logout",
    USER_REGISTER: "user.register",

    // Students
    STUDENT_CREATE: "student.create",
    STUDENT_UPDATE: "student.update",
    STUDENT_DELETE: "student.delete",

    // Applications
    APPLICATION_CREATE: "application.create",
    APPLICATION_UPDATE: "application.update",
    APPLICATION_STATUS_CHANGE: "application.status_change",

    // Documents
    DOCUMENT_UPLOAD: "document.upload",
    DOCUMENT_DELETE: "document.delete",
    DOCUMENT_DOWNLOAD: "document.download",

    // Payments
    PAYMENT_CREATE: "payment.create",
    PAYMENT_SUCCESS: "payment.success",
    PAYMENT_FAILED: "payment.failed",

    // Seats
    SEAT_ALLOCATE: "seat.allocate",
    SEAT_RELEASE: "seat.release",

    // College
    COLLEGE_UPDATE: "college.update",
    COLLEGE_ROLE_UPDATE: "college.role_update",
} as const;
