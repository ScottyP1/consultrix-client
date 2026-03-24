import { useEffect, useRef, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { LuSearch, LuSendHorizontal, LuTrash2, LuUsers } from 'react-icons/lu'

import GlassContainer from '#/components/liquidGlass/GlassContainer'
import PageHeader from '#/components/PageHeader'
import { useInstructorWorkspaceData } from '#/hooks/instructor/useInstructorWorkspaceData'
import { useConversations } from '#/hooks/useConversations'

export const Route = createFileRoute('/instructor/messages')({
  component: RouteComponent,
})

function RouteComponent() {
  const { meQuery, studentsQuery } = useInstructorWorkspaceData()
  const myId = meQuery.data ? Number(meQuery.data.id) : undefined

  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [draft, setDraft] = useState('')
  const [showNewGroup, setShowNewGroup] = useState(false)
  const [groupName, setGroupName] = useState('')
  const [selectedMemberIds, setSelectedMemberIds] = useState<number[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const {
    conversationsQuery,
    messagesQuery,
    createConversationMutation,
    deleteMessageMutation,
    publish,
    connected,
  } = useConversations({ enabled: !!myId, selectedId })

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messagesQuery.data])

  useEffect(() => {
    if (selectedId == null && conversationsQuery.data?.length) {
      setSelectedId(conversationsQuery.data[0].id)
    }
  }, [conversationsQuery.data, selectedId])

  const conversations = (conversationsQuery.data ?? []).filter(
    (c) =>
      !search ||
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.members.some((m) =>
        `${m.firstName} ${m.lastName}`.toLowerCase().includes(search.toLowerCase()),
      ),
  )

  const selectedConversation =
    conversationsQuery.data?.find((c) => c.id === selectedId) ?? null
  const messages = messagesQuery.data ?? []

  function sendMessage() {
    if (!draft.trim() || selectedId == null) return
    publish('/app/chat.send', { conversationId: selectedId, content: draft.trim() })
    setDraft('')
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <PageHeader
          eyebrow="Messages"
          title="Instructor Inbox"
          subtitle="Direct messages and group chats."
        />
        <button
          type="button"
          onClick={() => setShowNewGroup(true)}
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/6 px-3 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white"
        >
          <LuUsers size={15} /> New Group
        </button>
      </div>

      {showNewGroup && (
        <GlassContainer className="rounded-[18px] p-5">
          <h3 className="mb-4 text-base font-semibold text-white">Create Group Chat</h3>
          <input
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Group name..."
            className="mb-4 w-full rounded-xl border border-white/10 bg-white/6 px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/30"
          />
          <p className="mb-2 text-xs text-white/50">Select students:</p>
          <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto">
            {(studentsQuery.data ?? []).map((student) => {
              const checked = selectedMemberIds.includes(student.id)
              return (
                <label key={student.id} className="flex items-center gap-3 rounded-xl p-2 hover:bg-white/6 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() =>
                      setSelectedMemberIds((prev) =>
                        checked ? prev.filter((id) => id !== student.id) : [...prev, student.id],
                      )
                    }
                    className="accent-indigo-500"
                  />
                  <span className="text-sm text-white">
                    {student.firstName} {student.lastName}
                  </span>
                </label>
              )
            })}
          </div>
          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              disabled={!groupName.trim() || selectedMemberIds.length === 0}
              onClick={() => createConversationMutation.mutate(
                { name: groupName, type: 'GROUP', memberIds: selectedMemberIds },
                { onSuccess: (conv) => { setSelectedId(conv.id); setShowNewGroup(false); setGroupName(''); setSelectedMemberIds([]) } },
              )}
              className="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
            >
              Create Group
            </button>
            <button
              type="button"
              onClick={() => setShowNewGroup(false)}
              className="text-xs text-white/40 hover:text-white/60"
            >
              Cancel
            </button>
          </div>
        </GlassContainer>
      )}

      <div className="grid gap-4 xl:grid-cols-[17rem_minmax(0,1fr)]">
        <GlassContainer className="min-h-[31rem] rounded-[18px] overflow-hidden p-0">
          <div className="border-b border-white/8 p-4">
            <label className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/6 px-3 py-2.5">
              <LuSearch className="text-white/35" size={16} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/28"
              />
            </label>
          </div>

          <div className="divide-y divide-white/6">
            {conversations.length === 0 ? (
              <p className="p-4 text-sm text-white/40">No conversations yet.</p>
            ) : (
              conversations.map((conv) => {
                const isSelected = conv.id === selectedId
                return (
                  <button
                    key={conv.id}
                    type="button"
                    onClick={() => setSelectedId(conv.id)}
                    className={`flex w-full items-start gap-3 px-4 py-4 text-left transition ${isSelected ? 'bg-indigo-500/18' : 'hover:bg-white/5'}`}
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-fuchsia-500 to-indigo-500 text-xs font-semibold text-white">
                      {conv.type === 'GROUP' ? <LuUsers size={14} /> : getInitials(conv.name ?? '')}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-white">
                        {conv.name ?? 'Direct Message'}
                      </p>
                      {conv.lastMessage && (
                        <p className="mt-0.5 truncate text-xs text-white/40">
                          {conv.lastMessage.deleted ? '[deleted]' : conv.lastMessage.content}
                        </p>
                      )}
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </GlassContainer>

        <GlassContainer className="min-h-[31rem] rounded-[18px] overflow-hidden p-0 flex flex-col">
          {selectedConversation ? (
            <>
              <div className="border-b border-white/8 px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-fuchsia-500 to-indigo-500 text-xs font-semibold text-white">
                    {selectedConversation.type === 'GROUP'
                      ? <LuUsers size={16} />
                      : getInitials(selectedConversation.name ?? '')}
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-white">
                      {selectedConversation.name ?? 'Direct Message'}
                    </h2>
                    <p className="text-xs text-white/38">
                      {selectedConversation.type === 'GROUP'
                        ? `${selectedConversation.members.length} members`
                        : selectedConversation.members
                            .filter((m) => m.id !== myId)
                            .map((m) => `${m.firstName} ${m.lastName}`)
                            .join(', ')}
                    </p>
                  </div>
                  <div className="ml-auto flex items-center gap-1.5">
                    <span className={`h-2 w-2 rounded-full ${connected ? 'bg-emerald-400' : 'bg-white/20'}`} />
                    <span className="text-xs text-white/35">{connected ? 'Live' : 'Offline'}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-5 min-h-[20rem]">
                {messages.length === 0 ? (
                  <p className="text-center text-sm text-white/30">No messages yet.</p>
                ) : (
                  messages.map((msg) => {
                    const isMe = msg.sender.id === myId
                    return (
                      <div
                        key={msg.id}
                        className={`group flex items-end gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
                      >
                        {!isMe && (
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-[10px] font-semibold text-white/70">
                            {msg.sender.firstName[0]}{msg.sender.lastName[0]}
                          </div>
                        )}
                        <div className={`max-w-[70%] flex flex-col gap-1 ${isMe ? 'items-end' : 'items-start'}`}>
                          {!isMe && (
                            <span className="text-[10px] text-white/40">
                              {msg.sender.firstName} {msg.sender.lastName}
                            </span>
                          )}
                          <div
                            className={`rounded-2xl px-4 py-3 text-sm ${
                              msg.deleted
                                ? 'bg-white/5 italic text-white/30'
                                : isMe
                                  ? 'bg-linear-to-r from-indigo-500 to-violet-500 text-white'
                                  : 'bg-white/8 text-white/85'
                            }`}
                          >
                            {msg.content}
                          </div>
                          <span className="text-[10px] text-white/25">{formatTime(msg.sentAt)}</span>
                        </div>
                        {isMe && !msg.deleted && (
                          <button
                            type="button"
                            onClick={() => deleteMessageMutation.mutate(msg.id)}
                            className="invisible shrink-0 text-white/30 hover:text-rose-400 group-hover:visible"
                          >
                            <LuTrash2 size={13} />
                          </button>
                        )}
                      </div>
                    )
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="border-t border-white/8 px-4 py-4">
                <div className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/6 p-2">
                  <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    className="w-full bg-transparent px-2 text-sm text-white outline-none placeholder:text-white/28"
                  />
                  <button
                    type="button"
                    onClick={sendMessage}
                    disabled={!draft.trim() || !connected}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-r from-indigo-500 to-violet-500 text-white disabled:opacity-40"
                  >
                    <LuSendHorizontal size={18} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex h-full min-h-[31rem] items-center justify-center text-sm text-white/45">
              Select a conversation to start messaging.
            </div>
          )}
        </GlassContainer>
      </div>
    </div>
  )
}

function getInitials(name: string) {
  return name.split(/\s+/).slice(0, 2).map((p) => p.charAt(0).toUpperCase()).join('')
}

function formatTime(iso: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
  }).format(new Date(iso))
}
