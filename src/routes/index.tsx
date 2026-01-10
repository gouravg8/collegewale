import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: IndexPage,
});

function IndexPage() {
	// Redirect to dashboard
	if (typeof window !== "undefined") {
		window.location.href = "/dashboard";
	}

	return (
		<div style={{ textAlign: "center", padding: "50px" }}>
			<h1>Welcome to CollegeWale</h1>
			<p>Redirecting to dashboard...</p>
		</div>
	);
}
