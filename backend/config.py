import os

class Settings:
    PROJECT_NAME: str = "NABIZ AI Platform"
    VERSION: str = "1.0.0"
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://nabiz_user:nabiz_pass@localhost:5432/nabiz_db")
    
    # Redis Cache & Message Queue
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    
    # AI models
    BERT_MODEL_NAME: str = "dbmdz/bert-base-turkish-cased"
    LLM_API_URL: str = os.getenv("LLM_API_URL", "http://localhost:11434")  # Ollama local endpoint
    LLM_MODEL_NAME: str = os.getenv("LLM_MODEL_NAME", "llama3:latest")

settings = Settings()
