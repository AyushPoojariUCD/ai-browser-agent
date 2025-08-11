const AuthContainer = ({ children }) => (
  <div className="min-h-screen bg-gradient-to-br from-[#0f0f1b] via-[#131321] to-[#1a1a2e] flex items-center justify-center px-4">
    <div className="w-full max-w-5xl bg-[#1f1f3a] p-8 md:p-12 rounded-xl shadow-lg text-white flex flex-col md:flex-row items-center gap-8">
      {children}
    </div>
  </div>
);
export default AuthContainer;
