import { menuItems } from "@/config/menu-items";
import { RoleType } from "@/config/roles";
import {
	createFileRoute,
	Link,
	Outlet,
	useRouterState,
} from "@tanstack/react-router";
import { Avatar, Dropdown, Layout, Menu } from "antd";
import { useState } from "react";
import { MdLogout, MdPerson } from "react-icons/md";

export const Route = createFileRoute("/")({ component: App });

const { Header, Sider, Content, Footer } = Layout;

function App() {
	const [collapsed, setCollapsed] = useState(false);
	const routerState = useRouterState();

	// TODO: Replace with actual auth context
	const currentUser = {
		privilege: "COLLEGE" as RoleType,
		fullName: "Admin User",
		email: "admin@example.com",
		collegeName: "Sample College",
		collegeLogo: null,
	};

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
				<Menu theme="dark" mode="inline" selectedKeys={[selectedKey]}>
					{filteredItems.map((item) => (
						<Menu.Item key={item.key} icon={item.icon}>
							<Link to={item.key}>{item.label}</Link>
						</Menu.Item>
					))}
				</Menu>
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
						<div
							style={{
								display: "flex",
								alignItems: "center",
								gap: "12px",
								cursor: "pointer",
							}}
						>
							<div style={{ textAlign: "right" }}>
								<div style={{ fontWeight: 500 }}>{currentUser.fullName}</div>
								<div style={{ fontSize: "12px", color: "#666" }}>
									{currentUser.privilege}
								</div>
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
