// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  TrendingUp,
  Briefcase,
  Users,
  Target,
  Zap,
  Trophy,
} from "lucide-react";
import { motion } from "framer-motion";
import { auth } from "../firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Dashboard() {
  const [user, loading] = useAuthState(auth);

  const stats = [
    { label: "Resume Strength", value: "85%", icon: <Trophy className="text-yellow-500 w-5 h-5" /> },
    { label: "Job Matches", value: "12", icon: <Briefcase className="text-green-500 w-5 h-5" /> },
    { label: "Community Posts", value: "3", icon: <Users className="text-pink-500 w-5 h-5" /> },
    { label: "AI Insights", value: "Updated", icon: <TrendingUp className="text-blue-500 w-5 h-5" /> },
  ];

  const cards = [
    {
      title: "Career Insights",
      desc: "AI-powered feedback to boost your growth.",
      icon: <TrendingUp className="w-6 h-6 text-blue-600" />,
      link: "/career-insights",
      color: "from-blue-50 to-blue-100 hover:shadow-blue-200",
    },
    {
      title: "Job Match",
      desc: "Find jobs that perfectly align with your skills.",
      icon: <Briefcase className="w-6 h-6 text-green-600" />,
      link: "/job-match",
      color: "from-green-50 to-green-100 hover:shadow-green-200",
    },
    {
      title: "Resume Builder",
      desc: "Create, update and analyze your resume instantly.",
      icon: <FileText className="w-6 h-6 text-purple-600" />,
      link: "/resume-builder",
      color: "from-purple-50 to-purple-100 hover:shadow-purple-200",
    },
    {
      title: "Community",
      desc: "Connect, share, and learn from your peers.",
      icon: <Users className="w-6 h-6 text-pink-600" />,
      link: "/community",
      color: "from-pink-50 to-pink-100 hover:shadow-pink-200",
    },
  ];

  const milestones = [
    { label: "Resume Created", icon: "📄" },
    { label: "AI Insights Generated", icon: "🤖" },
    { label: "Job Matches Found", icon: "💼" },
    { label: "Community Joined", icon: "🌐" },
  ];

  const displayName = user ? (user.displayName || user.email.split("@")[0]) : "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 pb-20">
      <motion.div
        className="max-w-6xl mx-auto px-6 py-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* 👋 Welcome Section */}
        <div className="mb-10">
          {!loading && user ? (
            <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
              Welcome back,{" "}
              <span className="text-blue-600">{displayName} 👋</span>
            </h1>
          ) : (
            <div className="animate-pulse h-8 w-64 bg-gray-200 rounded"></div>
          )}
          <p className="text-gray-500 mt-2 text-lg">
            Here’s what’s happening in your career journey today.
          </p>
        </div>

        {/* ⚡ Quick Stats */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { staggerChildren: 0.1 },
            },
          }}
        >
          {stats.map((s, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05, y: -4 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="p-5 bg-white/80 backdrop-blur-md border border-gray-100 rounded-xl shadow-md flex items-center gap-3 hover:shadow-lg transition-all"
            >
              {s.icon}
              <div>
                <p className="text-gray-500 text-sm">{s.label}</p>
                <h3 className="text-xl font-bold text-gray-800">{s.value}</h3>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* 🚀 Main Feature Cards */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
            >
              <Link
                to={card.link}
                className={`block bg-gradient-to-br ${card.color} rounded-2xl shadow-md hover:shadow-xl transition-all p-6 flex flex-col gap-3 border border-gray-100`}
              >
                <div className="flex items-center gap-3">
                  {card.icon}
                  <h2 className="text-lg font-semibold text-gray-800">
                    {card.title}
                  </h2>
                </div>
                <p className="text-gray-600 text-sm flex-1">{card.desc}</p>
                <span className="text-blue-600 font-medium hover:underline text-sm">
                  Explore →
                </span>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* 🎯 Career Progress Timeline */}
        <div className="mt-16 bg-white/80 backdrop-blur-md rounded-2xl p-8 border border-gray-100 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Target className="text-purple-600 w-6 h-6" /> Career Progress
          </h2>
          <div className="flex items-center gap-6 overflow-x-auto pb-2">
            {milestones.map((m, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="flex flex-col items-center text-center min-w-[140px]"
              >
                <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-2xl">
                  {m.icon}
                </div>
                <p className="mt-3 text-sm text-gray-700 font-medium">
                  {m.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 💡 Daily Career Tip */}
        <motion.div
          className="mt-12 bg-gradient-to-r from-blue-100 to-purple-100 p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Zap className="w-6 h-6 text-yellow-500 flex-shrink-0" />
          <p className="text-gray-800 font-medium">
            💡 <span className="text-blue-700">Tip of the day:</span>{" "}
            Consistency beats intensity. Keep improving your resume & network
            daily!
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
