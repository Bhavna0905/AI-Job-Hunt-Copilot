import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to generate reset token"
        );
      }

      setResetToken(data.resetToken);
      setSuccess("Password reset request successful.");
    } catch (error) {
      console.error("Forgot password error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!newPassword || !confirmPassword) {
      setError("Please enter both password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: resetToken,
            newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to reset password"
        );
      }

      setSuccess("Password reset successfully!");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error("Reset password error:", error);
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
            {resetToken ? "Create New Password" : "Forgot Password"}
          </h1>

          <p className="text-gray-500 mt-3 text-sm">
            {!resetToken
              ? "Enter your email to reset your password."
              : "Create a new password for your account."}
          </p>

        </div>

        {/* Card */}
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

          {!resetToken ? (
            /* STEP 1 */
            <form onSubmit={handleForgotPassword}>

              <div className="mb-6">

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

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-[#ff2d8d] text-white text-sm font-medium hover:bg-[#ff469a] disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,45,141,0.12)] hover:shadow-[0_0_28px_rgba(255,45,141,0.22)] transition-all"
              >
                {loading ? "Processing..." : "Reset Password"}
              </button>

            </form>
          ) : (
            /* STEP 2 */
            <form onSubmit={handleResetPassword}>

              <div className="mb-5">

                <label className="block text-sm font-medium text-gray-300 mb-2">
                  New Password
                </label>

                <input
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-[#080808] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#ff2d8d]/50 focus:ring-1 focus:ring-[#ff2d8d]/20 transition"
                  required
                />

              </div>

              <div className="mb-6">

                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password
                </label>

                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#080808] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#ff2d8d]/50 focus:ring-1 focus:ring-[#ff2d8d]/20 transition"
                  required
                />

              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-[#ff2d8d] text-white text-sm font-medium hover:bg-[#ff469a] disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,45,141,0.12)] hover:shadow-[0_0_28px_rgba(255,45,141,0.22)] transition-all"
              >
                {loading ? "Resetting Password..." : "Reset Password"}
              </button>

            </form>
          )}

          {/* Back to Login */}
          <div className="mt-6 pt-6 border-t border-white/[0.06]">

            <button
              onClick={() => navigate("/login")}
              className="w-full text-sm text-gray-500 hover:text-[#ff2d8d] transition"
            >
              Back to Login
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default ForgotPassword;