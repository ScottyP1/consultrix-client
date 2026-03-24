import { useEffect, useRef, useState, useCallback } from 'react'
import { Client, type IMessage, type StompSubscription } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

import { getToken } from '@/lib/auth-token'

const WS_URL = `${import.meta.env.VITE_API_URL ?? 'http://localhost:8080'}/ws`

export function useStompClient() {
  const clientRef = useRef<Client | null>(null)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const token = getToken()

    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
      reconnectDelay: 5000,
      onConnect: () => setConnected(true),
      onDisconnect: () => setConnected(false),
      onStompError: (frame) => console.error('[STOMP] error', frame),
    })

    client.activate()
    clientRef.current = client

    return () => {
      client.deactivate()
    }
  }, [])

  const subscribe = useCallback(
    (destination: string, callback: (msg: IMessage) => void): StompSubscription | null => {
      if (!clientRef.current?.connected) return null
      return clientRef.current.subscribe(destination, callback)
    },
    [],
  )

  const publish = useCallback((destination: string, body: unknown) => {
    clientRef.current?.publish({
      destination,
      body: JSON.stringify(body),
    })
  }, [])

  return { connected, subscribe, publish, clientRef }
}
