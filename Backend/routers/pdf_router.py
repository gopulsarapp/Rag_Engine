from fastapi import APIRouter, UploadFile, File
from controllers.pdf_controller import process_pdf_upload

router = APIRouter(prefix="/pdf", tags=["PDF Upload"])


@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    """
    Upload a PDF, extract text, chunk, embed and store in DB.
    """
    result = await process_pdf_upload(file)
    return result
