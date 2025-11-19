// /frontend/src/components/AnalysisResults.jsx

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

const AnalysisResults = ({ analysis, loading, transformedResume, onTransform }) => {
  const [userAnswers, setUserAnswers] = useState('');
  const [transforming, setTransforming] = useState(false);

  // If loading and no analysis yet (initial Part 1 run), show a full-page spinner.
  // If loading but we already have `analysis` (i.e., we're running Part 2), keep showing
  // the existing analysis UI and only show an inline transforming indicator.
  if (loading && !analysis) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          gap: '15px'
        }}>
          <div className="loading-spinner"></div>
          <div>Analyzing your resume... This may take a minute.</div>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return null;
  }

  // Extract the analysis text from the analysis object
  const analysisText = typeof analysis === 'string' ? analysis : analysis.part_1_analysis || '';
  const extractSection = (text, sectionName) => {
    let content = '';
    
    if (sectionName === 'strengths') {
      const match = text.match(/1\.\s*Strengths[\s\S]*?(?=\n2\.|$)/);
      content = match ? match[0] : '';
    } else if (sectionName === 'gaps') {
      const match = text.match(/2\.\s*Gaps[\s\S]*?(?=\n3\.|$)/);
      content = match ? match[0] : '';
    } else if (sectionName === 'clarification') {
      const match = text.match(/3\.\s*Clarification[\s\S]*?$/);
      content = match ? match[0] : '';
    }
    
    if (content) {
      // Remove just the header line (e.g., "1. Strengths ..."), keep the rest
      const lines = content.split('\n');
      return lines.slice(1).join('\n').trim();
    }
    
    return '';
  };
  
  console.log('[AnalysisResults] Full analysis text:', analysisText.substring(0, 300));

  const strengthsSection = extractSection(analysisText, 'strengths');
  const gapsSection = extractSection(analysisText, 'gaps');
  const clarificationSection = extractSection(analysisText, 'clarification');

  // Reusable Part 1 analysis cards component
  const Part1AnalysisCards = () => (
    <>
      {/* Part 1: Analysis with Two-Column Layout */}
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '25px',
        marginBottom: '25px'
      }}>
        {/* Left Column: Strengths */}
        <div style={{ 
          padding: '25px', 
          border: '2px solid #e8f5e9', 
          borderRadius: '12px',
          backgroundColor: '#f9fff9',
          boxShadow: '0 2px 8px rgba(76, 175, 80, 0.08)'
        }}>
          <h2 style={{ 
            marginBottom: '20px', 
            color: '#2e7d32',
            fontSize: '20px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            📚 Top Strengths
          </h2>
          <div style={{ 
            backgroundColor: '#f5fff5', 
            padding: '20px', 
            borderRadius: '8px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fontSize: '14px',
            lineHeight: '1.6',
            color: '#333'
          }}>
            <ReactMarkdown
              components={{
                h1: ({node, ...props}) => null,
                h2: ({node, ...props}) => null,
                h3: ({node, ...props}) => null,
                p: ({node, ...props}) => (
                  <p style={{
                    marginBottom: '12px',
                    color: '#2e7d32',
                    lineHeight: '1.5',
                    fontSize: '13px'
                  }} {...props} />
                ),
                ul: ({node, ...props}) => (
                  <ul style={{
                    marginLeft: '0',
                    marginBottom: '15px',
                    paddingLeft: '20px',
                    color: '#2e7d32'
                  }} {...props} />
                ),
                ol: ({node, ...props}) => (
                  <ol style={{
                    marginLeft: '0',
                    marginBottom: '15px',
                    paddingLeft: '20px',
                    color: '#2e7d32'
                  }} {...props} />
                ),
                li: ({node, ...props}) => (
                  <li style={{
                    marginBottom: '8px',
                    lineHeight: '1.4',
                    fontSize: '13px'
                  }} {...props} />
                ),
                strong: ({node, ...props}) => (
                  <strong style={{
                    color: '#1b5e20',
                    fontWeight: '600'
                  }} {...props} />
                ),
              }}
            >
              {strengthsSection}
            </ReactMarkdown>
          </div>
        </div>

        {/* Right Column: Gaps */}
        <div style={{ 
          padding: '25px', 
          border: '2px solid #ffebee', 
          borderRadius: '12px',
          backgroundColor: '#fff9f9',
          boxShadow: '0 2px 8px rgba(255, 0, 0, 0.08)'
        }}>
          <h2 style={{ 
            marginBottom: '20px', 
            color: '#c41c3b',
            fontSize: '20px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            💡 Skill Gaps Identified
          </h2>
          <div style={{ 
            backgroundColor: '#fff5f5', 
            padding: '20px', 
            borderRadius: '8px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fontSize: '14px',
            lineHeight: '1.6',
            color: '#333'
          }}>
            <ReactMarkdown
              components={{
                h1: ({node, ...props}) => null,
                h2: ({node, ...props}) => null,
                h3: ({node, ...props}) => null,
                p: ({node, ...props}) => (
                  <p style={{
                    marginBottom: '12px',
                    color: '#d32f2f',
                    lineHeight: '1.5',
                    fontSize: '13px'
                  }} {...props} />
                ),
                ul: ({node, ...props}) => (
                  <ul style={{
                    marginLeft: '0',
                    marginBottom: '15px',
                    paddingLeft: '20px',
                    color: '#d32f2f'
                  }} {...props} />
                ),
                ol: ({node, ...props}) => (
                  <ol style={{
                    marginLeft: '0',
                    marginBottom: '15px',
                    paddingLeft: '20px',
                    color: '#d32f2f'
                  }} {...props} />
                ),
                li: ({node, ...props}) => (
                  <li style={{
                    marginBottom: '8px',
                    lineHeight: '1.4',
                    fontSize: '13px'
                  }} {...props} />
                ),
                strong: ({node, ...props}) => (
                  <strong style={{
                    color: '#c41c3b',
                    fontWeight: '600'
                  }} {...props} />
                ),
              }}
            >
              {gapsSection}
            </ReactMarkdown>
          </div>
        </div>
      </div>

      {/* Clarification Questions Section */}
      <div style={{ 
        padding: '25px', 
        border: '2px solid #e3f2fd', 
        borderRadius: '12px', 
        marginBottom: '25px',
        backgroundColor: '#f8fbff',
        boxShadow: '0 2px 8px rgba(33, 150, 243, 0.08)'
      }}>
        <h2 style={{ 
          marginBottom: '20px', 
          color: '#1565c0',
          fontSize: '20px',
          fontWeight: '700',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          ❓ Clarification Questions
        </h2>
        <div style={{ 
          backgroundColor: '#f5faff', 
          padding: '20px', 
          borderRadius: '8px',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          fontSize: '14px',
          lineHeight: '1.6',
          color: '#333',
          marginBottom: '20px'
        }}>
          <ReactMarkdown
            components={{
              h1: ({node, ...props}) => null,
              h2: ({node, ...props}) => null,
              h3: ({node, ...props}) => null,
              p: ({node, ...props}) => (
                <p style={{ marginBottom: '12px', color: '#1565c0', lineHeight: '1.5', fontSize: '13px' }} {...props} />
              ),
              ol: ({node, ...props}) => (
                <ol style={{ marginLeft: '20px', marginBottom: '15px', color: '#1565c0' }} {...props} />
              ),
              ul: ({node, ...props}) => (
                <ul style={{ marginLeft: '20px', marginBottom: '15px', color: '#1565c0' }} {...props} />
              ),
              li: ({node, ...props}) => (
                <li style={{ marginBottom: '8px', lineHeight: '1.4', fontSize: '13px' }} {...props} />
              ),
              strong: ({node, ...props}) => (
                <strong style={{ color: '#0d47a1', fontWeight: '600' }} {...props} />
              ),
            }}
          >
            {clarificationSection}
          </ReactMarkdown>
        </div>
      </div>
    </>
  );

  // Determine if transformation is currently running (either parent loading while analysis exists, or local transforming)
  const isGenerating = (loading && analysis) || transforming;

  // Always show Part 1 analysis cards. Below that, either show the input form (when idle)
  // or show the user's answers (read-only) while generating or after transformation.
  return (
    <>
      <Part1AnalysisCards />

      {/* If generating or transformedResume exists, show read-only answers block */}
      {(isGenerating || transformedResume) ? (
        <div style={{ 
          padding: '25px', 
          border: '2px solid #fff3e0', 
          borderRadius: '12px', 
          marginBottom: '25px',
          backgroundColor: '#fffbf0',
          boxShadow: '0 2px 8px rgba(255, 152, 0, 0.08)'
        }}>
          <h2 style={{ 
            marginBottom: '20px', 
            color: '#e65100',
            fontSize: '20px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            📝 Your Answers
          </h2>
          <div style={{ 
            backgroundColor: '#fffef9', 
            padding: '20px', 
            borderRadius: '8px',
            fontFamily: 'Courier New, monospace',
            fontSize: '13px',
            lineHeight: '1.6',
            color: '#666',
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
            border: '1px solid #ffe0b2'
          }}>
            {userAnswers || '(No answers provided)'}
          </div>
        </div>
      ) : (
        /* Otherwise show the editable input form */
        <div style={{ marginTop: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '10px', 
            fontSize: '14px', 
            fontWeight: '600', 
            color: '#333' 
          }}>
            Your Answers:
          </label>
          <textarea
            value={userAnswers}
            onChange={(e) => setUserAnswers(e.target.value)}
            placeholder="Paste your answers here..."
            readOnly={loading || transforming}
            style={{
              width: '100%',
              height: '150px',
              padding: '12px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              fontFamily: 'monospace',
              fontSize: '13px',
              color: '#333',
              marginBottom: '15px',
              boxSizing: 'border-box'
            }}
          />
          <button
            onClick={async () => {
              setTransforming(true);
              try {
                await onTransform(userAnswers);
              } finally {
                setTransforming(false);
              }
            }}
            disabled={!userAnswers.trim() || loading}
            style={{
              padding: '12px 24px',
              backgroundColor: !userAnswers.trim() || loading ? '#ccc' : '#1565c0',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: !userAnswers.trim() || loading ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: '600'
            }}
          >
            {(loading || transforming) ? '⏳ Generating...' : '🚀 Generate Transformed Resume (Part 2)'}
          </button>
        </div>
      )}

      {/* Render Part 2 area if generating or we have a transformed resume */}
      {(isGenerating || transformedResume) && (
        <div style={{ 
          padding: '25px', 
          border: '2px solid #f3e5f5', 
          borderRadius: '12px', 
          marginBottom: '25px',
          backgroundColor: '#faf9fc',
          boxShadow: '0 2px 8px rgba(156, 39, 176, 0.08)'
        }}>
          <h2 style={{ 
            marginBottom: '20px', 
            color: '#6a1b9a',
            fontSize: '20px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            ✨ Transformed Resume (Part 2)
            {(isGenerating) && (
              <span style={{ marginLeft: '8px' }}>
                <div className="loading-spinner" style={{ width: '18px', height: '18px', borderWidth: '3px' }}></div>
              </span>
            )}
          </h2>
          <div style={{ 
            backgroundColor: '#fdfbfe', 
            padding: '25px', 
            borderRadius: '8px',
            border: '1px solid #e1bee7',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fontSize: '13px',
            lineHeight: '1.6',
            minHeight: '300px',
            maxHeight: '800px',
            overflowY: 'auto',
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
            color: '#4a148c'
          }}>
            {transformedResume || (isGenerating ? 'Generating transformed resume — this can take a minute. The analysis above remains visible while we work.' : '')}
          </div>
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <button 
              onClick={() => transformedResume && navigator.clipboard.writeText(transformedResume)}
              disabled={!transformedResume}
              style={{
                padding: '12px 24px',
                backgroundColor: transformedResume ? '#6a1b9a' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: transformedResume ? 'pointer' : 'not-allowed',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => { if (transformedResume) e.target.style.backgroundColor = '#4a148c' }}
              onMouseOut={(e) => { if (transformedResume) e.target.style.backgroundColor = '#6a1b9a' }}
            >
              📋 Copy to Clipboard
            </button>
          </div>
        </div>
      )}
    </>
  );

  // Show analysis results with clarification questions form
  return (
    <>
      <Part1AnalysisCards />

      {/* User Input Form */}
      <div style={{ marginTop: '20px' }}>
        <label style={{ 
          display: 'block', 
          marginBottom: '10px', 
          fontSize: '14px', 
          fontWeight: '600', 
          color: '#333' 
        }}>
          Your Answers:
        </label>
        <textarea
          value={userAnswers}
          onChange={(e) => setUserAnswers(e.target.value)}
          placeholder="Paste your answers here..."
          style={{
            width: '100%',
            height: '150px',
            padding: '12px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            fontFamily: 'monospace',
            fontSize: '13px',
            color: '#333',
            marginBottom: '15px',
            boxSizing: 'border-box'
          }}
        />
        <button
          onClick={async () => {
            // local transforming indicator to keep UI responsive while parent does network work
            setTransforming(true);
            try {
              await onTransform(userAnswers);
            } finally {
              setTransforming(false);
            }
          }}
          disabled={!userAnswers.trim() || loading}
          style={{
            padding: '12px 24px',
            backgroundColor: !userAnswers.trim() || loading ? '#ccc' : '#1565c0',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: !userAnswers.trim() || loading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: '600'
          }}
        >
          {(loading || transforming) ? '⏳ Generating...' : '🚀 Generate Transformed Resume (Part 2)'}
        </button>
      </div>
    </>
  );
};

export default AnalysisResults;