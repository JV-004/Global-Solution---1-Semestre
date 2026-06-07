from fastapi import APIRouter

router = APIRouter(
    prefix="/health",
    tags=["Health"]
)


@router.get("/")
def health_check():
    return {
        "status": "online",
        "service": "Space Debris Tracker API",
        "message": "API disponível para receber requisições"
    }
