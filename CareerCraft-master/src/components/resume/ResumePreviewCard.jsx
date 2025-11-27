import React from "react";
import { MapPin, Mail, Phone, Linkedin } from "lucide-react";

export default function ResumePreviewCard({ data, template = "modern" }) {
  const {
    name,
    title,
    email,
    phone,
    location,
    linkedin,
    summary,
    skills,
    experience = [],
    education = [],
    projects = []
  } = data;

  const renderModernTemplate = () => (
    <div className="bg-white text-gray-800 p-8 rounded-lg shadow-lg border border-gray-200 font-sans" style={{ minHeight: '1123px' }}>
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{name || "Your Name"}</h1>
        {title && <p className="text-lg text-blue-600 font-medium mb-4">{title}</p>}
        
        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
          {email && (
            <div className="flex items-center space-x-1">
              <Mail className="h-4 w-4" />
              <span>{email}</span>
            </div>
          )}
          {phone && (
            <div className="flex items-center space-x-1">
              <Phone className="h-4 w-4" />
              <span>{phone}</span>
            </div>
          )}
          {location && (
            <div className="flex items-center space-x-1">
              <MapPin className="h-4 w-4" />
              <span>{location}</span>
            </div>
          )}
          {linkedin && (
            <div className="flex items-center space-x-1">
              <Linkedin className="h-4 w-4" />
              <span>LinkedIn</span>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {/* Summary */}
        {summary && (
          <section>
            <h2 className="text-xl font-semibold text-gray-900 border-b-2 border-blue-500 pb-2 mb-3">
              PROFESSIONAL SUMMARY
            </h2>
            <p className="text-gray-700 leading-relaxed text-sm">{summary}</p>
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && experience[0].company && (
          <section>
            <h2 className="text-xl font-semibold text-gray-900 border-b-2 border-blue-500 pb-2 mb-4">
              PROFESSIONAL EXPERIENCE
            </h2>
            <div className="space-y-4">
              {experience.map((exp, index) => (
                <div key={index} className="mb-4">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-gray-900 text-lg">{exp.position}</h3>
                    <span className="text-sm text-gray-600 bg-blue-50 px-2 py-1 rounded">{exp.duration}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-blue-600 font-medium">{exp.company}</p>
                    {exp.location && <span className="text-sm text-gray-500">{exp.location}</span>}
                  </div>
                  {exp.description && (
                    <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && education[0].institution && (
          <section>
            <h2 className="text-xl font-semibold text-gray-900 border-b-2 border-blue-500 pb-2 mb-4">
              EDUCATION
            </h2>
            <div className="space-y-3">
              {education.map((edu, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                    <span className="text-sm text-gray-600">{edu.year}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-blue-600">{edu.institution}</p>
                    {edu.gpa && <span className="text-sm text-gray-500">GPA: {edu.gpa}</span>}
                  </div>
                  {edu.location && <p className="text-sm text-gray-500">{edu.location}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {skills && (
          <section>
            <h2 className="text-xl font-semibold text-gray-900 border-b-2 border-blue-500 pb-2 mb-3">
              SKILLS & TECHNOLOGIES
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.split(',').map((skill, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {skill.trim()}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects.length > 0 && projects[0].name && (
          <section>
            <h2 className="text-xl font-semibold text-gray-900 border-b-2 border-blue-500 pb-2 mb-4">
              PROJECTS
            </h2>
            <div className="space-y-3">
              {projects.map((project, index) => (
                <div key={index}>
                  <h3 className="font-semibold text-gray-900">{project.name}</h3>
                  {project.tech && (
                    <p className="text-sm text-blue-600 mb-1">Technologies: {project.tech}</p>
                  )}
                  {project.description && (
                    <p className="text-gray-700 text-sm leading-relaxed">{project.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );

  return renderModernTemplate();
}