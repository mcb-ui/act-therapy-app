import axios from 'axios';
import { AxiosError } from 'axios';
import { clearStoredAuth, getStoredToken } from './auth';

export const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = getStoredToken();
  const clientTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (clientTimeZone) {
    config.headers['x-client-timezone'] = clientTimeZone;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ error?: string }>) => {
    const status = error.response?.status;
    const hadAuthHeader = Boolean(error.config?.headers?.Authorization);

    if (status === 401 && hadAuthHeader) {
      clearStoredAuth();
    }

    return Promise.reject(error);
  }
);

export const getApiErrorMessage = (error: unknown, fallbackMessage: string) => {
  if (axios.isAxiosError<{ error?: string }>(error)) {
    return error.response?.data?.error || fallbackMessage;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallbackMessage;
};
