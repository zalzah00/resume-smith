// /frontend/src/components/UserInput.jsx

import React from 'react';

const UserInput = ({ userAnswers, setUserAnswers, onGenerate, loading, analysis }) => {
  if (!analysis) {
    return null;
  }

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '20px' }}>
      <h2>2. Provide Clarifications</h2>
      <p style={{ marginBottom: '15px', color: '#666' }}>
        Please answer the questions from the analysis above to help improve your resume.
      </p>
      
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          Your Answers:
        </label>
        <textarea
          value={userAnswers}
          onChange={(e) => setUserAnswers(e.target.value)}
          placeholder="e.g., Q1: Yes, I used Docker and Kubernetes in a learning environment. Q2: No, only Python and SQL."
          rows={6}
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontFamily: 'inherit',
            fontSize: '14px'
          }}
          disabled={loading}
        />
      </div>

      <button
        onClick={onGenerate}
        disabled={!userAnswers.trim() || loading}
        style={{
          padding: '10px 20px',
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: (!userAnswers.trim() || loading) ? 'not-allowed' : 'pointer',
          opacity: (!userAnswers.trim() || loading) ? 0.6 : 1,
        }}
      >
        {loading ? 'Generating...' : '✨ Generate Final Resume'}
      </button>
    </div>
  );
};

export default UserInput;