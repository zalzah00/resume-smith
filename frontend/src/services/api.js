// frontend/src/services/api.js

// ----------------------------------------------------------------------
// CRITICAL CHANGE: Pointing directly to external API to bypass local proxy issues
// WARNING: This may cause CORS errors in some browser/deployment environments.
const JOB_SEARCH_API_URL = "https://www.findsgjobs.com/apis/job/searchable"; 
// ----------------------------------------------------------------------

// Keep this URL for /api/analyze and /api/transform endpoints
const API_URL = 'http://localhost:8000/api'; 

// --- General Fetch Utility (For local backend calls) ---
async function apiFetch(endpoint, options = {}) {
    const response = await fetch(`${API_URL}${endpoint}`, options);
    
    if (!response.ok) {
        // Attempt to parse API error response
        const errorData = await response.json().catch(() => ({ detail: "Unknown error" }));
        const errorMessage = `API Error (${response.status}): ${errorData.detail || errorData.message || 'Server error'}`;
        throw new Error(errorMessage);
    }
    
    return response.json();
}

// ----------------------------------------------------------------------
// Part 1: Resume Analysis (Calls the local backend)
// ----------------------------------------------------------------------

export async function analyzeResume(formData) {
    return apiFetch('/analyze', {
        method: 'POST',
        body: formData,
    });
}

// ----------------------------------------------------------------------
// Part 2: Resume Transformation (Calls the local backend)
// ----------------------------------------------------------------------

export async function transformResume(formData) {
    return apiFetch('/transform', {
        method: 'POST',
        body: formData,
    });
}

// ----------------------------------------------------------------------
// Job Search (NOW calls external API directly)
// ----------------------------------------------------------------------

export async function searchJobs(params) {
    // Convert params object to URL search string (handles page, keywords, etc.)
    const urlParams = new URLSearchParams(params).toString();
    
    try {
        // Fetch directly from the external API URL
        const response = await fetch(`${JOB_SEARCH_API_URL}?${urlParams}`);

        if (!response.ok) {
            // Attempt to parse API error response
            const errorData = await response.json().catch(() => ({ message: "Failed to parse API error response." }));
            const statusText = response.statusText || 'Error';
            throw new Error(`Job Search Failed (${response.status} ${statusText}): ${errorData.message || JSON.stringify(errorData)}`);
        }

        const data = await response.json();
        
        // This returns the raw data structure from the external API
        return data; 

    } catch (error) {
        console.error("Direct Job Search Failed:", error);
        throw error;
    }
}