from fastapi import APIRouter

from src.api.services.update_service import update_tle_data

router = APIRouter(
    prefix="/update",
    tags=["Update"]
)


@router.post(
    "/",
    summary="Atualiza dados TLE",
    description="Realiza nova coleta dos dados orbitais do CelesTrak."
)
def update_data():
    return update_tle_data()
