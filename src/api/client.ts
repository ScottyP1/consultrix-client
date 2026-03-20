import axios from 'axios'
import { getToken } from '@/lib/auth-token'

let authToken = getToken()

const apiBaseUrl = new URL(
  '/consultrix/',
  import.meta.env.VITE_API_URL
).toString()

export const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = authToken ?? getToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  } else if (config.headers.Authorization) {
    delete config.headers.Authorization
  }

  return config
})

export function setApiAuthToken(token: string | null) {
  authToken = token
}
