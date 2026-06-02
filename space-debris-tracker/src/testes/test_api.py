from fastapi.testclient import TestClient
from src.api.main import app

client = TestClient(app)


def test_root():
    response = client.get("/")

    assert response.status_code == 200
    assert response.json()["status"] == "online"


def test_health():
    response = client.get("/health/")

    assert response.status_code == 200
    assert response.json()["status"] == "online"


def test_debris():
    response = client.get("/debris/")

    assert response.status_code == 200


def test_conjunctions():
    response = client.get("/debris/conjunctions")

    assert response.status_code == 200
