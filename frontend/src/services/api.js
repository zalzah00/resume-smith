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