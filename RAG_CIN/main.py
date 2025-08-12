from fastapi import FastAPI
from app.api_routes import router

app = FastAPI(title="RAG Universitário")

# Adiciona suas rotas
app.include_router(router)

if __name__ == "__main__":
    import uvicorn
    print("🚀 Iniciando servidor RAG Universitário...")
    print("📚 Acesse a documentação em: http://localhost:8000/docs")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)