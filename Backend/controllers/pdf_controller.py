import io
import PyPDF2
from fastapi import UploadFile
from config.db import get_connection
from pgvector.psycopg2 import register_vector
from embedding.embeddings import embed_text


# ---------------------------
# PDF → TEXT
# ---------------------------
def extract_text_from_pdf(pdf_bytes):
    pdf_file = io.BytesIO(pdf_bytes)  # IMPORTANT FIX
    reader = PyPDF2.PdfReader(pdf_file)
    text = ""

    for page in reader.pages:
        text += page.extract_text() or ""

    return text


# ---------------------------
# TEXT → CHUNKS
# ---------------------------
def chunk_text(text, chunk_size=800):
    words = text.split()
    chunks = []
    current = []

    for word in words:
        current.append(word)
        if len(current) >= chunk_size:
            chunks.append(" ".join(current))
            current = []

    if current:
        chunks.append(" ".join(current))

    return chunks


# ---------------------------
# STORE IN DATABASE
# ---------------------------
def save_chunks_to_db(filename, chunks):
    conn = get_connection()
    register_vector(conn)
    cur = conn.cursor()

    try:
        for chunk in chunks:
            emb = embed_text(chunk)

            cur.execute("""
                INSERT INTO pdfdata (filename, content, embedding)
                VALUES (%s, %s, %s);
            """, (filename, chunk, emb))

        conn.commit()

    finally:
        cur.close()
        conn.close()


# ---------------------------
# MAIN UPLOAD HANDLER
# ---------------------------
async def process_pdf_upload(file: UploadFile):
    pdf_bytes = await file.read()

    # Extract text
    text = extract_text_from_pdf(pdf_bytes)

    if not text.strip():
        return {"status": "error", "message": "No text found in PDF"}

    # Chunk text
    chunks = chunk_text(text)

    # Save chunks + embeddings
    save_chunks_to_db(file.filename, chunks)

    return {
        "status": "success",
        "filename": file.filename,
        "chunks_stored": len(chunks)
    }
