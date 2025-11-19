# backend/app.py
# /backend/app.py

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
from core import (
    run_part_1_analysis, 
    run_part_2_transformation, 
    extract_text_from_file, 
    CLIENT_AVAILABLE,
    FINAL_API_STATUS,
    logger
)
import tempfile
import asyncio
import httpx
import json

app = FastAPI(title="Resume Transformer API", version="1.0.0")

# CORS middleware - MAXIMUM SECURITY
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "https://resume-smith-front.onrender.com"
    ],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)

# Helper to determine extension
def get_file_extension(filename):
    return os.path.splitext(filename)[1].lower()

@app.get("/")
async def root():
    return {"message": "Resume Transformer API is running.", "status": FINAL_API_STATUS}


# Temporary debug endpoint to test Groq responses directly (local dev only).
@app.post("/api/debug-groq")
async def debug_groq(model: str = Form(...), prompt: str = Form(...)):
    """
    Debug endpoint: sends `prompt` to the Groq client with the specified `model`.
    Returns raw result (for debugging only). Do NOT enable in production.
    """
    from core import _generate_content_with_config
    try:
        # Force provider to 'groq'
        result = _generate_content_with_config('groq', model, prompt)
        return JSONResponse(content={"status": "ok", "result": result})
    except Exception as e:
        return JSONResponse(content={"status": "error", "detail": str(e)}, status_code=500)


# NEW ENDPOINT: Job Search Proxy (to bypass CORS issues)
@app.get("/api/search-jobs")
async def search_jobs_proxy(
    page: int = 1,
    per_page_count: int = 5,
    keywords: str = None,
    JobCategory: int = None,
    EmploymentType: int = None,
    id_Job_NearestMRTStation: int = None
):
    """
    Proxy endpoint for searching jobs from findsgjobs.com API.
    Bypasses CORS restrictions on frontend.
    """
    try:
        external_api_url = "https://www.findsgjobs.com/apis/job/searchable"
        
        # Build query parameters
        params = {
            "page": page,
            "per_page_count": per_page_count,
        }
        
        if keywords:
            params["keywords"] = keywords
        if JobCategory:
            params["JobCategory"] = JobCategory
        if EmploymentType:
            params["EmploymentType"] = EmploymentType
        if id_Job_NearestMRTStation:
            params["id_Job_NearestMRTStation"] = id_Job_NearestMRTStation
        
        # Make request to external API using httpx
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.get(external_api_url, params=params)
            response.raise_for_status()
            return response.json()
        
    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="Job search API timed out. Please try again.")
    except httpx.RequestError as e:
        logger.error(f"Job search API error: {e}")
        raise HTTPException(status_code=502, detail="Failed to connect to job search API. Please try again.")
    except Exception as e:
        logger.error(f"Unexpected error in job search: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {e}")



@app.post("/api/analyze")
async def analyze_resume(
    provider: str = Form(...),
    resume: UploadFile = File(...),
    jd_text: str = Form(...) # <--- JD content is now a string from the frontend
):
    if not CLIENT_AVAILABLE:
        raise HTTPException(status_code=503, detail="LLM API client is not configured.")

    if not resume:
        raise HTTPException(status_code=400, detail="Resume file is required.")
        
    if not jd_text.strip(): # Check if the passed text is empty
        raise HTTPException(status_code=400, detail="Job Description text is empty. Please select a job.")


    temp_resume_path = None
    try:
        # --- 1. Extract Text from Resume File (REMAINS THE SAME) ---
        extension = get_file_extension(resume.filename)
        
        # Save resume file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=extension) as tmp:
            content = await resume.read()
            tmp.write(content)
            temp_resume_path = tmp.name
        
        resume_text = extract_text_from_file(temp_resume_path, extension)

        if not resume_text:
            raise HTTPException(status_code=400, detail="Could not extract text from resume file. Please check file format.")
            
        # --- 2. JD Text is already available (CRITICAL CHANGE) ---
        # jd_text variable now holds the content, no file handling needed.
        
        # --- 3. Run Analysis (REMAINS THE SAME) ---
        analysis_result = run_part_1_analysis(provider, resume_text, jd_text)

        return JSONResponse(content={
            "status": "success",
            "part_1_analysis": analysis_result,
            "original_resume_text": resume_text,
            "job_description_text": jd_text # return the JD text for safety/debugging
        })

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Analysis processing error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error during analysis: {e}")
    finally:
        if temp_resume_path and os.path.exists(temp_resume_path):
            os.remove(temp_resume_path)


# The /api/transform endpoint now includes job_title and company parameters
@app.post("/api/transform")
async def transform_resume(
    provider: str = Form(...),
    resume_text: str = Form(...),
    jd_text: str = Form(...),
    job_title: str = Form(default=''),
    company: str = Form(default=''),
    part_1_analysis: str = Form(...),
    user_answers: str = Form(...)
):
    # This endpoint now accepts job_title and company for enhanced context in the LLM prompt
    
    if not CLIENT_AVAILABLE:
        raise HTTPException(status_code=503, detail="LLM API client is not configured.")
        
    try:
        transformed_text = run_part_2_transformation(
            provider, 
            resume_text, 
            jd_text,
            job_title,
            company,
            part_1_analysis, 
            user_answers
        )
        
        return JSONResponse(content={
            "status": "success",
            "transformed_resume": transformed_text,
        })
        
    except Exception as e:
        logger.error(f"Transformation processing error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error during transformation: {e}")