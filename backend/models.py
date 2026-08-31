from datetime import datetime
from typing import Optional, List, Dict, Any
from uuid import UUID, uuid4
from sqlalchemy import Column, String, Float, Integer, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id: UUID = Column(String, primary_key=True, default=lambda: str(uuid4()))
    username: str = Column(String, unique=True, nullable=False)
    email: str = Column(String, unique=True, nullable=False)
    role: str = Column(String, nullable=False)  # admin | moderator | advertiser | creator
    trust_score: float = Column(Float, default=1.0)  # w_k value (0.0 to 1.0)
    is_verified: bool = Column(Boolean, default=False)
    created_at: datetime = Column(DateTime, default=datetime.utcnow)

    profile = relationship("Profile", back_populates="user", uselist=False)
    posts = relationship("Post", back_populates="author")
    campaigns = relationship("Campaign", back_populates="advertiser")


class Profile(Base):
    __tablename__ = "profiles"

    id: UUID = Column(String, primary_key=True, default=lambda: str(uuid4()))
    user_id: str = Column(String, ForeignKey("users.id"), nullable=False)
    display_name: str = Column(String, nullable=False)
    city: str = Column(String, nullable=True)  # Geographic location
    primary_language: str = Column(String, default="TR")
    preferences: Dict[str, Any] = Column(JSON, default=dict)

    user = relationship("User", back_populates="profile")


class TopicCategory(Base):
    __tablename__ = "topic_categories"

    id: UUID = Column(String, primary_key=True, default=lambda: str(uuid4()))
    slug: str = Column(String, unique=True, nullable=False)  # #ulasim, #teknoloji, etc.
    display_name: str = Column(String, nullable=False)
    is_active: bool = Column(Boolean, default=True)

    posts = relationship("Post", back_populates="category")


class Post(Base):
    __tablename__ = "posts"

    id: UUID = Column(String, primary_key=True, default=lambda: str(uuid4()))
    user_id: str = Column(String, ForeignKey("users.id"), nullable=False)
    category_id: str = Column(String, ForeignKey("topic_categories.id"), nullable=True)
    content: str = Column(Text, nullable=False)
    media_type: str = Column(String, default="text")  # text | image | video | reels
    sentiment_polarity: float = Column(Float, default=0.0)  # Φ(e_k) from BERTurk
    toxicity_score: float = Column(Float, default=0.0)  # Toxicity percentage
    city: str = Column(String, nullable=True)  # Post location
    created_at: datetime = Column(DateTime, default=datetime.utcnow)

    author = relationship("User", back_populates="posts")
    category = relationship("TopicCategory", back_populates="posts")
    interactions = relationship("Interaction", back_populates="post")


class Interaction(Base):
    __tablename__ = "interactions"

    id: UUID = Column(String, primary_key=True, default=lambda: str(uuid4()))
    post_id: str = Column(String, ForeignKey("posts.id"), nullable=False)
    user_id: str = Column(String, ForeignKey("users.id"), nullable=False)
    type: str = Column(String, nullable=False)  # like | retweet | comment | quote | click
    interaction_weight: float = Column(Float, default=1.0)
    created_at: datetime = Column(DateTime, default=datetime.utcnow)

    post = relationship("Post", back_populates="interactions")


class TensorSnapshot(Base):
    __tablename__ = "tensor_snapshots"

    id: UUID = Column(String, primary_key=True, default=lambda: str(uuid4()))
    axis_x: str = Column(String, nullable=False)  # e.g., Topic / Category
    axis_y: str = Column(String, nullable=False)  # e.g., City / Location
    window_start: datetime = Column(DateTime, nullable=False)
    window_end: datetime = Column(DateTime, nullable=False)
    window_size_min: int = Column(Integer, default=15)  # W duration
    rolling_mean: float = Column(Float, nullable=False)  # μ_i,j(W)
    rolling_std: float = Column(Float, nullable=False)   # σ_i,j(W)
    current_intensity: float = Column(Float, nullable=False)  # X_i,j(t)
    z_score: float = Column(Float, nullable=False)       # Z_i,j(t)
    raw_matrix_tensor: Dict[str, Any] = Column(JSON, nullable=False)  # Complete snapshot
    created_at: datetime = Column(DateTime, default=datetime.utcnow)


class AnomalyAlert(Base):
    __tablename__ = "anomaly_alerts"

    id: UUID = Column(String, primary_key=True, default=lambda: str(uuid4()))
    snapshot_id: str = Column(String, ForeignKey("tensor_snapshots.id"), nullable=False)
    alert_type: str = Column(String, nullable=False)  # CRISIS_SPIKE (Sense) | OPPORTUNITY_SPIKE (Ads)
    z_score_value: float = Column(Float, nullable=False)  # |Z| >= 3.0
    target_cell_x: str = Column(String, nullable=False)  # e.g. #ulasim
    target_cell_y: str = Column(String, nullable=False)  # e.g. Izmir
    severity: str = Column(String, default="MEDIUM")  # LOW | MEDIUM | HIGH | CRITICAL
    status: str = Column(String, default="DETECTED")  # DETECTED | UNDER_REVIEW | RESOLVED
    detected_at: datetime = Column(DateTime, default=datetime.utcnow)

    insights = relationship("AIRootCauseInsight", back_populates="alert")


class AIRootCauseInsight(Base):
    __tablename__ = "ai_root_cause_insights"

    id: UUID = Column(String, primary_key=True, default=lambda: str(uuid4()))
    alert_id: str = Column(String, ForeignKey("anomaly_alerts.id"), nullable=False)
    generated_summary: str = Column(Text, nullable=False)  # LLM Root Cause explanation in Turkish
    detected_trigger: str = Column(String, nullable=True)  # Trigger trigger word
    recommended_actions: List[str] = Column(JSON, default=list)  # e.g., ["Duyuru Yap", "Filtre Artir"]
    confidence_score: float = Column(Float, default=1.0)
    generated_at: datetime = Column(DateTime, default=datetime.utcnow)

    alert = relationship("AnomalyAlert", back_populates="insights")


class Campaign(Base):
    __tablename__ = "campaigns"

    id: UUID = Column(String, primary_key=True, default=lambda: str(uuid4()))
    advertiser_id: str = Column(String, ForeignKey("users.id"), nullable=False)
    target_category_id: str = Column(String, ForeignKey("topic_categories.id"), nullable=True)
    prompt_input: str = Column(Text, nullable=False)
    target_city: str = Column(String, nullable=True)
    target_age_range: str = Column(String, nullable=True)
    scheduled_start: Optional[datetime] = Column(DateTime, nullable=True)
    scheduled_end: Optional[datetime] = Column(DateTime, nullable=True)
    total_budget: float = Column(Float, nullable=False)
    generated_ad_copy: str = Column(Text, nullable=False)
    status: str = Column(String, default="DRAFT")  # DRAFT | ACTIVE | COMPLETED
    created_at: datetime = Column(DateTime, default=datetime.utcnow)

    advertiser = relationship("User", back_populates="campaigns")
    performance_metrics = relationship("AdPerformanceMetric", back_populates="campaign")


class AdPerformanceMetric(Base):
    __tablename__ = "ad_performance_metrics"

    id: UUID = Column(String, primary_key=True, default=lambda: str(uuid4()))
    campaign_id: str = Column(String, ForeignKey("campaigns.id"), nullable=False)
    impressions: int = Column(Integer, default=0)
    clicks: int = Column(Integer, default=0)
    conversions: int = Column(Integer, default=0)
    effective_cpm: float = Column(Float, default=0.0)
    achieved_roas: float = Column(Float, default=1.0)
    recorded_at: datetime = Column(DateTime, default=datetime.utcnow)

    campaign = relationship("Campaign", back_populates="performance_metrics")
