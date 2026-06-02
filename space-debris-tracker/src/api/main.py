from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.api.routes.health_routes import router as health_router
from src.api.routes.debris_routes import router as debris_router
from src.api.routes.rag_routes import router as rag_router
from src.api.routes.update_routes import router as update_router

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

app.include_router(health_router)
app.include_router(debris_router)
app.include_router(rag_router)
app.include_router(update_router)


@app.get("/")
def root():
    return {
        "message": "Space Debris Tracker API",
        "status": "online",
        "docs": "/docs"
    }
