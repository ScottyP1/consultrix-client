import { useMutation } from '@tanstack/react-query'

import { extractAuthToken, login, type LoginPayload } from '@/api/auth'
import { useAuth } from '@/context/AuthContext'

export function useLogin() {
  const { setToken } = useAuth()

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const response = await login(payload)
      const token = extractAuthToken(response)

      if (!token) {
        throw new Error('Login response did not include an auth token.')
      }

      return token
    },
    onSuccess: (token) => {
      setToken(token)
    },
  })
}
