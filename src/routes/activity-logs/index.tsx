import { requirePrivilege } from "@/config/auth-utils";
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/activity-logs/')({
  beforeLoad: requirePrivilege("ADMIN"),
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/activity-logs/"!</div>
}
