import { useState, useEffect } from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getCurrentUser } from "@/lib/auth";
import type { User } from "@shared/schema";

export function useAuth() {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [guestMode, setGuestMode] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Check for existing session first
    const checkExistingAuth = async () => {
      if (auth.currentUser && !authChecked) {
        try {
          const userData = await getCurrentUser(auth.currentUser.uid);
          setUser(userData);
          setFirebaseUser(auth.currentUser);
          setGuestMode(false);
          setLoading(false);
          setAuthChecked(true);
          return;
        } catch (error) {
          console.warn("Existing session invalid, continuing with auth state listener");
        }
      }
    };

    checkExistingAuth();

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (authChecked && firebaseUser === auth.currentUser) {
        return; // Skip if we already processed this user
      }

      setFirebaseUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          const userData = await getCurrentUser(firebaseUser.uid);
          setUser(userData);
          setGuestMode(false);
        } catch (error) {
          console.warn("Failed to get user data, falling back to guest mode:", error);
          setUser(null);
          setGuestMode(true);
        }
      } else {
        setUser(null);
        setGuestMode(true);
      }
      
      setLoading(false);
      setAuthChecked(true);
    });

    return unsubscribe;
  }, [authChecked]);

  return {
    firebaseUser,
    user,
    loading,
    guestMode,
    isAuthenticated: !!user,
  };
}
