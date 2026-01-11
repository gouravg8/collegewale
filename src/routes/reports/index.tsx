import { requirePrivilege } from "@/config/auth-utils";
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/reports/')({
  beforeLoad: requirePrivilege("COLLEGE"),
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/reports/"!</div>
}
