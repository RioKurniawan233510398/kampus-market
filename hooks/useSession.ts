import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

const SESSION_STORAGE_KEY = "@kampus_market_session";

export interface UserSession {
  fullName: string;
  email: string;
  studentId?: string;
  university?: string;
  faculty?: string;
  studyProgram?: string;
}

interface UseSessionReturn {
  session: UserSession | null;
  loading: boolean;
  saveSession: (user: UserSession) => Promise<void>;
  clearSession: () => Promise<void>;
}

export function useSession(): UseSessionReturn {
  const [session, setSession] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  const loadSession = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(SESSION_STORAGE_KEY);
      if (stored) {
        setSession(JSON.parse(stored));
      }
    } catch (err) {
      console.error("Failed to load session:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  const saveSession = useCallback(async (user: UserSession) => {
    try {
      await AsyncStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
      setSession(user);
    } catch (err) {
      console.error("Failed to save session:", err);
    }
  }, []);

  const clearSession = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(SESSION_STORAGE_KEY);
      setSession(null);
    } catch (err) {
      console.error("Failed to clear session:", err);
    }
  }, []);

  return {
    session,
    loading,
    saveSession,
    clearSession,
  };
}
