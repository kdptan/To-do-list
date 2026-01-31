/**
 * Authentication API - Infrastructure Layer
 * 
 * Handles authentication API calls.
 */

import { apiClient } from './apiClient';
import { 
  User, 
  AuthTokens, 
  LoginCredentials, 
  RegisterData, 
  AuthResponse 
} from '@/domain';

const TOKEN_KEY = 'auth_tokens';
const USER_KEY = 'auth_user';

/**
 * Get stored tokens from localStorage
 */
export function getStoredTokens(): AuthTokens | null {
  const stored = localStorage.getItem(TOKEN_KEY);
  return stored ? JSON.parse(stored) : null;
}

/**
 * Store tokens in localStorage
 */
export function storeTokens(tokens: AuthTokens): void {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
}

/**
 * Remove stored tokens
 */
export function clearTokens(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

/**
 * Get stored user from localStorage
 */
export function getStoredUser(): User | null {
  const stored = localStorage.getItem(USER_KEY);
  return stored ? JSON.parse(stored) : null;
}

/**
 * Store user in localStorage
 */
export function storeUser(user: User): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

/**
 * Map API user response to User entity
 */
function mapApiUserToUser(apiUser: Record<string, unknown>): User {
  return {
    id: apiUser.id as number,
    username: apiUser.username as string,
    email: apiUser.email as string,
    firstName: (apiUser.first_name as string) || '',
    lastName: (apiUser.last_name as string) || '',
    dateJoined: apiUser.date_joined as string,
  };
}

/**
 * Login with username and password
 */
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await apiClient.post<{ access: string; refresh: string }>('/auth/login/', {
    username: credentials.username,
    password: credentials.password,
  });
  
  const tokens: AuthTokens = {
    access: response.data.access,
    refresh: response.data.refresh,
  };
  
  // Store tokens
  storeTokens(tokens);
  
  // Fetch user data
  const user = await getCurrentUser();
  
  return {
    user,
    tokens,
  };
}

/**
 * Register a new user
 */
export async function register(data: RegisterData): Promise<AuthResponse> {
  const response = await apiClient.post<{
    user: Record<string, unknown>;
    tokens: { access: string; refresh: string };
    message?: string;
  }>('/auth/register/', {
    username: data.username,
    email: data.email,
    password: data.password,
    password2: data.password2,
    first_name: data.firstName || '',
    last_name: data.lastName || '',
  });
  
  const tokens: AuthTokens = {
    access: response.data.tokens.access,
    refresh: response.data.tokens.refresh,
  };
  
  // Store tokens
  storeTokens(tokens);
  
  const user = mapApiUserToUser(response.data.user);
  storeUser(user);
  
  return {
    user,
    tokens,
    message: response.data.message,
  };
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser(): Promise<User> {
  const response = await apiClient.get<Record<string, unknown>>('/auth/me/');
  const user = mapApiUserToUser(response.data);
  storeUser(user);
  return user;
}

/**
 * Refresh access token
 */
export async function refreshAccessToken(): Promise<AuthTokens> {
  const tokens = getStoredTokens();
  if (!tokens?.refresh) {
    throw new Error('No refresh token available');
  }
  
  const response = await apiClient.post<{ access: string }>('/auth/refresh/', {
    refresh: tokens.refresh,
  });
  
  const newTokens: AuthTokens = {
    access: response.data.access,
    refresh: tokens.refresh,
  };
  
  storeTokens(newTokens);
  return newTokens;
}

/**
 * Logout
 */
export async function logout(): Promise<void> {
  const tokens = getStoredTokens();
  
  try {
    if (tokens?.refresh) {
      await apiClient.post('/auth/logout/', {
        refresh: tokens.refresh,
      });
    }
  } catch {
    // Ignore errors on logout
  } finally {
    clearTokens();
  }
}

/**
 * Login with Google OAuth
 */
export async function loginWithGoogle(credential: string): Promise<AuthResponse> {
  const response = await apiClient.post<{
    user: Record<string, unknown>;
    tokens: { access: string; refresh: string };
    message?: string;
  }>('/auth/google/', {
    credential,
  });
  
  const tokens: AuthTokens = {
    access: response.data.tokens.access,
    refresh: response.data.tokens.refresh,
  };
  
  // Store tokens
  storeTokens(tokens);
  
  const user = mapApiUserToUser(response.data.user);
  storeUser(user);
  
  return {
    user,
    tokens,
    message: response.data.message,
  };
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  const tokens = getStoredTokens();
  return !!tokens?.access;
}
