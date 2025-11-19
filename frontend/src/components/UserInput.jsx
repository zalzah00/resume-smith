// frontend/src/components/UserInput.jsx

import React from 'react';
import './UserInput.css';

// CRITICAL CHANGE: Simplified props, removing all JD file-related props (jdFile, setJdFile, jdSelectedTitle).
const UserInput = ({ 
    resumeFile, 
    setResumeFile, 
    provider, 
    setProvider, 
    onAnalyze, 
    loading, 
    error,
    isJdReady // ONLY JD-related prop remaining, used for analysis button logic
}) => {
  
    // Helper to determine if analysis button should be enabled
    const isAnalyzeDisabled = loading || !resumeFile || !isJdReady;

    return (
        <div className="user-input-container">
            <h3>2. Upload Resume and Select LLM</h3>
            
            {/* --- Resume Upload --- */}
            <div className="input-group">
                <label htmlFor="resume-upload">Upload Resume (PDF/DOCX):</label>
                <input
                    id="resume-upload"
                    type="file"
                    accept=".pdf,.docx"
                    onChange={(e) => setResumeFile(e.target.files[0])}
                />
                {resumeFile && <p className="file-status success">✅ Resume: {resumeFile.name}</p>}
            </div>

            {/* --- LLM Provider Selection (NO CHANGE) --- */}
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
            
            {/* Display status messages */}
            {!isAnalyzeDisabled && (!resumeFile || !isJdReady) && (
                <p className="status-message warning">
                    Please ensure you have **uploaded a Resume** and provided a **Job Description** (via search or file upload in Step 1) before starting the analysis.
                </p>
            )}
        </div>
    );
};

export default UserInput;