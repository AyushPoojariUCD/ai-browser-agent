import React from "react";
import { Link } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import AuthContainer from "../components/Auth/AuthContainer";
import LogoBlock from "../components/Auth/LogoBlock";
import SignupForm from "../components/Auth/SignupForm";
import SocialSignup from "../components/Auth/SocialSignup";
import BackButton from "../components/BackButton";

const Signup = () => (
  <>
    <Toaster position="top-center" />
    <AuthContainer>
      <LogoBlock />
      <div className="w-full md:w-1/2">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Create an Account
        </h2>
        <SignupForm />
        <SocialSignup />
        <p className="mt-6 text-sm text-gray-400 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-orange-400 hover:underline">
            Sign In
          </Link>
        </p>
        <BackButton />
      </div>
    </AuthContainer>
  </>
);

export default Signup;
