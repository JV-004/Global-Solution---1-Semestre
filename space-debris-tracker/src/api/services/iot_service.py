def process_telemetry(data):

    distance = data["distance_to_nearest_object_km"]

    if distance < 2:
        risk = "alto"

    elif distance < 10:
        risk = "medio"

    else:
        risk = "baixo"

    return {
        "object_id": data["object_id"],
        "risk_level": risk,
        "telemetry_received": True
    }
