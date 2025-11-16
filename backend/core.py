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
        API_STATUS.append(f"✅ Gemini Client ({GEMINI_MODEL}) ready.")
    else:
        API_STATUS.append("⚠️ Gemini Client: Key missing in .env.")
except Exception as e:
    API_STATUS.append(f"❌ Gemini Client Error: {e}")

# Initialize Groq Client
try:
    GROQ_API_KEY = os.environ.get(GROQ_API_NAME)
    if GROQ_API_KEY:
        groq_client = Groq(api_key=GROQ_API_KEY)
        API_STATUS.append(f"✅ Groq Client ({GROQ_MODEL}) ready.")
    else:
        API_STATUS.append("⚠️ Groq Client: Key missing in .env.")
except Exception as e:
    API_STATUS.append(f"❌ Groq Client Error: {e}")

CLIENT_AVAILABLE = gemini_client is not None or groq_client is not None
FINAL_API_STATUS = "\n".join(API_STATUS)

if not CLIENT_AVAILABLE:
    logger.error("No LLM clients were successfully initialized. Please check your API keys.")

# --- SYSTEM INSTRUCTIONS ---
SYSTEM_INSTRUCTION = """
You are an expert resume transformer following an extremely strict, two-phase, human-in-the-loop process. You MUST adhere to all rules exactly.

--- GLOBAL MANDATORY RULES (Apply to ALL Parts) ---

1. No Hallucination
Do NOT invent, assume, imply, or infer any information that the user has not explicitly provided.

2. Structure and Style Preservation
You must preserve: All major resume sections, All internal sub-headings, All job entries, The order of segments (top to bottom), AND The Job Entry Introductory Paragraphs (if they existed originally).
You may NOT: Merge sections, remove any bullet, or omit a Job Entry Introductory Paragraph.
Do NOT insert any notes or commentary justifying the omission of content for brevity; all required content must be present.

3. JD Keyword Alignment
Use JD vocabulary only when a factual anchor exists in the resume/user input AND the JD term can be semantically aligned without implying new capabilities.

4. Reordering Restrictions
You may reorder bullets ONLY within the same sub-heading.

5. Synthesis Guardrail
Synthesize only by combining facts already present. No extrapolation.

--- PHASE 2 — PART 1 (MATCH/GAP ANALYSIS) RULES ---

- Task: Identify Strengths, Gaps, and 3-6 Clarification Questions.
- Output Format MUST be EXACTLY:

1. Strengths (Supported by Resume Text Only)
Bullet point
Bullet point
etc.

2. Gaps (Missing or Unstated Compared to JD)
Bullet point
Bullet point
etc.

3. Clarification Questions for the User
Ask 3–6 targeted questions designed ONLY to uncover additional factual content.

--- PHASE 2 — PART 2 (RESUME TRANSFORMATION) RULES ---

- Task: Execute the full resume rewrite using the Original Resume, JD, and User's Answers.
- Rules: Follow the V4 pipeline: JD keyword extraction, Targeted narrative rewriting, Skills reordering, Job entry introductory paragraph rewriting (retain structure and style), Sub-heading rephrasing, and Bullet rewrites.
- Output Format MUST be EXACTLY:

Part 2: Updated Resume (Final Draft)
(Provide the fully transformed resume here, with original structure and style preserved, rewritten according to all rules.)
The final output must consist ONLY of the text of the transformed resume. Do not include any commentary, notes, or justifications for editing.
"""

# --- Utility Functions ---
def docx_to_text(docx_file_path, doc_type):
    """Extracts text content from a .docx file using docx2txt."""
    if docx_file_path is None:
        return ""
    try:
        text = docx2txt.process(docx_file_path)
        text = '\n'.join([line.strip() for line in text.splitlines() if line.strip()])

        logger.info(f"--- Extracted {doc_type} Text (First 500 chars) ---\n{text[:500]}...")
        logger.debug(f"--- Full Extracted {doc_type} Text ---\n{text}")
        return text
    except Exception as e:
        error_msg = f"ERROR: Could not read DOCX file ({doc_type}). Details: {e}"
        logger.error(error_msg)
        return error_msg

# --- Core LLM Functions ---
def _generate_content_with_config(provider, model_name, prompt):
    """Internal function to call the LLM with system instruction config based on provider."""
    
    if provider == 'Gemini' and gemini_client:
        config = types.GenerateContentConfig(system_instruction=SYSTEM_INSTRUCTION)
        response = gemini_client.models.generate_content(
            model=model_name,
            contents=prompt,
            config=config
        )
        return response.text
    
    elif provider == 'Groq' and groq_client:
        messages = [
            {"role": "system", "content": SYSTEM_INSTRUCTION},
            {"role": "user", "content": prompt}
        ]
        chat_completion = groq_client.chat.completions.create(
            messages=messages,
            model=model_name,
        )
        return chat_completion.choices[0].message.content
        
    else:
        raise ValueError(f"Provider '{provider}' not available or client not initialized.")

def run_part_1_analysis(provider, resume_text, jd_text):
    """Calls the LLM to execute Phase 2 - Part 1 analysis."""
    if (provider == 'Gemini' and not gemini_client) or (provider == 'Groq' and not groq_client):
        return f"ERROR: Selected {provider} client is not initialized. Check API keys."

    model_name = GEMINI_MODEL if provider == 'Gemini' else GROQ_MODEL
    
    prompt = f"""
    --- EXECUTE PHASE 2 — PART 1 ---
    Generate the Match/Gap Analysis and Clarification Questions ONLY.

    [JOB DESCRIPTION START]
    {jd_text}
    [JOB DESCRIPTION END]

    [ORIGINAL RESUME START]
    {resume_text}
    [ORIGINAL RESUME END]
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
    """Calls the LLM to execute Phase 2 - Part 2 transformation."""
    if (provider == 'Gemini' and not gemini_client) or (provider == 'Groq' and not groq_client):
        return f"ERROR: Selected {provider} client is not initialized. Check API keys."
    
    model_name = GEMINI_MODEL if provider == 'Gemini' else GROQ_MODEL

    prompt = f"""
    --- EXECUTE PHASE 2 — PART 2 ---
    Perform the full resume transformation and output the final draft ONLY.

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

# end_of_file