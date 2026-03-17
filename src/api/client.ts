import axios from 'axios'

import { getToken } from '@/lib/auth-token'

let authToken = getToken()

export const api = axios.create({
  baseURL: 'http://localhost:8080/consultrix/',
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
