import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import { setApiAuthToken } from '@/api/client'
import {
  getAuthSession,
  removeAuthSession,
  setAuthSession as storeAuthSession,
} from '@/lib/auth-token'

type AuthSession = {
  token: string
  role: string | null
}

type AuthContextValue = {
  token: string | null
  role: string | null
  isAuthenticated: boolean
  setSession: (session: AuthSession) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSessionState] = useState<AuthSession | null>(() =>
    getAuthSession(),
  )

  const token = session?.token ?? null
  const role = session?.role ?? null

  useEffect(() => {
    setApiAuthToken(token)
  }, [token])

  const setSession = (nextSession: AuthSession) => {
    storeAuthSession(nextSession)
    setApiAuthToken(nextSession.token)
    setSessionState(nextSession)
  }

  const logout = () => {
    removeAuthSession()
    setApiAuthToken(null)
    setSessionState(null)
  }

  const value = useMemo(
    () => ({
      token,
      role,
      isAuthenticated: Boolean(token),
      setSession,
      logout,
    }),
    [role, token],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
