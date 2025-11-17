# /backend/core.py

import os
import logging
import sys
import docx2txt
from pathlib import Path
from google import genai
from google.genai import types
from groq import Groq
from dotenv import load_dotenv

# --- Logging Setup ---
LOG_FILE = 'debug_log.txt'
root_logger = logging.getLogger()
root_logger.setLevel(logging.DEBUG) 
formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')

file_handler = logging.FileHandler(LOG_FILE, mode='w')
file_handler.setFormatter(formatter)
root_logger.addHandler(file_handler)

console_handler = logging.StreamHandler(sys.stderr)
console_handler.setLevel(logging.INFO)
console_handler.setFormatter(formatter)
root_logger.addHandler(console_handler)

logger = logging.getLogger(__name__)
logger.info("Core application module loaded.")

# --- Configuration ---
GEMINI_MODEL = 'gemini-2.5-flash'
GROQ_MODEL = 'llama-3.3-70b-versatile'
GEMINI_API_NAME = 'GEMINI_API_KEY'
GROQ_API_NAME = 'GROQ_API_KEY'

# --- Initialize Clients ---
gemini_client = None
groq_client = None
API_STATUS = []

# Load environment variables
dotenv_path = Path('.') / '.env'
if dotenv_path.exists():
    load_dotenv(dotenv_path)
    logger.info("Loaded environment variables from .env file.")

# Initialize Gemini Client
try:
    GEMINI_API_KEY = os.environ.get(GEMINI_API_NAME)
    if GEMINI_API_KEY:
        gemini_client = genai.Client(api_key=GEMINI_API_KEY)
        API_STATUS.append("Gemini client initialized.")
    else:
        API_STATUS.append(f"Gemini client not initialized: {GEMINI_API_NAME} not set.")
except Exception as e:
    API_STATUS.append(f"Gemini client initialization error: {e}")
    logger.error(f"Gemini client initialization error: {e}")

# Initialize Groq Client
try:
    GROQ_API_KEY = os.environ.get(GROQ_API_NAME)
    if GROQ_API_KEY:
        groq_client = Groq(api_key=GROQ_API_KEY)
        API_STATUS.append("Groq client initialized.")
    else:
        API_STATUS.append(f"Groq client not initialized: {GROQ_API_NAME} not set.")
except Exception as e:
    API_STATUS.append(f"Groq client initialization error: {e}")
    logger.error(f"Groq client initialization error: {e}")

# Check client availability
CLIENT_AVAILABLE = {
    'Gemini': bool(gemini_client),
    'Groq': bool(groq_client)
}

FINAL_API_STATUS = {
    "status": "Ready",
    "clients": CLIENT_AVAILABLE,
    "details": API_STATUS
}
logger.info(f"API Client Status: {FINAL_API_STATUS}")

# --- System Instructions (MODIFIED) ---

PRIMARY_SYSTEM_INSTRUCTION = (
    "You are an expert career coach and resume transformer. Your goal is to rewrite a user's existing "
    "resume to better match a specific job description (JD) and incorporate user-provided answers about their experience."
    "For Part 1, you must analyze and ask clarification questions. For Part 2, you must generate the transformed resume content."
)

# 🆕 NEW INSTRUCTION FOR FORMATTING (Part 3)
FORMATTING_SYSTEM_INSTRUCTION = (
    "You are a professional Markdown formatting engine. Your only task is to take the provided raw text "
    "and convert it into a strictly formatted Markdown resume. Ensure the output uses:\n"
    "1. Headings (`#`, `##`) for all major sections (Experience, Education, etc.).\n"
    "2. Bullet points (`-` or `*`) for all job descriptions, achievements, and list items.\n"
    "3. Bold text (`**text**`) for emphasis where appropriate, such as job titles or companies.\n"
    "4. Maintain a clean, professional, and readable structure. "
    "DO NOT ADD, REMOVE, OR CHANGE THE SUBSTANTIVE CONTENT; you must ONLY reformat the text."
)

# --- Utility Functions (Unchanged) ---

def docx_to_text(file_path):
    """Converts a docx file to plain text."""
    try:
        return docx2txt.process(file_path)
    except Exception as e:
        logger.error(f"Error converting DOCX to text: {e}")
        return f"ERROR: Could not convert file to text. {e}"


def _generate_content_with_config(provider, model_name, prompt, system_instruction=PRIMARY_SYSTEM_INSTRUCTION):
    """Internal function to handle the actual LLM API call."""
    if provider == 'Gemini':
        client = gemini_client
        if not client:
            return "ERROR: Gemini client not initialized."
            
        config = types.GenerateContentConfig(
            system_instruction=system_instruction, 
        )
        response = client.models.generate_content(
            model=model_name,
            contents=prompt,
            config=config,
        )
        return response.text.strip()

    elif provider == 'Groq':
        client = groq_client
        if not client:
            return "ERROR: Groq client not initialized."
            
        response = client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_instruction},
                {"role": "user", "content": prompt}
            ],
            model=model_name,
        )
        return response.choices[0].message.content.strip()

    return "ERROR: Invalid provider specified."

# --- Core LLM Functions (Modified Part 2 docstring) ---

def run_part_1_analysis(provider, resume_text, jd_text):
    """Calls the LLM to execute Phase 1 - Analysis and Questions."""
    if (provider == 'Gemini' and not gemini_client) or (provider == 'Groq' and not groq_client):
        return f"ERROR: Selected {provider} client is not initialized. Check API keys."
    
    model_name = GEMINI_MODEL if provider == 'Gemini' else GROQ_MODEL

    prompt = f"""
    --- EXECUTE PHASE 1 ---
    Perform the analysis and ask 5-10 targeted clarification questions.
    
    [JOB DESCRIPTION START]
    {jd_text}
    [JOB DESCRIPTION END]

    [ORIGINAL RESUME START]
    {resume_text}
    [ORIGINAL RESUME END]
    
    Format your output strictly into two sections: 'Analysis' and 'Clarification Questions'.
    """
    
    logger.info(f"--- FULL PROMPT SENT TO {provider} ({model_name}) (PART 1) ---")
    logger.debug(prompt)

    try:
        response_text = _generate_content_with_config(provider, model_name, prompt)
        logger.info(f"--- LLM RESPONSE RECEIVED (PART 1) ---\n{response_text[:500]}...")
        return response_text
    except Exception as e:
        error_msg = f"LLM ERROR during Part 1 ({provider}): {e}"
        logger.error(error_msg)
        return error_msg

def run_part_2_transformation(provider, resume_text, jd_text, part_1_analysis, user_answers):
    """
    Calls the LLM to execute Phase 2 - Part 2 transformation (Generates the RAW DRAFT).
    Final formatting will be handled by run_part_3_formatting.
    """
    if (provider == 'Gemini' and not gemini_client) or (provider == 'Groq' and not groq_client):
        return f"ERROR: Selected {provider} client is not initialized. Check API keys."
    
    model_name = GEMINI_MODEL if provider == 'Gemini' else GROQ_MODEL

    prompt = f"""
    --- EXECUTE PHASE 2 — PART 2 (CONTENT DRAFTING) ---
    Perform the full resume transformation and output the final draft content ONLY.
    The content should be accurate and complete, but perfect Markdown formatting is NOT required here.

    [JOB DESCRIPTION START]
    {jd_text}
    [JOB DESCRIPTION END]

    [ORIGINAL RESUME START]
    {resume_text}
    [ORIGINAL RESUME END]

    [PART 1 ANALYSIS & QUESTIONS START]
    {part_1_analysis}
    [PART 1 ANALYSIS & QUESTIONS END]

    [USER CLARIFICATIONS START]
    {user_answers}
    [USER CLARIFICATIONS END]
    """
    
    logger.info(f"--- FULL PROMPT SENT TO {provider} ({model_name}) (PART 2) ---")
    logger.debug(prompt)

    try:
        response_text = _generate_content_with_config(provider, model_name, prompt)
        logger.info(f"--- LLM RESPONSE RECEIVED (PART 2) ---\n{response_text[:500]}...")
        return response_text
    except Exception as e:
        error_msg = f"LLM ERROR during Part 2 ({provider}): {e}"
        logger.error(error_msg)
        return error_msg

# 🆕 NEW PART 3 FUNCTION (Formatting)
def run_part_3_formatting(raw_resume_text, provider='Groq', model_name='llama-3.3-70b-versatile'):
    """
    Calls a specialized LLM to strictly format the raw text into clean Markdown.
    Defaults to Groq for speed/consistency if available.
    """
    
    if (provider == 'Gemini' and not gemini_client) or (provider == 'Groq' and not groq_client):
        return f"ERROR: Selected {provider} client is not initialized for formatting. Check API keys."
        
    logger.info(f"Starting Part 3 formatting with {provider}...")
    
    # The raw text from Part 2 becomes the user prompt for the formatting model
    prompt = raw_resume_text
    
    try:
        # Uses the new FORMATTING_SYSTEM_INSTRUCTION
        formatted_text = _generate_content_with_config(
            provider=provider,
            model_name=model_name,
            system_instruction=FORMATTING_SYSTEM_INSTRUCTION, 
            prompt=prompt 
        ) 
        logger.info("Part 3 formatting successful.")
        return formatted_text
    except Exception as e:
        error_msg = f"LLM ERROR during Part 3 Formatting ({provider}): {e}"
        logger.error(error_msg, exc_info=True)
        return error_msg