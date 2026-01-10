import { db } from "@/server/db";
import { sessions } from "@/server/db/schema";
import { authenticateRequest } from "@/server/middleware/auth";
import { ActivityActions, logActivity } from "@/server/utils/logger";
import { eq } from "drizzle-orm";

export async function POST({ request }: { request: Request }) {
    try {
        // Authenticate user
        const user = await authenticateRequest(request);

        if (!user) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Extract token
        const authHeader = request.headers.get("Authorization");
        const token = authHeader?.startsWith("Bearer ")
            ? authHeader.substring(7)
            : null;

        if (!token) {
            const cookie = request.headers.get("Cookie");
            if (cookie) {
                const match = cookie.match(/session=([^;]+)/);
                if (match) {
                    const cookieToken = match[1];
                    // Delete session
                    await db.delete(sessions).where(eq(sessions.token, cookieToken));
                }
            }
        } else {
            // Delete session
            await db.delete(sessions).where(eq(sessions.token, token));
        }

        // Log activity
        await logActivity({
            userId: user.id,
            collegeId: user.collegeId || undefined,
            action: ActivityActions.USER_LOGOUT,
        });

        return new Response(JSON.stringify({ success: true, message: "Logged out successfully" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Logout error:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
