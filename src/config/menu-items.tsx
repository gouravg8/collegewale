// src/config/menuItems.tsx
import {
	MdBarChart,
	MdDashboard,
	MdDescription,
	MdHistory,
	MdPayment,
	MdPeople,
	MdSettings,
	MdUploadFile,
} from "react-icons/md";
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
		icon: <MdDashboard size={18} />,
		privilege: "STUDENT",
	},
	{
		key: "/students",
		label: "Students",
		icon: <MdPeople size={18} />,
		privilege: "COLLEGE",
	},
	{
		key: "/applications",
		label: "Applications",
		icon: <MdDescription size={18} />,
		privilege: "STUDENT",
	},
	{
		key: "/documents",
		label: "Documents",
		icon: <MdUploadFile size={18} />,
		privilege: "STUDENT",
	},
	{
		key: "/payments",
		label: "Payments",
		icon: <MdPayment size={18} />,
		privilege: "COLLEGE",
	},
	{
		key: "/reports",
		label: "Reports",
		icon: <MdBarChart size={18} />,
		privilege: "COLLEGE",
	},
	{
		key: "/activity-logs",
		label: "Activity Logs",
		icon: <MdHistory size={18} />,
		privilege: "ADMIN",
	},
	{
		key: "/settings",
		label: "Settings",
		icon: <MdSettings size={18} />,
		privilege: "STUDENT",
	},
];
