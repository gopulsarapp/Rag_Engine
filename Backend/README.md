
# AI Document Processing Backend (FastAPI + PostgreSQL + Gemini)

This project is a complete backend system for:
- Uploading PDFs  
- Extracting text  
- Chunking text  
- Generating embeddings (Gemini `text-embedding-004`)  
- Storing chunks + embeddings in PostgreSQL (pgvector)  
- Asking questions using RAG (Retrieve + Gemini 2.5 Pro)

---

## 🚀 Features

### 1. PDF Upload API
- Upload PDF files  
- Extract text using **PyPDF2**  
- Chunk into equal-sized segments  
- Generate embeddings  
- Store in PostgreSQL `pdfdata` table  

### 2. Query API (RAG)
- Accept user questions  
- Find similar chunks using `pgvector`  
- Use Gemini 2.5 Pro to answer with context  

### 3. Gemini Models API
- List all available Gemini models  

---

## 📁 Project Structure

```
BackendPython/
│── main.py
│
├── routers/
│   ├── gemini_router.py
│   ├── query_router.py
│   ├── pdf_router.py
│   └── __init__.py
│
├── controllers/
│   ├── gemini_controller.py
│   ├── query_controller.py
│   ├── pdf_controller.py
│   └── __init__.py
│
├── embedding/
│   ├── embeddings.py
│   └── __init__.py
│
├── config/
│   ├── db.py
│   └── __init__.py
│
└── venv/
```

---

## 🛠 Installation

### 1. Create & Activate Virtual Environment

**Windows**
```
python -m venv venv
venv\Scripts\activate
```

**Mac/Linux**
```
python3 -m venv venv
source venv/bin/activate
```

---

### 2. Install Dependencies
```
pip install fastapi uvicorn psycopg2-binary pgvector numpy PyPDF2 python-multipart python-dotenv google-generativeai
```

---

## ▶ Run Server

Because your path is:

```
cd BackendPython
```

Run:

```
uvicorn main:app --reload
```

---

## 📌 API Endpoints

### **PDF Upload**
```
POST /pdf/upload
```
Form-data → `file`: (PDF file)

---

### **Ask Question**
```
POST /query/ask
```
Body:
```json
{
  "question": "your question"
}
```

---

### **List Gemini Models**
```
GET /gemini/models
```

---

## ⚙ Database Table Schema

```
CREATE TABLE IF NOT EXISTS pdfdata (
    id SERIAL PRIMARY KEY,
    filename TEXT,
    content TEXT,
    embedding vector(1536)
);
```

---

## ☁ Environment Variables

Create `.env` file:

```
POSTGRES_DB=yourdbname
POSTGRES_USER=youruser
POSTGRES_PASSWORD=yourpass
POSTGRES_HOST=yourhost
POSTGRES_PORT=5432
FRONTEND_URL=url_frontend_website 
GEMINI_API_KEY=your_api_key
```

---
