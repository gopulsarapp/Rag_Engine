import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise ValueError("Missing GEMINI_API_KEY in environment")

genai.configure(api_key=API_KEY)


def embed_text(text: str):
    """
    Generate embeddings using Gemini's embedding model.
    """
    try:
        response = genai.embed_content(
            model="models/text-embedding-004",
            content=text
        )
        return response["embedding"]
    except Exception as e:
        raise Exception(f"Embedding Error: {e}")
