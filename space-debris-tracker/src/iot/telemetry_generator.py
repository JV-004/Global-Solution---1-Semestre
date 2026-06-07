import random
from datetime import datetime


def generate_telemetry():

    return {
        "timestamp": datetime.utcnow().isoformat(),

        "object_id": random.randint(1000, 9999),

        "altitude_km": round(
            random.uniform(300, 1200), 2
        ),

        "velocity_kms": round(
            random.uniform(7.0, 8.5), 2
        ),

        "distance_to_nearest_object_km": round(
            random.uniform(0.5, 50),
            2
        )
    }
