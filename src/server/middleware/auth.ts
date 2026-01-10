import { eq } from "drizzle-orm";
import { db } from "../db";
import { sessions, users } from "../db/schema";

export interface AuthenticatedUser {
    id: string;
    email: string;
    role: "STUDENT" | "AGENT" | "COLLEGE" | "ADMIN";
    collegeId: string | null;
    fullName: string;
}

/**
 * Get user from session token
 */
export async function getUserFromToken(
    token: string,
): Promise<AuthenticatedUser | null> {
    try {
        // Find session
        const sessionResult = await db
            .select()
            .from(sessions)
            .where(eq(sessions.token, token))
            .limit(1);

        if (sessionResult.length === 0) {
            return null;
        }

        const session = sessionResult[0];

        // Check if session is expired
        if (new Date(session.expiresAt) < new Date()) {
            // Delete expired session
            await db.delete(sessions).where(eq(sessions.id, session.id));
            return null;
        }

        // Get user
        const userResult = await db
            .select()
            .from(users)
            .where(eq(users.id, session.userId))
            .limit(1);

        if (userResult.length === 0) {
            return null;
        }

        const user = userResult[0];

        if (!user.isActive) {
            return null;
        }

        return {
            id: user.id,
            email: user.email,
            role: user.role,
            collegeId: user.collegeId,
            fullName: user.fullName,
        };
    } catch (error) {
        console.error("Auth error:", error);
        return null;
    }
}

/**
 * Extract session token from request headers or cookies
 */
export function extractToken(request: Request): string | null {
    // Try Authorization header first
    const authHeader = request.headers.get("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
        return authHeader.substring(7);
    }

    // Try cookie
    const cookie = request.headers.get("Cookie");
    if (cookie) {
        const match = cookie.match(/session=([^;]+)/);
        if (match) {
            return match[1];
        }
    }

    return null;
}

/**
 * Authenticate request and return user
 */
export async function authenticateRequest(
    request: Request,
): Promise<AuthenticatedUser | null> {
    const token = extractToken(request);
    if (!token) {
        return null;
    }

    return await getUserFromToken(token);
}

/**
 * Create error response for unauthorized access
 */
export function unauthorizedResponse(message: string = "Unauthorized") {
    return new Response(JSON.stringify({ error: message }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
    });
}

/**
 * Create error response for forbidden access
 */
export function forbiddenResponse(message: string = "Forbidden") {
    return new Response(JSON.stringify({ error: message }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
    });
}
