import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, signInWithPopup, User as FirebaseUser } from "firebase/auth";
import { auth, googleProvider, appleProvider } from "./firebase";
import { apiRequest } from "./queryClient";
import type { User, InsertUser } from "@shared/schema";

export async function loginWithEmail(email: string, password: string): Promise<FirebaseUser> {
  const result = await signInWithEmailAndPassword(auth, email, password);
  const firebaseUser = result.user;
  
  // Get user data from our database
  let user = await getCurrentUser(firebaseUser.uid);
  
  // If user doesn't exist in our database, create them
  if (!user && firebaseUser.email) {
    const userData: InsertUser = {
      email: firebaseUser.email,
      displayName: firebaseUser.displayName || "",
      firebaseUid: firebaseUser.uid,
    };
    
    const response = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
      credentials: "include",
    });
    
    if (response.ok) {
      user = await response.json();
      localStorage.setItem('thoughtmarks-user', JSON.stringify(user));
      window.location.reload();
    }
  }
  
  return firebaseUser;
}

export async function registerWithEmail(email: string, password: string, displayName?: string): Promise<User> {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  const firebaseUser = result.user;
  
  // Create user in our database
  const userData: InsertUser = {
    email: firebaseUser.email!,
    displayName: displayName || firebaseUser.displayName || "",
    firebaseUid: firebaseUser.uid,
  };
  
  const response = await apiRequest("POST", "/api/users", userData);
  const user = await response.json();
  
  // Store user in localStorage for API authentication
  localStorage.setItem('thoughtmarks-user', JSON.stringify(user));
  
  return user;
}

// Google OAuth Sign-In
export async function signInWithGoogle(): Promise<FirebaseUser> {
  const result = await signInWithPopup(auth, googleProvider);
  const firebaseUser = result.user;
  
  // Check if user exists in our database
  let user = await getCurrentUser(firebaseUser.uid);
  
  // If user doesn't exist, create them
  if (!user && firebaseUser.email) {
    const userData: InsertUser = {
      email: firebaseUser.email,
      displayName: firebaseUser.displayName || firebaseUser.email.split('@')[0],
      firebaseUid: firebaseUser.uid,
    };
    
    const response = await apiRequest("POST", "/api/users", userData);
    if (response.ok) {
      user = await response.json();
      localStorage.setItem('thoughtmarks-user', JSON.stringify(user));
    }
  }
  
  return firebaseUser;
}

// Apple OAuth Sign-In
export async function signInWithApple(): Promise<FirebaseUser> {
  const result = await signInWithPopup(auth, appleProvider);
  const firebaseUser = result.user;
  
  // Check if user exists in our database
  let user = await getCurrentUser(firebaseUser.uid);
  
  // If user doesn't exist, create them
  if (!user && firebaseUser.email) {
    const userData: InsertUser = {
      email: firebaseUser.email,
      displayName: firebaseUser.displayName || firebaseUser.email.split('@')[0],
      firebaseUid: firebaseUser.uid,
    };
    
    const response = await apiRequest("POST", "/api/users", userData);
    if (response.ok) {
      user = await response.json();
      localStorage.setItem('thoughtmarks-user', JSON.stringify(user));
    }
  }
  
  return firebaseUser;
}

export async function logout(): Promise<void> {
  localStorage.removeItem('thoughtmarks-user');
  await signOut(auth);
}

export async function getCurrentUser(firebaseUid: string): Promise<User | null> {
  try {
    const response = await fetch(`/api/users/by-firebase/${firebaseUid}`, {
      credentials: "include",
    });
    
    if (response.status === 404) {
      return null;
    }
    
    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
    
    const user = await response.json();
    
    // Store user in localStorage for API authentication
    localStorage.setItem('thoughtmarks-user', JSON.stringify(user));
    
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}
