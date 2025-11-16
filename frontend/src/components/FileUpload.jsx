// /frontend/src/components/FileUpload.jsx

import React from 'react';

const FileUpload = ({ provider, setProvider, resumeFile, setResumeFile, jdFile, setJdFile, onAnalyze, loading }) => {
  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      setResumeFile(file);
    } else {
      alert('Please upload a .docx file for resume');
    }
  };

  const handleJdUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      setJdFile(file);
    } else {
      alert('Please upload a .docx file for job description');
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '20px' }}>
      <h2>1. Upload Files</h2>
      
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          LLM Provider:
        </label>
        <div>
          <label style={{ marginRight: '15px' }}>
            <input
              type="radio"
              value="Gemini"
              checked={provider === 'Gemini'}
              onChange={(e) => setProvider(e.target.value)}
              disabled={loading}
            />
            Gemini
          </label>
          <label>
            <input
              type="radio"
              value="Groq"
              checked={provider === 'Groq'}
              onChange={(e) => setProvider(e.target.value)}
              disabled={loading}
            />
            Groq
          </label>
        </div>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          Resume (.docx):
        </label>
        <input
          type="file"
          accept=".docx"
          onChange={handleResumeUpload}
          disabled={loading}
          style={{ width: '100%' }}
        />
        {resumeFile && (
          <div style={{ marginTop: '5px', color: 'green', fontSize: '14px' }}>
            ✓ {resumeFile.name}
          </div>
        )}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          Job Description (.docx):
        </label>
        <input
          type="file"
          accept=".docx"
          onChange={handleJdUpload}
          disabled={loading}
          style={{ width: '100%' }}
        />
        {jdFile && (
          <div style={{ marginTop: '5px', color: 'green', fontSize: '14px' }}>
            ✓ {jdFile.name}
          </div>
        )}
      </div>

      <button
        onClick={onAnalyze}
        disabled={!provider || !resumeFile || !jdFile || loading}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: (!provider || !resumeFile || !jdFile || loading) ? 'not-allowed' : 'pointer',
          opacity: (!provider || !resumeFile || !jdFile || loading) ? 0.6 : 1,
        }}
      >
        {loading ? 'Analyzing...' : '🚀 Start Analysis'}
      </button>
    </div>
  );
};

export default FileUpload;