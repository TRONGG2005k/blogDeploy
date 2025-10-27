import { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(() => localStorage.getItem('role') || null);
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('role'));

  const login = (data) => {
    setRole(data.role);
    setIsAuthenticated(true);
    const isAdmin = data.role.includes("ROLE_ADMIN");
    if(isAdmin)
      localStorage.setItem('role', "ROLE_ADMIN");
    else
      localStorage.setItem('role', data.role);
  };
  
  const logout = () => {
    setRole(null);
    setIsAuthenticated(false);
    localStorage.removeItem('role');
  };

  return (
    <AuthContext.Provider value={{ role, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
