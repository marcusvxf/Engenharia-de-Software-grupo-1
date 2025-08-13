from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from pathlib import Path
from typing import Dict, Any
import shutil
import os
import unicodedata
import fitz
import re
from dotenv import load_dotenv

# LangChain e OpenAI
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_chroma import Chroma
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate

# Configuração inicial
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise RuntimeError("OPENAI_API_KEY não encontrado! Verifique seu .env.")

UPLOAD_FOLDER = "documents"
VECTOR_STORE_DIR = "vectorestore"
Path(UPLOAD_FOLDER).mkdir(exist_ok=True)
Path(VECTOR_STORE_DIR).mkdir(exist_ok=True)

# Inicializa embeddings e vetor
embedding_model = OpenAIEmbeddings(openai_api_key=OPENAI_API_KEY)
vector_store = Chroma(
    embedding_function=embedding_model,
    persist_directory=VECTOR_STORE_DIR
)

# LLM e prompt
llm = ChatOpenAI(openai_api_key=OPENAI_API_KEY)
template = """
Você é um assistente virtual que responde a perguntas usando apenas o contexto fornecido.
Responda EXCLUSIVAMENTE em português, mesmo que a pergunta esteja em outro idioma.
Se a resposta não estiver no contexto fornecido, diga exatamente: "Não tenho informações suficientes para responder a essa pergunta."

Contexto: {context}
Pergunta: {question}

Resposta em português:
"""
PROMPT = PromptTemplate(template=template, input_variables=["context", "question"])

qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    retriever=vector_store.as_retriever(),
    return_source_documents=True,
    chain_type_kwargs={"prompt": PROMPT}
)

# Modelo
class Query(BaseModel):
    text: str
    max_results: int = 3

# Funções
def sanitize_filename(filename: str) -> str:
    nfkd = unicodedata.normalize("NFKD", filename)
    return "".join([c for c in nfkd if not unicodedata.combining(c)]).replace(" ", "_")

def extract_text_from_pdf(file_path: str) -> str:
    """Extrai texto apenas de PDFs com texto digital."""
    text_parts = []
    with fitz.open(file_path) as pdf:
        for page in pdf:
            page_text = page.get_text()
            if page_text.strip():
                text_parts.append(page_text)
    return "".join(text_parts)

def clean_text(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()

def split_text(text: str, chunk_size=1000, chunk_overlap=200) -> list:
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap
    )
    return splitter.split_text(text)

documents_db = {}
router = APIRouter()

@router.post("/upload/", summary="Faz upload e indexa um PDF")
async def upload_document(file: UploadFile = File(...)) -> Dict[str, Any]:
    try:
        if not file.filename.lower().endswith(".pdf"):
            raise HTTPException(status_code=400, detail="Somente arquivos PDF são permitidos.")

        safe_filename = sanitize_filename(file.filename)
        file_path = os.path.join(UPLOAD_FOLDER, safe_filename)

        with open(file_path, "wb") as f:
            shutil.copyfileobj(file.file, f)

        extracted_text = clean_text(extract_text_from_pdf(file_path))
        if not extracted_text:
            raise HTTPException(status_code=400, detail="O PDF está vazio ou ilegível.")

        chunks = split_text(extracted_text)

        doc_id = str(len(documents_db) + 1)
        documents_db[doc_id] = {
            "id": doc_id,
            "title": safe_filename,
            "content": extracted_text
        }

        vector_store.add_texts(
            texts=chunks,
            metadatas=[{"id": doc_id, "title": safe_filename}] * len(chunks)
        )

        return {
            "message": f"Documento '{safe_filename}' salvo e indexado.",
            "id": doc_id,
            "preview": extracted_text[:300]
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao processar documento: {str(e)}")

@router.post("/search/", summary="Busca com geração de resposta (RAG)")
async def search_documents(query: Query) -> Dict[str, Any]:
    if not query.text.strip():
        raise HTTPException(status_code=400, detail="A consulta está vazia.")

    try:
        result = qa_chain(query.text)
        return {
            "query": query.text,
            "answer": result["result"],
            "sources": [
                {
                    "title": doc.metadata.get("title", "Desconhecido"),
                    "preview": doc.page_content[:300]
                }
                for doc in result["source_documents"]
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro na geração de resposta: {str(e)}")
