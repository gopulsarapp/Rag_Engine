import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

API_KEY = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise ValueError("No API Key found! Set GOOGLE_API_KEY or GEMINI_API_KEY")

genai.configure(api_key=API_KEY)


def get_models():
    """
    Controller: Fetch all Gemini models.
    """
    try:
        models = genai.list_models()
        return [
            {
                "name": m.name,
                "methods": m.supported_generation_methods
            }
            for m in models
        ]
    except Exception as e:
        raise Exception(str(e))
