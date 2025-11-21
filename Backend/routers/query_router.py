from fastapi import APIRouter
from pydantic import BaseModel
from controllers.query_controller import ask_question

router = APIRouter(prefix="/query", tags=["Document Query"])


class QueryRequest(BaseModel):
    question: str


@router.post("/ask")
def ask_user_question(data: QueryRequest):
    """
    Ask a question and get an answer using PDF + Gemini RAG.
    """
    answer = ask_question(data.question)
    return {"question": data.question, "answer": answer}
