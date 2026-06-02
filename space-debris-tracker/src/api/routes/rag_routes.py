from fastapi import APIRouter
from pydantic import BaseModel

from src.api.services.rag_service import ask_rag

router = APIRouter(
    prefix="/rag",
    tags=["RAG"]
)


class QuestionRequest(BaseModel):
    question: str


@router.post("/ask")
def ask_question(request: QuestionRequest):

    resposta = ask_rag(request.question)

    return {
        "question": request.question,
        "answer": resposta
    }
