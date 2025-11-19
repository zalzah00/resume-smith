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
    const [currentPage, setCurrentPage] = useState(1); 
    const [totalResults, setTotalResults] = useState(0); 
    
    // NEW STATE: Tracks how many items were returned in the last API call.
    const [lastFetchedCount, setLastFetchedCount] = useState(0); 
    
    const [isInitialSearch, setIsInitialSearch] = useState(true); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    

    // Function to handle the actual API call
    const fetchJobs = async (pageToFetch, clearResults) => {
        setLoading(true);
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
            
            const jobResults = data?.data?.result || [];
            const newTotal = data?.data?.total_records || 0;

            if (clearResults) {
                // Initial search or new search
                setResults(jobResults);
            } else {
                // Load More button click - Append results
                setResults(prevResults => [...prevResults, ...jobResults]);
            }
            
            // Update successful fetch states
            setCurrentPage(pageToFetch); 
            setTotalResults(newTotal);
            // This is the key fix: record how many items were actually returned
            setLastFetchedCount(jobResults.length); 
            

            // Only set an error if the actual jobResults array is empty.
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
        
        setResults([]); // Clear results immediately
        setTotalResults(0);
        setLastFetchedCount(0); // Reset fetch count
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

    // FIXED LOGIC: Show "Load More" if the last fetch returned a full page size (PER_PAGE_COUNT)
    // This overrides the unreliable 'totalResults' count.
    const hasMoreResults = lastFetchedCount === PER_PAGE_COUNT;
    
    // Determine if we are loading the initial page 
    const isSearchingFirstPage = isInitialSearch && loading; 
    
    // Ensure the displayed total is never less than the number of jobs currently displayed
    // In case totalResults is 0 but we have 5 results, this will show 5.
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
                    {/* Use results.length here, and a MAX of results.length and totalResults for the total count */}
                    <h4>Showing {results.length} of {displayTotalResults === results.length ? 'many' : displayTotalResults} Results:</h4>
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
                    
                    {/* Load More Button - appears if the last fetch returned a full page */}
                    {hasMoreResults && (
                        <button 
                            onClick={handleLoadMore} 
                            disabled={loading && !isSearchingFirstPage} 
                            className="button load-more-button"
                        >
                            {loading && !isSearchingFirstPage ? 'Loading More...' : `Load More Jobs (Page ${currentPage + 1})`}
                        </button>
                    )}

                    {/* Display message when all known results are loaded */}
                    {!hasMoreResults && results.length > 0 && (
                        <div className="search-status-box all-loaded">
                            <p>All visible results loaded.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default JobSearchAndSelect;