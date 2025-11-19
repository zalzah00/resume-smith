// frontend/src/components/JobSearchAndSelect.jsx

import React, { useState } from 'react';
import { searchJobs } from '../services/api';
import './JobSearchAndSelect.css';

// --- CONFIGURATION (Extracted from job_search_app.py) ---
// This should match the CONFIG from your job_search_app.py
const CONFIG = {
    "JOB_CATEGORIES": {
        "All Categories": null,
        "Information Technology": 1861,
        "F&B (Food & Beverage)": 1855,
        "Sales / Retail": 1875,
        // ... (Add the rest of your categories here)
    },
    "EMPLOYMENT_TYPES": {
        "All Types": null,
        "Full Time": 76,
        "Part Time": 115,
        "Contract": 121,
        // ... (Add the rest of your employment types here)
    },
    "MRT_STATIONS": {
        "All Stations": null,
        "Woodlands (NS9/TE2)": 1833,
        "Jurong East (EW24/NS1)": 1840,
        // ... (Add the rest of your MRT stations here)
    },
};

// Helper function to get the display name for a code (for status message)
const getDisplayName = (code, configKey) => {
    const map = CONFIG[configKey];
    for (const [name, value] of Object.entries(map)) {
        if (value === code) return name;
    }
    return 'N/A';
};

const JobSearchAndSelect = ({ setJdText, selectedJdTitle, onDeselect }) => {
    const [keyword, setKeyword] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(CONFIG.JOB_CATEGORIES["All Categories"]);
    const [selectedEmployment, setSelectedEmployment] = useState(CONFIG.EMPLOYMENT_TYPES["All Types"]);
    const [selectedMRT, setSelectedMRT] = useState(CONFIG.MRT_STATIONS["All Stations"]);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResults([]);
        
        const params = {
            page: 1,
            per_page_count: 5, // Keep results manageable
        };

        if (selectedCategory) params.JobCategory = selectedCategory;
        if (selectedEmployment) params.EmploymentType = selectedEmployment;
        if (selectedMRT) params.id_Job_NearestMRTStation = selectedMRT;
        if (keyword.trim()) params.keywords = keyword.trim();

        try {
            console.log('Searching with params:', params);
            const data = await searchJobs(params);
            console.log('API response:', data);
            
            // Expected path: data.data.result
            const jobResults = data?.data?.result || [];
            console.log('Extracted job results:', jobResults);
            
            if (jobResults.length === 0) {
                setError("No jobs found matching your criteria.");
            }
            setResults(jobResults);
        } catch (err) {
            console.error('Search error:', err);
            setError(`Failed to fetch jobs: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectJob = (jobItem) => {
        const title = jobItem.job?.Title || 'Selected Job';
        const company = jobItem.company?.CompanyName || 'N/A';
        const description = jobItem.job?.JobDescription || '';
        
        // Pass the raw JobDescription text, job title, and company to the parent component (App.jsx)
        setJdText(description, title, company);
        setResults([]); // Clear results after selection
    };

    if (selectedJdTitle) {
        // Display the selected job confirmation
        return (
            <div className="search-status-box selected">
                <h3>✅ Job Selected</h3>
                <p><strong>Job Title:</strong> {selectedJdTitle}</p>
                <button 
                    onClick={onDeselect} 
                    className="button deselect"
                >
                    Change Job
                </button>
            </div>
        );
    }

    return (
        <div className="job-search-container">
            <h3>1. Search for a Job Description</h3>
            <form onSubmit={handleSearch} className="search-form">
                <input
                    type="text"
                    placeholder="Search keywords (e.g., modeller, data scientist)"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="keyword-input"
                />
                <div className="select-group">
                    <select value={selectedCategory || ''} onChange={(e) => setSelectedCategory(e.target.value ? parseInt(e.target.value) : null)}>
                        {Object.entries(CONFIG.JOB_CATEGORIES).map(([name, code]) => (
                            <option key={name} value={code || ''}>{name}</option>
                        ))}
                    </select>
                    <select value={selectedEmployment || ''} onChange={(e) => setSelectedEmployment(e.target.value ? parseInt(e.target.value) : null)}>
                        {Object.entries(CONFIG.EMPLOYMENT_TYPES).map(([name, code]) => (
                            <option key={name} value={code || ''}>{name}</option>
                        ))}
                    </select>
                    <select value={selectedMRT || ''} onChange={(e) => setSelectedMRT(e.target.value ? parseInt(e.target.value) : null)}>
                        {Object.entries(CONFIG.MRT_STATIONS).map(([name, code]) => (
                            <option key={name} value={code || ''}>{name}</option>
                        ))}
                    </select>
                </div>
                <button type="submit" disabled={loading} className="search-button">
                    {loading ? 'Searching...' : '🔍 Search Jobs'}
                </button>
            </form>

            {error && <div className="error-message">{error}</div>}

            {results.length > 0 && (
                <div className="search-results">
                    <h4>Top {results.length} Results:</h4>
                    {results.map((item, index) => (
                        <div key={index} className="job-card">
                            <div className="job-details">
                                <strong>{item.job?.Title || 'N/A'}</strong>
                                <span>{item.company?.CompanyName || 'N/A'}</span>
                            </div>
                            <button 
                                onClick={() => handleSelectJob(item)} 
                                className="button select-job"
                            >
                                Select This Job
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default JobSearchAndSelect;