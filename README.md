# Resume Transformer - Backend

FastAPI backend for the Resume Transformation tool.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt

Create .env file with your API keys:

env
GEMINI_API_KEY=your_key_here
GROQ_API_KEY=your_key_here
Run locally:

bash
uvicorn app:app --reload --port 8000