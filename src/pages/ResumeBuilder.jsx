// src/pages/ResumeBuilder.jsx
import React, { useState, useRef, useEffect } from "react";
import html2pdf from "html2pdf.js";
import {
  Download,
  FileText,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
// import { supabase } from "../supabaseClient";
import { getResume, saveResume } from "../api/resume";
import { auth } from "../firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";

const steps = ["Contact", "Summary", "Experience", "Education", "Skills", "Projects"];

// ✅ This matches your "old" structure that other components expect
const initialResume = {
  name: "",
  title: "",
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  summary: "",
  experience: [{ company: "", position: "", duration: "", description: "" }],
  education: [{ institution: "", degree: "", year: "", gpa: "" }],
  // skills: array of { name, level }
  skills: [{ name: "", level: "" }],
  projects: [{ name: "", description: "", tech: "" }],
  // optional, used by some templates
  languages: [{ name: "", proficiency: "" }],
};

export default function ResumeBuilder() {
  const [resume, setResume] = useState(initialResume);
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const previewRef = useRef(null);
  const [user, loading] = useAuthState(auth);

  // 🔹 Load resume from API on mount/auth
  useEffect(() => {
    async function loadResume() {
      if (!user) return;

      try {
        const data = await getResume();
        // Merge with initialResume to ensure structure
        setResume((prev) => ({ ...initialResume, ...data }));
      } catch (err) {
        console.error("Failed to load resume:", err);
      }
    }
    loadResume();
  }, [user]);

  // 🔹 Simple field change
  const handleChange = (field, value) => {
    setResume((prev) => ({ ...prev, [field]: value }));
  };

  // 🔹 Array field change (experience, education, projects, skills, languages)
  const handleArrayChange = (field, index, subfield, value) => {
    const updatedArray = [...resume[field]];
    updatedArray[index] = { ...updatedArray[index], [subfield]: value };
    setResume((prev) => ({ ...prev, [field]: updatedArray }));
  };

  const addArrayItem = (field, template) => {
    setResume((prev) => ({ ...prev, [field]: [...prev[field], template] }));
  };

  const removeArrayItem = (field, index) => {
    const updatedArray = resume[field].filter((_, i) => i !== index);
    setResume((prev) => ({ ...prev, [field]: updatedArray }));
  };

  const nextStep = () => setStep((prev) => Math.min(steps.length - 1, prev + 1));
  const prevStep = () => setStep((prev) => Math.max(0, prev - 1));

  // 🔹 Save JSON resume to Backend
  const handleSave = async () => {
    if (!user) {
      alert("You must be logged in to save your resume.");
      return;
    }

    try {
      setSaving(true);
      await saveResume(resume);
      alert("Resume saved successfully 🎉");
    } catch (err) {
      console.error("Resume save failed →", err);
      alert("❌ Failed — Check Network tab");
    } finally {
      setSaving(false);
    }
  };

  // 🔹 Download PDF
  const handleDownload = async () => {
    const element = previewRef.current;
    const opt = {
      margin: 15,
      filename: `${resume.name || "resume"}_professional.pdf`,
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    // Generate & download locally
    html2pdf().set(opt).from(element).save();

    // Upload to Supabase Storage (Commented out as we are moving to API)
    /*
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Try to also get blob for upload
    const pdfBlob = await html2pdf().set(opt).from(element).outputPdf("blob");

    const filename = `${user.id}-${Date.now()}.pdf`;

    const { error: uploadError } = await supabase.storage
      .from("resumes")
      .upload(filename, pdfBlob, { contentType: "application/pdf" });

    if (uploadError) {
      console.error(uploadError);
      alert("PDF upload failed");
      return;
    }

    const { data: urlData } = supabase.storage
      .from("resumes")
      .getPublicUrl(filename);

    const publicUrl = urlData.publicUrl;

    await supabase
      .from("resumes")
      .update({ pdf_url: publicUrl })
      .eq("user_id", user.id);

    alert("PDF uploaded & saved successfully!");
    */
  };

  // 🔹 Form steps (using your old layout, but with correct data structure)
  const renderCurrentStep = () => {
    switch (step) {
      case 0: // Contact
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Personal Information
            </h3>
            <input
              type="text"
              placeholder="Full Name *"
              value={resume.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="input-field"
            />
            <input
              type="text"
              placeholder="Professional Title"
              value={resume.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className="input-field"
            />
            <input
              type="email"
              placeholder="Email *"
              value={resume.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="input-field"
            />
            <input
              type="tel"
              placeholder="Phone"
              value={resume.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="input-field"
            />
            <input
              type="text"
              placeholder="Location"
              value={resume.location}
              onChange={(e) => handleChange("location", e.target.value)}
              className="input-field"
            />
            <input
              type="text"
              placeholder="LinkedIn URL"
              value={resume.linkedin}
              onChange={(e) => handleChange("linkedin", e.target.value)}
              className="input-field"
            />
          </div>
        );

      case 1: // Summary
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Professional Summary
            </h3>
            <textarea
              placeholder="2–3 sentences about your experience and goals."
              value={resume.summary}
              onChange={(e) => handleChange("summary", e.target.value)}
              className="input-field h-40 resize-none"
            />
          </div>
        );

      case 2: // Experience
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                Work Experience
              </h3>
              <button
                onClick={() =>
                  addArrayItem("experience", {
                    company: "",
                    position: "",
                    duration: "",
                    description: "",
                  })
                }
                className="btn-primary flex items-center space-x-2 text-sm"
              >
                <Plus className="h-4 w-4" />
                <span>Add Experience</span>
              </button>
            </div>

            {resume.experience.map((exp, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 space-y-4"
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-gray-900">
                    Experience #{index + 1}
                  </h4>
                  {resume.experience.length > 1 && (
                    <button
                      onClick={() => removeArrayItem("experience", index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <input
                  type="text"
                  placeholder="Company *"
                  value={exp.company}
                  onChange={(e) =>
                    handleArrayChange(
                      "experience",
                      index,
                      "company",
                      e.target.value
                    )
                  }
                  className="input-field"
                />
                <input
                  type="text"
                  placeholder="Position *"
                  value={exp.position}
                  onChange={(e) =>
                    handleArrayChange(
                      "experience",
                      index,
                      "position",
                      e.target.value
                    )
                  }
                  className="input-field"
                />
                <input
                  type="text"
                  placeholder="Duration (e.g., Jan 2020 - Present)"
                  value={exp.duration}
                  onChange={(e) =>
                    handleArrayChange(
                      "experience",
                      index,
                      "duration",
                      e.target.value
                    )
                  }
                  className="input-field"
                />
                <textarea
                  placeholder="Description of responsibilities and achievements"
                  value={exp.description}
                  onChange={(e) =>
                    handleArrayChange(
                      "experience",
                      index,
                      "description",
                      e.target.value
                    )
                  }
                  className="input-field h-24 resize-none"
                />
              </div>
            ))}
          </div>
        );

      case 3: // Education
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Education</h3>
              <button
                onClick={() =>
                  addArrayItem("education", {
                    institution: "",
                    degree: "",
                    year: "",
                    gpa: "",
                  })
                }
                className="btn-primary flex items-center space-x-2 text-sm"
              >
                <Plus className="h-4 w-4" />
                <span>Add Education</span>
              </button>
            </div>

            {resume.education.map((edu, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 space-y-4"
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-gray-900">
                    Education #{index + 1}
                  </h4>
                  {resume.education.length > 1 && (
                    <button
                      onClick={() => removeArrayItem("education", index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <input
                  type="text"
                  placeholder="Institution *"
                  value={edu.institution}
                  onChange={(e) =>
                    handleArrayChange(
                      "education",
                      index,
                      "institution",
                      e.target.value
                    )
                  }
                  className="input-field"
                />
                <input
                  type="text"
                  placeholder="Degree *"
                  value={edu.degree}
                  onChange={(e) =>
                    handleArrayChange(
                      "education",
                      index,
                      "degree",
                      e.target.value
                    )
                  }
                  className="input-field"
                />
                <input
                  type="text"
                  placeholder="Year (e.g., 2016 - 2020)"
                  value={edu.year}
                  onChange={(e) =>
                    handleArrayChange(
                      "education",
                      index,
                      "year",
                      e.target.value
                    )
                  }
                  className="input-field"
                />
                <input
                  type="text"
                  placeholder="GPA (optional)"
                  value={edu.gpa}
                  onChange={(e) =>
                    handleArrayChange(
                      "education",
                      index,
                      "gpa",
                      e.target.value
                    )
                  }
                  className="input-field"
                />
              </div>
            ))}
          </div>
        );

      case 4: // Skills (name + level)
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                Skills & Proficiency
              </h3>
              <button
                onClick={() =>
                  addArrayItem("skills", { name: "", level: "" })
                }
                className="btn-primary flex items-center space-x-2 text-sm"
              >
                <Plus className="h-4 w-4" />
                <span>Add Skill</span>
              </button>
            </div>

            {resume.skills.map((skill, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 space-y-3"
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-gray-900">
                    Skill #{index + 1}
                  </h4>
                  {resume.skills.length > 1 && (
                    <button
                      onClick={() => removeArrayItem("skills", index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <input
                  type="text"
                  placeholder="Skill Name (e.g., React)"
                  value={skill.name}
                  onChange={(e) =>
                    handleArrayChange("skills", index, "name", e.target.value)
                  }
                  className="input-field"
                />
                <input
                  type="text"
                  placeholder="Level (e.g., Beginner, Intermediate, Advanced)"
                  value={skill.level}
                  onChange={(e) =>
                    handleArrayChange("skills", index, "level", e.target.value)
                  }
                  className="input-field"
                />
              </div>
            ))}
          </div>
        );

      case 5: // Projects
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Projects</h3>
              <button
                onClick={() =>
                  addArrayItem("projects", {
                    name: "",
                    description: "",
                    tech: "",
                  })
                }
                className="btn-primary flex items-center space-x-2 text-sm"
              >
                <Plus className="h-4 w-4" />
                <span>Add Project</span>
              </button>
            </div>

            {resume.projects.map((project, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 space-y-4"
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-gray-900">
                    Project #{index + 1}
                  </h4>
                  {resume.projects.length > 1 && (
                    <button
                      onClick={() => removeArrayItem("projects", index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <input
                  type="text"
                  placeholder="Project Name *"
                  value={project.name}
                  onChange={(e) =>
                    handleArrayChange(
                      "projects",
                      index,
                      "name",
                      e.target.value
                    )
                  }
                  className="input-field"
                />
                <textarea
                  placeholder="Project Description"
                  value={project.description}
                  onChange={(e) =>
                    handleArrayChange(
                      "projects",
                      index,
                      "description",
                      e.target.value
                    )
                  }
                  className="input-field h-24 resize-none"
                />
                <input
                  type="text"
                  placeholder="Technologies Used"
                  value={project.tech}
                  onChange={(e) =>
                    handleArrayChange(
                      "projects",
                      index,
                      "tech",
                      e.target.value
                    )
                  }
                  className="input-field"
                />
              </div>
            ))}
          </div>
        );

      default:
        return <div>Step not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Professional Resume Builder
              </h1>
              <p className="text-gray-600">
                Create a resume ready for company submission
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-secondary flex items-center space-x-2 disabled:opacity-50"
            >
              <FileText className="h-5 w-5" />
              <span>{saving ? "Saving..." : "Save"}</span>
            </button>
            <button
              onClick={handleDownload}
              className="btn-primary flex items-center space-x-2"
            >
              <Download className="h-5 w-5" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left - Form */}
          <div className="lg:col-span-2">
            <div className="card p-6">
              {/* Progress Steps */}
              <div className="flex items-center space-x-4 mb-6">
                {steps.map((stepName, index) => (
                  <div key={stepName} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${index === step
                          ? "bg-blue-600 text-white"
                          : index < step
                            ? "bg-green-500 text-white"
                            : "bg-gray-200 text-gray-600"
                        }`}
                    >
                      {index + 1}
                    </div>
                    <span
                      className={`ml-2 font-medium ${index === step ? "text-blue-600" : "text-gray-500"
                        }`}
                    >
                      {stepName}
                    </span>
                    {index < steps.length - 1 && (
                      <div className="w-8 h-0.5 bg-gray-300 mx-2"></div>
                    )}
                  </div>
                ))}
              </div>

              {/* Current Step Form */}
              {renderCurrentStep()}

              {/* Navigation */}
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={prevStep}
                  disabled={step === 0}
                  className="btn-secondary flex items-center space-x-2 disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous</span>
                </button>
                <button
                  onClick={nextStep}
                  disabled={step === steps.length - 1}
                  className="btn-primary flex items-center space-x-2 disabled:opacity-50"
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right - Preview */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <div className="card p-4 mb-4">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Live Preview
                </h3>
                <p className="text-sm text-gray-600">
                  Real-time resume preview
                </p>
              </div>

              <div ref={previewRef} className="card p-6 bg-white">
                {/* Header preview */}
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {resume.name || "Your Name"}
                  </h1>
                  {resume.title && (
                    <p className="text-lg text-blue-600 font-medium mb-3">
                      {resume.title}
                    </p>
                  )}
                  <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-600">
                    {resume.email && <span>{resume.email}</span>}
                    {resume.phone && <span>{resume.phone}</span>}
                    {resume.location && <span>{resume.location}</span>}
                  </div>
                </div>

                {/* Summary */}
                {resume.summary && (
                  <section className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 border-b-2 border-blue-500 pb-1 mb-3">
                      PROFESSIONAL SUMMARY
                    </h2>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {resume.summary}
                    </p>
                  </section>
                )}

                {/* Experience */}
                {resume.experience && resume.experience[0]?.company && (
                  <section className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 border-b-2 border-blue-500 pb-1 mb-3">
                      EXPERIENCE
                    </h2>
                    {resume.experience.map((exp, index) =>
                      exp.company ? (
                        <div key={index} className="mb-4">
                          <div className="flex justify-between items-start mb-1">
                            <h3 className="font-semibold text-gray-900">
                              {exp.position || "Position"}
                            </h3>
                            <span className="text-sm text-gray-600">
                              {exp.duration}
                            </span>
                          </div>
                          <p className="text-blue-600 text-sm mb-2">
                            {exp.company}
                          </p>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {exp.description}
                          </p>
                        </div>
                      ) : null
                    )}
                  </section>
                )}

                {/* Education */}
                {resume.education && resume.education[0]?.institution && (
                  <section className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 border-b-2 border-blue-500 pb-1 mb-3">
                      EDUCATION
                    </h2>
                    {resume.education.map((edu, index) =>
                      edu.institution ? (
                        <div key={index} className="mb-3">
                          <div className="flex justify-between items-start">
                            <h3 className="font-semibold text-gray-900">
                              {edu.degree || "Degree"}
                            </h3>
                            <span className="text-sm text-gray-600">
                              {edu.year}
                            </span>
                          </div>
                          <p className="text-blue-600 text-sm">
                            {edu.institution}
                          </p>
                          {edu.gpa && (
                            <p className="text-gray-600 text-sm">
                              GPA: {edu.gpa}
                            </p>
                          )}
                        </div>
                      ) : null
                    )}
                  </section>
                )}

                {/* Skills */}
                {resume.skills && resume.skills[0]?.name && (
                  <section className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 border-b-2 border-blue-500 pb-1 mb-3">
                      SKILLS
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {resume.skills.map((skill, index) =>
                        skill.name ? (
                          <span
                            key={index}
                            className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                          >
                            {skill.name}
                            {skill.level
                              ? ` — ${skill.level}`
                              : ""}
                          </span>
                        ) : null
                      )}
                    </div>
                  </section>
                )}

                {/* Projects */}
                {resume.projects && resume.projects[0]?.name && (
                  <section>
                    <h2 className="text-lg font-semibold text-gray-900 border-b-2 border-blue-500 pb-1 mb-3">
                      PROJECTS
                    </h2>
                    {resume.projects.map((project, index) =>
                      project.name ? (
                        <div key={index} className="mb-4">
                          <h3 className="font-semibold text-gray-900">
                            {project.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-1">
                            {project.tech}
                          </p>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {project.description}
                          </p>
                        </div>
                      ) : null
                    )}
                  </section>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
