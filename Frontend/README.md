# 📘 AI Document Processing Frontend (Next.js + Tailwind + Light/Dark Mode)

This frontend allows users to:
- Upload PDF documents  
- Ask AI questions using RAG (Retrieve + Gemini backend)  
- Switch between **light and dark themes**  
- Interact with a FastAPI backend for processing  

## 🚀 Tech Stack
- Next.js 14 (App Router)
- Tailwind CSS
- ShadCN UI
- React Query
- Axios

## 📂 Project Structure
frontend/
│── app/
│── components/
│── lib/
└── .env.local

## ⚙ Environment Variables
Create `.env.local`:

NEXT_PUBLIC_BACKEND_URL=http://localhost:8000

## ▶ Run App
npm install
npm run dev
