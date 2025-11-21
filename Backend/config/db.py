import psycopg2
import psycopg2.extras
import os
from dotenv import load_dotenv

load_dotenv()

def get_connection():
    """
    Create and return a PostgreSQL connection using environment variables.
    """
    return psycopg2.connect(
        dbname=os.getenv("POSTGRES_DB"),
        user=os.getenv("POSTGRES_USER"),
        password=os.getenv("POSTGRES_PASSWORD"),
        host=os.getenv("POSTGRES_HOST"),
        port=os.getenv("POSTGRES_PORT", "5432"),
        sslmode="require"
    )

def init_db():
    """
    Initialize the database: create extension and table if not exists.
    """
    try:
        with get_connection() as conn:
            with conn.cursor() as cur:

               
                cur.execute("""
                    CREATE EXTENSION IF NOT EXISTS vector;

                    CREATE TABLE IF NOT EXISTS pdfdata (
                        id SERIAL PRIMARY KEY,
                        filename TEXT,
                        content TEXT,
                        embedding vector(1536)
                    );
                """)

            conn.commit()

        print("Database initialized successfully.")

    except Exception as e:
        print("Error initializing database:", e)
