// src/contexts/AuthContext.js
import React, { createContext, useState, useContext, ReactNode } from 'react';

type AuthContextType = {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
};

// Default value chỉ để tránh lỗi, không ảnh hưởng thực tế nếu dùng Provider đúng cách
export const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const stored = localStorage.getItem('isLoggedIn');
    return stored === 'true';
  });

const login = () => {
    console.log("AuthContext: login called");
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    console.log(isLoggedIn);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;