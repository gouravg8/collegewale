import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/students/new')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/students/new"!</div>
}
