```python
# frontend/.env
GENERATE_SOURCEMAP=<REPLACE_WITH_ACTUAL_VALUE>
DISABLE_ESLINT_PLUGIN=<REPLACE_WITH_ACTUAL_VALUE>
# end_of_file
```

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
    "react-scripts": "5.0.1"
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

```py
# frontend/README.md
# AI Resume Transformer

A full-stack application that uses AI to analyze and transform resumes based on job descriptions, following a human-in-the-loop process.

## Project Structure
resume-transformer/
├── backend/ # FastAPI backend
│ ├── app.py # FastAPI routes
│ ├── core.py # Business logic
│ ├── requirements.txt # Python dependencies
│ ├── .env.example # Environment variables template
│ └── README.md # Backend-specific instructions
├── frontend/ # React frontend
│ ├── public/
│ ├── src/
│ ├── package.json
│ └── README.md
└── README.md # This file

text

## Prerequisites

- Python 3.8+
- Node.js 14+
- API keys for Gemini and/or Groq

## Backend Setup

### 1. Create Virtual Environment

#### Windows:
```cmd
# Create virtual environment
python -m venv venv

# Activate virtual environment
venv\Scripts\activate

# Your terminal should show (venv) prefix
Linux/Mac:
bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Your terminal should show (venv) prefix
2. Install Dependencies
bash
# Navigate to backend directory
cd backend

# Install Python packages
pip install -r requirements.txt
3. Environment Configuration
bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your API keys
# Add your GEMINI_API_KEY and GROQ_API_KEY
4. Run Backend
bash
# Make sure you're in the backend directory and venv is activated
uvicorn app:app --reload --port 8000
The backend will be available at http://localhost:8000

Frontend Setup
1. Install Dependencies
bash
# Navigate to frontend directory (from project root)
cd frontend

# Install Node.js dependencies
npm install
2. Run Frontend
bash
# Start the development server
npm start
The frontend will be available at http://localhost:3000

Usage
Start Backend: Run the FastAPI server on port 8000

Start Frontend: Run the React app on port 3000

Access Application: Open http://localhost:3000 in your browser

Upload Files:

Select LLM provider (Gemini or Groq)

Upload your resume (.docx)

Upload job description (.docx)

Review Analysis: Get strengths, gaps, and clarification questions

Provide Answers: Answer the clarification questions

Generate Final Resume: Get your AI-transformed resume

API Keys
You need at least one of the following API keys:

Gemini API Key: Get from Google AI Studio

Groq API Key: Get from GroqCloud

Deployment
Backend (Render)
Root Directory: backend

Build Command: pip install -r requirements.txt

Start Command: uvicorn app:app --host 0.0.0.0 --port $PORT

Frontend (Render)
Root Directory: frontend

Build Command: npm install && npm run build

Start Command: serve -s build

Development Notes
Backend uses FastAPI with automatic Swagger docs at /docs

Frontend communicates with backend via REST API

File uploads are limited to .docx format

LLM calls may take 30-60 seconds depending on provider

Troubleshooting
Virtual Environment Issues
Windows: If venv\Scripts\activate doesn't work, try running PowerShell as Administrator

Linux/Mac: If python3 not found, install Python 3.8+ via package manager

API Key Issues
Ensure keys are correctly set in .env file

Verify keys have sufficient quotas

Check backend logs for authentication errors

File Upload Issues
Ensure files are in .docx format

Check file size (should be under 10MB)

Verify backend is running on port 8000
# end_of_file
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

```css
// frontend/src/App.css
/* /frontend/src/App.css */

.App {
  min-height: 100vh;
  background-color: #f8f9fa;
}

/* Basic reset and typography */
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
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
  main {
    padding: 0 10px;
  }
  
  .App header h1 {
    font-size: 1.5rem;
  }
}

/* Loading animation */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
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
// /frontend/src/App.jsx

import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import AnalysisResults from './components/AnalysisResults';
import UserInput from './components/UserInput';
import FinalResume from './components/FinalResume';
import { analyzeResume, transformResume } from './services/api';
import './App.css';

function App() {
  // State for the entire application flow
  const [provider, setProvider] = useState('Gemini');
  const [resumeFile, setResumeFile] = useState(null);
  const [jdFile, setJdFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [jdText, setJdText] = useState('');
  const [userAnswers, setUserAnswers] = useState('');
  const [finalResume, setFinalResume] = useState('');
  const [loadingAnalysis, setLoadingAnalysis] = useState(false); // Separate state for Part 1
  const [loadingTransformation, setLoadingTransformation] = useState(false); // Separate state for Part 2
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!provider || !resumeFile || !jdFile) {
      setError('Please select provider and upload both files');
      return;
    }

    setLoadingAnalysis(true); // Only set analysis loading
    setError('');
    setAnalysis(null);
    setFinalResume('');

    try {
      const result = await analyzeResume(provider, resumeFile, jdFile);
      
      if (result.status === 'success') {
        setAnalysis(result.analysis);
        setResumeText(result.resume_text);
        setJdText(result.jd_text);
      } else {
        setError(result.detail || 'Analysis failed');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Network error. Please try again.');
      console.error('Analysis error:', err);
    } finally {
      setLoadingAnalysis(false); // Only clear analysis loading
    }
  };

  const handleGenerate = async () => {
    if (!userAnswers.trim()) {
      setError('Please provide answers to the questions');
      return;
    }

    setLoadingTransformation(true); // Only set transformation loading
    setError('');

    try {
      const result = await transformResume(
        provider,
        resumeText,
        jdText,
        analysis,
        userAnswers
      );

      if (result.status === 'success') {
        setFinalResume(result.final_resume);
      } else {
        setError(result.detail || 'Transformation failed');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Network error. Please try again.');
      console.error('Transformation error:', err);
    } finally {
      setLoadingTransformation(false); // Only clear transformation loading
    }
  };

  return (
    <div className="App">
      <header style={{ 
        backgroundColor: '#343a40', 
        color: 'white', 
        padding: '20px', 
        textAlign: 'center',
        marginBottom: '30px'
      }}>
        <h1>🧠 AI Resume Transformer</h1>
        <p>Upload your resume and job description for AI-powered optimization</p>
      </header>

      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}>
        {error && (
          <div style={{
            backgroundColor: '#f8d7da',
            color: '#721c24',
            padding: '10px',
            borderRadius: '4px',
            marginBottom: '20px',
            border: '1px solid #f5c6cb'
          }}>
            {error}
          </div>
        )}

        <FileUpload
          provider={provider}
          setProvider={setProvider}
          resumeFile={resumeFile}
          setResumeFile={setResumeFile}
          jdFile={jdFile}
          setJdFile={setJdFile}
          onAnalyze={handleAnalyze}
          loading={loadingAnalysis || loadingTransformation} // Combined loading for file upload disable
        />

        <AnalysisResults 
          analysis={analysis} 
          loading={loadingAnalysis} // Only show analysis loading
        />

        <UserInput
          userAnswers={userAnswers}
          setUserAnswers={setUserAnswers}
          onGenerate={handleGenerate}
          loading={loadingTransformation} // Only show transformation loading
          analysis={analysis}
        />

        <FinalResume 
          finalResume={finalResume} 
          loading={loadingTransformation} // Only show transformation loading
        />
      </main>

      <footer style={{ 
        marginTop: '50px', 
        padding: '20px', 
        textAlign: 'center', 
        color: '#666',
        borderTop: '1px solid #ddd'
      }}>
        <p>Resume Transformer Tool - Powered by AI</p>
      </footer>
    </div>
  );
}

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

```tsx
// frontend/src/components/AnalysisResults.jsx
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
```

```tsx
// frontend/src/components/FileUpload.jsx
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

```tsx
// frontend/src/components/UserInput.jsx
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
// end_of_file
```

```tsx
// frontend/src/services/api.js
// /frontend/src/services/api.js

import axios from 'axios';

const API_BASE = 'https://resume-smith-api.onrender.com';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 300000, // 5 minutes for long-running LLM calls
});

export const analyzeResume = async (provider, resumeFile, jdFile) => {
  const formData = new FormData();
  formData.append('provider', provider);
  formData.append('resume', resumeFile);
  formData.append('jd', jdFile);
  
  const response = await api.post('/api/analyze', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const transformResume = async (provider, resumeText, jdText, part1Analysis, userAnswers) => {
  const formData = new FormData();
  formData.append('provider', provider);
  formData.append('resume_text', resumeText);
  formData.append('jd_text', jdText);
  formData.append('part_1_analysis', part1Analysis);
  formData.append('user_answers', userAnswers);
  
  const response = await api.post('/api/transform', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const healthCheck = async () => {
  const response = await api.get('/health');
  return response.data;
};
// end_of_file
```
