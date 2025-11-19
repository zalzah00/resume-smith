// frontend/src/config/jobConfig.js

/**
 * Static configuration data for job search filters.
 * The numerical codes are typically IDs expected by the backend API.
 * This should be kept consistent with your Python backend (e.g., job_search_app.py).
 */
const CONFIG = {
    "JOB_CATEGORIES": {
        "All Categories": null,
        "Information Technology": 1861,
        "F&B (Food & Beverage)": 1855,
        "Sales / Retail": 1875,
        "Accounting / Auditing / Taxation": 1845,
        "Admin / Secretarial": 1846,
        "Banking and Finance": 1847,
        "Building and Construction": 1848,
        "Customer Service": 1850,
        "Design": 1852,
        "Education / Training": 1853,
        "Engineering": 1854,
        "Healthcare / Pharmaceutical": 1856,
    },
    "EMPLOYMENT_TYPES": {
        "All Types": null,
        "Full Time": 76,
        "Part Time": 115,
        "Contract": 121,
        "Permanent": 88,
        "Temporary": 105,
        "Internship / Attachment": 90,
    },
    "MRT_STATIONS": {
        "All Stations": null,
        "Woodlands (NS9/TE2)": 1833,
        "Jurong East (EW24/NS1)": 1840,
        "Changi Airport (CG2)": 1787,
        "Raffles Place (EW14/NS26)": 1814,
        "Dhoby Ghaut (NE6/NS24/CC1)": 1790,
        "HarbourFront (NE1/CC29)": 1795,
        "Bishan (NS17/CC15)": 1779,
    },
};

export default CONFIG;