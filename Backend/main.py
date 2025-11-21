from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.gemini_router import router as gemini_router
from routers.query_router import router as query_router
from routers.pdf_router import router as pdf_router
from dotenv import load_dotenv
import os

# Load .env file
load_dotenv()

app = FastAPI(title="AI Document API")

# Read front-end URL from environment
cors_origins = os.getenv("FRONTEND_URL", "*").split(",")

# ========= FIX CORS HERE ========= #
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# ================================= #

app.include_router(gemini_router)
app.include_router(query_router)
app.include_router(pdf_router)

@app.get("/")
def home():
    return {"message": "API is running!"}
