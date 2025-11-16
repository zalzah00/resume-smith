// /frontend/src/components/FinalResume.jsx

import React from 'react';

const FinalResume = ({ finalResume, loading }) => {
  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          gap: '15px'
        }}>
          <div className="loading-spinner"></div>
          <div>Generating your final resume... This may take a minute.</div>
        </div>
      </div>
    );
  }

  if (!finalResume) {
    return null;
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(finalResume);
      alert('Resume copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div style={{ 
      padding: '25px', 
      border: '1px solid #e0e0e0', 
      borderRadius: '8px', 
      backgroundColor: 'white',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '20px',
        borderBottom: '2px solid #2c3e50',
        paddingBottom: '10px'
      }}>
        <h2 style={{ 
          color: '#2c3e50',
          fontSize: '20px',
          fontWeight: '600',
          margin: 0
        }}>
          📄 Final Transformed Resume
        </h2>
        <button
          onClick={handleCopy}
          style={{
            padding: '6px 12px',
            backgroundColor: '#495057',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '500'
          }}
        >
          📋 Copy to Clipboard
        </button>
      </div>
      
      <div style={{ 
        backgroundColor: 'white', 
        padding: '30px',
        border: '1px solid #d0d0d0',
        fontFamily: 'Arial, sans-serif',
        fontSize: '13px',
        lineHeight: '1.4',
        minHeight: '500px',
        maxHeight: '700px',
        overflowY: 'auto',
        color: '#000000',
        whiteSpace: 'pre-wrap', // This preserves ALL spacing and line breaks
        wordWrap: 'break-word'
      }}>
        {finalResume}
      </div>
    </div>
  );
};

export default FinalResume;

// end_of_file