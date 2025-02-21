import { createContext, useContext, useState, useEffect } from "react";
import '../css/Auth.css';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Check for authentication on mount
        const token = localStorage.getItem('jwtToken');
        setIsAuthenticated(!!token);
      }, []);

    const logIn = (userData) => {
        setUser(userData);
    };

    const logOut = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, user, logIn, logOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useUser = () => useContext(AuthContext);