import { getAuthSession } from '@/lib/auth-token'

export const ROLE_STUDENT = 'ROLE_STUDENT'
export const ROLE_INSTRUCTOR = 'ROLE_INSTRUCTOR'
export const ROLE_ADMIN = 'ROLE_ADMIN'

export function getDefaultRouteForRole(role: string | null | undefined) {
  switch (role) {
    case ROLE_INSTRUCTOR:
      return '/instructor/dashboard'
    case ROLE_ADMIN:
      return '/admin/dashboard'
    case ROLE_STUDENT:
    default:
      return '/student/dashboard'
  }
}

export function getStoredUserRole() {
  return getAuthSession()?.role ?? null
}

export function hasRequiredRole(allowedRoles: string[]) {
  const role = getStoredUserRole()

  if (!role) {
    return false
  }

  return allowedRoles.includes(role)
}
