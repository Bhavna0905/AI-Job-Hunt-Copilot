import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
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

  const navItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="w-[18px] h-[18px]"
        >
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      ),
    },

    {
      name: "Resume Analyzer",
      path: "/resume",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="w-[18px] h-[18px]"
        >
          <path d="M6 3h9l4 4v14H6z" />
          <path d="M14 3v5h5" />
          <path d="M9 13h6" />
          <path d="M9 17h6" />
        </svg>
      ),
    },

    {
      name: "Job Matcher",
      path: "/jobs",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="w-[18px] h-[18px]"
        >
          <rect x="3" y="7" width="18" height="13" rx="2" />
          <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          <path d="M3 12h18" />
        </svg>
      ),
    },

    {
      name: "AI Interview",
      path: "/interview",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="w-[18px] h-[18px]"
        >
          <rect x="7" y="3" width="10" height="15" rx="5" />
          <path d="M4 11a8 8 0 0 0 16 0" />
          <path d="M12 19v3" />
          <path d="M8 22h8" />
        </svg>
      ),
    },

    {
      name: "Applications",
      path: "/applications",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="w-[18px] h-[18px]"
        >
          <rect x="4" y="3" width="16" height="18" rx="2" />
          <path d="M8 8h8" />
          <path d="M8 12h8" />
          <path d="M8 16h5" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white flex">

      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 min-h-screen bg-[#090909] border-r border-white/[0.07] px-5 py-6 flex flex-col">

        {/* Brand */}
        <div className="px-3 mb-10">
          <div className="flex items-center gap-3">

            <div className="w-9 h-9 rounded-xl border border-[#ff2d8d]/40 bg-[#ff2d8d]/5 flex items-center justify-center">
              <span className="text-[#ff2d8d] text-sm font-bold">
                AI
              </span>
            </div>

            <div>
              <h1 className="text-lg font-semibold tracking-tight">
                AI Job Hunt
              </h1>

              <p className="text-[9px] uppercase tracking-[0.2em] text-gray-600 mt-0.5">
                Copilot
              </p>
            </div>

          </div>
        </div>

        {/* User */}
        {user && (
          <div className="mx-1 mb-8 p-4 rounded-xl bg-[#0f0f0f] border border-white/[0.07]">

            <p className="text-[10px] uppercase tracking-wider text-gray-600 mb-2">
              Logged in as
            </p>

            <p className="font-medium text-sm text-white truncate">
              {user.name}
            </p>

            <p className="text-xs text-gray-500 truncate mt-1">
              {user.email}
            </p>

          </div>
        )}

        {/* Navigation */}
        <nav className="space-y-1.5">

          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3.5 py-3 rounded-xl border transition-all duration-200 ${
                  isActive
                    ? "bg-[#ff2d8d]/10 border-[#ff2d8d]/20 text-white"
                    : "border-transparent text-gray-500 hover:text-gray-200 hover:bg-white/[0.03]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={
                      isActive
                        ? "text-[#ff2d8d]"
                        : "text-gray-600 group-hover:text-gray-300"
                    }
                  >
                    {item.icon}
                  </span>

                  <span className="text-sm">
                    {item.name}
                  </span>

                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#ff2d8d] shadow-[0_0_8px_#ff2d8d]" />
                  )}
                </>
              )}
            </NavLink>
          ))}

        </nav>

        {/* Logout */}
        <div className="mt-auto">

          <div className="border-t border-white/[0.06] mb-5" />

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-[#ff2d8d]/20 bg-[#ff2d8d]/5 text-[#ff2d8d] text-sm font-medium hover:bg-[#ff2d8d]/10 hover:border-[#ff2d8d]/40 transition-all duration-200"
          >

            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="w-[17px] h-[17px]"
            >
              <path d="M10 17l5-5-5-5" />
              <path d="M15 12H3" />
              <path d="M21 19V5a2 2 0 0 0-2-2h-6" />
            </svg>

            Logout

          </button>

        </div>

      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 min-w-0 bg-[#050505]">
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