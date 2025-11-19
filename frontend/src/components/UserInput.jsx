// frontend/src/components/UserInput.jsx

import React from 'react';
import './UserInput.css';

const ALLOWED_JD_EXTENSIONS = ['.pdf', '.docx', '.txt'];

// CRITICAL CHANGE: Updated props to manage JD File state and status from search
const UserInput = ({ 
    resumeFile, 
    setResumeFile, 
    provider, 
    setProvider, 
    onAnalyze, 
    loading, 
    error,
    // New Props
    jdFile, 
    setJdFile, 
    isJdReady, // New prop: true if EITHER jdFile or jdText is present
    jdSelectedTitle // New prop: displays the title of the job selected from search
}) => {
  
    // Determine status flags
    const isSearchJdSelected = !!jdSelectedTitle;
    const isJdUploadDisabled = isSearchJdSelected;

    // Helper to determine if analysis button should be enabled
    const isAnalyzeDisabled = loading || !resumeFile || !isJdReady;

    // New handler for JD file upload to ensure mutual exclusivity is maintained
    const handleJdFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const extension = '.' + file.name.split('.').pop().toLowerCase();
            if (ALLOWED_JD_EXTENSIONS.includes(extension)) {
                 // setJdFile is the handler from App.jsx, which clears the search JD text
                setJdFile(file);
            } else {
                alert(`Please upload a file with one of the following extensions for the JD: ${ALLOWED_JD_EXTENSIONS.join(', ')}`);
                setJdFile(null);
                e.target.value = ''; // Clear the input
            }
        } else {
            setJdFile(null);
        }
    };

    return (
        <div className="user-input-container">
            <h3>2. Upload Resume and Provide Job Description Source</h3>
            
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

            {/* --- JD File Upload (The new feature) --- */}
            <div className="input-group jd-upload-group">
                <label htmlFor="jd-upload">
                    <span style={{ opacity: isJdUploadDisabled ? 0.7 : 1 }}>
                        **OR** Upload Job Description ({ALLOWED_JD_EXTENSIONS.join(', ')}):
                    </span>
                </label>
                <input
                    id="jd-upload"
                    type="file"
                    accept={ALLOWED_JD_EXTENSIONS.join(',')}
                    onChange={handleJdFileChange}
                    disabled={isJdUploadDisabled}
                />
                
                {jdFile && <p className="file-status success">✅ JD File: {jdFile.name}</p>}

                {isSearchJdSelected && (
                    <p className="status-message warning">
                        ❌ JD file upload is disabled because **"{jdSelectedTitle}"** is selected from search in Step 1.
                    </p>
                )}
            </div>
            {/* --- End JD File Upload --- */}

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
                    Please ensure you have **uploaded a Resume** and provided a **Job Description** (either via search or file upload) before starting the analysis.
                </p>
            )}
        </div>
    );
};

export default UserInput;