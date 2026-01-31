/**
 * API Client - Infrastructure Layer
 * 
 * Configured Axios instance for API communication with JWT authentication.
 */

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const TOKEN_KEY = 'auth_tokens';

interface AuthTokens {
  access: string;
  refresh: string;
}

function getStoredTokens(): AuthTokens | null {
  const stored = localStorage.getItem(TOKEN_KEY);
  return stored ? JSON.parse(stored) : null;
}

function storeTokens(tokens: AuthTokens): void {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
}

function clearTokens(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem('auth_user');
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const tokens = getStoredTokens();
    if (tokens?.access) {
      config.headers.Authorization = `Bearer ${tokens.access}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling and token refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Don't try to refresh for auth endpoints
      if (originalRequest.url?.includes('/auth/login') || 
          originalRequest.url?.includes('/auth/register') ||
          originalRequest.url?.includes('/auth/refresh')) {
        // Create user-friendly error for login failures
        const friendlyError = new Error('Invalid username or password');
        return Promise.reject(friendlyError);
      }
      
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }
      
      originalRequest._retry = true;
      isRefreshing = true;
      
      const tokens = getStoredTokens();
      
      if (!tokens?.refresh) {
        clearTokens();
        window.location.href = '/login';
        return Promise.reject(error);
      }
      
      try {
        const response = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
          refresh: tokens.refresh,
        });
        
        const newTokens: AuthTokens = {
          access: response.data.access,
          refresh: tokens.refresh,
        };
        
        storeTokens(newTokens);
        processQueue(null, newTokens.access);
        
        originalRequest.headers.Authorization = `Bearer ${newTokens.access}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as Error, null);
        clearTokens();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    // Create user-friendly error messages
    let friendlyMessage = 'Something went wrong. Please try again.';
    
    if (error.response) {
      const data = error.response.data as Record<string, unknown>;
      const status = error.response.status;
      
      // Extract error message from response
      if (data?.detail) {
        friendlyMessage = data.detail as string;
      } else if (data?.error) {
        friendlyMessage = data.error as string;
      } else if (data?.message) {
        friendlyMessage = data.message as string;
      } else if (data?.non_field_errors) {
        friendlyMessage = (data.non_field_errors as string[])[0];
      } else if (typeof data === 'object') {
        // Get the first error message from any field
        const firstError = Object.values(data).find(v => v);
        if (Array.isArray(firstError)) {
          friendlyMessage = firstError[0] as string;
        } else if (typeof firstError === 'string') {
          friendlyMessage = firstError;
        }
      }
      
      // Fallback messages for common status codes
      if (friendlyMessage === 'Something went wrong. Please try again.') {
        switch (status) {
          case 400:
            friendlyMessage = 'Please check your input and try again.';
            break;
          case 401:
            friendlyMessage = 'Invalid username or password.';
            break;
          case 403:
            friendlyMessage = 'You don\'t have permission to do this.';
            break;
          case 404:
            friendlyMessage = 'Invalid username or password.';
            break;
          case 500:
            friendlyMessage = 'Server error. Please try again later.';
            break;
        }
      }
    } else if (error.request) {
      friendlyMessage = 'Unable to connect to server. Please check your internet connection.';
    }
    
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(new Error(friendlyMessage));
  }
);
