// src/config/menuItems.tsx
import {
	Activity,
	BarChart3,
	CreditCard,
	FileText,
	Home,
	Settings,
	Upload,
	Users,
} from "lucide-react";
import { RoleType } from "./roles";

export interface MenuItemConfig {
	key: string;
	label: string;
	icon: React.ReactNode;
	privilege: RoleType;
}

export const menuItems: MenuItemConfig[] = [
	{
		key: "/dashboard",
		label: "Dashboard",
		icon: <Home size={18} />,
		privilege: "STUDENT",
	},
	{
		key: "/students",
		label: "Students",
		icon: <Users size={18} />,
		privilege: "COLLEGE",
	},
	{
		key: "/applications",
		label: "Applications",
		icon: <FileText size={18} />,
		privilege: "STUDENT",
	},
	{
		key: "/documents",
		label: "Documents",
		icon: <Upload size={18} />,
		privilege: "STUDENT",
	},
	{
		key: "/payments",
		label: "Payments",
		icon: <CreditCard size={18} />,
		privilege: "COLLEGE",
	},
	{
		key: "/reports",
		label: "Reports",
		icon: <BarChart3 size={18} />,
		privilege: "COLLEGE",
	},
	{
		key: "/activity-logs",
		label: "Activity Logs",
		icon: <Activity size={18} />,
		privilege: "ADMIN",
	},
	{
		key: "/settings",
		label: "Settings",
		icon: <Settings size={18} />,
		privilege: "STUDENT",
	},
];

