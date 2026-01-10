import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/invite-college')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/invite-college"!</div>
}
