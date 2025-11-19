// frontend/src/App.jsx

import React, { useState } from 'react';
import './App.css';
import UserInput from './components/UserInput';
import AnalysisResults from './components/AnalysisResults';
import JobSearchAndSelect from './components/JobSearchAndSelect'; 
import { analyzeResume, transformResume } from './services/api';

const App = () => {
  const [resumeFile, setResumeFile] = useState(null);
  // NEW STATE: State for the uploaded JD file object
  const [jdFile, setJdFile] = useState(null); 
  
  const [jdText, setJdText] = useState('');
  const [selectedJdTitle, setSelectedJdTitle] = useState('');
  const [selectedCompany, setSelectedCompany] = useState(''); 
  const [provider, setProvider] = useState('gemini');
  const [analysis, setAnalysis] = useState(null);
  const [transformedResume, setTransformedResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // New setter function for JD Text (from search)
  const handleSetJdText = (text, title, company) => {
    // Rule: Selecting a job clears any uploaded JD file
    setJdFile(null);
    setJdText(text);
    setSelectedJdTitle(title);
    setSelectedCompany(company || '');
  };

  // NEW: Setter function for JD File (from upload)
  const handleSetJdFile = (file) => {
    // Rule: Uploading a file clears any selected job text
    setJdText('');
    setSelectedJdTitle('');
    setSelectedCompany('');
    setJdFile(file);
  };
  
  // New deselect function (only clears text state, leaves file state as is)
  const handleDeselect = () => {
    setJdText('');
    setSelectedJdTitle('');
    setSelectedCompany('');
  };


  const handleAnalyze = async () => {
    setError(null);
    setAnalysis(null);
    setTransformedResume(null);

    // CRITICAL CHANGE: JD is ready if EITHER jdText (from search) OR jdFile (from upload) exists
    const isJdReady = !!jdText || !!jdFile;

    if (!provider || !resumeFile || !isJdReady) {
      // Improved error message to reflect the dual input options
      setError('Please select an LLM, upload a resume, and provide a Job Description (via search or file upload).');
      return;
    }

    setLoading(true);
    try {
      // CRITICAL CHANGE: Pass both jdText and jdFile. The API service handles sending one of them.
      const result = await analyzeResume(provider, resumeFile, jdText, jdFile);
      
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
      // jdText here will be the text from the search/select, or an empty string if a file was used.
      // The backend uses the original prompt context to manage this, so passing the current jdText is fine.
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
        {/* Job Search & Select Component */}
        <JobSearchAndSelect 
            setJdText={handleSetJdText}
            selectedJdTitle={selectedJdTitle}
            onDeselect={handleDeselect}
            selectedCompany={selectedCompany} 
            fullJdText={jdText}
            // NEW PROP: Pass the jdFile status down for the component to visually disable/guide the user
            isJdFileUploaded={!!jdFile}
        />

        {/* User Input Component */}
        <UserInput 
          // Resume File (NO CHANGE)
          resumeFile={resumeFile}
          setResumeFile={setResumeFile}
          
          // LLM Provider (NO CHANGE)
          provider={provider}
          setProvider={setProvider}
          
          // NEW PROPS for JD File Management
          jdFile={jdFile}
          setJdFile={handleSetJdFile} // Use the new handler for mutual exclusivity
          
          // CRITICAL PROP CHANGE: JD is ready if EITHER jdText OR jdFile is present
          isJdReady={!!jdText || !!jdFile}
          
          // Status props to pass down
          jdSelectedTitle={selectedJdTitle} // Pass title down for display status
          
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