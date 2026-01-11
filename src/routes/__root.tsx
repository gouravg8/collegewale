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
				style={{
					overflow: "auto",
					height: "100vh",
					position: "fixed",
					left: 0,
					top: 0,
					bottom: 0,
				}}
			>
				<div
					style={{
						height: 64,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						padding: "0 16px",
						borderBottom: "1px solid rgba(255,255,255,0.1)",
					}}
				>
					{!collapsed && (
						<h2 style={{ color: "white", margin: 0, fontSize: "18px" }}>
							CollegeWale
						</h2>
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
			</Sider>

			<Layout style={{ marginLeft: collapsed ? 80 : 200, transition: "all 0.2s" }}>
				<Header
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						background: "#fff",
						padding: "0 24px",
						boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
						position: "sticky",
						top: 0,
						zIndex: 1,
					}}
				>
					<div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
						{currentUser.collegeLogo ? (
							<img
								src={currentUser.collegeLogo}
								alt="College Logo"
								style={{ height: 40, width: 40, borderRadius: "50%" }}
							/>
						) : (
							<div
								style={{
									height: 40,
									width: 40,
									borderRadius: "50%",
									background: "#1890ff",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									color: "white",
									fontWeight: "bold",
								}}
							>
								{currentUser.collegeName?.charAt(0) || "C"}
							</div>
						)}
						<h3 style={{ margin: 0, fontSize: "16px" }}>
							{currentUser.collegeName}
						</h3>
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
					<div
						style={{
							padding: 24,
							minHeight: "calc(100vh - 134px)",
							background: "#fff",
							borderRadius: 8,
						}}
					>
						<Outlet />
					</div>
				</Content>

				<Footer style={{ textAlign: "center", background: "#f0f2f5" }}>
					© {new Date().getFullYear()} CollegeWale. All rights reserved.
				</Footer>
			</Layout>
		</Layout>
	);
}
