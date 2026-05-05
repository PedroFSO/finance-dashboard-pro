import axios from 'axios'

const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL
const isLocalhostApi =
  configuredApiBaseUrl?.includes('localhost') ||
  configuredApiBaseUrl?.includes('127.0.0.1')

export const hasConfiguredApiBaseUrl = Boolean(
  configuredApiBaseUrl && !(import.meta.env.PROD && isLocalhostApi),
)

export const api = axios.create({
  baseURL: hasConfiguredApiBaseUrl ? configuredApiBaseUrl : undefined,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Não foi possível concluir a requisição.'

    return Promise.reject(new Error(message))
  },
)
