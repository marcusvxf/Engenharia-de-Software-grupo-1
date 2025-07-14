from unittest.mock import patch
from pathlib import Path
from langchain.schema import Document
from fastapi.testclient import TestClient
from app.api_routes import router

client = TestClient(router)

# --- Upload de PDF válido ---
@patch("app.api_routes.vector_store.add_texts")
def test_upload_pdf(mock_add_texts):
    test_file = Path("tests/assets/exemplo.pdf")
    response = client.post(
        "/upload/",
        files={"file": ("exemplo.pdf", open(test_file, "rb"), "application/pdf")}
    )
    assert response.status_code == 200
    assert "id" in response.json()
    assert "preview" in response.json()

# --- Upload de arquivo não-PDF ---
def test_upload_not_pdf():
    response = client.post(
        "/upload/",
        files={"file": ("arquivo.txt", b"texto qualquer", "text/plain")}
    )
    assert response.status_code == 400
    assert "Somente arquivos PDF" in response.json()["detail"]

# --- Upload de PDF vazio ou ilegível ---
@patch("app.api_routes.extract_text_from_pdf", return_value="")
def test_upload_pdf_sem_texto(mock_extract):
    test_file = Path("tests/assets/exemplo.pdf")
    response = client.post(
        "/upload/",
        files={"file": ("exemplo.pdf", open(test_file, "rb"), "application/pdf")}
    )
    assert response.status_code == 400
    assert "O PDF está vazio ou ilegível" in response.json()["detail"]

# --- Upload com erro inesperado ---
@patch("app.api_routes.extract_text_from_pdf", side_effect=Exception("Falha inesperada"))
def test_upload_falha_geral(mock_extract):
    test_file = Path("tests/assets/exemplo.pdf")
    response = client.post(
        "/upload/",
        files={"file": ("exemplo.pdf", open(test_file, "rb"), "application/pdf")}
    )
    assert response.status_code == 500
    assert "Erro ao processar documento" in response.json()["detail"]

# --- Consulta RAG com texto válido ---
@patch("app.api_routes.qa_chain")
def test_query_rag(mock_qa_chain):
    mock_qa_chain.return_value = {
        "result": "Resposta simulada para teste",
        "source_documents": [
            Document(page_content="Texto 1", metadata={"title": "Doc 1"}),
            Document(page_content="Texto 2", metadata={"title": "Doc 2"}),
        ]
    }
    query = {"text": "Qual o prazo de matrícula?", "max_results": 3}
    response = client.post("/search/", json=query)
    assert response.status_code == 200
    assert response.json()["answer"] == "Resposta simulada para teste"

# --- Consulta RAG com texto vazio ---
def test_query_vazia():
    query = {"text": "   ", "max_results": 3}
    response = client.post("/search/", json=query)
    assert response.status_code == 400
    assert "consulta está vazia" in response.json()["detail"]
