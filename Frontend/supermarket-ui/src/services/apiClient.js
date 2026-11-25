import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5192/api',
  timeout: 10000,
  headers: { Accept: 'application/json' },
})

export default apiClient
