# /backend/app.py

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
from core import (
    run_part_1_analysis, 
    run_part_2_transformation, 
    run_part_3_formatting,  # <-- 1. NEW: Import formatting function
    docx_to_text,
    CLIENT_AVAILABLE,
    FINAL_API_STATUS,
    logger,
    GROQ_MODEL # Need GROQ_MODEL for formatting step configuration
)
import tempfile
import asyncio

app = FastAPI(title="Resume Transformer API", version="1.0.0")

# CORS middleware - MAXIMUM SECURITY
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "https://resume-smith-front.onrender.com"
    ],
    allow_credentials=False,
    allow_methods=["POST"],  # ← REMOVED GET & OPTIONS (we only need POST)
    allow_headers=["Content-Type"],  # ← REMOVED Authorization (not needed)
)


@app.get("/")
async def root():
    return {
        "message": "Resume Transformer API", 
        "status": "Running",
        "api_status": FINAL_API_STATUS
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "clients_available": CLIENT_AVAILABLE}

@app.post("/api/analyze")
async def analyze_resume(
    provider: str = Form(...),
    resume: UploadFile = File(...),
    jd: UploadFile = File(...)
):
    """
    Process resume and job description files for Part 1 analysis and questions.
    """
    if not CLIENT_AVAILABLE:
        raise HTTPException(status_code=500, detail="No LLM clients available. Check API keys.")
    
    if provider not in ["Gemini", "Groq"]:
        raise HTTPException(status_code=400, detail="Provider must be 'Gemini' or 'Groq'")

    # --- File handling logic (Unchanged) ---
    try:
        # Save files temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=f".{resume.filename.split('.')[-1]}") as r_tmp:
            r_tmp.write(await resume.read())
            resume_path = r_tmp.name
        
        with tempfile.NamedTemporaryFile(delete=False, suffix=f".{jd.filename.split('.')[-1]}") as j_tmp:
            j_tmp.write(await jd.read())
            jd_path = j_tmp.name

        # Convert to text
        resume_text = docx_to_text(resume_path)
        jd_text = docx_to_text(jd_path)
        
        # Clean up temp files
        os.unlink(resume_path)
        os.unlink(jd_path)
        
        if "ERROR" in resume_text or "ERROR" in jd_text:
            raise Exception("File conversion error.")

        # Run Part 1 analysis
        part_1_analysis = run_part_1_analysis(
            provider=provider,
            resume_text=resume_text,
            jd_text=jd_text
        )
        
        if "ERROR" in part_1_analysis:
            raise HTTPException(status_code=500, detail=part_1_analysis)

        return {
            "status": "success",
            "part_1_analysis": part_1_analysis,
            "resume_text": resume_text,
            "jd_text": jd_text
        }
        
    except Exception as e:
        logger.error(f"Error in analyze_resume: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Processing error: {str(e)}")

# --- /api/transform endpoint MODIFIED to chain calls (Part 2 and Part 3) ---
@app.post("/api/transform")
async def transform_resume(
    provider: str = Form(...),
    resume_text: str = Form(...),
    jd_text: str = Form(...),
    part_1_analysis: str = Form(...),
    user_answers: str = Form(...)
):
    """
    Generate final transformed resume by chaining Part 2 (drafting) and 
    Part 3 (formatting) internally.
    """
    if not CLIENT_AVAILABLE:
        raise HTTPException(status_code=500, detail="No LLM clients available. Check API keys.")
    
    if provider not in ["Gemini", "Groq"]:
        raise HTTPException(status_code=400, detail="Provider must be 'Gemini' or 'Groq'")
    
    try:
        # 1. Execute Part 2: Generate the RAW RESUME DRAFT
        logger.info("Starting Part 2: Transformation (Drafting)...")
        raw_resume_draft = run_part_2_transformation(
            provider=provider,
            resume_text=resume_text,
            jd_text=jd_text,
            part_1_analysis=part_1_analysis,
            user_answers=user_answers
        )

        if "ERROR" in raw_resume_draft:
            logger.error(f"Part 2 error: {raw_resume_draft}")
            raise HTTPException(status_code=500, detail=raw_resume_draft)

        # 2. Execute Part 3: Format the RAW DRAFT (Internal Chaining)
        logger.info("Transformation complete. Starting Part 3: Formatting...")
        
        # Default to Groq for formatting if available due to high speed/low latency
        formatting_provider = 'Groq' if CLIENT_AVAILABLE.get('Groq') else provider
        
        final_formatted_resume = run_part_3_formatting(
            raw_resume_text=raw_resume_draft,
            provider=formatting_provider,
            model_name=GROQ_MODEL # Using the higher-end Groq model for quality formatting
        )
        
        if "ERROR" in final_formatted_resume:
            logger.error(f"Part 3 formatting error: {final_formatted_resume}")
            raise HTTPException(status_code=500, detail=final_formatted_resume)

        logger.info("Part 3 Formatting complete. Returning final result.")
        return {
            "status": "success",
            "final_resume": final_formatted_resume
        }
        
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        logger.error(f"Error in transform_resume: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal Server Error during transformation/formatting chain: {str(e)}")