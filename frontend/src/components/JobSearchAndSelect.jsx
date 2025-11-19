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
    
    // Tracks how many items were returned in the last API call.
    const [lastFetchedCount, setLastFetchedCount] = useState(0); 
    
    const [isInitialSearch, setIsInitialSearch] = useState(true); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    

    // Function to handle the actual API call
    const fetchJobs = async (pageToFetch) => { // Removed 'clearResults' as the logic handles clear vs. replace
        setLoading(true);
        setError(null);

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

            // --- REVISED PAGINATION LOGIC ---
            // TRADITIONAL PAGINATION: Always REPLACE results, never append.
            setResults(jobResults);
            // --------------------------------

            // Update successful fetch states
            setCurrentPage(pageToFetch); 
            setTotalResults(newTotal);
            setLastFetchedCount(jobResults.length); 
            

            // Only set an error if the actual jobResults array is empty.
            if (jobResults.length === 0 && pageToFetch === 1) {
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

    // Handler for form submission (Always starts a new search, fetching page 1)
    const handleSearch = async (e) => {
        e.preventDefault();
        
        setResults([]); // Clear results immediately
        setTotalResults(0);
        setLastFetchedCount(0);
        setCurrentPage(1); 
        setIsInitialSearch(true); 
        
        await fetchJobs(1); // Fetch page 1
    };

    // Handler for the "Next Page" button
    const handleNextPage = () => {
        const nextPage = currentPage + 1;
        fetchJobs(nextPage);
    };

    // Handler for the "Previous Page" button
    const handlePrevPage = () => {
        const prevPage = currentPage - 1;
        if (prevPage >= 1) {
            fetchJobs(prevPage);
        }
    };


    const handleSelectJob = (jobItem) => {
        const title = jobItem.job?.Title || 'Selected Job';
        const company = jobItem.company?.CompanyName || 'N/A';
        const description = jobItem.job?.JobDescription || '';
        
        setJdText(description, title, company);
        setResults([]); 
        setTotalResults(0); 
        setCurrentPage(1); 
    };

    // Show "Next Page" button if the last fetch returned a full page size (5)
    const hasNextPage = lastFetchedCount === PER_PAGE_COUNT;
    const hasPrevPage = currentPage > 1;
    
    // Determine if we are loading the initial page 
    const isSearchingFirstPage = isInitialSearch && loading; 
    
    // Ensure the displayed total is never less than the number of jobs currently displayed
    const displayTotalResults = Math.max(results.length, totalResults);
    
    // Calculate the range of jobs being shown
    const startRange = results.length > 0 ? (currentPage - 1) * PER_PAGE_COUNT + 1 : 0;
    const endRange = startRange > 0 ? startRange + results.length - 1 : 0;


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
                    {/* Updated Header for Traditional Pagination */}
                    <h4>
                        Showing {startRange}-{endRange} of {displayTotalResults === results.length && !hasNextPage ? results.length : 'many'} Results:
                    </h4>

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
                    
                    {/* Pagination Controls */}
                    <div className="pagination-controls">
                        <button 
                            onClick={handlePrevPage} 
                            disabled={loading || !hasPrevPage} 
                            className="button prev-button"
                        >
                            {'< Previous Page'}
                        </button>
                        <span className="page-status">
                            Page {currentPage}
                        </span>
                        <button 
                            onClick={handleNextPage} 
                            disabled={loading || !hasNextPage} 
                            className="button next-button"
                        >
                            {loading && !isSearchingFirstPage ? 'Loading...' : 'Next Page >'}
                        </button>
                    </div>

                    {/* Display message when all known results are loaded */}
                    {!hasNextPage && results.length > 0 && (
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