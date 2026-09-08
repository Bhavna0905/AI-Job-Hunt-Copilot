import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import JobMatcher from "./pages/JobMatcher";
import Interview from "./pages/Interview";
import Applications from "./pages/Applications";

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Dashboard</Link>
        <Link to="/resume">Resume Analyzer</Link>
        <Link to="/jobs">Job Matcher</Link>
        <Link to="/interview">AI Interview</Link>
        <Link to="/applications">Applications</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/resume" element={<ResumeAnalyzer />} />
        <Route path="/jobs" element={<JobMatcher />} />
        <Route path="/interview" element={<Interview />} />
        <Route path="/applications" element={<Applications />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;