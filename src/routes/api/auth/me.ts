import { authenticateRequest } from "@/server/middleware/auth";

export async function GET({ request }: { request: Request }) {
    // Get current authenticated user
    const user = await authenticateRequest(request);

    if (!user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        });
    }

    // Return user info (without sensitive data)
    return new Response(JSON.stringify({
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
}
