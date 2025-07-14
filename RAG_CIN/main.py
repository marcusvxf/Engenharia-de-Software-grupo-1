from fastapi import FastAPI
from app.api_routes import router

app = FastAPI(title="RAG Universitário")

# Adiciona suas rotas
app.include_router(router)
