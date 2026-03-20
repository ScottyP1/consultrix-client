import {
  getMe,
  login as loginRequest,
  type AuthMeResponse,
  type LoginPayload,
  type LoginResponse,
} from './consultrix'

export type { AuthMeResponse, LoginPayload, LoginResponse }

export interface AuthSessionResponse {
  token: string
  role: string | null
  tokenType?: string
  expiresInSeconds?: number
}

export async function login(payload: LoginPayload) {
  const response = await loginRequest(payload)
  return normalizeLoginResponse(response)
}

export function normalizeLoginResponse(
  response: LoginResponse,
): AuthSessionResponse {
  if (!response.accessToken) {
    throw new Error('Login response did not include an auth token.')
  }

  return {
    token: response.accessToken,
    role: response.role ?? null,
    tokenType: response.tokenType,
    expiresInSeconds: response.expiresInSeconds,
  }
}

export { getMe }
