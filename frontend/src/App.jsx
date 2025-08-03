import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ChatProvider } from "./contexts/ChatContext";

// Pages
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Chat from "./pages/Chat";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <p>Loading...</p>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const RedirectHomeIfAuthenticated = ({ children }) => {
  const { isAuthenticated, authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <p>Loading...</p>
      </div>
    );
  }

  return isAuthenticated ? <Navigate to="/chat" replace /> : children;
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <ChatProvider>
          <Routes>
            <Route
              path="/"
              element={
                <RedirectHomeIfAuthenticated>
                  <Home />
                </RedirectHomeIfAuthenticated>
              }
            />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <Chat />
                </ProtectedRoute>
              }
            />
          </Routes>
        </ChatProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
