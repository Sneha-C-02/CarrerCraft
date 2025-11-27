
import React, { useState } from "react";
import ResumeStep from "./ResumeStep";
import { ChevronLeft, ChevronRight, FileText } from "lucide-react";

const steps = [
  "Contact",
  "Summary",
  "Experience",
  "Education",
  "Skills",
  "Projects"
];

export default function ResumeForm({ data, setData, selectedTemplate }) {
  const [step, setStep] = useState(0);

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const handleChange = (field, value) => {
    setData({ ...data, [field]: value });
  };

  const handleArrayChange = (field, index, subfield, value) => {
    const updatedArray = [...data[field]];
    updatedArray[index] = { ...updatedArray[index], [subfield]: value };
    handleChange(field, updatedArray);
  };

  const addArrayItem = (field, template) => {
    handleChange(field, [...(data[field] || []), template]);
  };

  const removeArrayItem = (field, index) => {
    const updatedArray = data[field].filter((_, i) => i !== index);
    handleChange(field, updatedArray);
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Build Your Resume</h1>
            <p className="text-gray-600">Step by step professional resume creation</p>
          </div>
        </div>

        {/* Progress bar with labels */}
        <div className="mb-2">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>Step {step + 1} of {steps.length}</span>
          </div>
          <div className="flex items-center mb-1">
            {steps.map((s, i) => (
              <div key={s} className="flex-1 flex flex-col items-center">
                <div
                  className={`h-2 w-full rounded-full transition-all duration-300 ${
                    i <= step 
                      ? "bg-gradient-to-r from-blue-500 to-purple-500" 
                      : "bg-gray-200"
                  }`}
                ></div>
                <span className={`text-xs mt-2 font-medium ${
                  i === step ? "text-blue-600" : "text-gray-500"
                }`}>
                  {s}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <ResumeStep 
          step={step} 
          data={data} 
          onChange={handleChange}
          onArrayChange={handleArrayChange}
          onAddItem={addArrayItem}
          onRemoveItem={removeArrayItem}
        />

        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-between items-center pt-6 border-t border-gray-200">
          <button
            onClick={prev}
            disabled={step === 0}
            className="flex items-center space-x-2 px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Back</span>
          </button>
          
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-500">
              {steps[step]}
            </span>
          </div>

          <button
            onClick={next}
            disabled={step === steps.length - 1}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Next</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}