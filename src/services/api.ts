import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
})

api.interceptors.request.use(
  (config) => {
    const token = getTokenFromCookie()
    console.log('Token:', token) 
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

function getTokenFromCookie(): string | null {
  const match = document.cookie.match(/(^| )token=([^;]+)/)
  return match ? match[2] : null
}

export default api
