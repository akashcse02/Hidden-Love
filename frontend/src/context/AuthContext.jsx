import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import api from "../api/client.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadMe = useCallback(async () => {
    try {
      const { data } = await api.get("/users/me");
      setUser(data.user);
      return data.user;
    } catch {
      localStorage.removeItem("hl_token");
      setUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    (async () => {
      if (localStorage.getItem("hl_token")) {
        await loadMe();
      }
      setLoading(false);
    })();
  }, [loadMe]);

  const login = useCallback(async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("hl_token", data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    return data;
  }, []);

  const verifyEmail = useCallback(async (email, code) => {
    const { data } = await api.post("/auth/verify-email", { email, code });
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("hl_token");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, login, register, verifyEmail, logout, refresh: loadMe }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside an AuthProvider");
  return ctx;
}
