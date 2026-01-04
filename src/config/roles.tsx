export type RoleMatrix =
	| "read:dashboard"
	| "read:student"
	| "read:application"
	| "read:documents"
	| "read:payments"
	| "read:reports"
	| "read:settings";

export type RoleType = "STUDENT" | "AGENT" | "COLLEGE" | "ADMIN";

export const Roles: Record<RoleType, RoleMatrix[]> = {
	STUDENT: [],
	AGENT: [],
	COLLEGE: [],
	ADMIN: [],
};
