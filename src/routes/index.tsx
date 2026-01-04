import { menuItems } from "@/config/menu-items";
import { RoleType } from "@/config/roles";
import {
	createFileRoute,
	Link,
	Outlet,
	useRouterState,
} from "@tanstack/react-router";
import { Layout, Menu } from "antd";
import { useState } from "react";

export const Route = createFileRoute("/")({ component: App });

const { Header, Sider, Content, Footer } = Layout;

function App() {
	const [collapsed, setCollapsed] = useState(true);
	const routerState = useRouterState();

	// Example: current user privilege (replace with auth context)
	const currentPrivilege: RoleType = "STUDENT";

	const filteredItems = menuItems.filter(
		(item) => item.privilege === currentPrivilege,
	);

	const selectedKey = routerState.location.pathname;

	return (
		<Layout style={{ minHeight: "100vh" }}>
			<Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
				<div
					style={{
						height: 48,
						margin: 16,
						background: "rgba(255,255,255,0.2)",
						borderRadius: 8,
					}}
				/>
				<Menu theme="dark" mode="inline" selectedKeys={[selectedKey]}>
					{filteredItems.map((item) => (
						<Menu.Item key={item.key} icon={item.icon}>
							<Link to={item.key}>{item.label}</Link>
						</Menu.Item>
					))}
				</Menu>
			</Sider>

			<Layout>
				<Header style={{ display: "flex", alignItems: "center" }}>
					<h3 className="text-lg text-white">collegeWale</h3>
				</Header>

				<Content style={{ margin: 16 }}>
					<div
						style={{
							padding: 16,
							minHeight: 360,
							background: "#fff",
							borderRadius: 8,
						}}
					>
						<Outlet />
					</div>
				</Content>

				<Footer style={{ textAlign: "center" }}>
					© {new Date().getFullYear()} collegeWale. All rights reserved.
				</Footer>
			</Layout>
		</Layout>
	);
}
