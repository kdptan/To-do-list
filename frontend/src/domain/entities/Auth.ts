/**
 * User entity
 */
export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  dateJoined: string;
}

/**
 * Authentication tokens
 */
export interface AuthTokens {
  access: string;
  refresh: string;
}

/**
 * Login credentials
 */
export interface LoginCredentials {
  username: string;
  password: string;
}

/**
 * Registration data
 */
export interface RegisterData {
  username: string;
  email: string;
  password: string;
  password2: string;
  firstName?: string;
  lastName?: string;
}

/**
 * Auth response from API
 */
export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
  message?: string;
}
