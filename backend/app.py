# /backend/app.py

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
from core import (
    run_part_1_analysis, 
    run_part_2_transformation, 
    docx_to_text,
    CLIENT_AVAILABLE,
    FINAL_API_STATUS,
    logger
)
import tempfile
import asyncio

app = FastAPI(title="Resume Transformer API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://https://resume-smith-front.onrender.com/"],  # Update with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
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
    Process resume and job description files for Part 1 analysis
    """
    if not CLIENT_AVAILABLE:
        raise HTTPException(status_code=500, detail="No LLM clients available. Check API keys.")
    
    if provider not in ["Gemini", "Groq"]:
        raise HTTPException(status_code=400, detail="Provider must be 'Gemini' or 'Groq'")
    
    try:
        # Save uploaded files temporarily and extract text
        with tempfile.NamedTemporaryFile(delete=False, suffix=".docx") as resume_temp:
            resume_content = await resume.read()
            resume_temp.write(resume_content)
            resume_temp_path = resume_temp.name
        
        with tempfile.NamedTemporaryFile(delete=False, suffix=".docx") as jd_temp:
            jd_content = await jd.read()
            jd_temp.write(jd_content)
            jd_temp_path = jd_temp.name
        
        # Extract text from DOCX files
        resume_text = docx_to_text(resume_temp_path, "RESUME")
        jd_text = docx_to_text(jd_temp_path, "JD")
        
        # Clean up temporary files
        os.unlink(resume_temp_path)
        os.unlink(jd_temp_path)
        
        # Check for extraction errors
        if "ERROR" in resume_text:
            raise HTTPException(status_code=400, detail=f"Resume file error: {resume_text}")
        if "ERROR" in jd_text:
            raise HTTPException(status_code=400, detail=f"Job description file error: {jd_text}")
        
        # Run Part 1 analysis
        analysis_result = run_part_1_analysis(provider, resume_text, jd_text)
        
        if "ERROR" in analysis_result:
            raise HTTPException(status_code=500, detail=analysis_result)
        
        return {
            "status": "success",
            "analysis": analysis_result,
            "resume_text": resume_text,
            "jd_text": jd_text
        }
        
    except Exception as e:
        logger.error(f"Error in analyze_resume: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Processing error: {str(e)}")

@app.post("/api/transform")
async def transform_resume(
    provider: str = Form(...),
    resume_text: str = Form(...),
    jd_text: str = Form(...),
    part_1_analysis: str = Form(...),
    user_answers: str = Form(...)
):
    """
    Generate final transformed resume based on user answers (Part 2)
    """
    if not CLIENT_AVAILABLE:
        raise HTTPException(status_code=500, detail="No LLM clients available. Check API keys.")
    
    if provider not in ["Gemini", "Groq"]:
        raise HTTPException(status_code=400, detail="Provider must be 'Gemini' or 'Groq'")
    
    try:
        # Run Part 2 transformation
        final_resume = run_part_2_transformation(
            provider=provider,
            resume_text=resume_text,
            jd_text=jd_text,
            part_1_analysis=part_1_analysis,
            user_answers=user_answers
        )
        
        if "ERROR" in final_resume:
            raise HTTPException(status_code=500, detail=final_resume)
        
        return {
            "status": "success",
            "final_resume": final_resume
        }
        
    except Exception as e:
        logger.error(f"Error in transform_resume: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Transformation error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

# end_of_file