from fastapi import FastAPI, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from datetime import datetime
import uuid

from .config import settings
from .anomaly_engine import AnomalyEngine
from .ai_service import AIService

app = FastAPI(title=settings.PROJECT_NAME, version=settings.VERSION)
engine = AnomalyEngine()
ai_service = AIService()

# In-memory store for demonstration
db_matrix: Dict[str, Dict[str, List[float]]] = {
    "İzmir": {
        "#Ulaşım": [28.0, 30.0, 31.0, 35.0, 33.0, 32.0, 34.0, 148.0] # Spikes at the end
    },
    "İstanbul": {
        "#Kültür": [40.0, 42.0, 45.0, 46.0, 44.0, 45.0, 47.0, 88.0] # Spikes at the end
    }
}

class IngestData(BaseModel):
    city: str
    topic: str
    content: str
    user_trust_score: float  # w_k
    media_type: Optional[str] = "text"

class PromptRequest(BaseModel):
    prompt: str
    target_city: str
    age_range: str
    budget: float

@app.get("/")
def read_root():
    return {"status": "active", "service": settings.PROJECT_NAME, "version": settings.VERSION}

@app.post("/api/ingest")
async def ingest_post(data: IngestData):
    """
    Ingest a new social media post, run BERTurk sentiment, update multi-axis matrix, and verify anomaly scores.
    """
    # 1. Run sentiment analysis
    analysis = await ai_service.analyze_sentiment_and_toxicity(data.content)
    
    # 2. Add to active window
    city = data.city
    topic = data.topic
    
    if city not in db_matrix:
        db_matrix[city] = {}
    if topic not in db_matrix[city]:
        db_matrix[city][topic] = [20.0] * 7 # populate mock base history
        
    db_matrix[city][topic].append(float(len(data.content) / 2)) # mock load spike
    
    # 3. Calculate rolling stats
    history = db_matrix[city][topic][:-1]
    current = db_matrix[city][topic][-1]
    
    mean, std = engine.calculate_rolling_stats(history)
    z_score = engine.calculate_z_score(current, mean, std)
    is_anomaly = engine.is_anomalous(z_score)
    
    response = {
        "id": str(uuid.uuid4()),
        "processed_at": datetime.utcnow(),
        "sentiment": analysis["sentiment_polarity"],
        "toxicity": analysis["toxicity_score"],
        "stats": {
            "mean": mean,
            "std": std,
            "current": current,
            "z_score": z_score,
            "is_anomaly": is_anomaly
        }
    }
    
    return response

@app.post("/api/campaigns/wizard")
async def campaign_wizard(req: PromptRequest):
    """
    Conversational AI target matching and ad copy generation.
    """
    ad_copy = await ai_service.generate_ad_copy(req.prompt, req.target_city, req.age_range)
    
    # Analyze best matching hour/ROAS (Mocking matrix scan logic)
    best_roas = 3.74
    if req.target_city == "İstanbul" and req.age_range == "18-30":
        best_roas = 3.82

    return {
        "campaign_id": str(uuid.uuid4()),
        "prompt": req.prompt,
        "matched_targets": {
            "city": req.target_city,
            "age_range": req.age_range,
            "optimal_window": "Cuma 18:30 - Pazar 21:30",
            "projected_roas": best_roas
        },
        "ad_copy": ad_copy
    }

@app.get("/api/anomalies/detect")
def detect_matrix_anomalies():
    """
    Runs tensor matrix scan to check Z-Scores above threshold.
    """
    anomalies = []
    for city in db_matrix:
        for topic in db_matrix[city]:
            volumes = db_matrix[city][topic]
            if len(volumes) < 2:
                continue
            history = volumes[:-1]
            current = volumes[-1]
            mean, std = engine.calculate_rolling_stats(history)
            z = engine.calculate_z_score(current, mean, std)
            if engine.is_anomalous(z):
                anomalies.append({
                    "city": city,
                    "topic": topic,
                    "current": current,
                    "mean": mean,
                    "z_score": z
                })
    return {"active_anomalies": anomalies}
