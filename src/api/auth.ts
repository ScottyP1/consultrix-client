import { api } from './client'

export interface LoginPayload {
  email: string
  password: string
}

export interface LoginResponse {
  token?: string
  accessToken?: string
  access_token?: string
  data?:
    | {
        token?: string
        accessToken?: string
        access_token?: string
      }
    | undefined
}

export async function login(payload: LoginPayload) {
  const response = await api.post<LoginResponse>('/auth/login', payload)
  return response.data
}

export function extractAuthToken(response: LoginResponse) {
  return (
    response.token ??
    response.accessToken ??
    response.access_token ??
    response.data?.token ??
    response.data?.accessToken ??
    response.data?.access_token ??
    null
  )
}
