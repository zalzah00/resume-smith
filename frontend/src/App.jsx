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