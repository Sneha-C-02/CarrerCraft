import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";   // ⬅️ Supabase import

export default function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Track user session
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    // cleanup
    return () => listener.subscription.unsubscribe();
  }, []);

  // Logout handler
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent"
        >
          CareerCraft
        </Link>

        {/* Right side buttons */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Dashboard
              </Link>

              <button
                onClick={handleLogout}
                className="text-gray-700 hover:text-red-600 font-medium transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="bg-blue-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-all shadow-sm"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
