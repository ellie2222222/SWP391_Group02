import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from '../utils/axiosInstance';

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
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        const refreshAuthToken = async () => {
            try {
                const response = await axiosInstance.post('/user/refresh-token', {}, { withCredentials: true });
                const { token, existToken } = response.data;

                if (existToken) {
                    const decoded = jwtDecode(token);
                    localStorage.setItem('token', token);
                    setUser({ ...decoded, token });
                } else {
                    setUser(null);
                }
            } catch (error) {
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

    const login = async (email, password) => {
        try {
            const response = await axiosInstance.post('/user/login', { email, password }, { withCredentials: true });
            const { token } = response.data;
            const decoded = jwtDecode(token);
            localStorage.setItem('token', token);
            setUser({ ...decoded, token });
            return decoded.role;
        } catch (error) {
            throw error;
        }
    };

    const signup = async (userData) => {
        try {
            const response = await axiosInstance.post('/user/signup', userData, { withCredentials: true });
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
            await axiosInstance.post('/user/logout', {}, { withCredentials: true });
            localStorage.removeItem('token'); // Remove the token from local storage
            setUser(null);
        } catch (error) {
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;