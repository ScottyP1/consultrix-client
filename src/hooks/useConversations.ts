import { useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import {
  getConversations,
  getConversationMessages,
  createConversation,
  deleteConversation,
  deleteMessage,
  type MessageDto,
  type CreateConversationPayload,
} from '@/api/consultrix'
import { useStompClient } from './useStompClient'

/**
 * Conversations list + message thread + mutations.
 * Handles STOMP subscriptions for real-time delivery.
 */
export function useConversations(options: { enabled?: boolean; selectedId?: number | null } = {}) {
  const { enabled = true, selectedId = null } = options
  const qc = useQueryClient()
  const { connected, subscribe, publish } = useStompClient()

  const conversationsQuery = useQuery({
    queryKey: ['conversations'],
    queryFn: getConversations,
    enabled,
    staleTime: 1000 * 30,
  })

  const messagesQuery = useQuery({
    queryKey: ['messages', selectedId],
    queryFn: () => getConversationMessages(selectedId!),
    enabled: selectedId != null,
    staleTime: 0,
  })

  // Subscribe to all conversation topics whenever the list is loaded
  useEffect(() => {
    if (!connected || !conversationsQuery.data) return

    const subs = conversationsQuery.data.map((conv) =>
      subscribe(`/topic/conversation.${conv.id}`, (msg) => {
        const newMessage: MessageDto = JSON.parse(msg.body)
        qc.setQueryData<MessageDto[]>(['messages', conv.id], (prev) =>
          prev ? [...prev, newMessage] : [newMessage],
        )
        qc.invalidateQueries({ queryKey: ['conversations'] })
      }),
    )

    return () => {
      subs.forEach((sub) => sub?.unsubscribe())
    }
  }, [connected, conversationsQuery.data, subscribe, qc])

  const createConversationMutation = useMutation({
    mutationFn: (payload: CreateConversationPayload) => createConversation(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['conversations'] }),
  })

  const deleteConversationMutation = useMutation({
    mutationFn: (conversationId: number) => deleteConversation(conversationId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['conversations'] }),
  })

  const deleteMessageMutation = useMutation({
    mutationFn: (messageId: number) => deleteMessage(messageId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['messages', selectedId] }),
  })

  return {
    conversationsQuery,
    messagesQuery,
    createConversationMutation,
    deleteConversationMutation,
    deleteMessageMutation,
    publish,
    connected,
  }
}
