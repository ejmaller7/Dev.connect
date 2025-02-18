import { createContext, useContext, useState } from "react";
import '../css/Auth.css';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const logIn = (userData) => {
        setUser(userData);
    };

    const logOut = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, logIn, logOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useUser = () => useContext(AuthContext);