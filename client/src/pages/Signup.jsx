import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      setSuccess("Account created successfully!");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      console.error("Signup error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-6">

      <div className="w-full max-w-md">

        {/* Brand */}
        <div className="text-center mb-8">

          <div className="inline-flex items-center gap-2 mb-5">

            <div className="w-9 h-9 rounded-xl bg-[#ff2d8d]/10 border border-[#ff2d8d]/30 flex items-center justify-center">
              <span className="text-[#ff2d8d] font-bold text-sm">
                AI
              </span>
            </div>

            <div className="text-left">
              <p className="font-semibold text-sm tracking-wide">
                AI Job Hunt
              </p>

              <p className="text-[10px] text-[#ff2d8d] tracking-[0.2em]">
                COPILOT
              </p>
            </div>

          </div>

          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Create Account
          </h1>

          <p className="text-gray-500 mt-3 text-sm">
            Create your account and start your job search.
          </p>

        </div>

        {/* Signup Card */}
        <div className="bg-[#0b0b0b] border border-white/[0.08] rounded-2xl p-7 shadow-2xl">

          {/* Error */}
          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl border border-red-500/20 bg-red-500/5">
              <p className="text-sm text-red-400">
                {error}
              </p>
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="mb-5 px-4 py-3 rounded-xl border border-[#ff2d8d]/20 bg-[#ff2d8d]/5">
              <p className="text-sm text-[#ff65ab]">
                {success}
              </p>
            </div>
          )}

          <form onSubmit={handleSignup}>

            {/* Name */}
            <div className="mb-5">

              <label className="block text-sm font-medium text-gray-300 mb-2">
                Name
              </label>

              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#080808] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#ff2d8d]/50 focus:ring-1 focus:ring-[#ff2d8d]/20 transition"
                required
              />

            </div>

            {/* Email */}
            <div className="mb-5">

              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#080808] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#ff2d8d]/50 focus:ring-1 focus:ring-[#ff2d8d]/20 transition"
                required
              />

            </div>

            {/* Password */}
            <div className="mb-6">

              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>

              <input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#080808] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#ff2d8d]/50 focus:ring-1 focus:ring-[#ff2d8d]/20 transition"
                required
              />

            </div>

            {/* Create Account */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#ff2d8d] text-white text-sm font-medium hover:bg-[#ff469a] disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,45,141,0.12)] hover:shadow-[0_0_28px_rgba(255,45,141,0.22)] transition-all"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

          </form>

          {/* Login */}
          <div className="mt-7 pt-6 border-t border-white/[0.06] text-center">

            <p className="text-sm text-gray-500">
              Already have an account?{" "}

              <button
                onClick={() => navigate("/login")}
                className="text-[#ff2d8d] font-medium hover:text-[#ff65ab] transition"
              >
                Login
              </button>
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Signup;