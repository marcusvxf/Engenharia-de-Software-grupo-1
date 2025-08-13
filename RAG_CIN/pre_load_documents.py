import os
from pathlib import Path
from api_routes import (
    sanitize_filename,
    extract_text_from_pdf,
    clean_text,
    split_text,
    vector_store,
    documents_db,
)

# 🔹 Pasta com os documentos a serem pré-carregados
PRELOAD_FOLDER = "documents_to_preload"
Path(PRELOAD_FOLDER).mkdir(exist_ok=True)

def preload_documents():
    """
    Função para ler arquivos PDF de uma pasta e adicioná-los
    ao vector store.
    """
    print("Iniciando pré-carregamento de documentos...")

    # Certifique-se de que a pasta de uploads existe
    upload_folder = "documents"
    Path(upload_folder).mkdir(exist_ok=True)

    for filename in os.listdir(PRELOAD_FOLDER):
        if filename.lower().endswith(".pdf"):
            try:
                # Copia o arquivo para a pasta de uploads
                original_path = os.path.join(PRELOAD_FOLDER, filename)
                safe_filename = sanitize_filename(filename)
                file_path = os.path.join(upload_folder, safe_filename)

                with open(original_path, "rb") as src_file, open(file_path, "wb") as dest_file:
                    dest_file.write(src_file.read())

                print(f"Processando '{safe_filename}'...")

                extracted_text = clean_text(extract_text_from_pdf(file_path))
                if not extracted_text:
                    print(f"Aviso: O PDF '{safe_filename}' está vazio ou ilegível. Pulando.")
                    continue

                chunks = split_text(extracted_text)

                # Adiciona ao banco de dados local
                doc_id = str(len(documents_db) + 1)
                documents_db[doc_id] = {
                    "id": doc_id,
                    "title": safe_filename,
                    "content": extracted_text,
                }

                # Adiciona ao ChromaDB
                vector_store.add_texts(
                    texts=chunks,
                    metadatas=[{"id": doc_id, "title": safe_filename}] * len(chunks),
                )
                print(f"Documento '{safe_filename}' pré-carregado com sucesso.")

            except Exception as e:
                print(f"Erro ao processar o arquivo '{filename}': {str(e)}")

    print("Pré-carregamento concluído.")

if __name__ == "__main__":
    preload_documents()