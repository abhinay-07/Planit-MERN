import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

// Initial state
const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true
};

// Actions
const AUTH_SUCCESS = 'AUTH_SUCCESS';
const AUTH_FAIL = 'AUTH_FAIL';
const LOGOUT = 'LOGOUT';
const SET_LOADING = 'SET_LOADING';

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_SUCCESS:
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false
      };
    case AUTH_FAIL:
    case LOGOUT:
      localStorage.removeItem('token');
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false
      };
    case SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Set auth token in axios headers
  useEffect(() => {
    if (state.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [state.token]);

  // Load user on app start
  useEffect(() => {
    const loadUser = async () => {
      if (state.token) {
        try {
          const res = await axios.get('http://localhost:5000/api/auth/me');
          dispatch({
            type: AUTH_SUCCESS,
            payload: {
              user: res.data.user,
              token: state.token
            }
          });
        } catch (error) {
          dispatch({ type: AUTH_FAIL });
        }
      } else {
        dispatch({ type: SET_LOADING, payload: false });
      }
    };
    loadUser();
  }, []);

  // Login user
  const login = async (email, password) => {
    try {
      dispatch({ type: SET_LOADING, payload: true });
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });
      
      dispatch({
        type: AUTH_SUCCESS,
        payload: res.data
      });
      
      return { success: true };
    } catch (error) {
      dispatch({ type: AUTH_FAIL });
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  // Register user
  const register = async (userData) => {
    try {
      dispatch({ type: SET_LOADING, payload: true });
      const res = await axios.post('http://localhost:5000/api/auth/register', userData);
      
      dispatch({
        type: AUTH_SUCCESS,
        payload: res.data
      });
      
      return { success: true };
    } catch (error) {
      dispatch({ type: AUTH_FAIL });
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      };
    }
  };

  // Logout user
  const logout = () => {
    dispatch({ type: LOGOUT });
  };

  const value = {
    ...state,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};