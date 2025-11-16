# Resume Transformer - Backend

FastAPI backend for AI-powered resume transformation.

## Quick Start

1. **Create and activate virtual environment** (see main README)
2. **Install dependencies**: `pip install -r requirements.txt`
3. **Set up environment variables** in `.env` file
4. **Run server**: `uvicorn app:app --reload --port 8000`

## API Documentation

Once running, visit:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## Environment Variables

Copy `.env.example` to `.env` and set:
- `GEMINI_API_KEY`: Your Google Gemini API key
- `GROQ_API_KEY`: Your Groq API key

## Endpoints

- `POST /api/analyze` - Analyze resume and job description
- `POST /api/transform` - Generate final transformed resume
- `GET /health` - Health check
- `GET /` - API info