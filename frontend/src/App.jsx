// frontend/src/App.jsx

import React, { useState, useEffect } from 'react';
import './App.css';
import UserInput from './components/UserInput';
import AnalysisResults from './components/AnalysisResults';
import JobSearchAndSelect from './components/JobSearchAndSelect';
import JDUpload from './components/JDUpload';
import { analyzeResume, transformResume, wakeUpBackend } from './services/api';

const App = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [jdText, setJdText] = useState('');
  const [selectedJdTitle, setSelectedJdTitle] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [provider, setProvider] = useState('gemini');
  const [analysis, setAnalysis] = useState(null);
  const [transformedResume, setTransformedResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // New state for JD mode and file upload
  const [jdMode, setJdMode] = useState('search'); // 'search' or 'upload'
  const [jdFile, setJdFile] = useState(null);

  // Backend wake-up notification state
  const [backendStatus, setBackendStatus] = useState(null); // 'ready' or 'starting'

  // Wake up backend on page load
  useEffect(() => {
    const pingBackend = async () => {
      try {
        await wakeUpBackend();
        setBackendStatus('ready');
      } catch (err) {
        setBackendStatus('starting');
      }
    };
    pingBackend();
  }, []);

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

    // Validate based on mode
    if (!provider || !resumeFile) {
      setError('Please select an LLM and upload a resume.');
      return;
    }

    if (jdMode === 'search' && !jdText) {
      setError('Please select a Job Description from search.');
      return;
    }

    if (jdMode === 'upload' && !jdFile) {
      setError('Please upload a Job Description file.');
      return;
    }

    setLoading(true);
    try {
      // Pass jdFile when in upload mode, otherwise pass jdText
      const result = await analyzeResume(
        provider,
        resumeFile,
        jdText,
        jdMode === 'upload' ? jdFile : null
      );

      setAnalysis({
        part_1_analysis: result.part_1_analysis,
        original_resume_text: result.original_resume_text,
      });

      // CRITICAL FIX: Store the extracted JD text from the response
      // This is needed for the transform endpoint
      if (jdMode === 'upload' && result.job_description_text) {
        setJdText(result.job_description_text);
      }

      // Set title and company to <see resume> if file was uploaded
      if (jdMode === 'upload') {
        setSelectedJdTitle('<see resume>');
        setSelectedCompany('<see resume>');
      }
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

      {/* Backend Status Notification - Compact for debugging */}
      {backendStatus && (
        <div style={{
          padding: '4px 12px',
          textAlign: 'center',
          backgroundColor: backendStatus === 'ready' ? '#d4edda' : '#fff3cd',
          color: backendStatus === 'ready' ? '#155724' : '#856404',
          borderBottom: `1px solid ${backendStatus === 'ready' ? '#c3e6cb' : '#ffeaa7'}`,
          fontSize: '12px',
          margin: '0'
        }}>
          {backendStatus === 'ready' ? '✅ Backend is ready, please proceed.' : '⏳ Backend is starting, please proceed.'}
        </div>
      )}

      <main className="App-main">
        {/* Section 1: JD Mode Toggle and Input */}
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '20px' }}>
          <h3>1. Job Description</h3>

          {/* Mode Toggle - Segmented Control */}
          <div style={{
            display: 'inline-flex',
            border: '2px solid #007bff',
            borderRadius: '8px',
            overflow: 'hidden',
            marginBottom: '15px'
          }}>
            <button
              onClick={() => setJdMode('search')}
              disabled={loading}
              style={{
                padding: '10px 20px',
                border: 'none',
                backgroundColor: jdMode === 'search' ? '#007bff' : 'white',
                color: jdMode === 'search' ? 'white' : '#007bff',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: jdMode === 'search' ? 'bold' : 'normal',
                transition: 'all 0.2s',
                opacity: loading ? 0.6 : 1
              }}
            >
              Search in FindSGJobs
            </button>
            <button
              onClick={() => setJdMode('upload')}
              disabled={loading}
              style={{
                padding: '10px 20px',
                border: 'none',
                borderLeft: '2px solid #007bff',
                backgroundColor: jdMode === 'upload' ? '#007bff' : 'white',
                color: jdMode === 'upload' ? 'white' : '#007bff',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: jdMode === 'upload' ? 'bold' : 'normal',
                transition: 'all 0.2s',
                opacity: loading ? 0.6 : 1
              }}
            >
              Upload JD
            </button>
          </div>

          {/* Conditional Rendering based on mode */}
          {jdMode === 'search' ? (
            <JobSearchAndSelect
              setJdText={handleSetJdText}
              selectedJdTitle={selectedJdTitle}
              onDeselect={handleDeselect}
              selectedCompany={selectedCompany}
              fullJdText={jdText}
            />
          ) : (
            <JDUpload
              jdFile={jdFile}
              setJdFile={setJdFile}
              loading={loading}
            />
          )}
        </div>

        {/* Section 2: Resume Upload */}
        <UserInput
          resumeFile={resumeFile}
          setResumeFile={setResumeFile}
          provider={provider}
          setProvider={setProvider}
          isJdSelected={jdMode === 'search' ? !!jdText : !!jdFile}
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