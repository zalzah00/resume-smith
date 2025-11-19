// frontend/src/App.jsx

import React, { useState } from 'react';
import './App.css';
import UserInput from './components/UserInput';
import AnalysisResults from './components/AnalysisResults';
import JobSearchAndSelect from './components/JobSearchAndSelect'; // NEW IMPORT
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
        {/* Job Search & Select Component */}
        <JobSearchAndSelect 
            setJdText={handleSetJdText}
            selectedJdTitle={selectedJdTitle}
            onDeselect={handleDeselect}
        />

        <UserInput 
          // Passed resumeFile and setResumeFile (NO CHANGE)
          resumeFile={resumeFile}
          setResumeFile={setResumeFile}
          
          // Removed jdFile related props
          
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