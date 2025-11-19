// frontend/src/services/api.js

import axios from 'axios';

// Set up base URL for the backend API
// This will default to localhost:8000 in development, 
// and the environment variable in production.
const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL,
});

// --------------------------------------------------------
// API for Job Search (Part 1)
// --------------------------------------------------------
export const searchJobs = async (params) => {
  const response = await api.get('/api/search-jobs', {
    params: params,
    timeout: 20000, // Timeout for job search
  });
  return response.data;
};
// --------------------------------------------------------


// CRITICAL CHANGE: Added jdFile (optional) to accept JD as a file or text
export const analyzeResume = async (provider, resumeFile, jdText, jdFile) => {
  const formData = new FormData();
  formData.append('provider', provider);
  formData.append('resume', resumeFile);
  
  // CRITICAL LOGIC: Conditionally append JD as a file or as text
  if (jdFile) {
    // If a file is present, append the file
    formData.append('jd_file', jdFile);
  } else {
    // Otherwise, append the text (from search/select)
    formData.append('jd_text', jdText); 
  }
  
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

  const response = await api.post('/api/transform', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};