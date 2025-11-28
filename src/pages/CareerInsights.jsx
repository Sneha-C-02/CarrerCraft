import React, { useState, useMemo } from "react";
import {
  TrendingUp,
  Briefcase,
  Lightbulb,
  Target,
  Rocket,
  Moon,
  Sun,
  Check,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { getResume } from "../api/resume";
import { scoreResume } from "../api/ai";
import { auth } from "../firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";

export default function CareerInsights() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState("Overview");

  const [goals] = useState([
    { id: 1, title: "Build 3 full-stack projects", progress: 80 },
    { id: 2, title: "Contribute to open-source", progress: 40 },
    { id: 3, title: "Learn TypeScript", progress: 60 },
  ]);

  const [tasks, setTasks] = useState([
    { id: "t1", text: "Add measurable metrics to experience bullets", done: false },
    { id: "t2", text: "Include 1 open-source contribution", done: false },
    { id: "t3", text: "Add TypeScript project to portfolio", done: false },
  ]);

  const [aiOpen, setAiOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [user] = useAuthState(auth);

  const summaryStats = useMemo(
    () => [
      { label: "Skill Score", value: "82%", icon: <TrendingUp />, color: "text-blue-600" },
      { label: "Job Readiness", value: "76%", icon: <Briefcase />, color: "text-green-600" },
      { label: "Market Fit", value: "88%", icon: <Lightbulb />, color: "text-purple-600" },
    ],
    []
  );

  const radarData = [
    { skill: "React", you: 90, market: 80 },
    { skill: "Tailwind", you: 80, market: 75 },
    { skill: "Firebase", you: 70, market: 60 },
    { skill: "Node.js", you: 60, market: 70 },
    { skill: "TypeScript", you: 55, market: 65 },
  ];

  const growthData = [
    { week: "W1", score: 68 },
    { week: "W2", score: 70 },
    { week: "W3", score: 73 },
    { week: "W4", score: 76 },
    { week: "W5", score: 79 },
    { week: "W6", score: 82 },
  ];

  const containerClass = darkMode
    ? "bg-gray-900 text-gray-100"
    : "bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-900";
  const cardBase = darkMode
    ? "bg-gray-800 border-gray-700 text-gray-100"
    : "bg-white border-gray-100 text-gray-900";

  function toggleTask(id) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  }

  async function runAIAnalyze() {
    if (!user) return alert("Please login to analyze resume");
    setAiOpen(true);
    setAiLoading(true);
    setAiResult(null);

    try {
      // 1. Fetch current resume
      const resumeData = await getResume();
      const resume = resumeData.resume || {};

      // 2. Score resume via API
      const data = await scoreResume(resume);

      setAiResult({
        resumeScore: data.score || 0,
        primaryRole: "Frontend Engineer", // Mock for now, backend could infer this
        recommendation: (data.suggestions || [])[0] || "Great start! Keep adding more details.",
        topGaps: data.gaps || [],
      });
    } catch (err) {
      console.error("AI Analysis failed", err);
      // Fallback mock result if API fails or resume empty
      setAiResult({
        resumeScore: 65,
        primaryRole: "Developer",
        recommendation: "We couldn't fully analyze your resume. Try adding more sections.",
        topGaps: ["Experience Details", "Skills List"],
      });
    } finally {
      setAiLoading(false);
    }
  }

  return (
    <div className={`${containerClass} min-h-screen py-10 transition-colors duration-300`}>
      <div className="max-w-6xl mx-auto px-6">
        {/* HEADER */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">
              Career Insights
            </h1>
            <p className="text-gray-500 mt-2">
              Personalized analytics & AI-backed recommendations to speed up your growth.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setDarkMode((d) => !d)}
              className={`p-2 rounded-lg border ${darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
                }`}
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </button>
            <button
              onClick={runAIAnalyze}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg shadow hover:scale-105 transform transition"
            >
              <Rocket className="w-4 h-4" /> Analyze My Resume
            </button>
          </div>
        </div>

        {/* SUMMARY STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {summaryStats.map((s) => (
            <motion.div
              key={s.label}
              whileHover={{ y: -4 }}
              className={`p-5 rounded-xl border ${cardBase} shadow-sm flex items-center gap-4`}
            >
              <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-white/30">
                {React.cloneElement(s.icon, { className: `${s.color} w-5 h-5` })}
              </div>
              <div>
                <p className="text-sm text-gray-500">{s.label}</p>
                <h3 className="text-2xl font-bold">{s.value}</h3>
              </div>
            </motion.div>
          ))}
        </div>

        {/* TABS */}
        <div className="flex gap-3 mb-6">
          {["Overview", "Growth", "Goals", "AI Tips"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${activeTab === tab
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow"
                  : `${darkMode ? "text-gray-300" : "text-gray-700"}`
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* TAB CONTENT */}
        <AnimatePresence mode="wait">
          {activeTab === "Overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.3 }}
              className={`rounded-2xl p-6 border ${cardBase} shadow-lg mb-6`}
            >
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1 min-w-[260px]">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" /> Skill Radar
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="skill" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar name="You" dataKey="you" stroke="#2563eb" fill="#2563eb" fillOpacity={0.25} />
                      <Radar name="Market" dataKey="market" stroke="#9333ea" fill="#9333ea" fillOpacity={0.18} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-3">Summary & Path</h3>
                  <p className="text-gray-600 mb-4">
                    Strong frontend foundation (React, Tailwind). Focus next on TypeScript and one backend project to become a full-stack candidate.
                  </p>
                  <div className="p-4 rounded-lg bg-white/40 border">
                    <p className="text-sm text-gray-700">
                      <strong>Fit:</strong> Frontend Engineer — 78%
                    </p>
                    <p className="text-sm text-gray-500">Improve with +TypeScript + Next.js + Metrics</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "Goals" && (
            <motion.div
              key="goals"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              className={`rounded-2xl p-6 border ${cardBase} shadow-lg mb-6`}
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-600" /> Career Goals
              </h3>
              {goals.map((g) => (
                <div key={g.id} className="p-4 mb-3 rounded-lg border bg-white/50">
                  <div className="flex justify-between">
                    <span>{g.title}</span>
                    <span>{g.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
                    <div
                      className="h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                      style={{ width: `${g.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === "AI Tips" && (
            <motion.div
              key="aitips"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              className={`rounded-2xl p-6 border ${cardBase} shadow-lg mb-6`}
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-500" /> AI Suggestions
              </h3>
              {tasks.map((t) => (
                <div
                  key={t.id}
                  className="flex justify-between items-center p-3 border rounded-lg mb-2 bg-white/40"
                >
                  <div className="flex items-center gap-2">
                    <input type="checkbox" checked={t.done} onChange={() => toggleTask(t.id)} />
                    <p className={`${t.done ? "line-through text-gray-400" : ""}`}>
                      {t.text}
                    </p>
                  </div>
                  {t.done ? <Check className="text-green-600 w-4 h-4" /> : <X className="text-gray-400 w-4 h-4" />}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="text-center text-sm text-gray-500 mt-6">
          Mock demo data — integrate backend later for real AI insights.
        </div>
      </div>

      {/* ✅ SINGLE CLEAN MODAL */}
      <AnimatePresence>
        {aiOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              transition={{ duration: 0.25 }}
              className={`w-full max-w-md rounded-2xl p-6 ${darkMode ? "bg-gray-900 text-gray-100 border border-gray-700" : "bg-white text-gray-900 border border-gray-100"
                }`}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Rocket className="w-5 h-5 text-blue-600" /> AI Resume Insights
                </h3>
                <button onClick={() => setAiOpen(false)}>
                  <X className="w-4 h-4" />
                </button>
              </div>

              {aiLoading && (
                <div className="flex flex-col items-center py-10">
                  <div className="animate-spin w-10 h-10 border-4 border-blue-300 border-t-blue-600 rounded-full"></div>
                  <p className="mt-4 text-gray-500 text-sm">Analyzing resume...</p>
                </div>
              )}

              {!aiLoading && aiResult && (
                <div className="space-y-3">
                  <p><strong>Score:</strong> {aiResult.resumeScore}%</p>
                  <p><strong>Role:</strong> {aiResult.primaryRole}</p>
                  <p><strong>Tip:</strong> {aiResult.recommendation}</p>
                  <ul className="list-disc list-inside text-sm">
                    {aiResult.topGaps.map((g, i) => <li key={i}>{g}</li>)}
                  </ul>
                  <div className="flex justify-end gap-3 mt-4">
                    <button onClick={() => setAiOpen(false)} className="px-4 py-2 rounded-md bg-blue-600 text-white">
                      Close
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
