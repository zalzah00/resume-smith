import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/**
 * Custom ReactMarkdown components to style the final resume output.
 * It uses Tailwind CSS classes for a professional, clean look.
 */
const resumeComponents = {
  // Headings for sections (e.g., Experience, Education)
  h1: ({ node, ...props }) => (
    <h1 
      className="text-2xl font-bold border-b-2 border-indigo-500 pb-1 mb-3 mt-4 text-indigo-700 tracking-wider" 
      {...props} 
    />
  ),
  h2: ({ node, ...props }) => (
    <h2 
      className="text-xl font-semibold mb-2 mt-4 text-gray-800" 
      {...props} 
    />
  ),
  // Strong for titles/roles
  strong: ({ node, ...props }) => (
    <strong 
      className="font-bold text-gray-900" 
      {...props} 
    />
  ),
  // Paragraphs for general text
  p: ({ node, ...props }) => (
    <p 
      className="mb-2 text-gray-700 leading-snug" 
      {...props} 
    />
  ),
  // Unordered lists for bullet points
  ul: ({ node, ...props }) => (
    <ul 
      className="list-disc list-inside space-y-1 pl-4 mb-4 text-gray-700" 
      {...props} 
    />
  ),
  // List items for achievements/descriptions
  li: ({ node, ...props }) => (
    <li 
      className="text-sm" 
      {...props} 
    />
  ),
  // Horizontal Rule for separation (if used)
  hr: ({ node, ...props }) => (
    <hr 
      className="my-6 border-t border-gray-200" 
      {...props} 
    />
  ),
};

/**
 * Component to display the final, formatted resume.
 * @param {object} props
 * @param {string} props.finalResume - The resume text in Markdown format.
 * @param {string} props.className - Tailwind CSS classes for the container.
 */
const FinalResume = ({ finalResume, className }) => {
  return (
    <div className={`p-6 bg-white rounded-xl shadow-lg border border-gray-200 h-full overflow-y-auto ${className}`}>
      <h2 className="text-2xl font-bold text-center text-green-600 mb-4">
        ✅ Final Resume (Formatted)
      </h2>
      <div className="resume-content space-y-3">
        {/* Process Markdown with custom components for styling */}
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          components={resumeComponents}
        >
          {finalResume}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default FinalResume;