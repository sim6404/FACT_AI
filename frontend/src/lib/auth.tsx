"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

export type UserRole = "admin" | "dept";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  department: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = "fact_user";
const USERS_KEY = "fact_users";

// 데모 계정
const DEMO_USERS: (AuthUser & { password: string })[] = [
  {
    id: "admin-1",
    name: "김관리",
    email: "admin@youngdongtech.com",
    password: "admin1234",
    role: "admin",
    department: "경영지원팀",
  },
  {
    id: "dept-1",
    name: "이생산",
    email: "prod@youngdongtech.com",
    password: "dept1234",
    role: "dept",
    department: "생산팀",
  },
];

function getStoredUsers(): (AuthUser & { password: string })[] {
  if (typeof window === "undefined") return DEMO_USERS;
  try {
    const stored = localStorage.getItem(USERS_KEY);
    const extra = stored ? JSON.parse(stored) : [];
    return [...DEMO_USERS, ...extra];
  } catch {
    return DEMO_USERS;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setUser(JSON.parse(stored));
    } catch {}
    setLoading(false);
  }, []);

  async function login(email: string, password: string) {
    const users = getStoredUsers();
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) return { ok: false, error: "이메일 또는 비밀번호가 올바르지 않습니다." };
    const { password: _, ...authUser } = found;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
    localStorage.setItem("fact_token", `mock-token-${authUser.id}`);
    setUser(authUser);
    return { ok: true };
  }

  async function register(data: RegisterData) {
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
    };
    try {
      const stored = localStorage.getItem(USERS_KEY);
      const extra = stored ? JSON.parse(stored) : [];
      localStorage.setItem(USERS_KEY, JSON.stringify([...extra, newUser]));
    } catch {}
    const { password: _, ...authUser } = newUser;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
    localStorage.setItem("fact_token", `mock-token-${authUser.id}`);
    setUser(authUser);
    return { ok: true };
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem("fact_token");
    setUser(null);
    router.push("/login");
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
