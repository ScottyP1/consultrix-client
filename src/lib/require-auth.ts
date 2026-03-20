import { redirect } from '@tanstack/react-router'

import { getAuthSession } from '@/lib/auth-token'
import { getDefaultRouteForRole } from '@/lib/auth-role'

export function requireAuth(allowedRoles?: string[]) {
  if (typeof window === 'undefined') {
    return
  }

  const session = getAuthSession()

  if (!session?.token) {
    throw redirect({ to: '/' })
  }

  if (allowedRoles?.length && (!session.role || !allowedRoles.includes(session.role))) {
    throw redirect({ to: getDefaultRouteForRole(session.role) })
  }
}
