import { getCurrentUser } from "@/config/auth-utils";
import { menuItems } from "@/config/menu-items";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { createRootRoute, HeadContent, Outlet, Scripts, useRouter, useRouterState } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { Avatar, Dropdown, Layout, Menu } from "antd";
import { useState } from "react";
import { MdLogout, MdPerson } from "react-icons/md";

import appCss from "../styles.css?url";

const { Header, Sider, Content, Footer } = Layout;

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "CollegeWale - College Management System",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),

	component: RootComponent,
});

function RootComponent() {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				<AppLayout />
				<TanStackDevtools
					config={{
						position: "bottom-right",
					}}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
					]}
				/>
				<Scripts />
			</body>
		</html>
	);
}

function AppLayout() {
	const [collapsed, setCollapsed] = useState(false);
	const routerState = useRouterState();
	const router = useRouter();

	// Get current user from auth context
	const currentUser = getCurrentUser();

	const filteredItems = menuItems.filter((item) => {
		// Admin can see everything
		if (currentUser.privilege === "ADMIN") return true;
		// College can see college and student items
		if (currentUser.privilege === "COLLEGE") {
			return ["STUDENT", "COLLEGE"].includes(item.privilege);
		}
		// Others see only their privilege level
		return item.privilege === currentUser.privilege;
	});

	const selectedKey = routerState.location.pathname;

	const userMenuItems = [
		{
			key: "profile",
			icon: <MdPerson size={16} />,
			label: "Profile",
		},
		{
			key: "logout",
			icon: <MdLogout size={16} />,
			label: "Logout",
			danger: true,
		},
	];

	return (
		<Layout style={{ minHeight: "100vh" }}>
			<Sider
				collapsible
				collapsed={collapsed}
				onCollapse={setCollapsed}
				className="h-screen! fixed! left-0! top-0! bottom-0! overflow-auto"
			>
				<div className="h-16 flex items-center justify-center border-b border-slate-800">
					{!collapsed && (
						<h2 className="text-white text-lg font-bold">CollegeWale</h2>
					)}
				</div>
				<Menu
					theme="dark"
					mode="inline"
					onClick={(e) => router.navigate({ to: e.key })}
					items={filteredItems.map((item) => ({
						key: item.key,
						icon: item.icon,
						label: item.label,
					}))}
					selectedKeys={[selectedKey]}
				/>
			</Sider >

			<Layout style={{ marginLeft: collapsed ? 80 : 200, transition: "all 0.2s" }}>
				<Header
					className="flex items-center justify-between bg-white! shadow-sm"
				>
					<div className="flex items-center gap-3">
						<h3 className="text-lg font-bold">{currentUser.collegeName}</h3>
					</div>

					<Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
						<div className="flex items-center gap-3" >
							<div className="font-medium">{currentUser.fullName}
								<span className="text-xs text-gray-500 ml-2">({currentUser.privilege})</span>
							</div>
							<Avatar icon={<MdPerson size={16} />} />
						</div>
					</Dropdown>
				</Header>

				<Content style={{ margin: "24px 16px 0" }}>
					<div className="p-4 py-6 min-h-[calc(100vh-134px)] bg-white rounded-lg">
						<Outlet />
					</div>
				</Content>

				<Footer className="text-center text-gray-500">
					© {new Date().getFullYear()} CollegeWale. All rights reserved.
				</Footer>
			</Layout>
		</Layout >
	);
}
