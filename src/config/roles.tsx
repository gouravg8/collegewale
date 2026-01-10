export type RoleMatrix =
	| "read:dashboard"
	| "read:student"
	| "write:student"
	| "delete:student"
	| "read:application"
	| "write:application"
	| "read:documents"
	| "write:documents"
	| "delete:documents"
	| "read:payments"
	| "write:payments"
	| "read:reports"
	| "read:settings"
	| "write:settings"
	| "read:activity_logs";

export type RoleType = "STUDENT" | "AGENT" | "COLLEGE" | "ADMIN";

export const Roles: Record<RoleType, RoleMatrix[]> = {
	STUDENT: [
		"read:dashboard",
		"read:student",
		"read:application",
		"read:documents",
		"read:payments",
		"read:settings",
	],
	AGENT: [
		"read:dashboard",
		"read:student",
		"read:application",
		"read:documents",
	],
	COLLEGE: [
		"read:dashboard",
		"read:student",
		"write:student",
		"read:application",
		"write:application",
		"read:documents",
		"write:documents",
		"delete:documents",
		"read:payments",
		"write:payments",
		"read:reports",
		"read:settings",
		"write:settings",
	],
	ADMIN: [
		"read:dashboard",
		"read:student",
		"write:student",
		"delete:student",
		"read:application",
		"write:application",
		"read:documents",
		"write:documents",
		"delete:documents",
		"read:payments",
		"write:payments",
		"read:reports",
		"read:settings",
		"write:settings",
		"read:activity_logs",
	],
};

