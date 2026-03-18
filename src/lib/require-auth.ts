import { redirect } from '@tanstack/react-router'

import { getToken } from '@/lib/auth-token'

export function requireAuth() {
  if (typeof window === 'undefined') {
    return
  }

  if (!getToken()) {
    throw redirect({ to: '/' })
  }
}
