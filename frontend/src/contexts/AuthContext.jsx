import React, { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// Create the context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const isAuthenticated = !!user;

  const loginWithEmail = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login successful!");
      navigate("/chat");
    } catch (error) {
      toast.error(error.message || "Login failed.");
    }
  };

  const signupWithEmail = async (email, password) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast.success("Signed up successfully!");
      navigate("/chat");
    } catch (error) {
      toast.error(error.message || "Signup failed.");
    }
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success("Signed in with Google!");
      navigate("/chat");
    } catch (error) {
      toast.error(error.message || "Google Sign-in failed.");
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("conversations");
      toast.success("Logged out!");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error(error.message || "Failed to logout.");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        authLoading,
        loginWithEmail,
        signupWithEmail,
        signInWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook to access context
export const useAuth = () => useContext(AuthContext);
