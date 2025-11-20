// frontend/src/components/JDUpload.jsx

import React from 'react';

// Allowed extensions for JD file upload
const ALLOWED_EXTENSIONS = ['.docx', '.pdf', '.txt'];

const JDUpload = ({ jdFile, setJdFile, loading }) => {
  
  const isValidFile = (file) => {
    if (!file) return false;
    const extension = '.' + file.name.split('.').pop().toLowerCase();
    return ALLOWED_EXTENSIONS.includes(extension);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && isValidFile(file)) {
      setJdFile(file);
    } else if (file) {
      alert(`Please upload a file with one of the following extensions: ${ALLOWED_EXTENSIONS.join(', ')}`);
      setJdFile(null);
      e.target.value = ''; // Clear the input
    } else {
      setJdFile(null);
    }
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
        Job Description (.docx, .pdf, .txt):
      </label>
      <input
        type="file"
        accept=".docx,.pdf,.txt"
        onChange={handleFileUpload}
        disabled={loading}
        style={{ width: '100%' }}
      />
      {jdFile && (
        <div style={{ marginTop: '5px', color: 'green', fontSize: '14px' }}>
          ✓ {jdFile.name}
        </div>
      )}
    </div>
  );
};

export default JDUpload;
