import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
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
            Welcome Back
          </h1>

          <p className="text-gray-500 mt-3 text-sm">
            Login to continue your job search.
          </p>

        </div>

        {/* Login Card */}
        <div className="bg-[#0b0b0b] border border-white/[0.08] rounded-2xl p-7 shadow-2xl">

          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl border border-red-500/20 bg-red-500/5">
              <p className="text-sm text-red-400">
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleLogin}>

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
            <div className="mb-2">

              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#080808] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#ff2d8d]/50 focus:ring-1 focus:ring-[#ff2d8d]/20 transition"
                required
              />

            </div>

            {/* Forgot Password */}
            <div className="text-right mb-6">

              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-sm text-gray-500 hover:text-[#ff2d8d] transition"
              >
                Forgot Password?
              </button>

            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#ff2d8d] text-white text-sm font-medium hover:bg-[#ff469a] disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,45,141,0.12)] hover:shadow-[0_0_28px_rgba(255,45,141,0.22)] transition-all"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

          {/* Signup */}
          <div className="mt-7 pt-6 border-t border-white/[0.06] text-center">

            <p className="text-sm text-gray-500">
              Don't have an account?{" "}

              <button
                onClick={() => navigate("/signup")}
                className="text-[#ff2d8d] font-medium hover:text-[#ff65ab] transition"
              >
                Sign up
              </button>
            </p>

          </div>

        </div>

        <p className="text-center text-xs text-gray-700 mt-6">
          Secure access to your job search workspace
        </p>

      </div>

    </div>
  );
}

export default Login;