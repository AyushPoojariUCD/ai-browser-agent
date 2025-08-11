// src/pages/Login.jsx (after breakdown)
import React from "react";
import { Toaster } from "react-hot-toast";
import AuthContainer from "../components/Auth/AuthContainer";
import LogoBlock from "../components/Auth/LogoBlock";
import LoginForm from "../components/Auth/LoginForm";
import SocialLogin from "../components/Auth/SocialLogin";
import BackButton from "../components/BackButton";
import { Link } from "react-router-dom";

const Login = () => (
  <>
    <Toaster position="top-center" />
    <AuthContainer>
      <LogoBlock />
      <div className="w-full md:w-1/2">
        <h2 className="text-3xl font-bold mb-6 text-center">Welcome Back</h2>
        <LoginForm />
        <SocialLogin />
        <p className="mt-6 text-sm text-gray-400 text-center">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-orange-400 hover:underline">
            Sign Up
          </Link>
        </p>
        <BackButton />
      </div>
    </AuthContainer>
  </>
);

export default Login;
