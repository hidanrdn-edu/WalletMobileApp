import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import type { User } from "@/db/schema";
import { getCurrentUser } from "@/services/auth";

type AuthContextValue = {
  currentUser: User | null;
  isAuthReady: boolean;
  setCurrentUser: (user: User | null) => void;
  refreshCurrentUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    void refreshCurrentUser();
  }, []);

  async function refreshCurrentUser() {
    try {
      const user = await getCurrentUser();
      setCurrentUser(user);
    } finally {
      setIsAuthReady(true);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthReady,
        setCurrentUser,
        refreshCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}
