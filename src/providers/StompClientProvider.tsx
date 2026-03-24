import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { Client, type IMessage, type StompSubscription } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

import { getToken } from '@/lib/auth-token'

const WS_URL = `${import.meta.env.VITE_API_URL ?? 'http://localhost:8080'}/ws`

type StompContextValue = {
  connected: boolean
  subscribe: (destination: string, callback: (msg: IMessage) => void) => StompSubscription | null
  publish: (destination: string, body: unknown) => void
  clientRef: React.RefObject<Client | null>
}

const StompContext = createContext<StompContextValue | null>(null)

export function StompClientProvider({ children }: { children: ReactNode }) {
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
    return () => { client.deactivate() }
  }, [])

  const subscribe = useCallback(
    (destination: string, callback: (msg: IMessage) => void): StompSubscription | null => {
      if (!clientRef.current?.connected) return null
      return clientRef.current.subscribe(destination, callback)
    },
    [],
  )

  const publish = useCallback((destination: string, body: unknown) => {
    clientRef.current?.publish({ destination, body: JSON.stringify(body) })
  }, [])

  return (
    <StompContext.Provider value={{ connected, subscribe, publish, clientRef }}>
      {children}
    </StompContext.Provider>
  )
}

export function useStompContext(): StompContextValue {
  const ctx = useContext(StompContext)
  if (!ctx) throw new Error('useStompContext must be used within StompClientProvider')
  return ctx
}
