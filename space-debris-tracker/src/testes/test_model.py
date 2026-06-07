from src.ai.collision_model import predict_collision_risk


def test_collision_model():

    risco = predict_collision_risk(
        distance_km=3,
        relative_velocity=12
    )

    assert risco in [
        "baixo",
        "médio",
        "alto"
    ]
