import io
import os
import pdfplumber
from fastapi import UploadFile
from config.db import get_connection
from pgvector.psycopg2 import register_vector
from embedding.embeddings import embed_text

UPLOAD_DIR = "uploads"

os.makedirs(UPLOAD_DIR, exist_ok=True)


# ---------------------------
# SAVE PDF INTO FOLDER
# ---------------------------
def save_pdf_to_folder(file: UploadFile):
    file_location = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_location, "wb") as f:
        f.write(file.file.read())

    return file_location


# ---------------------------
# PDF → TEXT (FAST, RELIABLE)
# ---------------------------
def extract_text_from_pdf(path):
    try:
        text = ""
        with pdfplumber.open(path) as pdf:
            for page in pdf.pages:
                text += page.extract_text() or ""
        return text
    except Exception as e:
        print("PDF ERROR:", str(e))
        return ""


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
        for c in chunks:
            emb = embed_text(c)
            emb = list(emb)  # ensure python list

            cur.execute("""
                INSERT INTO pdfdata (filename, content, embedding)
                VALUES (%s, %s, %s);
            """, (filename, c, emb))

        conn.commit()
    except Exception as e:
        conn.rollback()
        print("DB ERROR:", str(e))
    finally:
        cur.close()
        conn.close()


# ---------------------------
# MAIN UPLOAD HANDLER
# ---------------------------
async def process_pdf_upload(file: UploadFile):

    # 1️⃣ Save in uploads folder
    pdf_path = save_pdf_to_folder(file)

    # 2️⃣ Extract text
    text = extract_text_from_pdf(pdf_path)

    if not text.strip():
        return {"status": "error", "message": "No text found in PDF"}

    # 3️⃣ Chunk
    chunks = chunk_text(text)

    # 4️⃣ Save chunks + embeddings
    save_chunks_to_db(file.filename, chunks)

    return {
        "status": "success",
        "file_saved": pdf_path,
        "chunks_stored": len(chunks)
    }

def select_All_Pdf():
    try:
        conn = get_connection()
        register_vector(conn)
        cur = conn.cursor()

        # Return only unique filenames
        cur.execute("""
            SELECT DISTINCT filename 
            FROM pdfdata;
        """)

        rows = cur.fetchall()

        # Convert from [('a.pdf',), ('b.pdf',)] → ['a.pdf', 'b.pdf']
        filenames = [row[0] for row in rows]

        return filenames

    except Exception as e:
        print("DB ERROR:", str(e))
        return []

    finally:
        cur.close()
        conn.close()
