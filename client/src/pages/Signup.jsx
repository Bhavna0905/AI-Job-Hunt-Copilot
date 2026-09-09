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
        "http://localhost:5000/api/auth/signup",
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-black mb-2">
          Create Account
        </h1>

        <p className="text-gray-500 mb-8">
          Create your AI Job Hunt Copilot account.
        </p>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-5">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-5">
            {success}
          </div>
        )}

        <form onSubmit={handleSignup}>
          <label className="block mb-2 font-medium text-black">
            Name
          </label>

          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-lg p-3 mb-5 text-black bg-white"
            required
          />

          <label className="block mb-2 font-medium text-black">
            Email
          </label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-lg p-3 mb-5 text-black bg-white"
            required
          />

          <label className="block mb-2 font-medium text-black">
            Password
          </label>

          <input
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-lg p-3 mb-6 text-black bg-white"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-gray-500 mt-6">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-black font-semibold hover:underline"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}

export default Signup;