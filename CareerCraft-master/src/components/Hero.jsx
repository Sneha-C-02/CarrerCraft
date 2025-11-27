import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";

export default function Hero() {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-3xl shadow-xl px-8 py-20 md:py-28 text-center flex flex-col items-center justify-center">
      <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
        Craft Your Future with <span className="text-white/90">CareerCraft</span>
      </h1>
      <p className="max-w-2xl text-lg md:text-xl text-blue-100 mb-8">
        Build professional resumes, analyze your skills, and match with the right jobs — all in one place.
      </p>

      {!user ? (
        <div className="flex gap-4 flex-wrap justify-center">
          <button
            onClick={() => navigate("/login")}
            className="bg-white text-blue-700 font-medium px-6 py-3 rounded-lg shadow hover:bg-blue-50 transition-all"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="bg-transparent border border-white/70 text-white font-medium px-6 py-3 rounded-lg hover:bg-white/10 transition-all"
          >
            Sign Up
          </button>
        </div>
      ) : (
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-white text-blue-700 font-medium px-6 py-3 rounded-lg shadow hover:bg-blue-50 transition-all"
        >
          Go to Dashboard
        </button>
      )}
    </section>
  );
}
