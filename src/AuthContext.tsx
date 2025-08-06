// src/contexts/AuthContext.tsx
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import axios from 'axios';

export interface UserType {
  id: number;
  email: string;
  name: string;
  phone: string;
  avatar_url: string;
  gender: string;
  default_address?: any;
  role: "admin" | "user" | "driver" | "restaurant";
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: UserType | null;
  login: (user: UserType) => void;
  logout: () => void;
  isLoading: boolean; //  thêm isLoading để hỗ trợ trạng thái chờ
}

export const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  user: null,
  login: () => { },
  logout: () => { },
  isLoading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const token = localStorage.getItem('token');
    return !!token;
  });
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true); // khởi tạo loading

  const login = (userData: UserType) => {
    setIsLoggedIn(true);
    setUser(userData);
    setIsLoading(false);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUser(null);
    setIsLoading(false);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setIsLoading(false);
      return;
    }

    axios.get('http://localhost:8000/api/get_user', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        console.log(" User từ API:", res.data);
        setUser(res.data);

        setIsLoggedIn(true);
      })
      .catch((err) => {
        console.error('Lỗi khi lấy user:', err);
        setUser(null);
        setIsLoggedIn(false);
        localStorage.removeItem('token');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
