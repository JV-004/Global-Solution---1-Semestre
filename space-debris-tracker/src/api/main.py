from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Space Debris Tracker API",
    description="API responsável por conectar dados orbitais, modelo de risco e dashboard.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "Space Debris Tracker API",
        "status": "online"
    }


@app.get("/health")
def health_check():
    return {
        "status": "online",
        "service": "api",
        "message": "API funcionando corretamente"
    }
