import os
import numpy as np
from config.db import get_connection
from embedding.embeddings import embed_text
from pgvector.psycopg2 import register_vector
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")
MODEL_NAME = os.getenv("GENAI_MODEL", "models/gemini-2.5-pro")

if not API_KEY:
    raise ValueError("Missing GEMINI_API_KEY in environment")

genai.configure(api_key=API_KEY)


model = genai.GenerativeModel(MODEL_NAME)


def find_most_similar_chunk(query: str, k: int = 3):
    """
    Retrieve similar PDF chunks from DB using pgvector.
    """
    emb = embed_text(query)

    # Convert numpy to python list
    emb_list = emb.tolist() if isinstance(emb, np.ndarray) else emb

    conn = get_connection()
    register_vector(conn)
    cur = conn.cursor()

    try:
        cur.execute("""
            SELECT id, filename, content,
                   (embedding <-> %s::vector) AS distance
            FROM pdfdata
            ORDER BY distance ASC
            LIMIT %s;
        """, (emb_list, k))

        return cur.fetchall()

    finally:
        cur.close()
        conn.close()


def ask_question(question: str):
    """
    Generate an answer from Gemini using retrieved context.
    """
    rows = find_most_similar_chunk(question, k=3)

    if not rows:
        return "No matching documents found."

    # join all content together
    context = "\n\n---\n\n".join([r[2] for r in rows])

    prompt = f"""
Use ONLY the following PDF content to answer the user's question.
If the answer is not in the content, reply:
"I don't know based on the provided documents."

--- PDF Content ---
{context}
--- End of Content ---

User question: {question}
"""

    response = model.generate_content(prompt)

    return response.text





def findSelectPdf(query: str, pdfName: str, k: int = 3):
    """
    Retrieve similar chunks ONLY from a specific PDF (filtered by pdfName).
    """
    # normalize filename
    pdfName = pdfName.strip()
    pdfName = os.path.basename(pdfName)

    emb = embed_text(query)
    emb_list = emb.tolist() if isinstance(emb, np.ndarray) else emb

    conn = get_connection()
    register_vector(conn)
    cur = conn.cursor()

    try:
        cur.execute("""
            SELECT id, filename, content,
                   (embedding <-> %s::vector) AS distance
            FROM pdfdata
            WHERE filename = %s
            ORDER BY distance ASC
            LIMIT %s;
        """, (emb_list, pdfName, k))

        return cur.fetchall()

    finally:
        cur.close()
        conn.close()




def ask_with_pdf_question(question: str, pdfName: str):
    """
    Answer a question using ONLY the content from a specific PDF.
    """
    rows = findSelectPdf(question, pdfName, k=3)

    if not rows:
        return f"No matching content found in PDF: {pdfName}"

    # Combine content
    context = "\n\n---\n\n".join([r[2] for r in rows])

    prompt = f"""
Use ONLY the following PDF content to answer the user's question.
If the answer is not in the content, reply:
"I don't know based on the provided documents."

--- PDF Content ---
{context}
--- End of Content ---

User question: {question}
"""

    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return {"error": str(e)}
