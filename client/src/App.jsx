function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex">

      {/* Sidebar */}
      <aside className="w-64 min-h-screen bg-gray-900 border-r border-gray-800 p-6">

        <h1 className="text-xl font-bold mb-10">
          🚀 AI Job Hunt
        </h1>

        <nav className="space-y-3">

          <button className="w-full text-left px-4 py-3 rounded-lg bg-purple-600">
            🏠 Dashboard
          </button>

          <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-800">
            📄 Resume Analyzer
          </button>

          <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-800">
            💼 Job Matcher
          </button>

          <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-800">
            🎤 AI Interview
          </button>

          <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-800">
            📋 Applications
          </button>

        </nav>

      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">

        <h2 className="text-3xl font-bold">
          Good afternoon 👋
        </h2>

        <p className="text-gray-400 mt-2">
          Track your job hunt smarter with AI.
        </p>
        
         {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mt-8">

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <p className="text-gray-400">Resume Score</p>
            <h3 className="text-3xl font-bold mt-2">82/100</h3>
            <p className="text-green-400 text-sm mt-2">
              Good
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <p className="text-gray-400">Job Matches</p>
            <h3 className="text-3xl font-bold mt-2">24</h3>
            <p className="text-blue-400 text-sm mt-2">
              8 new this week
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <p className="text-gray-400">Applications</p>
            <h3 className="text-3xl font-bold mt-2">12</h3>
            <p className="text-purple-400 text-sm mt-2">
              3 interviews
            </p>
          </div>

        </div>

         {/* Recent Applications */}
<div className="mt-8 bg-gray-900 border border-gray-800 rounded-2xl p-6">

  <div className="flex items-center justify-between mb-6">
    <h3 className="text-xl font-semibold">
      Recent Applications
    </h3>

    <button className="text-purple-400 hover:text-purple-300 text-sm">
      View all →
    </button>
  </div>

  <div className="space-y-4">

    {/* Application 1 */}
    <div className="flex items-center justify-between p-4 bg-gray-800 rounded-xl">
      <div>
        <h4 className="font-medium">Google</h4>
        <p className="text-sm text-gray-400">
          Software Engineer
        </p>
      </div>

      <span className="px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-400 text-sm">
        Interview
      </span>
    </div>

    {/* Application 2 */}
    <div className="flex items-center justify-between p-4 bg-gray-800 rounded-xl">
      <div>
        <h4 className="font-medium">Amazon</h4>
        <p className="text-sm text-gray-400">
          SDE I
        </p>
      </div>

      <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm">
        Applied
      </span>
    </div>

    {/* Application 3 */}
    <div className="flex items-center justify-between p-4 bg-gray-800 rounded-xl">
      <div>
        <h4 className="font-medium">Microsoft</h4>
        <p className="text-sm text-gray-400">
          Software Engineer
        </p>
      </div>

      <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-sm">
        Online Assessment
      </span>
    </div>

  </div>

</div>

{/* Quick Actions */}
<div className="mt-8">

  <h3 className="text-xl font-semibold mb-4">
    Quick Actions
  </h3>

  <div className="grid grid-cols-3 gap-6">

    <button className="bg-purple-600 hover:bg-purple-700 rounded-2xl p-6 text-left transition">
      <div className="text-3xl mb-3">📄</div>
      <h4 className="font-semibold text-lg">
        Analyze Resume
      </h4>
      <p className="text-purple-200 text-sm mt-1">
        Get your AI-powered resume score
      </p>
    </button>

    <button className="bg-gray-900 border border-gray-800 hover:border-purple-500 rounded-2xl p-6 text-left transition">
      <div className="text-3xl mb-3">💼</div>
      <h4 className="font-semibold text-lg">
        Find Job Matches
      </h4>
      <p className="text-gray-400 text-sm mt-1">
        See jobs that match your skills
      </p>
    </button>

    <button className="bg-gray-900 border border-gray-800 hover:border-purple-500 rounded-2xl p-6 text-left transition">
      <div className="text-3xl mb-3">🎤</div>
      <h4 className="font-semibold text-lg">
        Practice Interview
      </h4>
      <p className="text-gray-400 text-sm mt-1">
        Start an AI mock interview
      </p>
    </button>

  </div>

</div>

      </main>

    </div>
  );
}

export default App;