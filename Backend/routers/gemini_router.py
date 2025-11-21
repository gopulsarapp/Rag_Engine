from fastapi import APIRouter
from dotenv import load_dotenv
import os
import google.generativeai as genai

load_dotenv()

API_KEY = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise ValueError("No API Key found! Set GOOGLE_API_KEY or GEMINI_API_KEY")

genai.configure(api_key=API_KEY)

router = APIRouter(prefix="/gemini", tags=["Gemini Models"])


@router.get("/models")
def list_gemini_models():
    """
    List all available Gemini models.
    """
    try:
        models = genai.list_models()
        result = [
            {"name": m.name, "methods": m.supported_generation_methods}
            for m in models
        ]
        return {"status": "success", "models": result}
    except Exception as e:
        return {"status": "error", "message": str(e)}
