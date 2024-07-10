import React, { createContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const token = localStorage.getItem('token');
        return token ? { ...jwtDecode(token), token } : null;
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const decoded = jwtDecode(token);
                    const currentTime = Date.now() / 1000;

                    if (decoded.exp < currentTime) {
                        await refreshAuthToken();
                    } else {
                        setUser({ ...decoded, token });
                    }
                }
            } catch (error) {
                console.error('Error checking auth:', error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        const refreshAuthToken = async () => {
            try {
                const response = await axios.post('http://localhost:4000/api/user/refresh-token', {}, { withCredentials: true });
                const { token, existToken } = response.data;

                if (existToken) {
                    const decoded = jwtDecode(token);
                    localStorage.setItem('token', token);
                    setUser({ ...decoded, token });
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error('Error refreshing token:', error);
                setUser(null);
            }
        };

        const intervalId = setInterval(async () => {
            const token = localStorage.getItem('token');
            if (token) {
                const decoded = jwtDecode(token);
                const currentTime = Date.now() / 1000;
                
                // If token is about to expire in the next minute, refresh it
                if (decoded.exp - currentTime < 60) {
                    await refreshAuthToken();
                }
            }
        }, 60000); // Check every minute

        checkAuth();

        return () => clearInterval(intervalId);
    }, []);

    const baseUrl = 'http://localhost:4000/api/user';

    const login = async (email, password) => {
        try {
            const response = await axios.post(baseUrl + '/login', { email, password }, { withCredentials: true });
            const { token } = response.data;
            const decoded = jwtDecode(token);
            localStorage.setItem('token', token);
            setUser({ ...decoded, token });
            return decoded.role;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const signup = async (userData) => {
        try {
            const response = await axios.post(baseUrl + '/signup', userData, { withCredentials: true });
            const { token } = response.data;
            const decoded = jwtDecode(token);
            localStorage.setItem('token', token);
            setUser({ ...decoded, token });
            return decoded.role;
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                throw new Error(error.response.data.error);
            } else {
                throw new Error('Signup failed');
            }
        }
    };

    const logout = async () => {
        try {
          await axios.post(baseUrl + '/logout', {}, { withCredentials: true });
          localStorage.removeItem('token'); // Remove the token from local storage
          setUser(null);
        } catch (error) {
          console.error('Logout error:', error);
        }
      };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;