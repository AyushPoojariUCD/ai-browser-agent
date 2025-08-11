import React, { useState } from "react";
import { useFirebaseAuth } from "../../hooks/useFirebaseAuth";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loginWithEmail } = useFirebaseAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await loginWithEmail(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 w-full">
      <div>
        <label className="block text-sm mb-1 text-gray-300">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 rounded bg-[#2b2b45] text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>
      <div>
        <label className="block text-sm mb-1 text-gray-300">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-2 rounded bg-[#2b2b45] text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded transition"
      >
        Login with Email
      </button>
    </form>
  );
};

export default LoginForm;
