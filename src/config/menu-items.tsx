// src/config/menuItems.tsx
import { Home, Settings, Users, Shield } from "lucide-react";
import { RoleType } from "./roles";

export interface MenuItemConfig {
	key: string;
	label: string;
	icon: React.ReactNode;
	privilege: RoleType;
}

export const menuItems: MenuItemConfig[] = [
	{
		key: "/",
		label: "Dashboard",
		icon: <Home size={18} />,
		privilege: "STUDENT",
	},
	{
		key: "/users",
		label: "Users",
		icon: <Users size={18} />,
		privilege: "ADMIN",
	},
	{
		key: "/settings",
		label: "Settings",
		icon: <Settings size={18} />,
		privilege: "STUDENT",
	},
	{
		key: "/security",
		label: "Security",
		icon: <Shield size={18} />,
		privilege: "AGENT",
	},
];
