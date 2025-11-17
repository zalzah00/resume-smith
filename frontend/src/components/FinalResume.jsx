// /frontend/src/components/FinalResume.jsx

import React from 'react';
import ReactMarkdown from 'react-markdown';

// Define custom components to map Markdown elements (h2, p, ul, li, strong)
// to React components with specific resume styling, focusing on vertical spacing
const resumeComponents = {
  // Style for H2 (##) or H1 (#) to look like a main resume section header
  h2: ({node, ...props}) => (
    <h2 style={{
      color: '#2c3e50',
      fontSize: '18px',
      fontWeight: '700',
      textTransform: 'uppercase',
      borderBottom: '1px solid #000',
      // Consistent vertical spacing for main headers
      marginTop: '25px', 
      marginBottom: '10px', 
      paddingBottom: '5px',
    }} {...props} />
  ),
  
  // Style for standard paragraphs (used for summaries, intro text)
  p: ({node, ...props}) => (
    <p style={{ 
      marginTop: '10px', 
      marginBottom: '10px' 
    }} {...props} />
  ),

  // Style for unordered lists (from * or -)
  ul: ({node, ...props}) => (
    <ul style={{
      listStyleType: 'disc',
      marginLeft: '20px',
      paddingLeft: '0',
      marginTop: '10px',
      marginBottom: '10px'
    }} {...props} />
  ),
  
  // Style for list items (bullets)
  li: ({node, ...props}) => (
    <li style={{ 
      marginBottom: '5px', 
      paddingLeft: '5px' 
    }} {...props} />
  ),
  
  // FIX: Force the bolded sub-headings (e.g., "Cloud & Orchestration") to be block elements.
  // This ensures the following text/bullet points start on a new line, solving the compression issue.
  strong: ({node, ...props}) => (
    <strong style={{ 
      fontWeight: '700',
      display: 'block', // Crucial fix: forces the element onto its own line
      marginBottom: '5px' // Adds a little space between the title and the content
    }} {...props} />
  ),
};


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
        wordWrap: 'break-word'
      }}>
        <ReactMarkdown components={resumeComponents}>
          {finalResume}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default FinalResume;