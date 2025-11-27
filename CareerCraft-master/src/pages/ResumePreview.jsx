// src/components/ResumePreview.jsx
import React from "react";

const ResumePreview = ({ data, template, darkMode }) => {
  const renderTemplate = () => {
    switch(template.id) {
      case 1:
        return <ModernExecutive data={data} />;
      case 2:
        return <CreativePro data={data} />;
      case 3:
        return <MinimalistATS data={data} />;
      case 4:
        return <AcademicProfessional data={data} />;
      default:
        return <ModernExecutive data={data} />;
    }
  };

  return (
    <div className="resume-container">
      {renderTemplate()}
    </div>
  );
};

// Template 1: Modern Executive
const ModernExecutive = ({ data }) => (
  <div className="bg-white text-gray-800 p-8 rounded-lg shadow-xl font-sans" style={{ minHeight: '1123px' }}>
    {/* Header */}
    <div className="text-center mb-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{data.name || "Your Name"}</h1>
      <p className="text-lg text-blue-600 mb-3">{data.title || "Professional Title"}</p>
      <div className="flex justify-center space-x-4 text-sm text-gray-600">
        <span>{data.email || "email@example.com"}</span>
        <span>•</span>
        <span>{data.phone || "+1 (555) 123-4567"}</span>
        <span>•</span>
        <span>{data.location || "City, Country"}</span>
      </div>
    </div>

    <div className="grid grid-cols-3 gap-8">
      {/* Left Column */}
      <div className="col-span-1 space-y-6">
        {/* Summary */}
        {data.summary && (
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3 pb-2 border-b-2 border-blue-500">PROFILE</h2>
            <p className="text-sm text-gray-700 leading-relaxed">{data.summary}</p>
          </section>
        )}

        {/* Skills */}
        {data.skills && data.skills.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3 pb-2 border-b-2 border-blue-500">SKILLS</h2>
            <div className="space-y-2">
              {data.skills.map((skill, index) => (
                <div key={index} className="text-sm">
                  <span className="font-medium">{skill.name}:</span>
                  <span className="text-gray-600 ml-1">{skill.level}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Languages */}
        {data.languages && data.languages.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3 pb-2 border-b-2 border-blue-500">LANGUAGES</h2>
            <div className="space-y-2">
              {data.languages.map((lang, index) => (
                <div key={index} className="text-sm">
                  <span className="font-medium">{lang.name}:</span>
                  <span className="text-gray-600 ml-1">{lang.proficiency}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Right Column */}
      <div className="col-span-2 space-y-6">
        {/* Experience */}
        {data.experience && data.experience[0]?.company && (
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-blue-500">EXPERIENCE</h2>
            <div className="space-y-4">
              {data.experience.map((exp, index) => (
                <div key={index} className="mb-4">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                    <span className="text-sm text-gray-600 bg-blue-50 px-2 py-1 rounded">{exp.duration}</span>
                  </div>
                  <p className="text-blue-600 text-sm mb-2">{exp.company}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {data.education && data.education[0]?.institution && (
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-blue-500">EDUCATION</h2>
            <div className="space-y-3">
              {data.education.map((edu, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                    <span className="text-sm text-gray-600">{edu.year}</span>
                  </div>
                  <p className="text-blue-600 text-sm">{edu.institution}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {data.projects && data.projects[0]?.name && (
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-blue-500">PROJECTS</h2>
            <div className="space-y-3">
              {data.projects.map((project, index) => (
                <div key={index}>
                  <h3 className="font-semibold text-gray-900">{project.name}</h3>
                  <p className="text-sm text-gray-700 mb-1">{project.description}</p>
                  <p className="text-xs text-blue-600">Tech: {project.tech}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  </div>
);

// Template 2: Creative Pro (simplified for example)
const CreativePro = ({ data }) => (
  <div className="bg-gradient-to-br from-purple-50 to-pink-50 text-gray-800 p-8 rounded-lg shadow-xl">
    {/* Creative template implementation */}
    <div className="text-center mb-8">
      <h1 className="text-4xl font-bold text-purple-600 mb-2">{data.name}</h1>
      <p className="text-lg text-gray-600">{data.title}</p>
    </div>
    {/* Add creative layout */}
  </div>
);

// Add other template components similarly...

export default ResumePreview;