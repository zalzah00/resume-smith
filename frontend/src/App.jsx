import React, { useState, useCallback, useMemo } from 'react';
import { analyzeResume, transformResume, formatResume } from './services/api';
import UserInput from './components/UserInput';
import Analysis from './components/Analysis';
import FinalResume from './components/FinalResume';
import { FileText, Zap, BookOpen, Loader2 } from 'lucide-react';
import './App.css'; // Assuming you have a basic CSS file

const App = () => {
  // --- State for Files and Inputs ---
  const [resumeFile, setResumeFile] = useState(null);
  const [jdFile, setJdFile] = useState(null);
  const [provider, setProvider] = useState('groq'); // Default provider
  const [userAnswers, setUserAnswers] = useState('');

  // --- State for Data and Output ---
  // Stores raw texts and the analysis report from Phase 1
  const [analysisData, setAnalysisData] = useState({ 
    resume_text: '', 
    jd_text: '', 
    part_1_output: '' 
  }); 
  const [analysis, setAnalysis] = useState('');
  const [finalResume, setFinalResume] = useState('');

  // --- State for UI and Errors ---
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [loadingTransformation, setLoadingTransformation] = useState(false);
  const [error, setError] = useState('');

  // --- Handlers ---

  const handleAnalyze = useCallback(async () => {
    if (!resumeFile || !jdFile) {
      setError('Please upload both Resume and Job Description files.');
      return;
    }

    setLoadingAnalysis(true);
    setError('');
    setAnalysis('');
    setFinalResume('');

    try {
      const result = await analyzeResume(provider, resumeFile, jdFile);
      
      // Store all necessary data for Part 2 and display the analysis
      if (result.resume_text && result.jd_text && result.part_1_output) {
        setAnalysis(result.part_1_output); // Display the formatted analysis report
        setAnalysisData({
          resume_text: result.resume_text,
          jd_text: result.jd_text,
          part_1_output: result.part_1_output
        });
      } else {
        setError('Analysis failed: Missing expected data.');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Network or LLM error during analysis.';
      setError(errorMsg);
      console.error('Analysis error:', err);
    } finally {
      setLoadingAnalysis(false);
    }
  }, [provider, resumeFile, jdFile]);

  const handleGenerate = useCallback(async () => {
    if (!userAnswers.trim() || !analysisData.resume_text) {
      setError('Please provide answers and complete the analysis step first.');
      return;
    }

    setLoadingTransformation(true);
    setError('');
    setFinalResume('');

    try {
      // --- PHASE 2: Transformation (Raw Resume Generation) ---
      const rawResult = await transformResume(
        provider,
        analysisData.resume_text,
        analysisData.jd_text,
        analysisData.part_1_output,
        userAnswers
      );
      
      const rawResumeText = rawResult.raw_resume;
      if (!rawResumeText) {
        setError(rawResult.detail || 'Transformation failed: No raw resume draft returned.');
        return;
      }
      
      // --- PHASE 3: Formatting (Final Markdown Generation) ---
      // The formatting call is chained here, using the output of Phase 2
      const finalResult = await formatResume(provider, rawResumeText); 

      if (finalResult.final_resume) {
        setFinalResume(finalResult.final_resume);
      } else {
        setError(finalResult.detail || 'Formatting failed: No final resume returned.');
      }

    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Network or LLM error during transformation or formatting.';
      setError(errorMsg);
      console.error('Transformation/Formatting error:', err);
    } finally {
      setLoadingTransformation(false);
    }
  }, [provider, userAnswers, analysisData]);

  // Determine the current step for the UI
  const currentStep = useMemo(() => {
    if (!analysis) return 1;
    if (!finalResume) return 2;
    return 3;
  }, [analysis, finalResume]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 sm:p-8">
      <header className="w-full max-w-5xl text-center py-6">
        <h1 className="text-4xl font-extrabold text-indigo-700 tracking-tight">
          AI Resume Transformer
        </h1>
        <p className="mt-2 text-gray-500">
          Analyze, Transform (Draft), and Format (Final) your resume in 3 steps.
        </p>
      </header>

      <main className="w-full max-w-5xl bg-white shadow-xl rounded-2xl p-6 md:p-10 mb-10">
        
        {/* Step Indicators */}
        <div className="flex justify-between items-center mb-8 border-b pb-4">
          <StepIndicator 
            icon={<FileText className="w-5 h-5" />}
            label="1. Analyze" 
            isActive={currentStep === 1} 
            isComplete={currentStep > 1}
          />
          <div className="flex-1 h-0.5 mx-2 bg-gray-200" />
          <StepIndicator 
            icon={<BookOpen className="w-5 h-5" />}
            label="2. Draft" 
            isActive={currentStep === 2} 
            isComplete={currentStep > 2}
          />
          <div className="flex-1 h-0.5 mx-2 bg-gray-200" />
          <StepIndicator 
            icon={<Zap className="w-5 h-5" />}
            label="3. Format" 
            isActive={currentStep === 3} 
            isComplete={currentStep > 3}
          />
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-100" role="alert">
            {error}
          </div>
        )}

        {/* Content Area */}
        <div className={`grid gap-8 ${analysis ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
          {/* Left Column: Input and Analysis */}
          <div className="space-y-8">
            {/* Note: UserInput and Analysis components are assumed to be available 
                in the components directory as they were in the previous successful code block */}
            <UserInput 
              resumeFile={resumeFile} 
              setResumeFile={setResumeFile} 
              jdFile={jdFile} 
              setJdFile={setJdFile} 
              provider={provider}
              setProvider={setProvider}
              userAnswers={userAnswers}
              setUserAnswers={setUserAnswers}
              handleAnalyze={handleAnalyze}
              handleGenerate={handleGenerate}
              loadingAnalysis={loadingAnalysis}
              loadingTransformation={loadingTransformation}
              isAnalysisComplete={!!analysis}
            />

            {analysis && (
              <Analysis 
                analysis={analysis} 
                className="col-span-1"
              />
            )}
          </div>

          {/* Right Column: Final Resume */}
          {finalResume && (
            <FinalResume 
              finalResume={finalResume} 
              className="md:col-span-1"
            />
          )}

          {/* Loading Indicator for Transformation/Formatting */}
          {loadingTransformation && (
            <div className="md:col-span-1 flex items-center justify-center p-10 bg-gray-50 rounded-xl shadow-inner border border-dashed">
              <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mr-3" />
              <span className="text-lg text-gray-600">
                {/* This message correctly reflects the two-step process in Phase 2/3 */}
                {currentStep === 2 ? "Generating Raw Draft (Phase 2)..." : "Formatting Final Resume (Phase 3)..."}
              </span>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

// Helper Component for Step Indicators
const StepIndicator = ({ icon, label, isActive, isComplete }) => (
  <div className="flex flex-col items-center">
    <div className={`p-3 rounded-full transition-colors duration-300 shadow-md ${
      isComplete ? 'bg-indigo-500 text-white' : isActive ? 'bg-indigo-200 text-indigo-800' : 'bg-gray-100 text-gray-400'
    }`}>
      {icon}
    </div>
    <span className={`mt-2 text-xs font-medium text-center transition-colors duration-300 ${
      isComplete || isActive ? 'text-indigo-700' : 'text-gray-500'
    }`}>
      {label}
    </span>
  </div>
);

export default App;