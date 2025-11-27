import React from "react";
import { Link } from "react-router-dom";

export default function Welcome() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white px-6 text-center">
      <div className="max-w-2xl">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 animate-fadeIn">
          Welcome to <span className="text-yellow-300">CareerCraft</span>
        </h1>
        <p className="text-lg text-blue-100 mb-8 leading-relaxed">
          Craft your future with smart resume tools, AI insights, and a growing
          professional community.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/login"
            className="bg-white text-blue-700 font-semibold py-3 px-6 rounded-lg shadow hover:bg-blue-50 transition-all"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="bg-yellow-400 text-gray-900 font-semibold py-3 px-6 rounded-lg shadow hover:bg-yellow-300 transition-all"
          >
            Sign Up
          </Link>
        </div>
      </div>

      <footer className="absolute bottom-4 text-sm text-blue-100">
        © {new Date().getFullYear()} CareerCraft. full cpoyright protection applied.
      </footer>
    </div>
  );
}
