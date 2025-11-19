// frontend/src/App.jsx

import React, { useState, useCallback } from 'react';
import './App.css';
import { analyzeResume, transformResume } from './services/api';

// Components
import JobSearchAndSelect from './components/JobSearchAndSelect';
import UserInput from './components/UserInput';
import AnalysisResults from './components/AnalysisResults';
import FinalResume from './components/FinalResume';

function App() {
  // --- Step 2/3 States (LLM/Resume) ---
  const [resumeFile, setResumeFile] = useState(null);
  const [provider, setProvider] = useState('gemini');

  // --- Step 1 States (Job Description) ---
  const [jdText, setJdText] = useState(''); // JD text from search result
  // CRITICAL CHANGE 1: New state for JD file upload
  const [jdFile, setJdFile] = useState(null); 
  // State to track which JD was selected from the search UI (for display/disabling)
  const [jdSelectedTitle, setJdSelectedTitle] = useState(''); 
  const [selectedCompany, setSelectedCompany] = useState('');

  // --- Results and Status States ---
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [transformedResume, setTransformedResume] = useState(null);
  
  // --- Analysis Prep States (Data extracted from analysis result for Part 2) ---
  const [resumeText, setResumeText] = useState('');
  
  
  // --- Core Logic ---
  
  // CRITICAL CHANGE 2: Unified JD check. Analysis is ready if JD Text (from search) OR JD File (from upload) is present.
  const isJdReady = !!jdText || !!jdFile;

  // CRITICAL CHANGE 3: Handler for JD selection/deselection
  const handleJdSelect = useCallback((title, company, text) => {
    // If a JD is selected via search, clear any uploaded file
    setJdFile(null); 
    setJdSelectedTitle(title);
    setSelectedCompany(company);
    setJdText(text); // JD text from search is always stored here
  }, []);

  const handleJdDeselect = useCallback(() => {
    setJdSelectedTitle('');
    setSelectedCompany('');
    setJdText('');
  }, []);
  
  // CRITICAL CHANGE 4: Handler for JD File upload
  const handleJdFileChange = useCallback((file) => {
    // If a JD file is uploaded, clear any selected search result
    setJdSelectedTitle(''); 
    setSelectedCompany('');
    setJdText('');
    setJdFile(file);
  }, []);

  // --- Step 1: Analyze Resume (Part 1) ---
  const onAnalyze = async () => {
    if (!resumeFile || !isJdReady) {
      setError("Please upload a resume and provide a Job Description (via search or file).");
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysis(null);
    setTransformedResume(null);

    try {
      // CRITICAL CHANGE 5: Pass the JD file if it exists, otherwise pass the JD text.
      const response = await analyzeResume(provider, resumeFile, jdText, jdFile); 

      if (response.status === 'success') {
        setAnalysis(response.analysis);
        setResumeText(response.resume_text); // Store extracted resume text for Part 2
      } else {
        setError(response.message || 'Analysis failed due to an unknown error.');
      }
    } catch (err) {
      console.error(err);
      // Backend returns a detailed error in JSON, try to extract it
      const detailedError = err.response?.data?.detail || err.message;
      setError(`Analysis failed: ${detailedError}`);
    } finally {
      setLoading(false);
    }
  };

  // --- Step 2: Transform Resume (Part 2) ---
  const onTransform = async (userAnswers) => {
    setLoading(true); // Re-use loading state for Part 2
    setError(null);

    try {
      const response = await transformResume(
        provider,
        resumeText, // Extracted resume text from Part 1
        jdText || (jdFile ? `(JD provided as file: ${jdFile.name})` : ''), // JD text from search or placeholder for file
        jdSelectedTitle, // Contextual data
        selectedCompany, // Contextual data
        JSON.stringify(analysis), // Full analysis result for LLM
        userAnswers // User clarifications
      );

      if (response.status === 'success') {
        setTransformedResume(response.transformed_resume);
      } else {
        setError(response.message || 'Transformation failed due to an unknown error.');
      }
    } catch (err) {
      console.error(err);
      const detailedError = err.response?.data?.detail || err.message;
      setError(`Transformation failed: ${detailedError}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Reset all states
  const handleReset = () => {
    setResumeFile(null);
    setProvider('gemini');
    setJdText('');
    setJdFile(null); 
    setJdSelectedTitle('');
    setSelectedCompany('');
    setLoading(false);
    setError(null);
    setAnalysis(null);
    setTransformedResume(null);
    setResumeText('');
  };

  return (
    <div className="App">
      <header>
        <h1>🤖 AI Resume Transformer</h1>
        <p>Use Gemini or Groq to tailor your resume to a specific job description.</p>
      </header>
      
      <main>
        {transformedResume ? (
          <>
            <FinalResume transformedResume={transformedResume} />
            <button onClick={handleReset} className="reset-button">
              Start New Analysis
            </button>
          </>
        ) : analysis ? (
          // --- Step 3: Analysis Results and User Input for Part 2 ---
          <AnalysisResults
            analysis={analysis}
            loading={loading}
            transformedResume={transformedResume}
            onTransform={onTransform}
          />
        ) : (
          // --- Step 1 & 2: Initial Inputs ---
          <>
            <JobSearchAndSelect 
              setJdText={setJdText}
              selectedJdTitle={jdSelectedTitle}
              selectedCompany={selectedCompany}
              fullJdText={jdText}
              onDeselect={handleJdDeselect}
              // Pass JD file state and handler to JobSearchAndSelect
              jdFile={jdFile} 
              setJdFile={handleJdFileChange} // Use the custom handler
            />
            
            <hr />

            <UserInput
              resumeFile={resumeFile}
              setResumeFile={setResumeFile}
              provider={provider}
              setProvider={setProvider}
              onAnalyze={onAnalyze}
              loading={loading}
              error={error}
              // CRITICAL PROPS: Passed simplified JD state for enabling logic
              isJdReady={isJdReady}
              // Removed unused JD file props from UserInput
            />
          </>
        )}
      </main>
      <footer>
        <p>&copy; 2024 Resume Transformer</p>
      </footer>
    </div>
  );
}

export default App;