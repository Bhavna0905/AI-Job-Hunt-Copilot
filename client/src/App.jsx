import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import JobMatcher from "./pages/JobMatcher";
import Interview from "./pages/Interview";
import Applications from "./pages/Applications";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function Layout({ children }) {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex">

      {/* Sidebar */}
      <aside className="w-64 min-h-screen bg-gray-900 border-r border-gray-800 p-6 flex flex-col">

        <h1 className="text-xl font-bold mb-10">
          🚀 AI Job Hunt
        </h1>

        {/* User Info */}
        {user && (
          <div className="mb-8 p-3 bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-400">
              Logged in as
            </p>

            <p className="font-semibold truncate">
              {user.name}
            </p>

            <p className="text-xs text-gray-400 truncate">
              {user.email}
            </p>
          </div>
        )}

        <nav className="space-y-3">

          <Link
            to="/"
            className="block px-4 py-3 rounded-lg hover:bg-gray-800"
          >
            🏠 Dashboard
          </Link>

          <Link
            to="/resume"
            className="block px-4 py-3 rounded-lg hover:bg-gray-800"
          >
            📄 Resume Analyzer
          </Link>

          <Link
            to="/jobs"
            className="block px-4 py-3 rounded-lg hover:bg-gray-800"
          >
            💼 Job Matcher
          </Link>

          <Link
            to="/interview"
            className="block px-4 py-3 rounded-lg hover:bg-gray-800"
          >
            🎤 AI Interview
          </Link>

          <Link
            to="/applications"
            className="block px-4 py-3 rounded-lg hover:bg-gray-800"
          >
            📋 Applications
          </Link>

        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="mt-auto w-full px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white"
        >
          🚪 Logout
        </button>

      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {children}
      </main>

    </div>
  );
}

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* Public Routes */}
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/resume"
          element={
            <ProtectedRoute>
              <Layout>
                <ResumeAnalyzer />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/jobs"
          element={
            <ProtectedRoute>
              <Layout>
                <JobMatcher />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/interview"
          element={
            <ProtectedRoute>
              <Layout>
                <Interview />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/applications"
          element={
            <ProtectedRoute>
              <Layout>
                <Applications />
              </Layout>
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;