import { redirect } from "@tanstack/react-router";
import { RoleType } from "./roles";

// TODO: Replace with actual auth context/hook
export function getCurrentUser() {
    // This is a placeholder - replace with actual auth logic
    return {
        privilege: "STUDENT" as RoleType,
        fullName: "Admin User",
        email: "admin@example.com",
        collegeName: "Sample College",
        collegeLogo: null,
    };
}

/**
 * Check if user has the required privilege level to access a route
 */
export function hasRequiredPrivilege(
    userPrivilege: RoleType,
    requiredPrivilege: RoleType,
): boolean {
    // Define privilege hierarchy
    const privilegeHierarchy: Record<RoleType, number> = {
        STUDENT: 1,
        AGENT: 2,
        COLLEGE: 3,
        ADMIN: 4,
    };

    // Admin can access everything
    if (userPrivilege === "ADMIN") return true;

    // College can access COLLEGE and STUDENT level routes
    if (userPrivilege === "COLLEGE") {
        return ["STUDENT", "COLLEGE"].includes(requiredPrivilege);
    }

    // Others can only access their own privilege level or lower
    return privilegeHierarchy[userPrivilege] >= privilegeHierarchy[requiredPrivilege];
}

/**
 * Route guard function to be used in beforeLoad
 */
export function requirePrivilege(requiredPrivilege: RoleType) {
    return () => {
        const user = getCurrentUser();

        if (!hasRequiredPrivilege(user.privilege, requiredPrivilege)) {
            // Redirect to unauthorized page or dashboard
            throw redirect({
                to: "/unauthorized",
                search: {
                    redirect: window.location.pathname,
                },
            });
        }
    };
}
