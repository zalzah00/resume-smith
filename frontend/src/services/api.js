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

/**
 * Calls the backend /api/analyze endpoint to perform Part 1 analysis.
 * * @param {string} provider - The selected LLM provider ('gemini' or 'groq').
 * @param {File} resumeFile - The user's resume file object.
 * @param {string} jdText - The Job Description text (from search/select).
 * @param {File} [jdFile=null] - Optional Job Description file object (from upload).
 */
export const analyzeResume = async (provider, resumeFile, jdText, jdFile = null) => {
  const formData = new FormData();
  formData.append('provider', provider);
  formData.append('resume', resumeFile);
  
  // CRITICAL CHANGE: Conditionally append EITHER jd_text or jd_file
  if (jdFile) {
    formData.append('jd_file', jdFile); // If file is present, send it as jd_file
  } else {
    formData.append('jd_text', jdText || ''); // Otherwise, send the text string (may be empty if no job selected)
  }
  
  const response = await api.post('/api/analyze', formData, {
    headers: {
      // Must be 'multipart/form-data' because we are sending at least two files (resume and possibly jdFile)
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