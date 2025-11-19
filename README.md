# AI Resume Transformer

A full-stack application that uses AI to analyze and transform resumes based on job descriptions, following a human-in-the-loop process.

## Project Structure
resume-transformer/
├── backend/ # FastAPI backend
│ ├── app.py # FastAPI routes
│ ├── core.py # Business logic
│ ├── requirements.txt # Python dependencies
│ ├── .env.example # Environment variables template
│ └── README.md # Backend-specific instructions
├── frontend/ # React frontend
│ ├── public/
│ ├── src/
│ ├── package.json
│ └── README.md
└── README.md # This file

text

## Prerequisites

- Python 3.8+
- Node.js 14+
- API keys for Gemini and/or Groq

## Backend Setup

### 1. Create Virtual Environment

#### Windows:
```cmd
# Create virtual environment
python -m venv venv

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Your terminal should show (venv) prefix
Linux/Mac:
bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Your terminal should show (venv) prefix
2. Install Dependencies
bash
# Navigate to backend directory
cd backend

# Install Python packages
pip install -r requirements.txt
3. Environment Configuration
bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your API keys
# Add your GEMINI_API_KEY and GROQ_API_KEY
4. Run Backend
bash
# Make sure you're in the backend directory and venv is activated
uvicorn app:app --reload --port 8000
The backend will be available at http://localhost:8000

Frontend Setup
1. Install Dependencies
bash
# Navigate to frontend directory (from project root)
cd frontend

# Install Node.js dependencies
npm install
2. Run Frontend
bash
# Start the development server
npm start
The frontend will be available at http://localhost:3000

Usage
Start Backend: Run the FastAPI server on port 8000

Start Frontend: Run the React app on port 3000

Access Application: Open http://localhost:3000 in your browser

Upload Files:

Select LLM provider (Gemini or Groq)

Upload your resume (.docx)

Upload job description (.docx)

Review Analysis: Get strengths, gaps, and clarification questions

Provide Answers: Answer the clarification questions

Generate Final Resume: Get your AI-transformed resume

API Keys
You need at least one of the following API keys:

Gemini API Key: Get from Google AI Studio

Groq API Key: Get from GroqCloud

Deployment
Backend (Render)
Root Directory: backend

Build Command: pip install -r requirements.txt

Start Command: uvicorn app:app --host 0.0.0.0 --port $PORT

Frontend (Render)
Root Directory: frontend

Build Command: npm install && npm run build

Start Command: serve -s build

Development Notes
Backend uses FastAPI with automatic Swagger docs at /docs

Frontend communicates with backend via REST API

File uploads are limited to .docx format

LLM calls may take 30-60 seconds depending on provider

Troubleshooting
Virtual Environment Issues
Windows: If venv\Scripts\activate doesn't work, try running PowerShell as Administrator

Linux/Mac: If python3 not found, install Python 3.8+ via package manager

API Key Issues
Ensure keys are correctly set in .env file

Verify keys have sufficient quotas

Check backend logs for authentication errors

File Upload Issues
Ensure files are in .docx format

Check file size (should be under 10MB)

Verify backend is running on port 8000