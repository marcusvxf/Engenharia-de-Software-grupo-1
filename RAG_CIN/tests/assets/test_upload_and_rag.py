from pathlib import Path
from fastapi.testclient import TestClient
from app.api_routes import router

client = TestClient(router)

def test_rag_integracao_real():
    # 1. Upload de PDF real
    test_file = Path("tests/assets/exemplo.pdf")
    with open(test_file, "rb") as f:
        response_upload = client.post(
            "/upload/",
            files={"file": ("exemplo.pdf", f, "application/pdf")}
        )

    assert response_upload.status_code == 200, f"Falhou upload: {response_upload.text}"
    data_upload = response_upload.json()
    assert "id" in data_upload
    assert "preview" in data_upload

    # 2. Consulta real ao RAG
    query = {"text": "Qual o prazo de matrícula?", "max_results": 3}
    response_search = client.post("/search/", json=query)

    assert response_search.status_code == 200, f"Falhou busca: {response_search.text}"
    data_search = response_search.json()

    # 3. Validar que a resposta não está vazia
    assert "answer" in data_search
    assert data_search["answer"].strip() != "", "RAG não retornou resposta"
    assert "source_documents" in data_search
    assert len(data_search["source_documents"]) > 0
