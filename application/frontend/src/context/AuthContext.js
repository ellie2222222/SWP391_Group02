import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const token = localStorage.getItem('token');
        return token ? { ...jwtDecode(token), token } : null;
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = jwtDecode(token);
            setUser( { ...decoded, token });
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await axios.post('http://localhost:4000/api/user/login', { email, password });
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
            await axios.post('http://localhost:4000/api/user/signup', userData);
        } catch (error) {
            throw error
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
