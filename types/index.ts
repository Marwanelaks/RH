// User types
export interface Userr {
    id: number;
    username: string;
    email: string;
    created_at?: Date;
  }
  
  export interface UserInput {
    username: string;
    email: string;
    password: string;
  }
  
  export interface LoginInput {
    email: string;
    password: string;
  }
  
  export interface ApiResponse<T = any> {
    data?: T;
    error?: string;
    message?: string;
  }
  
  export interface AuthResponse {
    user: Omit<Userr, 'created_at'>;
  }
  
  // Token payload
  export interface TokenPayload {
    userId: number;
    iat?: number;
    exp?: number;
  }