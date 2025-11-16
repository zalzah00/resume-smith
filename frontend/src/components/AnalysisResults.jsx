// /frontend/src/components/AnalysisResults.jsx

import React from 'react';
import ReactMarkdown from 'react-markdown';

const AnalysisResults = ({ analysis, loading }) => {
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
          <div>Analyzing your resume... This may take a minute.</div>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return null;
  }

  return (
    <div style={{ 
      padding: '25px', 
      border: '1px solid #e9ecef', 
      borderRadius: '12px', 
      marginBottom: '25px',
      backgroundColor: 'white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ 
        marginBottom: '20px', 
        color: '#343a40',
        borderBottom: '2px solid #007bff',
        paddingBottom: '10px',
        fontSize: '24px'
      }}>
        📊 Analysis Results
      </h2>
      <div style={{ 
        backgroundColor: '#f8f9fa', 
        padding: '25px', 
        borderRadius: '8px',
        border: '1px solid #dee2e6',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        fontSize: '15px',
        lineHeight: '1.6',
        minHeight: '200px',
        maxHeight: '600px',
        overflowY: 'auto'
      }}>
        <ReactMarkdown
          components={{
            h1: ({node, children, ...props}) => {
              const text = React.Children.toArray(children).join('');
              
              // Hardcoded section header detection with simple string matching
              if (text.includes('Strengths')) {
                return (
                  <h1 
                    style={{
                      color: '#155724',
                      backgroundColor: '#d4edda',
                      padding: '15px 20px',
                      borderRadius: '8px',
                      borderLeft: '5px solid #28a745',
                      margin: '30px 0 20px 0',
                      fontSize: '18px',
                      fontWeight: '700',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                    {...props}
                  >
                    ✅ {children}
                  </h1>
                );
              } else if (text.includes('Gaps')) {
                return (
                  <h1 
                    style={{
                      color: '#856404',
                      backgroundColor: '#fff3cd',
                      padding: '15px 20px',
                      borderRadius: '8px',
                      borderLeft: '5px solid #ffc107',
                      margin: '30px 0 20px 0',
                      fontSize: '18px',
                      fontWeight: '700',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                    {...props}
                  >
                    ⚠️ {children}
                  </h1>
                );
              } else if (text.includes('Clarification Questions')) {
                return (
                  <h1 
                    style={{
                      color: '#004085',
                      backgroundColor: '#cce5ff',
                      padding: '15px 20px',
                      borderRadius: '8px',
                      borderLeft: '5px solid #007bff',
                      margin: '30px 0 20px 0',
                      fontSize: '18px',
                      fontWeight: '700',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                    {...props}
                  >
                    ❓ {children}
                  </h1>
                );
              }
              
              // Default styling for other h1 elements
              return (
                <h1 
                  style={{
                    color: '#2c3e50',
                    margin: '25px 0 15px 0',
                    fontSize: '18px',
                    fontWeight: '600'
                  }}
                  {...props}
                >
                  {children}
                </h1>
              );
            },
            h2: ({node, ...props}) => (
              <h2 style={{
                color: '#34495e',
                margin: '20px 0 12px 0',
                paddingBottom: '6px',
                borderBottom: '1px solid #bdc3c7',
                fontSize: '16px',
                fontWeight: '600'
              }} {...props} />
            ),
            h3: ({node, ...props}) => (
              <h3 style={{
                color: '#7f8c8d',
                margin: '18px 0 10px 0',
                fontStyle: 'italic',
                fontSize: '14px'
              }} {...props} />
            ),
            p: ({node, ...props}) => (
              <p style={{
                marginBottom: '12px',
                color: '#2c3e50',
                lineHeight: '1.5'
              }} {...props} />
            ),
            ul: ({node, ...props}) => (
              <ul style={{
                marginLeft: '20px',
                marginBottom: '15px',
                color: '#2c3e50'
              }} {...props} />
            ),
            ol: ({node, ...props}) => (
              <ol style={{
                marginLeft: '20px',
                marginBottom: '15px',
                color: '#2c3e50'
              }} {...props} />
            ),
            li: ({node, ...props}) => (
              <li style={{
                marginBottom: '8px',
                lineHeight: '1.4'
              }} {...props} />
            ),
            strong: ({node, ...props}) => (
              <strong style={{
                color: '#2c3e50',
                fontWeight: '600'
              }} {...props} />
            ),
            em: ({node, ...props}) => (
              <em style={{
                color: '#7f8c8d',
                fontStyle: 'italic'
              }} {...props} />
            ),
          }}
        >
          {analysis}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default AnalysisResults;

// end_of_file