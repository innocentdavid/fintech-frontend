import { createContext, useState } from 'react';

export const AuthContext = createContext({
    isAuthenticated: false,
    user: null,
    login: () => { },
    logout: () => { },
});

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    const login = (userData) => {
        // authenticate user and set state
    };

    const logout = () => {
        // clear user authentication and set state
    };

    return (
        <AuthContext.Provider
            value={{ isAuthenticated, user, login, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
};
