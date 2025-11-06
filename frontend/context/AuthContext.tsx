import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import axios from 'axios';

type User = {
  id: string;
  name?: string;
  email: string;
  isEmailVerified?: boolean;
  [key: string]: unknown;
};

type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
};

type AuthContextValue = AuthState & {
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>; 
  register: (data: Record<string, unknown>) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
};

const hasLocalStorage = (globalThis as any)?.localStorage !== undefined;

const initialState: AuthState = {
  user: null,
  token: hasLocalStorage ? (globalThis as any).localStorage.getItem('token') : null,
  isAuthenticated: false,
  loading: true,
};

type Action =
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'AUTH_FAIL' }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean };

const reducer = (state: AuthState, action: Action): AuthState => {
  switch (action.type) {
    case 'AUTH_SUCCESS':
      if (hasLocalStorage) {
        (globalThis as any).localStorage.setItem('token', action.payload.token);
      }
      return { ...state, user: action.payload.user, token: action.payload.token, isAuthenticated: true, loading: false };
    case 'AUTH_FAIL':
    case 'LOGOUT':
      if (hasLocalStorage) {
        (globalThis as any).localStorage.removeItem('token');
      }
      return { ...state, user: null, token: null, isAuthenticated: false, loading: false };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Setup axios interceptor to handle 401 errors globally
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        // If we get a 401 error (invalid token), clear the token and logout
        if (error?.response?.status === 401) {
          console.log('401 error detected - clearing token');
          if (hasLocalStorage) {
            (globalThis as any).localStorage.removeItem('token');
          }
          dispatch({ type: 'LOGOUT' });
        }
        return Promise.reject(error);
      }
    );

    // Cleanup interceptor on unmount
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  useEffect(() => {
    if (state.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [state.token]);

  useEffect(() => {
    const loadUser = async () => {
      if (state.token) {
        try {
          const res = await axios.get('http://localhost:5000/api/auth/me');
          dispatch({ type: 'AUTH_SUCCESS', payload: { user: res.data.user as User, token: state.token! } });
        } catch (err: any) {
          console.error('Failed to load user', err);
          // Clear invalid/expired token (including JWT signature errors)
          const isInvalidToken = 
            err?.response?.status === 401 || 
            err?.response?.data?.message?.includes('Invalid token') ||
            err?.response?.data?.message?.includes('signature') ||
            err?.message?.includes('signature');
          
          if (isInvalidToken) {
            console.log('Clearing invalid token from localStorage');
            if (hasLocalStorage) {
              (globalThis as any).localStorage.removeItem('token');
            }
          }
          dispatch({ type: 'AUTH_FAIL' });
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };
    void loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      dispatch({ type: 'AUTH_SUCCESS', payload: res.data as { user: User; token: string } });
      return { success: true };
    } catch (error: any) {
      dispatch({ type: 'AUTH_FAIL' });
      return { success: false, message: error?.response?.data?.message ?? 'Login failed' };
    }
  };

  const register = async (data: Record<string, unknown>) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const res = await axios.post('http://localhost:5000/api/auth/register', data);
      
      // Registration now returns token and logs user in automatically
      if (res.data.token) {
        dispatch({ type: 'AUTH_SUCCESS', payload: { user: res.data.user as User, token: res.data.token } });
        return { success: true, message: res.data.message };
      }
      
      dispatch({ type: 'AUTH_FAIL' });
      return { success: true, message: res.data.message };
    } catch (error: any) {
      dispatch({ type: 'AUTH_FAIL' });
      const message = error?.response?.data?.message || 
                     error?.response?.data?.errors?.[0]?.msg || 
                     'Registration failed';
      return { success: false, message };
    }
  };

  const logout = () => dispatch({ type: 'LOGOUT' });

  const value = useMemo<AuthContextValue>(() => ({ ...state, login, register, logout }), [state]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
