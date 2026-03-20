import { api } from './client'

export interface LoginPayload {
  email: string
  password: string
}

export interface LoginResponseData {
  token?: string
  accessToken?: string
  access_token?: string
  role?: string
  tokenType?: string
  expiresInSeconds?: number
}

export interface LoginResponse extends LoginResponseData {
  data?: LoginResponseData | undefined
}

export interface AuthSessionResponse {
  token: string
  role: string | null
  tokenType?: string
  expiresInSeconds?: number
}

export async function login(payload: LoginPayload) {
  const response = await api.post<LoginResponse>('/auth/login', payload)
  return normalizeLoginResponse(response.data)
}

export function normalizeLoginResponse(
  response: LoginResponse,
): AuthSessionResponse {
  const token =
    response.token ??
    response.accessToken ??
    response.access_token ??
    response.data?.token ??
    response.data?.accessToken ??
    response.data?.access_token

  if (!token) {
    throw new Error('Login response did not include an auth token.')
  }

  return {
    token,
    role: response.role ?? response.data?.role ?? null,
    tokenType: response.tokenType ?? response.data?.tokenType,
    expiresInSeconds:
      response.expiresInSeconds ?? response.data?.expiresInSeconds,
  }
}
