import { useQuery } from '@tanstack/react-query'

import { getMe } from '@/api/consultrix'

export function useMe(enabled = true) {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: getMe,
    enabled,
    staleTime: Infinity,
  })
}
