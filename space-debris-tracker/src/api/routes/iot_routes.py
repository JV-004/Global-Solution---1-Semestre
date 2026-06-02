from fastapi import APIRouter
from pydantic import BaseModel

from src.api.services.iot_service import process_telemetry

router = APIRouter(
    prefix="/iot",
    tags=["IoT"]
)


class TelemetryRequest(BaseModel):
    object_id: str
    altitude_km: float
    velocity_kms: float
    distance_to_nearest_object_km: float


@router.post(
    "/telemetry",
    summary="Recebe telemetria orbital",
    description="Recebe dados enviados por sensores orbitais simulados."
)
def receive_telemetry(data: TelemetryRequest):

    return process_telemetry(data.dict())
