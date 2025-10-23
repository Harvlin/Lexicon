import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { endpoints, getAuthToken, clearAuthToken } from "./api";
import type { UserDTO, AuthResponseDTO } from "./types";

type AuthState = {
  user: UserDTO | null;
  loading: boolean;
  refresh: () => Promise<void>;
  setUser: (u: UserDTO | null) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthState | undefined>(undefined);
const USER_CACHE_KEY = "lexigrain:user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserDTO | null>(() => {
    try {
      const raw = localStorage.getItem(USER_CACHE_KEY);
      return raw ? (JSON.parse(raw) as UserDTO) : null;
    } catch { return null; }
  });
  const [loading, setLoading] = useState(false);
  const triedOnce = useRef(false);

  const refresh = async () => {
    const token = getAuthToken();
    if (!token) return; // not logged in
    setLoading(true);
    try {
      const me: AuthResponseDTO = await endpoints.auth.me();
      const next: UserDTO = {
        name: me.name || me.user?.name || user?.name || "",
        email: me.email || me.user?.email || user?.email || "",
        avatar: user?.avatar,
        joinedDate: user?.joinedDate,
      };
      setUser(next);
      try { localStorage.setItem(USER_CACHE_KEY, JSON.stringify(next)); } catch {}
    } catch {
      // If token invalid/expired, clear and reset user
      try { clearAuthToken(); } catch {}
      setUser(null);
      try { localStorage.removeItem(USER_CACHE_KEY); } catch {}
    } finally {
      setLoading(false);
      triedOnce.current = true;
    }
  };

  useEffect(() => {
    // initial fetch (with gentle retry if came from fallback cache)
    if (!triedOnce.current) {
      refresh();
    }
  }, []);

  const logout = () => {
    clearAuthToken();
    setUser(null);
    try { localStorage.removeItem(USER_CACHE_KEY); } catch {}
  };

  const value = useMemo(() => ({ user, setUser, loading, refresh, logout }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
