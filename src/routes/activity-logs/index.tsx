import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/activity-logs/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/activity-logs/"!</div>
}
