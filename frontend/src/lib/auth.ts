"use client";

import { useState, useEffect, useContext, useCallback, createContext } from "react";
import React from "react";

export type UserRole = "admin" | "user" | "dept";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  createdAt: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  department?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
}

const STORAGE_KEY = "fact_auth_user";
const USERS_KEY = "fact_users";

function getStoredUsers(): (AuthUser & { password: string })[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

function seedDefaultUsers() {
  const existing = getStoredUsers();
  if (existing.length > 0) return;
  const defaults: (AuthUser & { password: string })[] = [
    {
      id: "admin-001",
      name: "시스템 관리자",
      email: "admin@youngdongtech.com",
      password: "admin1234",
      role: "admin",
      department: "IT관리",
      createdAt: new Date().toISOString(),
    },
    {
      id: "user-001",
      name: "홍길동",
      email: "prod@youngdongtech.com",
      password: "dept1234",
      role: "dept",
      department: "생산팀",
      createdAt: new Date().toISOString(),
    },
  ];
  localStorage.setItem(USERS_KEY, JSON.stringify(defaults));
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  login: async () => ({ ok: false }),
  register: async () => ({ ok: false }),
  logout: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    seedDefaultUsers();
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setUser(JSON.parse(stored));
    } catch {
      /* ignore */
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const users = getStoredUsers();
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) return { ok: false, error: "이메일 또는 비밀번호가 올바르지 않습니다." };
    const { password: _pw, ...authUser } = found;
    void _pw;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
    setUser(authUser);
    return { ok: true };
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    const users = getStoredUsers();
    if (users.find(u => u.email === data.email)) {
      return { ok: false, error: "이미 사용 중인 이메일입니다." };
    }
    const newUser: AuthUser & { password: string } = {
      id: `user-${Date.now()}`,
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
      department: data.department,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));
    const { password: _pw, ...authUser } = newUser;
    void _pw;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
    setUser(authUser);
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  return React.createElement(
    AuthContext.Provider,
    { value: { user, loading, login, register, logout } },
    children
  );
}
