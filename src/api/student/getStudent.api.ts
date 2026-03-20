import { api } from '../client'

export const getStudent = async () => {
  const response = await api.get('/students/me')
  return response.data
}
