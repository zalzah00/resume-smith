// frontend/src/components/UserInput.jsx

import React from 'react';
import './UserInput.css';

// CRITICAL CHANGE: Added isJdSelected prop to control analysis button
const UserInput = ({
  resumeFile,
  setResumeFile,
  provider,
  setProvider,
  onAnalyze,
  loading,
  error,
  isJdSelected // New prop
}) => {

  // Helper to determine if analysis button should be enabled
  const isAnalyzeDisabled = loading || !resumeFile || !isJdSelected;

  return (
    <div className="user-input-container">
      <h3>2. Upload Resume and Select LLM</h3>
      <div className="input-group">
        <label htmlFor="resume-upload">Upload Resume (.docx, .pdf, .txt):</label>
        <input
          id="resume-upload"
          type="file"
          accept=".pdf,.docx,.txt"
          onChange={(e) => setResumeFile(e.target.files[0])}
        />
        {resumeFile && <p className="file-status">✅ Resume: {resumeFile.name}</p>}
      </div>

      {/* REMOVED: The Job Description file upload input section has been removed */}

      <div className="input-group">
        <label htmlFor="llm-select">Select LLM Provider:</label>
        <select
          id="llm-select"
          value={provider}
          onChange={(e) => setProvider(e.target.value)}
        >
          <option value="gemini">Gemini</option>
          <option value="groq">Groq</option>
        </select>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="action-area">
        <button
          onClick={onAnalyze}
          disabled={isAnalyzeDisabled}
          className="analyze-button"
        >
          {loading ? 'Analyzing...' : '🧠 Start Analysis (Part 1)'}
        </button>
      </div>

      {/* Display messages if JD is missing */}
      {!isAnalyzeDisabled && !isJdSelected && (
        <p className="status-message warning">Please select a job description in Step 1.</p>
      )}
    </div>
  );
};

export default UserInput;