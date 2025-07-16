import React from "react";
import { useFirebaseAuth } from "../../hooks/useFirebaseAuth";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

const SocialSignup = () => {
  const { signInWithGoogle, signInWithGitHub } = useFirebaseAuth();

  return (
    <div className="w-full">
      <div className="my-4 text-gray-500 text-center">or</div>

      <button
        onClick={signInWithGoogle}
        className="flex items-center justify-center gap-3 w-full bg-white text-black font-semibold py-2 rounded hover:bg-gray-200 transition mb-3"
      >
        <FcGoogle size={20} />
        Sign Up with Google
      </button>

      <button
        onClick={signInWithGitHub}
        className="flex items-center justify-center gap-3 w-full bg-black text-white font-semibold py-2 rounded hover:bg-gray-800 transition"
      >
        <FaGithub size={20} />
        Sign Up with GitHub
      </button>
    </div>
  );
};

export default SocialSignup;
