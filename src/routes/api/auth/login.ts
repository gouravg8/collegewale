import { db } from "@/server/db";
import { sessions, users } from "@/server/db/schema";
import { ActivityActions, logActivity } from "@/server/utils/logger";
import { json } from "@tanstack/react-start/server";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

export async function POST({ request }: { request: Request }) {
    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return json({ error: "Email and password are required" }, { status: 400 });
        }

        // Find user by email
        const userResult = await db
            .select()
            .from(users)
            .where(eq(users.email, email.toLowerCase()))
            .limit(1);

        if (userResult.length === 0) {
            return json({ error: "Invalid credentials" }, { status: 401 });
        }

        const user = userResult[0];

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.passwordHash);

        if (!isValidPassword) {
            return json({ error: "Invalid credentials" }, { status: 401 });
        }

        // Check if user is active
        if (!user.isActive) {
            return json({ error: "Account is inactive" }, { status: 403 });
        }

        // Create session
        const sessionToken = nanoid(32);
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

        await db.insert(sessions).values({
            userId: user.id,
            token: sessionToken,
            expiresAt,
        });

        // Log activity
        await logActivity({
            userId: user.id,
            collegeId: user.collegeId || undefined,
            action: ActivityActions.USER_LOGIN,
            ipAddress: request.headers.get("x-forwarded-for") || undefined,
            userAgent: request.headers.get("user-agent") || undefined,
        });

        // Return session and user info
        return json({
            session: {
                token: sessionToken,
                expiresAt: expiresAt.toISOString(),
            },
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                fullName: user.fullName,
                collegeId: user.collegeId,
            },
        });
    } catch (error) {
        console.error("Login error:", error);
        return json({ error: "Internal server error" }, { status: 500 });
    }
}
