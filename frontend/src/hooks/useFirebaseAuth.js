import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  GithubAuthProvider,
} from "firebase/auth";
import { useState } from "react";
import { auth } from "../firebase/config";
import toast from "react-hot-toast";

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export const useFirebaseAuth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const loginWithEmail = async (email, password) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login successful!");
      navigate("/chat");
    } catch (error) {
      toast.error(parseFirebaseError(error));
    } finally {
      setLoading(false);
    }
  };

  const signupWithEmail = async (email, password) => {
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast.success("Signed up successfully!");
      navigate("/chat");
    } catch (error) {
      toast.error(parseFirebaseError(error));
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success("Signed in with Google!");
      navigate("/chat");
    } catch (error) {
      toast.error(parseFirebaseError(error));
    } finally {
      setLoading(false);
    }
  };

  const signInWithGitHub = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, githubProvider);
      toast.success("Signed in with GitHub!");
      navigate("/chat");
    } catch (error) {
      toast.error(parseFirebaseError(error));
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      localStorage.removeItem("conversations");
      toast.success("Logged out!");
      navigate("/login");
    } catch (error) {
      toast.error("Failed to logout.");
      console.error("Logout Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const parseFirebaseError = (error) => {
    if (error.code) {
      switch (error.code) {
        case "auth/user-not-found":
          return "User not found. Please sign up.";
        case "auth/wrong-password":
          return "Incorrect password.";
        case "auth/email-already-in-use":
          return "Email is already in use.";
        case "auth/invalid-email":
          return "Invalid email address.";
        case "auth/popup-closed-by-user":
          return "Popup was closed before completing sign-in.";
        case "auth/network-request-failed":
          return "Network error. Please check your internet connection.";
        default:
          return error.message;
      }
    }
    return "An unexpected error occurred.";
  };

  return {
    loginWithEmail,
    signupWithEmail,
    signInWithGoogle,
    signInWithGitHub,
    logout,
    loading,
  };
};
