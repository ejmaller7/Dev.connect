import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // Install this package: npm install jwt-decode
import '../css/Auth.css';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
<<<<<<< HEAD
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
=======
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
>>>>>>> 67856d434467b2ce51701b8ffdc23c88a27479c7
    };

    // Logout function
    const logOut = () => {
<<<<<<< HEAD
        localStorage.removeItem('jwtToken');
=======
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("user");
>>>>>>> 67856d434467b2ce51701b8ffdc23c88a27479c7
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
<<<<<<< HEAD
        <AuthContext.Provider value={{ isAuthenticated, user, logIn, logOut }}>
=======
        <AuthContext.Provider value={{ user, isAuthenticated, logIn, logOut }}>
>>>>>>> 67856d434467b2ce51701b8ffdc23c88a27479c7
            {children}
        </AuthContext.Provider>
    );
};

<<<<<<< HEAD
=======
// Custom hook to access AuthContext
>>>>>>> 67856d434467b2ce51701b8ffdc23c88a27479c7
export const useUser = () => useContext(AuthContext);
