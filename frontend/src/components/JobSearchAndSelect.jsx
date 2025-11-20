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

// ACCEPTING new props: selectedCompany and fullJdText
const JobSearchAndSelect = ({ setJdText, selectedJdTitle, selectedCompany, fullJdText, onDeselect }) => {
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

    // V2: State for row selection
    const [highlightedJobIndex, setHighlightedJobIndex] = useState(null);

    const [isInitialSearch, setIsInitialSearch] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    // Function to handle the actual API call
    const fetchJobs = async (pageToFetch) => {
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

            // TRADITIONAL PAGINATION: Always REPLACE results, never append.
            setResults(jobResults);

            // V2: Reset highlight when loading new page
            setHighlightedJobIndex(null);

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

    // Handler for form submission
    const handleSearch = async (e) => {
        e.preventDefault();

        setResults([]);
        setTotalResults(0);
        setLastFetchedCount(0);
        setCurrentPage(1);
        setIsInitialSearch(true);

        await fetchJobs(1); // Fetch page 1
    };

    // V2: HANDLER for clicking a table row to select and highlight
    const handleRowClick = (jobItem, index) => {
        // 1. Highlight the row
        setHighlightedJobIndex(index);

        // 2. Select the job and pass data to the parent component
        const title = jobItem.job?.Title || 'Selected Job';
        const company = jobItem.company?.CompanyName || 'N/A';
        // Corrected variable usage from 'item' to 'jobItem' (Fix from previous turn)
        const description = jobItem.job?.JobDescription || '';

        // This call updates selectedJdTitle in the parent component (App.jsx), triggering the screen change
        setJdText(description, title, company);
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

    // Derived state
    const hasNextPage = lastFetchedCount === PER_PAGE_COUNT;
    const hasPrevPage = currentPage > 1;
    const isSearchingFirstPage = isInitialSearch && loading;
    const displayTotalResults = Math.max(results.length, totalResults);
    const startRange = results.length > 0 ? (currentPage - 1) * PER_PAGE_COUNT + 1 : 0;
    const endRange = startRange > 0 ? startRange + results.length - 1 : 0;


    if (selectedJdTitle) {
        // Display the selected job confirmation
        // MODIFIED BLOCK START: Now uses selectedCompany and fullJdText

        // Display the full JD text passed from the parent

        return (
            <div className="search-status-box selected">
                <h3>✅ Job Selected</h3>

                <div className="selected-job-details">
                    <p><strong>Job Title:</strong> {selectedJdTitle}</p>
                    <p><strong>Company:</strong> {selectedCompany}</p>
                    <p>
                        <strong>Job Description:</strong>
                        {/* Re-using dangerouslySetInnerHTML to render the full JD */}
                        <span
                            dangerouslySetInnerHTML={{ __html: fullJdText }}
                            style={{ display: 'block', marginTop: '5px' }}
                        />
                    </p>
                </div>

                <button
                    onClick={() => {
                        setHighlightedJobIndex(null); // Clear highlight on deselect
                        onDeselect(); // Clear parent selection
                    }}
                    className="button deselect"
                >
                    Change Job
                </button>
            </div>
        );
        // MODIFIED BLOCK END
    }

    return (
        <div className="job-search-container">
            <h3>Search for a Job Description (Click Row to Select)</h3>
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
                    <h4>
                        Showing {startRange}-{endRange} of {displayTotalResults === results.length && !hasNextPage ? results.length : 'many'} Results:
                    </h4>

                    {/* V2: Tabular Display */}
                    <table className="job-results-table">
                        <thead>
                            <tr>
                                <th style={{ width: '30%' }}>Job Title / Company</th>
                                <th style={{ width: '70%' }}>Job Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map((item, index) => {
                                const jdText = item.job?.JobDescription || 'No description provided.';
                                // Display full JD text

                                return (
                                    <tr
                                        key={index}
                                        className={index === highlightedJobIndex ? 'selected-row' : ''}
                                        onClick={() => handleRowClick(item, index)}
                                    >
                                        <td>
                                            <strong>{item.job?.Title || 'N/A'}</strong>
                                            <br />
                                            <span className="company-name">{item.company?.CompanyName || 'N/A'}</span>
                                        </td>
                                        {/* Use dangerouslySetInnerHTML to render HTML formatted text */}
                                        <td
                                            className="jd-snippet-cell"
                                            dangerouslySetInnerHTML={{ __html: jdText }}
                                        />
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

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