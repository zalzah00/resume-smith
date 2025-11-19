// frontend/src/components/JobSearchAndSelect.jsx

import React, { useState } from 'react';
import { searchJobs } from '../services/api';
import CONFIG from '../config/jobConfig'; 
import './JobSearchAndSelect.css';

// Allowed extensions for JD file upload
const ALLOWED_JD_EXTENSIONS = ['.pdf', '.docx', '.txt'];

// Helper function to get the display name for a code (for status message)
const getDisplayName = (code, configKey) => {
    const map = CONFIG[configKey];
    for (const [name, value] of Object.entries(map)) {
        if (value === code) return name;
    }
    return 'N/A';
};

const PER_PAGE_COUNT = 5; // Define the fixed number of results per page

// CRITICAL CHANGE: Updated props to include jdFile and setJdFile
const JobSearchAndSelect = ({ setJdText, selectedJdTitle, selectedCompany, fullJdText, onDeselect, jdFile, setJdFile }) => {
    const [keyword, setKeyword] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(CONFIG.JOB_CATEGORIES["All Categories"]);
    const [selectedEmployment, setSelectedEmployment] = useState(CONFIG.EMPLOYMENT_TYPES["All Types"]);
    const [selectedMRT, setSelectedMRT] = useState(CONFIG.MRT_STATIONS["All Stations"]);
    
    // State for Pagination
    const [results, setResults] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); 
    const [totalResults, setTotalResults] = useState(0); 
    const [lastFetchedCount, setLastFetchedCount] = useState(0); 
    
    // V2: State for row selection
    const [highlightedJobIndex, setHighlightedJobIndex] = useState(null); 
    
    const [isInitialSearch, setIsInitialSearch] = useState(true); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // Derived State for Mutual Exclusivity
    const isFileSelected = !!jdFile;
    const isSearchSelected = !!selectedJdTitle;
    
    // Logic: If a file is selected, search is disabled. If search is selected, file upload is disabled.
    const isSearchDisabled = isFileSelected;
    const isFileUploadDisabled = isSearchSelected;


    // NEW: Handler for JD file upload to ensure mutual exclusivity is maintained
    const handleJdFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const extension = '.' + file.name.split('.').pop().toLowerCase();
            if (ALLOWED_JD_EXTENSIONS.includes(extension)) {
                 // setJdFile is the handler from App.jsx, which clears the search JD text
                setJdFile(file);
                // Clear search results and error messages
                setResults([]); 
                setError(null);
            } else {
                alert(`Please upload a file with one of the following extensions for the JD: ${ALLOWED_JD_EXTENSIONS.join(', ')}`);
                setJdFile(null);
                e.target.value = ''; // Clear the input
            }
        } else {
            setJdFile(null);
        }
    };
    
    // Function to handle the actual API call
    const fetchJobs = async (pageToFetch) => { 
        // Prevent fetching if a file is already uploaded
        if (isFileSelected) return;

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
            const data = await searchJobs(params);
            
            const jobResults = data?.data?.result || [];
            const newTotal = data?.data?.total_records || 0;

            setResults(jobResults);
            
            setHighlightedJobIndex(null); 

            setCurrentPage(pageToFetch); 
            setTotalResults(newTotal);
            setLastFetchedCount(jobResults.length); 
            
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
        
        // Prevent searching if a JD file is uploaded
        if (isFileSelected) return;
        
        // Clear previous state
        setResults([]); 
        setTotalResults(0);
        setLastFetchedCount(0);
        setCurrentPage(1); 
        setIsInitialSearch(true); 
        setError(null);
        
        await fetchJobs(1); // Fetch page 1
    };

    // V2: HANDLER for clicking a table row to select and highlight
    const handleRowClick = (jobItem, index) => {
        // Prevent selection if a JD file is uploaded
        if (isFileSelected) return;

        setHighlightedJobIndex(index); 

        const title = jobItem.job?.Title || 'Selected Job';
        const company = jobItem.company?.CompanyName || 'N/A';
        const description = jobItem.job?.JobDescription || ''; 
        
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


    // --- RENDERING LOGIC ---

    // Case 1: Job selected from search (Text JD is present)
    if (isSearchSelected) {
        const snippet = fullJdText.substring(0, 200) + (fullJdText.length > 200 ? '...' : '');

        return (
            <div className="search-status-box selected">
                <h3>✅ Job Description Selected (via Search)</h3>
                
                <div className="selected-job-details">
                    <p><strong>Job Title:</strong> {selectedJdTitle}</p>
                    <p><strong>Company:</strong> {selectedCompany}</p>
                    <p>
                        <strong>JD Snippet:</strong> 
                        <span 
                            dangerouslySetInnerHTML={{ __html: snippet }} 
                            style={{ display: 'block', marginTop: '5px' }}
                        />
                    </p>
                </div>

                <button 
                    onClick={() => {
                        setHighlightedJobIndex(null); // Clear highlight on deselect
                        onDeselect(); // Clear parent selection (App.jsx)
                    }} 
                    className="button deselect"
                >
                    Change Job
                </button>
            </div>
        );
    }
    
    // Case 2: JD File is selected (Show file confirmation and clear button)
    if (isFileSelected) {
        return (
            <div className="search-status-box selected file-selected">
                <h3>✅ Job Description Selected (via File)</h3>
                
                <div className="selected-job-details">
                    <p><strong>File Name:</strong> {jdFile.name}</p>
                    <p className="status-message warning">
                        Job Search is **disabled**. Clear the file below to use the search functionality.
                    </p>
                </div>

                <button 
                    onClick={() => {
                        setJdFile(null); // Clear file state (calls handleSetJdFile in App.jsx)
                    }} 
                    className="button deselect"
                >
                    Change/Remove File
                </button>
            </div>
        );
    }

    
    // Case 3: No job selected and no file uploaded (Show search interface and file upload)
    return (
        <div className="job-search-container">
            <h3>1. Provide Job Description Source</h3>
            
            {/* --- Option A: JD Search Form --- */}
            <div className="search-section" style={{ opacity: isSearchDisabled ? 0.6 : 1, pointerEvents: isSearchDisabled ? 'none' : 'auto' }}>
                <h4>Option A: Search and Select (Click Row to Select)</h4>
                <form onSubmit={handleSearch} className="search-form">
                    <input
                        type="text"
                        placeholder="Search keywords (e.g., modeller, data scientist)"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        className="keyword-input"
                        disabled={isSearchDisabled}
                    />
                    <div className="select-group">
                        <select 
                            value={selectedCategory || ''} 
                            onChange={(e) => setSelectedCategory(e.target.value ? parseInt(e.target.value) : null)} 
                            disabled={isSearchDisabled}
                        >
                            {Object.entries(CONFIG.JOB_CATEGORIES).map(([name, code]) => (
                                <option key={name} value={code || ''}>{name}</option>
                            ))}
                        </select>
                        <select 
                            value={selectedEmployment || ''} 
                            onChange={(e) => setSelectedEmployment(e.target.value ? parseInt(e.target.value) : null)}
                            disabled={isSearchDisabled}
                        >
                            {Object.entries(CONFIG.EMPLOYMENT_TYPES).map(([name, code]) => (
                                <option key={name} value={code || ''}>{name}</option>
                            ))}
                        </select>
                        <select 
                            value={selectedMRT || ''} 
                            onChange={(e) => setSelectedMRT(e.target.value ? parseInt(e.target.value) : null)}
                            disabled={isSearchDisabled}
                        >
                            {Object.entries(CONFIG.MRT_STATIONS).map(([name, code]) => (
                                <option key={name} value={code || ''}>{name}</option>
                            ))}
                        </select>
                    </div>
                    <button type="submit" disabled={isSearchDisabled || (loading && isSearchingFirstPage)} className="search-button">
                        {loading && isSearchingFirstPage ? 'Searching...' : '🔍 Search Jobs'}
                    </button>
                </form>

                {error && <div className="error-message">{error}</div>}
                
                {/* --- Search Results Table --- */}
                {results.length > 0 && (
                    <div className="search-results">
                        <h4>
                            Showing {startRange}-{endRange} of {displayTotalResults === results.length && !hasNextPage ? results.length : 'many'} Results:
                        </h4>

                        <table className="job-results-table">
                            <thead>
                                <tr>
                                    <th style={{width: '30%'}}>Job Title / Company</th>
                                    <th style={{width: '70%'}}>Job Description Snippet</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.map((item, index) => {
                                    const jdText = item.job?.JobDescription || 'No description provided.';
                                    const jdSnippet = jdText.substring(0, 200) + (jdText.length > 200 ? '...' : '');

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
                                            <td 
                                                className="jd-snippet-cell"
                                                dangerouslySetInnerHTML={{ __html: jdSnippet }} 
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
            
            {/* --- Option B: JD File Upload --- */}
            <div className="input-group jd-upload-group" style={{ marginTop: '25px' }}>
                <h4>Option B: Upload a File</h4>
                <label htmlFor="jd-upload">
                    Upload Job Description ({ALLOWED_JD_EXTENSIONS.join(', ')}):
                </label>
                <input
                    id="jd-upload"
                    type="file"
                    accept={ALLOWED_JD_EXTENSIONS.join(',')}
                    onChange={handleJdFileChange}
                    disabled={isFileUploadDisabled}
                />
                
                {isFileUploadDisabled && (
                    <p className="status-message warning">
                        ❌ File upload is disabled because **"{selectedJdTitle}"** is currently selected via search. Clear the job selection above to upload a file.
                    </p>
                )}
            </div>
        </div>
    );
};

export default JobSearchAndSelect;