import type { AuthenticatedUser } from "./auth";

/**
 * Check if user has required role
 */
export function hasRole(
    user: AuthenticatedUser,
    allowedRoles: Array<"STUDENT" | "AGENT" | "COLLEGE" | "ADMIN">,
): boolean {
    return allowedRoles.includes(user.role);
}

/**
 * Check if user is admin
 */
export function isAdmin(user: AuthenticatedUser): boolean {
    return user.role === "ADMIN";
}

/**
 * Check if user belongs to specific college
 */
export function belongsToCollege(
    user: AuthenticatedUser,
    collegeId: string,
): boolean {
    if (user.role === "ADMIN") {
        return true; // Admin can access all colleges
    }
    return user.collegeId === collegeId;
}

/**
 * Check if user can edit (College or Admin role)
 */
export function canEdit(user: AuthenticatedUser): boolean {
    return user.role === "COLLEGE" || user.role === "ADMIN";
}

/**
 * Check if user can only read (Student role)
 */
export function isReadOnly(user: AuthenticatedUser): boolean {
    return user.role === "STUDENT";
}
