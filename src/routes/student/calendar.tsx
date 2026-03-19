import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/student/calendar')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="text-4xl tracking-[10px] text-white/45 text-center">
      COMING SOON
    </div>
  )
}
