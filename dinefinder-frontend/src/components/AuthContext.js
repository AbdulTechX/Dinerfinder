import React, { createContext, useState, useContext} from "react";

// Create the AuthContext
const AuthContext = createContext ();

// AuthProvider component to wrap around yout app
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('jwtToken'));
    
    const login = (token) => {
        localStorage.setItem('jwtToken', token);
        setIsAuthenticated(true)
    };

    const logout = () => {
        localStorage.removeItem('jwtToken');
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
    
};

// Custom hook to use the AuthContext
export const useAuth = () => {
    return useContext(AuthContext);
};
