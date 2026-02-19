"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  apiLogin,
  apiRegister,
  apiGetMe,
  type UserData,
} from "@/lib/api-client";

interface AuthContextValue {
  user: UserData | null;
  token: string | null;
  isLoading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<string | null>;
  register: (
    name: string,
    email: string,
    password: string,
    adminCode?: string
  ) => Promise<string | null>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Hydrate auth state on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token");
    if (storedToken) {
      setToken(storedToken);
      apiGetMe().then((res) => {
        if (res.data) {
          setUser(res.data.user);
        } else {
          // Token expired or invalid
          localStorage.removeItem("auth_token");
          setToken(null);
        }
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<string | null> => {
      const res = await apiLogin({ email, password });
      if (res.error) return res.error;
      if (res.data) {
        localStorage.setItem("auth_token", res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        if (res.data.user.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
      }
      return null;
    },
    [router]
  );

  const register = useCallback(
    async (
      name: string,
      email: string,
      password: string,
      adminCode?: string
    ): Promise<string | null> => {
      const res = await apiRegister({ name, email, password, adminCode });
      if (res.error) return res.error;
      if (res.data) {
        localStorage.setItem("auth_token", res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        if (res.data.user.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
      }
      return null;
    },
    [router]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("auth_token");
    setToken(null);
    setUser(null);
    router.push("/");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAdmin: user?.role === "admin",
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
