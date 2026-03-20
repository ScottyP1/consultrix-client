const AUTH_SESSION_KEY = 'consultrix_auth_session'

export type StoredAuthSession = {
  token: string
  role: string | null
}

export function getAuthSession(): StoredAuthSession | null {
  if (typeof window === 'undefined') {
    return null
  }

  const rawValue = window.localStorage.getItem(AUTH_SESSION_KEY)

  if (!rawValue) {
    return null
  }

  try {
    const parsed = JSON.parse(rawValue) as Partial<StoredAuthSession>

    if (typeof parsed.token === 'string') {
      return {
        token: parsed.token,
        role: typeof parsed.role === 'string' ? parsed.role : null,
      }
    }
  } catch {
    return { token: rawValue, role: null }
  }

  return null
}

export function getToken() {
  return getAuthSession()?.token ?? null
}

export function setAuthSession(session: StoredAuthSession) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session))
}

export function setToken(token: string) {
  setAuthSession({ token, role: null })
}

export function removeAuthSession() {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.removeItem(AUTH_SESSION_KEY)
}

export function removeToken() {
  removeAuthSession()
}
