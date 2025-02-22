import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // Install this package: npm install jwt-decode
import '../css/Auth.css';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Check for token on mount
        const token = localStorage.getItem('jwtToken');

        if (token) {
            try {
                const decodedUser = jwtDecode(token);
                const currentTime = Date.now() / 1000; // Convert to seconds

                if (decodedUser.exp && decodedUser.exp > currentTime) {
                    setUser(decodedUser);
                    setIsAuthenticated(true);
                } else {
                    logOut(); // Token expired, log out user
                }
            } catch (error) {
                console.error("Invalid token:", error);
                logOut(); // If token is invalid, log out user
            }
        }
    }, []);

    const logIn = (userData, token) => {
        if (!token) {
            console.error("Token is undefined, skipping login.");
            return;
        }
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem("jwtToken", token);
    };

    const logOut = () => {
        localStorage.removeItem('jwtToken');
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, logIn, logOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useUser = () => useContext(AuthContext);
