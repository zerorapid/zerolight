"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface AuthUser {
  username: string;
  name: string;
  role: string;
  tier: string;
  avatar: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser | null;
  login: (username: string, pass: string) => { success: boolean; error?: string };
  logout: () => void;
}

const DEFAULT_USER: AuthUser = {
  username: "zerolight",
  name: "ZeroLight Root Admin",
  role: "System Architect",
  tier: "Enterprise Tier",
  avatar: "ZL",
};

const AUTH_STORAGE_KEY = "zl_auth_session";

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: () => ({ success: false }),
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored === "authenticated") {
        setIsAuthenticated(true);
        setUser(DEFAULT_USER);
      }
    } catch {
      // Ignore storage errors in restricted contexts
    }
    setHasHydrated(true);
  }, []);

  const login = (username: string, pass: string) => {
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = pass.trim();

    if (cleanUser === "zerolight" && cleanPass === "22121997") {
      setIsAuthenticated(true);
      setUser(DEFAULT_USER);
      try {
        window.localStorage.setItem(AUTH_STORAGE_KEY, "authenticated");
      } catch {
        // storage quota fallback
      }
      return { success: true };
    }

    if (cleanUser !== "zerolight") {
      return { success: false, error: "Invalid username. Default username is 'zerolight'." };
    }

    return { success: false, error: "Incorrect PIN/password. Access denied." };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    try {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      // storage clear fallback
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
