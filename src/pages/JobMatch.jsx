import React, { useState, useEffect, useMemo } from "react";
import {
  Briefcase,
  MapPin,
  Star,
  Rocket,
  Search,
  Filter,
  Sun,
  Moon,
  Save,
  CheckCircle,
  X,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { getSkills } from "../api/skills";
import { suggestJobs } from "../api/jobs";
import { auth } from "../firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";

export default function JobMatch() {
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("careercraft_theme") === "dark"
  );
  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState(() => {
    const stored = localStorage.getItem("saved_jobs");
    return stored ? JSON.parse(stored) : [];
  });
  const [search, setSearch] = useState("");
  const [minMatch, setMinMatch] = useState(0);
  const [showModal, setShowModal] = useState(null);
  const [aiModal, setAiModal] = useState(null);
  const [alert, setAlert] = useState(false);
  const [user] = useAuthState(auth);

  const containerClass = darkMode
    ? "bg-gray-900 text-gray-100"
    : "bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-900";

  const cardBase = darkMode
    ? "bg-gray-800 border-gray-700 text-gray-100"
    : "bg-white border-gray-100 text-gray-900";

  // Load jobs from API
  useEffect(() => {
    async function loadJobs() {
      if (!user) return;
      try {
        // 1. Get user skills
        const skillsData = await getSkills();
        const userSkills = skillsData.skills || [];

        // 2. Get job suggestions based on skills
        const jobsData = await suggestJobs(userSkills);

        // Map backend job format to UI format if needed
        // Backend returns: { id, title, company, location, match_score, skills, posted_at }
        // UI expects: id, title, company, location, match, skills, posted
        const mappedJobs = (jobsData.jobs || []).map(j => ({
          id: j.id,
          title: j.title,
          company: j.company,
          location: j.location,
          match: j.match_score || 0,
          skills: j.skills || [],
          posted: j.posted_at ? new Date(j.posted_at).toLocaleDateString() : "Recently"
        }));

        setJobs(mappedJobs);
        setTimeout(() => setAlert(true), 2500);
      } catch (err) {
        console.error("Failed to load jobs", err);
      }
    }
    loadJobs();
  }, [user]);

  // Persist dark mode
  useEffect(() => {
    localStorage.setItem("careercraft_theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // Persist saved jobs
  useEffect(() => {
    localStorage.setItem("saved_jobs", JSON.stringify(savedJobs));
  }, [savedJobs]);

  // ✅ Filter logic
  const filteredJobs = useMemo(() => {
    return jobs.filter(
      (j) =>
        j.title.toLowerCase().includes(search.toLowerCase()) &&
        j.match >= minMatch
    );
  }, [jobs, search, minMatch]);

  const matchTrendData = [
    { week: "W1", score: 70 },
    { week: "W2", score: 76 },
    { week: "W3", score: 80 },
    { week: "W4", score: 84 },
    { week: "W5", score: 89 },
  ];

  // ✅ Toggle save job
  function toggleSave(id) {
    if (savedJobs.includes(id))
      setSavedJobs((prev) => prev.filter((j) => j !== id));
    else setSavedJobs((prev) => [...prev, id]);
  }

  return (
    <div
      className={`${containerClass} min-h-screen py-12 transition-colors duration-300`}
    >
      <div className="max-w-6xl mx-auto px-6 relative">
        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <h1 className="text-4xl font-extrabold flex items-center gap-3">
              <Rocket className="w-8 h-8 text-blue-600" />
              Smart Job Recommendations
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              Tailored matches based on your resume insights.
            </p>
          </div>
          <button
            onClick={() => setDarkMode((d) => !d)}
            className={`p-2 rounded-lg border ${darkMode ? "border-gray-700" : "border-gray-200"
              }`}
            aria-label="Toggle theme"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-700" />
            )}
          </button>
        </div>

        {/* Search + Filters */}
        <div
          className={`rounded-xl ${cardBase} p-4 flex flex-wrap gap-4 items-center justify-between mb-10 shadow`}
        >
          <div className="flex items-center gap-2 flex-1">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`flex-1 bg-transparent outline-none text-sm ${darkMode ? "placeholder-gray-400" : "placeholder-gray-500"
                }`}
            />
          </div>

          <div className="flex items-center gap-3">
            <Filter className="w-4 h-4 text-gray-400" />
            <input
              type="range"
              min="0"
              max="100"
              value={minMatch}
              onChange={(e) => setMinMatch(Number(e.target.value))}
              className="w-24"
            />
            <span className="text-sm text-gray-500">Min {minMatch}%</span>
          </div>
        </div>

        {/* Loading skeleton */}
        {jobs.length === 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-white border border-gray-100 shadow animate-pulse h-60"
              />
            ))}
          </div>
        ) : (
          <motion.div
            layout
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredJobs.map((job, i) => (
              <motion.div
                key={job.id}
                whileHover={{ y: -4 }}
                className={`rounded-2xl border ${cardBase} shadow-md p-6 transition-all`}
              >
                {/* Header */}
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Briefcase className="text-blue-600 w-5 h-5" />
                    {job.title}
                  </h2>
                  <span className="text-xs text-gray-500">{job.posted}</span>
                </div>

                <p className="font-medium text-gray-700">{job.company}</p>
                <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                  <MapPin className="w-4 h-4 text-blue-500" />
                  {job.location}
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {job.skills.map((s, idx) => (
                    <motion.span
                      whileHover={{ scale: 1.1 }}
                      key={idx}
                      className="px-3 py-1 text-xs font-medium bg-blue-50 border border-blue-100 rounded-full text-blue-700"
                    >
                      {s}
                    </motion.span>
                  ))}
                </div>

                {/* Animated match bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Match Score</span>
                    <span
                      className={`font-semibold ${job.match >= 85
                          ? "text-green-600"
                          : job.match >= 70
                            ? "text-yellow-600"
                            : "text-gray-500"
                        }`}
                    >
                      {job.match}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${job.match}%` }}
                      transition={{ duration: 1 }}
                      className={`h-full ${job.match >= 85
                          ? "bg-green-500"
                          : job.match >= 70
                            ? "bg-yellow-500"
                            : "bg-gray-400"
                        }`}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center mt-5">
                  <button
                    onClick={() => setShowModal(job)}
                    className="px-4 py-2 text-sm bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow hover:opacity-90 transition"
                  >
                    View Details
                  </button>

                  <button
                    onClick={() => toggleSave(job.id)}
                    className="p-2 rounded-full border hover:scale-110 transition"
                    title="Save Job"
                  >
                    {savedJobs.includes(job.id) ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <Save className="w-5 h-5 text-gray-500" />
                    )}
                  </button>
                </div>

                {/* AI fit suggestion toggle */}
                <button
                  onClick={() => setAiModal(job)}
                  className="mt-3 text-xs text-blue-600 hover:underline flex items-center gap-1"
                >
                  <Sparkles className="w-4 h-4" /> View AI Fit
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Trend chart */}
        <div className={`mt-16 rounded-2xl border ${cardBase} p-6`}>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" /> Your Career Fit
            Trend
          </h3>
          <div className="h-64">
            <ResponsiveContainer>
              <LineChart data={matchTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Smart alert */}
        <AnimatePresence>
          {alert && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.5 }}
              className="fixed bottom-6 right-6 bg-white shadow-lg rounded-xl border border-blue-100 p-4 flex items-center gap-3"
            >
              <Rocket className="text-blue-600 w-5 h-5" />
              <p className="text-sm text-gray-700">
                3 new roles match your updated skills 🎯
              </p>
              <button
                onClick={() => setAlert(false)}
                className="ml-2 text-gray-400 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Job detail modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className={`max-w-lg w-full rounded-2xl p-6 ${cardBase}`}
              >
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-xl font-bold">{showModal.title}</h2>
                  <button
                    onClick={() => setShowModal(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-sm text-gray-500 mb-2">
                  {showModal.company} • {showModal.location}
                </p>
                <p className="text-gray-700 mb-4">
                  Exciting opportunity to join a growing product team. Ideal for
                  engineers comfortable with modern JS frameworks and teamwork.
                </p>
                <div className="flex gap-2 flex-wrap mb-4">
                  {showModal.skills.map((s, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs border border-blue-100"
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowModal(null)}
                    className="px-4 py-2 border rounded-md"
                  >
                    Close
                  </button>
                  <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md">
                    Apply Now
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Fit modal */}
        <AnimatePresence>
          {aiModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className={`max-w-md w-full rounded-2xl p-6 ${cardBase}`}
              >
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-blue-600" /> AI Fit
                    Insights
                  </h2>
                  <button
                    onClick={() => setAiModal(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-sm text-gray-600">
                  Based on your skills and profile, you’re an excellent fit for{" "}
                  <strong>{aiModal.title}</strong> at{" "}
                  <strong>{aiModal.company}</strong>. Your React + Tailwind
                  expertise strongly matches this role’s core stack. Adding
                  backend depth with Node.js could raise your fit score further!
                </p>
                <div className="mt-5 flex justify-end">
                  <button
                    onClick={() => setAiModal(null)}
                    className="px-4 py-2 border rounded-md"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
