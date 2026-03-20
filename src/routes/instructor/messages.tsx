import { createFileRoute } from '@tanstack/react-router'

import GlassContainer from '#/components/liquidGlass/GlassContainer'
import PageHeader from '#/components/PageHeader'
import { useInstructorWorkspaceData } from '#/hooks/instructor/useInstructorWorkspaceData'

export const Route = createFileRoute('/instructor/messages')({
  component: RouteComponent,
})

function RouteComponent() {
  const { notificationsQuery, isLoading, error } = useInstructorWorkspaceData()

  if (isLoading) {
    return (
      <PageHeader
        eyebrow="Messages"
        title="Loading messages"
        subtitle="Fetching instructor notifications."
      />
    )
  }

  if (error) {
    return (
      <PageHeader
        eyebrow="Messages"
        title="Messages unavailable"
        subtitle={error.message}
      />
    )
  }

  const items = notificationsQuery.data ?? []

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Messages"
        title="Instructor Inbox"
        subtitle="Live notifications for the current instructor account."
      />

      {items.length > 0 ? (
        <div className="grid gap-4">
          {items.map((notification) => (
            <GlassContainer
              key={notification.notificationId}
              className="space-y-2 p-5"
            >
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-lg font-semibold text-white">
                  {notification.title}
                </h2>
                <span className="rounded-full bg-white/8 px-3 py-1 text-xs uppercase tracking-[0.18em] text-white/60">
                  {notification.isRead ? 'Read' : 'Unread'}
                </span>
              </div>
              <p className="text-sm leading-6 text-white/60">
                {notification.message}
              </p>
            </GlassContainer>
          ))}
        </div>
      ) : (
        <p className="text-sm text-white/45">No messages available.</p>
      )}
    </div>
  )
}
