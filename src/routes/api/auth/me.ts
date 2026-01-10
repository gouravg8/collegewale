import { authenticateRequest } from "@/server/middleware/auth";
import { json } from "@tanstack/react-start/server";

export async function GET({ request }: { request: Request }) {
    // Get current authenticated user
    const user = await authenticateRequest(request);

    if (!user) {
        return json({ error: "Unauthorized" }, { status: 401 });
    }

    // Return user info (without sensitive data)
    return json({
        user: {
            id: user.id,
            email: user.email,
            role: user.role,
            fullName: user.fullName,
            collegeId: user.collegeId,
        },
    });
}
