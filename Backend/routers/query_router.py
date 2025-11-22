from fastapi import APIRouter, Query
from pydantic import BaseModel
from typing import Optional
from controllers.query_controller import ask_question, ask_with_pdf_question

router = APIRouter(prefix="/query", tags=["Document Query"])

class QueryRequest(BaseModel):
    question: str

@router.post("/ask")
def ask_user_question(
    data: QueryRequest,
    pdf: Optional[str] = Query(None, description="PDF filename")
):
    """
    Ask a question and get an answer.
    If 'pdf' is provided as a query parameter, use that PDF for RAG.
    """
    # If pdf parameter exists → pass it to ask_question
    if pdf:
        answer = ask_with_pdf_question(data.question, pdf)
    else:
        answer = ask_question(data.question)

    return {"question": data.question, "pdf": pdf, "answer": answer}
