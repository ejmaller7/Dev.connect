import { createContext, useContext, useState, useEffect } from "react";
import { useApolloClient } from "@apollo/client";
import '../css/Auth.css';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const client = useApolloClient();

    useEffect(() => {
        // Load user from localStorage on page load
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("jwtToken");

        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
        }
    }, []);

    // Login function
    const logIn = (userData) => {
        localStorage.setItem("jwtToken", userData.token);
        localStorage.setItem("user", JSON.stringify(userData.user));
        setUser(userData.user);
        setIsAuthenticated(true);
        client.resetStore(); // Refresh Apollo cache after login
    };

    // Logout function
    const logOut = () => {
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("user");
        setUser(null);
        setIsAuthenticated(false);
        client.clearStore(); // Clear Apollo cache on logout
    };

    return (
        <AuthContext.Provider value={{ user, setUser, isAuthenticated, logIn, logOut }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to access AuthContext
export const useUser = () => useContext(AuthContext);
