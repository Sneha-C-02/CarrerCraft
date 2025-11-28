import React from "react";

export default function DashboardCard({ title, value, icon: Icon, color }) {
  return (
    <div
      className={`flex items-center justify-between bg-white border-l-4 ${color} p-5 rounded-xl shadow-sm hover:shadow-md transition-all`}
    >
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h3 className="text-2xl font-semibold text-gray-800">{value}</h3>
      </div>
      {Icon && <Icon className="text-gray-400" size={28} />}
    </div>
  );
}
