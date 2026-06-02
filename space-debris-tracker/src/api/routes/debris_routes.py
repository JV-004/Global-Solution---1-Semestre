from fastapi import APIRouter

from src.api.services.debris_service import (
    get_all_debris,
    get_high_risk_conjunctions
)

router = APIRouter(
    prefix="/debris",
    tags=["Debris"]
)


@router.get(
    "/",
    summary="Lista objetos orbitais",
    description="Retorna todos os objetos orbitais processados a partir dos dados TLE."
)
def list_debris():
    return get_all_debris()


@router.get(
    "/conjunctions",
    summary="Lista conjunções críticas",
    description="Retorna os pares de objetos com maior risco de colisão."
)
def list_conjunctions():
    return get_high_risk_conjunctions()
