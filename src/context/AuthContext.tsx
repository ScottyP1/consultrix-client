import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import { setApiAuthToken } from '@/api/client'
import { getToken, removeToken, setToken as storeToken } from '@/lib/auth-token'

type AuthContextValue = {
  token: string | null
  isAuthenticated: boolean
  setToken: (token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(() => getToken())

  useEffect(() => {
    setApiAuthToken(token)
  }, [token])

  const setToken = (nextToken: string) => {
    storeToken(nextToken)
    setApiAuthToken(nextToken)
    setTokenState(nextToken)
  }

  const logout = () => {
    removeToken()
    setApiAuthToken(null)
    setTokenState(null)
  }

  const value = useMemo(
    () => ({
      token,
      isAuthenticated: Boolean(token),
      setToken,
      logout,
    }),
    [token]
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
