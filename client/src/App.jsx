import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import JobMatcher from "./pages/JobMatcher";
import Interview from "./pages/Interview";
import Applications from "./pages/Applications";

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex">

      {/* Sidebar */}
      <aside className="w-64 min-h-screen bg-gray-900 border-r border-gray-800 p-6">

        <h1 className="text-xl font-bold mb-10">
          🚀 AI Job Hunt
        </h1>

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

        <Route
          path="/"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />

        <Route
          path="/resume"
          element={
            <Layout>
              <ResumeAnalyzer />
            </Layout>
          }
        />

        <Route
          path="/jobs"
          element={
            <Layout>
              <JobMatcher />
            </Layout>
          }
        />

        <Route
          path="/interview"
          element={
            <Layout>
              <Interview />
            </Layout>
          }
        />

        <Route
          path="/applications"
          element={
            <Layout>
              <Applications />
            </Layout>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;