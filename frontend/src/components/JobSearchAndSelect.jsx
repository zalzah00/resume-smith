// frontend/src/components/JobSearchAndSelect.jsx

import React, { useState } from 'react';
import { searchJobs } from '../services/api';
import CONFIG from '../config/jobConfig'; 
import './JobSearchAndSelect.css';

// Helper function to get the display name for a code (for status message)
const getDisplayName = (code, configKey) => {
    const map = CONFIG[configKey];
    for (const [name, value] of Object.entries(map)) {
        if (value === code) return name;
    }
    return 'N/A';
};

const PER_PAGE_COUNT = 5; // Define the fixed number of results per page

const JobSearchAndSelect = ({ setJdText, selectedJdTitle, onDeselect }) => {
    const [keyword, setKeyword] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(CONFIG.JOB_CATEGORIES["All Categories"]);
    const [selectedEmployment, setSelectedEmployment] = useState(CONFIG.EMPLOYMENT_TYPES["All Types"]);
    const [selectedMRT, setSelectedMRT] = useState(CONFIG.MRT_STATIONS["All Stations"]);
    
    // State for Pagination
    const [results, setResults] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // Tracks the current page number
    const [totalResults, setTotalResults] = useState(0); // Tracks the total jobs available
    const [isInitialSearch, setIsInitialSearch] = useState(true); // Helps reset state for a new search
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    

    // Function to handle the actual API call
    const fetchJobs = async (pageToFetch, clearResults) => {
        setLoading(true);
        // Clear error only when starting a fetch, not when loading more
        if (clearResults) { 
            setError(null);
        }

        const params = {
            page: pageToFetch,
            per_page_count: PER_PAGE_COUNT,
        };

        if (selectedCategory) params.JobCategory = selectedCategory;
        if (selectedEmployment) params.EmploymentType = selectedEmployment;
        if (selectedMRT) params.id_Job_NearestMRTStation = selectedMRT;
        if (keyword.trim()) params.keywords = keyword.trim();

        try {
            console.log('Searching with params:', params);
            const data = await searchJobs(params);
            
            // Assuming the API response structure: data.data.result and data.data.total_records
            const jobResults = data?.data?.result || [];
            const newTotal = data?.data?.total_records || 0;

            if (clearResults) {
                // Initial search or new search
                setResults(jobResults);
                setCurrentPage(pageToFetch); 
            } else {
                // Load More button click - Append results
                setResults(prevResults => [...prevResults, ...jobResults]);
                setCurrentPage(pageToFetch); // Update the page state on success
            }
            
            setTotalResults(newTotal);

            // FIX 1: Only set an error if the actual jobResults array is empty.
            if (jobResults.length === 0 && clearResults) {
                 setError("No jobs found matching your criteria.");
            }
            
        } catch (err) {
            console.error('Search error:', err);
            setError(`Failed to fetch jobs: ${err.message}`);
        } finally {
            setLoading(false);
            setIsInitialSearch(false);
        }
    }

    // Handler for form submission (Always starts a new search, clearing previous results)
    const handleSearch = async (e) => {
        e.preventDefault();
        
        setTotalResults(0);
        setCurrentPage(1); // Ensure start from page 1
        setIsInitialSearch(true); 
        
        await fetchJobs(1, true); // Fetch page 1, clear existing results
    };

    // Handler for the "Load More" button
    const handleLoadMore = () => {
        const nextPage = currentPage + 1;
        fetchJobs(nextPage, false); // Fetch next page, DO NOT clear results
    };


    const handleSelectJob = (jobItem) => {
        const title = jobItem.job?.Title || 'Selected Job';
        const company = jobItem.company?.CompanyName || 'N/A';
        const description = jobItem.job?.JobDescription || '';
        
        // Pass the raw JobDescription text, job title, and company to the parent component (App.jsx)
        setJdText(description, title, company);
        setResults([]); // Clear results after selection
        setTotalResults(0); // Clear total results count
        setCurrentPage(1); // Reset page state
    };

    // Check if there are more pages to load
    const hasMoreResults = results.length < totalResults;
    // Determine if we are loading the initial page (to show 'Searching...' on the main button)
    const isSearchingFirstPage = isInitialSearch && loading; 
    
    // FIX 2: Ensure the displayed total is never less than the number of jobs currently displayed
    const displayTotalResults = Math.max(results.length, totalResults);

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
                <button type="submit" disabled={loading && isSearchingFirstPage} className="search-button">
                    {loading && isSearchingFirstPage ? 'Searching...' : '🔍 Search Jobs'}
                </button>
            </form>

            {error && <div className="error-message">{error}</div>}
            
            {results.length > 0 && (
                <div className="search-results">
                    <h4>Showing {results.length} of {displayTotalResults} Results:</h4>
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
                    
                    {/* Load More Button */}
                    {hasMoreResults && (
                        <button 
                            onClick={handleLoadMore} 
                            disabled={loading && !isSearchingFirstPage} // Disable only when loading more
                            className="button load-more-button"
                        >
                            {loading && !isSearchingFirstPage ? 'Loading More...' : `Load More Jobs (${displayTotalResults - results.length} left)`}
                        </button>
                    )}

                    {results.length === displayTotalResults && displayTotalResults > 0 && (
                        <div className="search-status-box all-loaded">
                            <p>All {displayTotalResults} results loaded.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default JobSearchAndSelect;