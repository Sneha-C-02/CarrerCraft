import React from "react";
import { Plus, Trash2, MapPin, Mail, Phone, Globe, Linkedin } from "lucide-react";

export default function ResumeStep({ step, data, onChange, onArrayChange, onAddItem, onRemoveItem }) {
  // Initialize arrays if they don't exist
  if (!data.experience) data.experience = [];
  if (!data.education) data.education = [];
  if (!data.projects) data.projects = [];
  if (!data.skills) data.skills = [];

  switch (step) {
    case 0: // Contact
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={data.name || ""}
                  onChange={(e) => onChange("name", e.target.value)}
                  className="w-full input-field"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Professional Title
                </label>
                <input
                  type="text"
                  placeholder="Senior Software Engineer"
                  value={data.title || ""}
                  onChange={(e) => onChange("title", e.target.value)}
                  className="w-full input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="h-4 w-4 inline mr-2" />
                  Email Address *
                </label>
                <input
                  type="email"
                  placeholder="john.doe@example.com"
                  value={data.email || ""}
                  onChange={(e) => onChange("email", e.target.value)}
                  className="w-full input-field"
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="h-4 w-4 inline mr-2" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={data.phone || ""}
                  onChange={(e) => onChange("phone", e.target.value)}
                  className="w-full input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="h-4 w-4 inline mr-2" />
                  Location
                </label>
                <input
                  type="text"
                  placeholder="San Francisco, CA"
                  value={data.location || ""}
                  onChange={(e) => onChange("location", e.target.value)}
                  className="w-full input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Linkedin className="h-4 w-4 inline mr-2" />
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/in/username"
                  value={data.linkedin || ""}
                  onChange={(e) => onChange("linkedin", e.target.value)}
                  className="w-full input-field"
                />
              </div>
            </div>
          </div>
        </div>
      );

    case 1: // Summary
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Professional Summary *
            </label>
            <p className="text-sm text-gray-500 mb-3">
              Write a brief overview of your professional background and career goals (2-3 sentences recommended)
            </p>
            <textarea
              placeholder="Experienced software engineer with 5+ years in full-stack development. Specialized in React, Node.js, and cloud technologies. Passionate about building scalable applications and leading development teams."
              value={data.summary || ""}
              onChange={(e) => onChange("summary", e.target.value)}
              className="w-full input-field h-40 resize-none"
              required
            />
          </div>
        </div>
      );

    case 2: // Experience
      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <label className="block text-lg font-semibold text-gray-900">
              Work Experience
            </label>
            <button
              type="button"
              onClick={() => onAddItem("experience", { 
                company: "", 
                position: "", 
                duration: "", 
                description: "",
                location: ""
              })}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add Experience</span>
            </button>
          </div>

          {data.experience.map((exp, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-6 space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-gray-900">Experience #{index + 1}</h3>
                {data.experience.length > 1 && (
                  <button
                    type="button"
                    onClick={() => onRemoveItem("experience", index)}
                    className="text-red-600 hover:text-red-700 p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company *
                  </label>
                  <input
                    type="text"
                    placeholder="Google"
                    value={exp.company || ""}
                    onChange={(e) => onArrayChange("experience", index, "company", e.target.value)}
                    className="w-full input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Position *
                  </label>
                  <input
                    type="text"
                    placeholder="Senior Software Engineer"
                    value={exp.position || ""}
                    onChange={(e) => onArrayChange("experience", index, "position", e.target.value)}
                    className="w-full input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration *
                  </label>
                  <input
                    type="text"
                    placeholder="Jan 2020 - Present"
                    value={exp.duration || ""}
                    onChange={(e) => onArrayChange("experience", index, "duration", e.target.value)}
                    className="w-full input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="San Francisco, CA"
                    value={exp.location || ""}
                    onChange={(e) => onArrayChange("experience", index, "location", e.target.value)}
                    className="w-full input-field"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  placeholder="Describe your responsibilities and achievements. Use bullet points for better readability."
                  value={exp.description || ""}
                  onChange={(e) => onArrayChange("experience", index, "description", e.target.value)}
                  className="w-full input-field h-24 resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Tip: Use action verbs and quantify achievements (e.g., "Increased performance by 30%")
                </p>
              </div>
            </div>
          ))}

          {data.experience.length === 0 && (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
              <div className="text-gray-400 mb-4">
                <Plus className="h-12 w-12 mx-auto" />
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                No experience added yet
              </h4>
              <p className="text-gray-600 mb-4">
                Add your work experience to showcase your professional journey
              </p>
              <button
                type="button"
                onClick={() => onAddItem("experience", { 
                  company: "", 
                  position: "", 
                  duration: "", 
                  description: "",
                  location: ""
                })}
                className="btn-primary"
              >
                Add Your First Experience
              </button>
            </div>
          )}
        </div>
      );

    case 3: // Education
      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <label className="block text-lg font-semibold text-gray-900">
              Education
            </label>
            <button
              type="button"
              onClick={() => onAddItem("education", { 
                institution: "", 
                degree: "", 
                year: "",
                location: "",
                gpa: ""
              })}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add Education</span>
            </button>
          </div>

          {data.education.map((edu, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-6 space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-gray-900">Education #{index + 1}</h3>
                {data.education.length > 1 && (
                  <button
                    type="button"
                    onClick={() => onRemoveItem("education", index)}
                    className="text-red-600 hover:text-red-700 p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Institution *
                  </label>
                  <input
                    type="text"
                    placeholder="Stanford University"
                    value={edu.institution || ""}
                    onChange={(e) => onArrayChange("education", index, "institution", e.target.value)}
                    className="w-full input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Degree *
                  </label>
                  <input
                    type="text"
                    placeholder="Bachelor of Science in Computer Science"
                    value={edu.degree || ""}
                    onChange={(e) => onArrayChange("education", index, "degree", e.target.value)}
                    className="w-full input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Year *
                  </label>
                  <input
                    type="text"
                    placeholder="2016 - 2020"
                    value={edu.year || ""}
                    onChange={(e) => onArrayChange("education", index, "year", e.target.value)}
                    className="w-full input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GPA
                  </label>
                  <input
                    type="text"
                    placeholder="3.8/4.0"
                    value={edu.gpa || ""}
                    onChange={(e) => onArrayChange("education", index, "gpa", e.target.value)}
                    className="w-full input-field"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="Stanford, CA"
                  value={edu.location || ""}
                  onChange={(e) => onArrayChange("education", index, "location", e.target.value)}
                  className="w-full input-field"
                />
              </div>
            </div>
          ))}

          {data.education.length === 0 && (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
              <div className="text-gray-400 mb-4">
                <Plus className="h-12 w-12 mx-auto" />
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                No education added yet
              </h4>
              <p className="text-gray-600 mb-4">
                Add your educational background
              </p>
              <button
                type="button"
                onClick={() => onAddItem("education", { 
                  institution: "", 
                  degree: "", 
                  year: "",
                  location: "",
                  gpa: ""
                })}
                className="btn-primary"
              >
                Add Education
              </button>
            </div>
          )}
        </div>
      );

    case 4: // Skills
      return (
        <div className="space-y-6">
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-4">
              Skills & Technologies
            </label>
            <p className="text-sm text-gray-600 mb-4">
              Add your technical skills, programming languages, tools, and technologies. Separate with commas.
            </p>
            <textarea
              placeholder="JavaScript, React, Node.js, Python, AWS, Docker, Git, Agile Methodology, Team Leadership, Project Management"
              value={data.skills || ""}
              onChange={(e) => onChange("skills", e.target.value)}
              className="w-full input-field h-32 resize-none"
            />
            <p className="text-xs text-gray-500 mt-2">
              Example: "React, Node.js, Python, AWS, Docker, MongoDB, Git, Agile Methodology"
            </p>
          </div>
        </div>
      );

    case 5: // Projects
      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <label className="block text-lg font-semibold text-gray-900">
              Projects
            </label>
            <button
              type="button"
              onClick={() => onAddItem("projects", { 
                name: "", 
                description: "", 
                tech: "",
                link: ""
              })}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add Project</span>
            </button>
          </div>

          {data.projects.map((project, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-6 space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-gray-900">Project #{index + 1}</h3>
                {data.projects.length > 1 && (
                  <button
                    type="button"
                    onClick={() => onRemoveItem("projects", index)}
                    className="text-red-600 hover:text-red-700 p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  placeholder="E-commerce Platform"
                  value={project.name || ""}
                  onChange={(e) => onArrayChange("projects", index, "name", e.target.value)}
                  className="w-full input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  placeholder="Describe the project, your role, and key achievements..."
                  value={project.description || ""}
                  onChange={(e) => onArrayChange("projects", index, "description", e.target.value)}
                  className="w-full input-field h-24 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Technologies Used
                  </label>
                  <input
                    type="text"
                    placeholder="React, Node.js, MongoDB, AWS"
                    value={project.tech || ""}
                    onChange={(e) => onArrayChange("projects", index, "tech", e.target.value)}
                    className="w-full input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Link (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://github.com/username/project"
                    value={project.link || ""}
                    onChange={(e) => onArrayChange("projects", index, "link", e.target.value)}
                    className="w-full input-field"
                  />
                </div>
              </div>
            </div>
          ))}

          {data.projects.length === 0 && (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
              <div className="text-gray-400 mb-4">
                <Plus className="h-12 w-12 mx-auto" />
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                No projects added yet
              </h4>
              <p className="text-gray-600 mb-4">
                Showcase your personal or professional projects
              </p>
              <button
                type="button"
                onClick={() => onAddItem("projects", { 
                  name: "", 
                  description: "", 
                  tech: "",
                  link: ""
                })}
                className="btn-primary"
              >
                Add Project
              </button>
            </div>
          )}
        </div>
      );

    default:
      return (
        <div className="text-center py-8">
          <p className="text-gray-500">
            Step {step + 1}: Section coming soon.
          </p>
        </div>
      );
  }
}