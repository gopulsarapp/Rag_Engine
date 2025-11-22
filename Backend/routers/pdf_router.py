from fastapi import APIRouter, UploadFile, File
from controllers.pdf_controller import process_pdf_upload, select_All_Pdf

router = APIRouter(prefix="/pdf", tags=["PDF Upload"])


@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    """
    Upload a PDF, extract text, chunk, embed and store in DB.
    """
    result = await process_pdf_upload(file)
    return result

@router.get("/getAllPdf")
async def get_all_pdf():
    allpdffilename = select_All_Pdf()  # no await
    return {"message": "success", "data": allpdffilename}