import { api } from '../client'

export const getStudent = async () => {
  const response = await api.get('/auth/me')
  return response.data
}
