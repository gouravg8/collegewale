import { db } from "@/server/db";
import { sessions, users } from "@/server/db/schema";
import { ActivityActions, logActivity } from "@/server/utils/logger";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

export async function POST({ request }: { request: Request }) {
    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return new Response(JSON.stringify({ error: "Email and password are required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Find user by email
        const userResult = await db
            .select()
            .from(users)
            .where(eq(users.email, email.toLowerCase()))
            .limit(1);

        if (userResult.length === 0) {
            return new Response(JSON.stringify({ error: "Invalid credentials" }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
            });
        }

        const user = userResult[0];

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.passwordHash);

        if (!isValidPassword) {
            return new Response(JSON.stringify({ error: "Invalid credentials" }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Check if user is active
        if (!user.isActive) {
            return new Response(JSON.stringify({ error: "Account is inactive" }), {
                status: 403,
                headers: { "Content-Type": "application/json" },
            });
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
        return new Response(JSON.stringify({
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
        }), {
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Login error:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
