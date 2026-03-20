import { useMemo, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { LuSearch, LuSendHorizontal } from 'react-icons/lu'

import GlassContainer from '#/components/liquidGlass/GlassContainer'
import PageHeader from '#/components/PageHeader'
import { useStudentNotifications } from '#/hooks/student/useStudentNotifications'
import { useStudentProfile } from '#/hooks/student/useStudentProfile'

export const Route = createFileRoute('/student/messages')({
  component: RouteComponent,
})

function RouteComponent() {
  const profileQuery = useStudentProfile()
  const notificationsQuery = useStudentNotifications(profileQuery.data?.userId)
  const [searchQuery, setSearchQuery] = useState('')

  if (profileQuery.isLoading || notificationsQuery.isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader
          eyebrow="Messages"
          title="Loading messages"
          subtitle="Fetching live notifications and announcements."
        />
      </div>
    )
  }

  const error = profileQuery.error ?? notificationsQuery.error

  if (error) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader
          eyebrow="Messages"
          title="Messages unavailable"
          subtitle={error.message}
        />
      </div>
    )
  }

  const items = notificationsQuery.data ?? []
  const filteredItems = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()

    if (!normalizedQuery) {
      return items
    }

    return items.filter(
      (notification) =>
        notification.title.toLowerCase().includes(normalizedQuery) ||
        notification.message.toLowerCase().includes(normalizedQuery),
    )
  }, [items, searchQuery])
  const [selectedId, setSelectedId] = useState<number | null>(items[0]?.notificationId ?? null)
  const selectedThread =
    filteredItems.find((notification) => notification.notificationId === selectedId) ??
    filteredItems[0] ??
    null
  const conversationBubbles = useMemo(() => {
    if (!selectedThread) {
      return []
    }

    return selectedThread.message
      .split(/(?<=[.!?])\s+/)
      .map((segment) => segment.trim())
      .filter(Boolean)
  }, [selectedThread])

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Messages"
        title="Messages"
        subtitle="Communicate with instructors and groups."
      />

      {items.length > 0 ? (
        <div className="grid gap-4 xl:grid-cols-[17rem_minmax(0,1fr)]">
          <GlassContainer className="min-h-[31rem] rounded-[18px] overflow-hidden p-0">
            <div className="border-b border-white/8 p-4">
              <label className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/6 px-3 py-2.5">
                <LuSearch className="text-white/35" size={16} />
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search messages..."
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/28"
                />
              </label>
            </div>

            <div className="divide-y divide-white/6">
              {filteredItems.map((notification) => {
                const isSelected =
                  notification.notificationId === selectedThread?.notificationId

                return (
                  <button
                    key={notification.notificationId}
                    type="button"
                    onClick={() => setSelectedId(notification.notificationId)}
                    className={`flex w-full items-start gap-3 px-4 py-4 text-left transition ${
                      isSelected ? 'bg-indigo-500/18' : 'hover:bg-white/5'
                    }`}
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-fuchsia-500 to-indigo-500 text-xs font-semibold text-white">
                      {getInitials(notification.title)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <p className="truncate text-sm font-semibold text-white">
                          {notification.title}
                        </p>
                        {!notification.isRead ? (
                          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-500 px-1.5 text-[10px] font-semibold text-white">
                            1
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-1 truncate text-xs text-white/48">
                        {notification.message}
                      </p>
                      <p className="mt-1 text-[11px] text-white/28">
                        {notification.isRead ? 'Read' : 'New'}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          </GlassContainer>

          <GlassContainer className="min-h-[31rem] rounded-[18px] overflow-hidden p-0">
            {selectedThread ? (
              <>
                <div className="border-b border-white/8 px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-fuchsia-500 to-indigo-500 text-xs font-semibold text-white">
                      {getInitials(selectedThread.title)}
                    </div>
                    <div>
                      <h2 className="text-base font-semibold text-white">
                        {selectedThread.title}
                      </h2>
                      <p className="text-xs text-white/38">
                        {selectedThread.isRead
                          ? 'Instructor Thread'
                          : 'Unread Instructor Update'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex min-h-[22rem] flex-col gap-4 px-4 py-5">
                  {conversationBubbles.map((bubble, index) => (
                    <div
                      key={`${selectedThread.notificationId}-${index}`}
                      className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                        index === conversationBubbles.length - 1 &&
                        selectedThread.isRead
                          ? 'ml-auto bg-linear-to-r from-indigo-500 to-violet-500 text-white shadow-[0_10px_30px_-18px_rgba(99,102,241,0.85)]'
                          : 'bg-white/8 text-white/80'
                      }`}
                    >
                      <p className="text-[11px] text-white/45">
                        {index === conversationBubbles.length - 1 &&
                        selectedThread.isRead
                          ? 'You'
                          : selectedThread.title}
                      </p>
                      <p className="mt-1 text-sm leading-6">{bubble}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-auto border-t border-white/8 px-4 py-4">
                  <div className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/6 p-2">
                    <input
                      readOnly
                      value=""
                      placeholder="Type a message..."
                      className="w-full bg-transparent px-2 text-sm text-white outline-none placeholder:text-white/28"
                    />
                    <button
                      type="button"
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-r from-indigo-500 to-violet-500 text-white"
                    >
                      <LuSendHorizontal size={18} />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex h-full min-h-[31rem] items-center justify-center text-sm text-white/45">
                No message thread selected.
              </div>
            )}
          </GlassContainer>
        </div>
      ) : (
        <p className="text-sm text-white/45">No messages available.</p>
      )}
    </div>
  )
}

function getInitials(value: string) {
  return value
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
}
