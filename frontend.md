```json
// frontend/package.json
{
  "name": "resume-transformer-frontend",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "axios": "^1.6.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-markdown": "^9.1.0",
    "react-scripts": "^5.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}

// end_of_file
```

```html
// frontend/public/index.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta
      name="description"
      content="AI-powered resume transformation tool"
    />
    <title>Resume Transformer</title>
    <style>
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
          'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
          sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        background-color: #f5f5f5;
      }
    </style>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
// end_of_file
```

```py
# frontend/public/fonts/README.md
Place Inter font woff2 files here to use the bundled local font:

- Inter-Regular.woff2 (400)
- Inter-Medium.woff2  (500)
- Inter-SemiBold.woff2 (600)
- Inter-Bold.woff2 (700)

If these files are present at `/public/fonts/...`, the app will load the local font and avoid external Google Fonts requests. If they are missing, the app falls back to system fonts.

Where to get them:
- Download Inter woff2 files from https://rsms.me/inter/ or from Google Fonts (convert to woff2), and place the files above in this folder.

Note for development:
- After adding the files, restart the dev server or hard-refresh the browser to see the font changes.

# end_of_file
```

```css
// frontend/src/App.css
/* /frontend/src/App.css */

:root {
  --primary-color: #1e3a8a;
  --primary-light: #3b82f6;
  --primary-dark: #1e40af;
  --success-color: #16a34a;
  --danger-color: #dc2626;
  --warning-color: #ea580c;
  --neutral-50: #f9fafb;
  --neutral-100: #f3f4f6;
  --neutral-200: #e5e7eb;
  --neutral-300: #d1d5db;
  --neutral-600: #4b5563;
  --neutral-700: #374151;
  --neutral-900: #111827;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.App {
  min-height: 100vh;
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
}

/* Basic reset and typography */
* {
  box-sizing: border-box;
}

/* Local font files not found during build in some setups. Use system stack as fallback.
   To use bundled Inter fonts, add woff2 files to `public/fonts/` and re-enable @font-face. */

body {
  margin: 0;
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--neutral-900);
}

/* Header Styles */
.App-header {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
  color: white;
  padding: 14px 16px; /* further reduced vertical padding for a tighter header */
  text-align: center;
  box-shadow: var(--shadow-lg);
  margin-bottom: 24px;
}

.App-header h1 {
  margin: 0;
  font-size: 1.6rem; /* slightly smaller title to reduce visual dominance */
  font-weight: 700;
  letter-spacing: -0.3px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
}

/* Small normalize / form defaults to ensure consistent spacing */
h1, h2, h3, h4, h5 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

input, button, select, textarea {
  font-family: inherit; /* ensure form controls use the Inter font */
  font-size: 1rem;
}

button {
  border-radius: 6px;
}

/* Main Content */
.App-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px 40px 20px;
}

/* Footer */
footer {
  background-color: var(--neutral-900);
  color: white;
  text-align: center;
  padding: 20px;
  margin-top: 60px;
  font-size: 0.875rem;
}

footer p {
  margin: 0;
}

/* Utility classes */
.text-center {
  text-align: center;
}

.mb-20 {
  margin-bottom: 20px;
}

/* Responsive design */
@media (max-width: 768px) {
  .App-main {
    padding: 0 10px 20px 10px;
  }
  
  .App-header h1 {
    font-size: 1.4rem;
  }
}

/* Loading animation */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-spinner {
  border: 4px solid var(--neutral-200);
  border-top: 4px solid var(--primary-light);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 2s linear infinite;
  margin: 20px auto;
}

/* end_of_file */
// end_of_file
```

```tsx
// frontend/src/App.jsx

import React, { useState } from 'react';
import './App.css';
import UserInput from './components/UserInput';
import AnalysisResults from './components/AnalysisResults';
import JobSearchAndSelect from './components/JobSearchAndSelect'; 
import { analyzeResume, transformResume } from './services/api';

const App = () => {
  const [resumeFile, setResumeFile] = useState(null);
  // Replaced jdFile state with jdText
  const [jdText, setJdText] = useState('');
  const [selectedJdTitle, setSelectedJdTitle] = useState(''); // To display selected job name
  const [selectedCompany, setSelectedCompany] = useState(''); // Store company name for LLM prompt
  const [provider, setProvider] = useState('gemini');
  const [analysis, setAnalysis] = useState(null);
  const [transformedResume, setTransformedResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // New setter function to handle text, title, and company
  const handleSetJdText = (text, title, company) => {
    setJdText(text);
    setSelectedJdTitle(title);
    setSelectedCompany(company || '');
  };
  
  // New deselect function
  const handleDeselect = () => {
    setJdText('');
    setSelectedJdTitle('');
    setSelectedCompany('');
  };


  const handleAnalyze = async () => {
    setError(null);
    setAnalysis(null);
    setTransformedResume(null);

    // CRITICAL CHANGE: Check for jdText instead of jdFile
    if (!provider || !resumeFile || !jdText) {
      setError('Please select an LLM, upload a resume, and select a Job Description.');
      return;
    }

    setLoading(true);
    try {
      // CRITICAL CHANGE: Pass jdText string instead of jdFile object
      const result = await analyzeResume(provider, resumeFile, jdText);
      // Extract the analysis markdown from the response
      setAnalysis({
        part_1_analysis: result.part_1_analysis,
        original_resume_text: result.original_resume_text,
      });
    } catch (err) {
      setError(`Analysis failed: ${err.message}. Check the backend API.`);
    } finally {
      setLoading(false);
    }
  };

  const handleTransform = async (userAnswers) => {
    setLoading(true);
    setError(null);
    try {
      // The transformResume call includes jdText, job title, and company
      const result = await transformResume(
        provider,
        analysis.original_resume_text,
        jdText,
        selectedJdTitle,
        selectedCompany,
        analysis.part_1_analysis,
        userAnswers
      );
      setTransformedResume(result.transformed_resume);
    } catch (err) {
      setError(`Transformation failed: ${err.message}.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Resume Transformer ✨</h1>
      </header>
      
      <main className="App-main">
        {/* Job Search & Select Component - ADDING new props */}
        <JobSearchAndSelect 
            setJdText={handleSetJdText}
            selectedJdTitle={selectedJdTitle}
            onDeselect={handleDeselect}
            selectedCompany={selectedCompany} // NEW
            fullJdText={jdText}               // NEW
        />

        <UserInput 
          // Passed resumeFile and setResumeFile (NO CHANGE)
          resumeFile={resumeFile}
          setResumeFile={setResumeFile}
          
          // LLM Provider (NO CHANGE)
          provider={provider}
          setProvider={setProvider}
          
          // New requirement to check before allowing analysis
          isJdSelected={!!jdText}
          
          onAnalyze={handleAnalyze}
          loading={loading}
          error={error}
        />

        <AnalysisResults
          analysis={analysis}
          transformedResume={transformedResume}
          onTransform={handleTransform}
          loading={loading}
        />
      </main>
      <footer>
        <p>© 2025 Resume Transformer</p>
      </footer>
    </div>
  );
};

export default App;
// end_of_file
```

```tsx
// frontend/src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./App.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
// end_of_file
```

```css
// frontend/src/components/AnalysisResults.css
/* AnalysisResults.css */

:root {
  --primary-color: #1e3a8a;
  --primary-light: #3b82f6;
  --primary-dark: #1e40af;
  --success-color: #16a34a;
  --danger-color: #dc2626;
  --warning-color: #ea580c;
  --neutral-50: #f9fafb;
  --neutral-100: #f3f4f6;
  --neutral-200: #e5e7eb;
  --neutral-300: #d1d5db;
  --neutral-600: #4b5563;
  --neutral-700: #374151;
  --neutral-900: #111827;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.analysis-results-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Part 1 Analysis Cards Section */
.part1-analysis-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.analysis-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: var(--shadow-md);
  transition: all 0.3s ease;
}

.analysis-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.analysis-card h4 {
  margin: 0 0 16px 0;
  font-size: 1.125rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
}

.analysis-card.strengths {
  border-left: 4px solid var(--success-color);
  background: linear-gradient(135deg, rgba(22, 163, 74, 0.05) 0%, white 100%);
}

.analysis-card.strengths h4 {
  color: var(--success-color);
}

.analysis-card.gaps {
  border-left: 4px solid var(--danger-color);
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.05) 0%, white 100%);
}

.analysis-card.gaps h4 {
  color: var(--danger-color);
}

.analysis-card.clarification {
  border-left: 4px solid var(--primary-light);
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, white 100%);
  grid-column: 1 / -1;
}

.analysis-card.clarification h4 {
  color: var(--primary-light);
}

.analysis-card ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.analysis-card li {
  padding: 10px 0;
  color: var(--neutral-700);
  line-height: 1.6;
  border-bottom: 1px solid var(--neutral-100);
}

.analysis-card li:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

/* Part 2 Section */
.part2-section {
  margin-top: 32px;
}

.part2-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

.user-answers-box {
  background: white;
  border-radius: 12px;
  padding: 20px;
  border-left: 4px solid var(--warning-color);
  background: linear-gradient(135deg, rgba(234, 88, 12, 0.05) 0%, white 100%);
  box-shadow: var(--shadow-md);
}

.user-answers-box h4 {
  margin: 0 0 16px 0;
  color: var(--warning-color);
  font-size: 1.125rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-answers-box p {
  margin: 8px 0;
  color: var(--neutral-700);
  line-height: 1.6;
}

.transformed-resume-box {
  background: white;
  border-radius: 12px;
  padding: 20px;
  border-left: 4px solid #6a1b9a;
  background: linear-gradient(135deg, rgba(106, 27, 154, 0.05) 0%, white 100%);
  box-shadow: var(--shadow-md);
}

.transformed-resume-box h4 {
  margin: 0 0 16px 0;
  color: #6a1b9a;
  font-size: 1.125rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.copy-button {
  background-color: #6a1b9a;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
  margin: 0;
}

.copy-button:hover {
  background-color: #5a1680;
}

.copy-button.copied {
  background-color: var(--success-color);
}

.resume-content {
  color: var(--neutral-700);
  line-height: 1.8;
}

.resume-content h5 {
  margin: 16px 0 8px 0;
  color: #6a1b9a;
  font-size: 0.95rem;
  font-weight: 700;
}

.resume-content p {
  margin: 4px 0 12px 0;
  line-height: 1.6;
}

.resume-content ul {
  margin: 0 0 12px 0;
  padding-left: 20px;
}

.resume-content li {
  margin: 4px 0;
  color: var(--neutral-700);
}

/* Loading State */
.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
}

.spinner {
  border: 3px solid var(--neutral-200);
  border-top: 3px solid var(--primary-light);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Error State */
.error-box {
  background-color: rgba(220, 38, 38, 0.1);
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 16px;
  color: #991b1b;
  margin: 20px 0;
}

/* Responsive */
@media (max-width: 768px) {
  .part1-analysis-section {
    grid-template-columns: 1fr;
  }
  
  .analysis-card.clarification {
    grid-column: 1;
  }
  
  .part2-content {
    grid-template-columns: 1fr;
  }
  
  .analysis-card,
  .user-answers-box,
  .transformed-resume-box {
    padding: 16px;
  }
}

// end_of_file
```

```tsx
// frontend/src/components/AnalysisResults.jsx
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
// end_of_file
```

```tsx
// frontend/src/components/FileUpload.jsx
// /frontend/src/components/FileUpload.jsx

import React from 'react';

// Allowed extensions for local validation/hints
const ALLOWED_EXTENSIONS = ['.docx', '.pdf', '.txt'];

const FileUpload = ({ provider, setProvider, resumeFile, setResumeFile, jdFile, setJdFile, onAnalyze, loading }) => {
  
  const isValidFile = (file) => {
    if (!file) return false;
    const extension = '.' + file.name.split('.').pop().toLowerCase();
    return ALLOWED_EXTENSIONS.includes(extension);
  }

  const handleFileUpload = (e, setFile) => {
    const file = e.target.files[0];
    if (file && isValidFile(file)) {
      setFile(file);
    } else if (file) {
      alert(`Please upload a file with one of the following extensions: ${ALLOWED_EXTENSIONS.join(', ')}`);
      setFile(null);
      e.target.value = ''; // Clear the input
    } else {
      setFile(null);
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
          Resume (.docx, .pdf, .txt):
        </label>
        <input
          type="file"
          accept=".docx,.pdf,.txt" // Updated accept attribute
          onChange={(e) => handleFileUpload(e, setResumeFile)}
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
          Job Description (.docx, .pdf, .txt):
        </label>
        <input
          type="file"
          accept=".docx,.pdf,.txt" // Updated accept attribute
          onChange={(e) => handleFileUpload(e, setJdFile)}
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

// end_of_file
```

```tsx
// frontend/src/components/FinalResume.jsx
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
// end_of_file
```

```css
// frontend/src/components/JobSearchAndSelect.css
/* --- V2 Tabular Display Styles --- */

.job-results-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 15px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.job-results-table th, 
.job-results-table td {
    border: 1px solid #ddd;
    padding: 10px 15px;
    text-align: left;
    vertical-align: top;
}

.job-results-table th {
    background-color: #f4f4f4;
    font-weight: bold;
    color: #333;
}

/* Row Hover and Selection Styling */
.job-results-table tbody tr {
    transition: background-color 0.2s ease, border-left 0.2s ease;
}

.job-results-table tbody tr:hover {
    cursor: pointer;
    background-color: #e6f7ff; /* Light blue hover */
}

/* Highlight for the currently selected job */
.job-results-table tbody tr.selected-row {
    background-color: #d0e0ff; /* Distinct blue highlight */
    border-left: 5px solid #0056b3; /* Stronger border for emphasis */
}

.job-results-table .company-name {
    display: block;
    font-size: 0.9em;
    color: #555;
    margin-top: 2px;
}

.job-results-table .jd-snippet-cell {
    font-size: 0.9em;
    color: #444;
    line-height: 1.4;
}

/* Pagination Controls Styling */
.pagination-controls {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 20px 0;
    gap: 15px;
}

.pagination-controls .page-status {
    font-weight: bold;
    color: #333;
}

/* Ensure buttons in controls look consistent */
.pagination-controls .button {
    padding: 8px 15px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.pagination-controls .button:hover:not(:disabled) {
    background-color: #0056b3;
}

.pagination-controls .button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

/* You may need to keep or adjust existing styles for .job-search-container, .search-form, etc. */
// end_of_file
```

```tsx
// frontend/src/components/JobSearchAndSelect.jsx

import React, { useState } from 'react';
import { searchJobs } from '../services/api';
import CONFIG from '../config/jobConfig'; 
import './JobSearchAndSelect.css';

// Helper function to get the display name for a code (for status message)
const getDisplayName = (code, configKey) => {
    const map = CONFIG[configKey];
    for (const [name, value] of Object.entries(map)) {
        if (value === code) return name;
    }
    return 'N/A';
};

const PER_PAGE_COUNT = 5; // Define the fixed number of results per page

// ACCEPTING new props: selectedCompany and fullJdText
const JobSearchAndSelect = ({ setJdText, selectedJdTitle, selectedCompany, fullJdText, onDeselect }) => {
    const [keyword, setKeyword] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(CONFIG.JOB_CATEGORIES["All Categories"]);
    const [selectedEmployment, setSelectedEmployment] = useState(CONFIG.EMPLOYMENT_TYPES["All Types"]);
    const [selectedMRT, setSelectedMRT] = useState(CONFIG.MRT_STATIONS["All Stations"]);
    
    // State for Pagination
    const [results, setResults] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); 
    const [totalResults, setTotalResults] = useState(0); 
    
    // Tracks how many items were returned in the last API call.
    const [lastFetchedCount, setLastFetchedCount] = useState(0); 
    
    // V2: State for row selection
    const [highlightedJobIndex, setHighlightedJobIndex] = useState(null); 
    
    const [isInitialSearch, setIsInitialSearch] = useState(true); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    

    // Function to handle the actual API call
    const fetchJobs = async (pageToFetch) => { 
        setLoading(true);
        setError(null);

        const params = {
            page: pageToFetch,
            per_page_count: PER_PAGE_COUNT,
        };

        if (selectedCategory) params.JobCategory = selectedCategory;
        if (selectedEmployment) params.EmploymentType = selectedEmployment;
        if (selectedMRT) params.id_Job_NearestMRTStation = selectedMRT;
        if (keyword.trim()) params.keywords = keyword.trim();

        try {
            console.log('Searching with params:', params);
            const data = await searchJobs(params);
            
            const jobResults = data?.data?.result || [];
            const newTotal = data?.data?.total_records || 0;

            // TRADITIONAL PAGINATION: Always REPLACE results, never append.
            setResults(jobResults);
            
            // V2: Reset highlight when loading new page
            setHighlightedJobIndex(null); 

            // Update successful fetch states
            setCurrentPage(pageToFetch); 
            setTotalResults(newTotal);
            setLastFetchedCount(jobResults.length); 
            
            // Only set an error if the actual jobResults array is empty.
            if (jobResults.length === 0 && pageToFetch === 1) {
                 setError("No jobs found matching your criteria.");
            }
            
        } catch (err) {
            console.error('Search error:', err);
            setError(`Failed to fetch jobs: ${err.message}`);
        } finally {
            setLoading(false);
            setIsInitialSearch(false);
        }
    }

    // Handler for form submission
    const handleSearch = async (e) => {
        e.preventDefault();
        
        setResults([]); 
        setTotalResults(0);
        setLastFetchedCount(0);
        setCurrentPage(1); 
        setIsInitialSearch(true); 
        
        await fetchJobs(1); // Fetch page 1
    };

    // V2: HANDLER for clicking a table row to select and highlight
    const handleRowClick = (jobItem, index) => {
        // 1. Highlight the row
        setHighlightedJobIndex(index); 

        // 2. Select the job and pass data to the parent component
        const title = jobItem.job?.Title || 'Selected Job';
        const company = jobItem.company?.CompanyName || 'N/A';
        // Corrected variable usage from 'item' to 'jobItem' (Fix from previous turn)
        const description = jobItem.job?.JobDescription || ''; 
        
        // This call updates selectedJdTitle in the parent component (App.jsx), triggering the screen change
        setJdText(description, title, company); 
    };

    // Handler for the "Next Page" button
    const handleNextPage = () => {
        const nextPage = currentPage + 1;
        fetchJobs(nextPage);
    };

    // Handler for the "Previous Page" button
    const handlePrevPage = () => {
        const prevPage = currentPage - 1;
        if (prevPage >= 1) {
            fetchJobs(prevPage);
        }
    };
    
    // Derived state
    const hasNextPage = lastFetchedCount === PER_PAGE_COUNT;
    const hasPrevPage = currentPage > 1;
    const isSearchingFirstPage = isInitialSearch && loading; 
    const displayTotalResults = Math.max(results.length, totalResults);
    const startRange = results.length > 0 ? (currentPage - 1) * PER_PAGE_COUNT + 1 : 0;
    const endRange = startRange > 0 ? startRange + results.length - 1 : 0;


    if (selectedJdTitle) {
        // Display the selected job confirmation
        // MODIFIED BLOCK START: Now uses selectedCompany and fullJdText
        
        // Create a snippet using the full JD text passed from the parent
        const snippet = fullJdText.substring(0, 200) + (fullJdText.length > 200 ? '...' : '');

        return (
            <div className="search-status-box selected">
                <h3>✅ Job Selected</h3>
                
                <div className="selected-job-details">
                    <p><strong>Job Title:</strong> {selectedJdTitle}</p>
                    <p><strong>Company:</strong> {selectedCompany}</p>
                    <p>
                        <strong>JD Snippet:</strong> 
                        {/* Re-using dangerouslySetInnerHTML to render the formatted snippet */}
                        <span 
                            dangerouslySetInnerHTML={{ __html: snippet }} 
                            style={{ display: 'block', marginTop: '5px' }}
                        />
                    </p>
                </div>

                <button 
                    onClick={() => {
                        setHighlightedJobIndex(null); // Clear highlight on deselect
                        onDeselect(); // Clear parent selection
                    }} 
                    className="button deselect"
                >
                    Change Job
                </button>
            </div>
        );
        // MODIFIED BLOCK END
    }

    return (
        <div className="job-search-container">
            <h3>1. Search for a Job Description (Click Row to Select)</h3>
            <form onSubmit={handleSearch} className="search-form">
                <input
                    type="text"
                    placeholder="Search keywords (e.g., modeller, data scientist)"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="keyword-input"
                />
                <div className="select-group">
                    <select value={selectedCategory || ''} onChange={(e) => setSelectedCategory(e.target.value ? parseInt(e.target.value) : null)}>
                        {Object.entries(CONFIG.JOB_CATEGORIES).map(([name, code]) => (
                            <option key={name} value={code || ''}>{name}</option>
                        ))}
                    </select>
                    <select value={selectedEmployment || ''} onChange={(e) => setSelectedEmployment(e.target.value ? parseInt(e.target.value) : null)}>
                        {Object.entries(CONFIG.EMPLOYMENT_TYPES).map(([name, code]) => (
                            <option key={name} value={code || ''}>{name}</option>
                        ))}
                    </select>
                    <select value={selectedMRT || ''} onChange={(e) => setSelectedMRT(e.target.value ? parseInt(e.target.value) : null)}>
                        {Object.entries(CONFIG.MRT_STATIONS).map(([name, code]) => (
                            <option key={name} value={code || ''}>{name}</option>
                        ))}
                    </select>
                </div>
                <button type="submit" disabled={loading && isSearchingFirstPage} className="search-button">
                    {loading && isSearchingFirstPage ? 'Searching...' : '🔍 Search Jobs'}
                </button>
            </form>

            {error && <div className="error-message">{error}</div>}
            
            {results.length > 0 && (
                <div className="search-results">
                    <h4>
                        Showing {startRange}-{endRange} of {displayTotalResults === results.length && !hasNextPage ? results.length : 'many'} Results:
                    </h4>

                    {/* V2: Tabular Display */}
                    <table className="job-results-table">
                        <thead>
                            <tr>
                                <th style={{width: '30%'}}>Job Title / Company</th>
                                <th style={{width: '70%'}}>Job Description Snippet</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map((item, index) => {
                                const jdText = item.job?.JobDescription || 'No description provided.';
                                // Display first 200 characters as snippet
                                const jdSnippet = jdText.substring(0, 200) + (jdText.length > 200 ? '...' : '');

                                return (
                                    <tr 
                                        key={index} 
                                        className={index === highlightedJobIndex ? 'selected-row' : ''}
                                        onClick={() => handleRowClick(item, index)} 
                                    >
                                        <td>
                                            <strong>{item.job?.Title || 'N/A'}</strong>
                                            <br />
                                            <span className="company-name">{item.company?.CompanyName || 'N/A'}</span>
                                        </td>
                                        {/* Use dangerouslySetInnerHTML to render HTML formatted text */}
                                        <td 
                                            className="jd-snippet-cell"
                                            dangerouslySetInnerHTML={{ __html: jdSnippet }} 
                                        />
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    
                    {/* Pagination Controls */}
                    <div className="pagination-controls">
                        <button 
                            onClick={handlePrevPage} 
                            disabled={loading || !hasPrevPage} 
                            className="button prev-button"
                        >
                            {'< Previous Page'}
                        </button>
                        <span className="page-status">
                            Page {currentPage}
                        </span>
                        <button 
                            onClick={handleNextPage} 
                            disabled={loading || !hasNextPage} 
                            className="button next-button"
                        >
                            {loading && !isSearchingFirstPage ? 'Loading...' : 'Next Page >'}
                        </button>
                    </div>

                    {!hasNextPage && results.length > 0 && (
                        <div className="search-status-box all-loaded">
                            <p>All visible results loaded.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default JobSearchAndSelect;
// end_of_file
```

```css
// frontend/src/components/UserInput.css
/* UserInput.css */

:root {
  --primary-color: #1e3a8a;
  --primary-light: #3b82f6;
  --primary-dark: #1e40af;
  --success-color: #16a34a;
  --danger-color: #dc2626;
  --warning-color: #ea580c;
  --neutral-50: #f9fafb;
  --neutral-100: #f3f4f6;
  --neutral-200: #e5e7eb;
  --neutral-300: #d1d5db;
  --neutral-600: #4b5563;
  --neutral-700: #374151;
  --neutral-900: #111827;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.user-input-container {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: var(--shadow-md);
}

.user-input-container h3 {
  margin: 0 0 20px 0;
  color: var(--neutral-900);
  font-size: 1.125rem;
  font-weight: 600;
}

.input-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--neutral-700);
}

.file-input-wrapper {
  position: relative;
}

.file-input-wrapper input[type="file"] {
  display: none;
}

.file-input-label {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px; /* slightly reduced padding for tighter spacing */
  border: 2px dashed var(--neutral-300);
  border-radius: 8px;
  background-color: var(--neutral-50);
  cursor: pointer;
  transition: all 0.18s ease;
  font-size: 0.9rem; /* slightly smaller label text */
  font-weight: 500;
  color: var(--neutral-700);
  font-family: inherit;
}

.file-input-label:hover {
  border-color: var(--primary-light);
  background-color: rgba(59, 130, 246, 0.05);
  color: var(--primary-light);
}

.file-input-label svg {
  width: 20px;
  height: 20px;
  margin-right: 8px;
}

.file-selected {
  padding: 12px 16px;
  background-color: rgba(22, 163, 74, 0.1);
  border: 1px solid var(--success-color);
  border-radius: 6px;
  color: var(--success-color);
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.file-selected svg {
  width: 16px;
  height: 16px;
}

.remove-file-button {
  background: none;
  border: none;
  color: var(--success-color);
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  transition: transform 0.2s ease;
}

.remove-file-button:hover {
  transform: scale(1.1);
}

.form-group select {
  padding: 10px 12px;
  border: 1px solid var(--neutral-300);
  border-radius: 6px;
  font-size: 0.95rem;
  font-family: inherit;
  background-color: white;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-group select:focus {
  outline: none;
  border-color: var(--primary-light);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-start;
}

.analyze-button {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
  color: white;
  border: none;
  padding: 10px 20px; /* reduced padding for more compact buttons */
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.18s ease;
  box-shadow: var(--shadow-md);
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.analyze-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.analyze-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.analyze-button.loading {
  position: relative;
  color: transparent;
}

.analyze-button.loading::after {
  content: '';
  position: absolute;
  width: 16px;
  height: 16px;
  top: 50%;
  left: 50%;
  margin-left: -8px;
  margin-top: -8px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-message {
  padding: 12px 16px;
  background-color: rgba(220, 38, 38, 0.1);
  border: 1px solid #fecaca;
  border-radius: 6px;
  color: #991b1b;
  font-size: 0.875rem;
  margin-bottom: 12px;
}

.success-message {
  padding: 12px 16px;
  background-color: rgba(22, 163, 74, 0.1);
  border: 1px solid #86efac;
  border-radius: 6px;
  color: #15803d;
  font-size: 0.875rem;
  margin-bottom: 12px;
}

/* Responsive */
@media (max-width: 768px) {
  .user-input-container {
    padding: 16px;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .analyze-button {
    width: 100%;
    justify-content: center;
  }
}

// end_of_file
```

```tsx
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
        <label htmlFor="resume-upload">Upload Resume (PDF/DOCX):</label>
        <input
          id="resume-upload"
          type="file"
          accept=".pdf,.docx"
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
// end_of_file
```

```tsx
// frontend/src/config/jobConfig.js

/**
 * Static configuration data for job search filters.
 * The numerical codes are typically IDs expected by the backend API.
 * This should be kept consistent with your Python backend (e.g., job_search_app.py).
 */
const CONFIG = {
    "JOB_CATEGORIES": {
        "All Categories": null,
        "Information Technology": 1861,
        "F&B (Food & Beverage)": 1855,
        "Sales / Retail": 1875,
        "Accounting / Auditing / Taxation": 1845,
        "Admin / Secretarial": 1846,
        "Banking and Finance": 1847,
        "Building and Construction": 1848,
        "Customer Service": 1850,
        "Design": 1852,
        "Education / Training": 1853,
        "Engineering": 1854,
        "Healthcare / Pharmaceutical": 1856,
    },
    "EMPLOYMENT_TYPES": {
        "All Types": null,
        "Full Time": 76,
        "Part Time": 115,
        "Contract": 121,
        "Permanent": 88,
        "Temporary": 105,
        "Internship / Attachment": 90,
    },
    "MRT_STATIONS": {
        "All Stations": null,
        "Woodlands (NS9/TE2)": 1833,
        "Jurong East (EW24/NS1)": 1840,
        "Changi Airport (CG2)": 1787,
        "Raffles Place (EW14/NS26)": 1814,
        "Dhoby Ghaut (NE6/NS24/CC1)": 1790,
        "HarbourFront (NE1/CC29)": 1795,
        "Bishan (NS17/CC15)": 1779,
    },
};

export default CONFIG;
// end_of_file
```

```tsx
// frontend/src/services/api.js

import axios from 'axios';

// NOTE: Ensure this is the correct backend URL
// For development: use localhost:8000
// For production: use https://resume-smith-api.onrender.com
const API_BASE = process.env.NODE_ENV === 'production'
  ? 'https://resume-smith-api.onrender.com'
  : 'http://localhost:8000'; 
// External API for job search
const JOBS_API_BASE = 'https://www.findsgjobs.com/apis/job/searchable';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 300000, 
});

// --- Job Search API Call (via backend proxy to bypass CORS) ---
export const searchJobs = async (params) => {
  const response = await api.get('/api/search-jobs', {
    params: params,
    timeout: 20000, // Timeout for job search
  });
  return response.data;
};
// --------------------------------------------------------


export const analyzeResume = async (provider, resumeFile, jdText) => {
  const formData = new FormData();
  formData.append('provider', provider);
  formData.append('resume', resumeFile);
  
  // CRITICAL CHANGE: Append jdText as a string form field
  formData.append('jd_text', jdText); 
  
  const response = await api.post('/api/analyze', formData, {
    headers: {
      // Still need 'multipart/form-data' because of the resume file
      'Content-Type': 'multipart/form-data', 
    },
  });
  return response.data;
};

// transformResume now includes job title and company name
export const transformResume = async (provider, resumeText, jdText, jobTitle, company, part1Analysis, userAnswers) => {
  const formData = new FormData();
  formData.append('provider', provider);
  formData.append('resume_text', resumeText);
  formData.append('jd_text', jdText);
  formData.append('job_title', jobTitle || '');
  formData.append('company', company || '');
  formData.append('part_1_analysis', part1Analysis);
  formData.append('user_answers', userAnswers);
  
  // Assuming the content-type is still handled correctly by axios for form data
  const response = await api.post('/api/transform', formData);
  return response.data;
};
// end_of_file
```
