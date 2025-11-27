import React from "react";
import { useParams } from "react-router-dom";
import ResumePreviewCard from "../components/resume/ResumePreviewCard";

export default function PublicProfile() {
  const { slug } = useParams();

  // 🔧 Placeholder: later fetch from backend by slug
  const mockData = {
    contact: { name: slug || "User Name", email: "user@email.com", phone: "123-456-7890" },
    summary: "Frontend developer with a passion for clean design.",
    experience: [{ company: "Acme Corp" }]
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-3xl w-full bg-white shadow-sm rounded-2xl p-8">
        <ResumePreviewCard data={mockData} />
      </div>
    </div>
  );
}
