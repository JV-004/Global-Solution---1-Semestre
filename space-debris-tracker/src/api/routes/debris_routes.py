from fastapi import APIRouter

from src.api.services.debris_service import (
    get_all_debris,
    get_high_risk_conjunctions
)

router = APIRouter(
    prefix="/debris",
    tags=["Debris"]
)


@router.get("/")
def list_debris():
    return get_all_debris()


@router.get("/conjunctions")
def list_conjunctions():
    return get_high_risk_conjunctions()
