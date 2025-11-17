import axios from 'axios';

// IMPORTANT: Replace this with your actual backend API URL
const API_BASE = 'http://localhost:8000'; 

const api = axios.create({
  baseURL: API_BASE,
  timeout: 300000, // 5 minutes for long-running LLM calls
});

/**
 * Phase 1: Analyze Resume and JD, then generate initial analysis.
 * @param {string} provider - The LLM provider (e.g., 'gemini').
 * @param {File} resumeFile - The resume document file.
 * @param {File} jdFile - The job description document file.
 * @returns {Promise<{resume_text: string, jd_text: string, part_1_output: string}>} - Texts and the analysis report.
 */
export const analyzeResume = async (provider, resumeFile, jdFile) => {
  const formData = new FormData();
  formData.append('provider', provider);
  formData.append('resume_file', resumeFile); // Key matches backend argument name
  formData.append('jd_file', jdFile);         // Key matches backend argument name
  
  const response = await api.post('/analyze', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Phase 2: Transform the texts and analysis into a raw, unformatted resume draft.
 * @param {string} provider - The LLM provider.
 * @param {string} resumeText - The extracted resume text.
 * @param {string} jdText - The extracted JD text.
 * @param {string} part1Analysis - The analysis report from Phase 1.
 * @param {string} userAnswers - User's qualitative answers.
 * @returns {Promise<{raw_resume: string}>} - The unformatted text of the new resume.
 */
export const transformResume = async (provider, resumeText, jdText, part1Analysis, userAnswers) => {
  const response = await api.post('/transform', {
    provider: provider,
    resume_text: resumeText,
    jd_text: jdText,
    part_1_analysis: part1Analysis,
    user_answers: userAnswers,
  });
  return response.data; // Expected: { raw_resume: "..." }
};

/**
 * Phase 3: Format the raw resume draft into final Markdown output.
 * @param {string} provider - The LLM provider (will be ignored by backend, which forces Groq).
 * @param {string} rawResumeText - The unformatted text from Phase 2.
 * @returns {Promise<{final_resume: string}>} - The final, formatted resume in Markdown.
 */
export const formatResume = async (provider, rawResumeText) => {
  const response = await api.post('/format', {
    provider: provider, 
    raw_resume_text: rawResumeText,
  });
  return response.data; // Expected: { final_resume: "..." }
};