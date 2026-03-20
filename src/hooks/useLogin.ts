import { useMutation } from '@tanstack/react-query'

import { login, type LoginPayload } from '@/api/auth'
import { useAuth } from '@/context/AuthContext'

export function useLogin() {
  const { setSession } = useAuth()

  return useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
    onSuccess: (session) => {
      setSession({ token: session.token, role: session.role })
    },
  })
}
