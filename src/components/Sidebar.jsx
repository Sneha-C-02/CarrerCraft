import React from "react";
import { LayoutDashboard, FileText, Users, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div className="hidden lg:flex flex-col w-64 bg-white shadow-lg border-r border-gray-100 p-6">
      <h2 className="text-2xl font-bold text-blue-600 mb-8 flex items-center gap-2">
        <LayoutDashboard className="w-6 h-6" /> CareerCraft
      </h2>

      <nav className="space-y-3">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 text-gray-700 hover:bg-blue-50 px-3 py-2 rounded-lg transition-all"
        >
          <LayoutDashboard className="w-5 h-5 text-blue-600" />
          Dashboard
        </Link>
        <Link
          to="/resume-builder"
          className="flex items-center gap-2 text-gray-700 hover:bg-blue-50 px-3 py-2 rounded-lg transition-all"
        >
          <FileText className="w-5 h-5 text-blue-600" />
          Resume Builder
        </Link>
        <Link
          to="/u/public"
          className="flex items-center gap-2 text-gray-700 hover:bg-blue-50 px-3 py-2 rounded-lg transition-all"
        >
          <Users className="w-5 h-5 text-blue-600" />
          Public Profile
        </Link>
      </nav>

      <button
        onClick={handleLogout}
        className="mt-auto flex items-center gap-2 text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-all"
      >
        <LogOut className="w-5 h-5" /> Logout
      </button>
    </div>
  );
}
