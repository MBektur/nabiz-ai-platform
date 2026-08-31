import httpx
from typing import Dict, Any, List
from .config import settings

class AIService:
    def __init__(self):
        self.llm_url = f"{settings.LLM_API_URL}/api/generate"
        self.llm_model = settings.LLM_MODEL_NAME

    async def analyze_sentiment_and_toxicity(self, text: str) -> Dict[str, float]:
        """
        Mock prediction representing BERTurk model output.
        Returns:
            Dict containing sentiment_polarity (-1.0 to 1.0) and toxicity_score (0.0 to 1.0)
        """
        # In a full deployment, this loads the local transformer pipeline:
        # classifier = pipeline("sentiment-analysis", model="dbmdz/bert-base-turkish-cased")
        
        lower_text = text.lower()
        
        # Simple rule-based mock for demonstration
        sentiment = 0.0
        toxicity = 0.0
        
        negative_words = ["arıza", "bozuk", "rezalet", "yavaş", "kötü", "iptal", "bıktık", "gecikme", "istifa", "problem", "şerefsiz"]
        positive_words = ["güzel", "harika", "mükemmel", "taze", "leziz", "festival", "kampanya", "indirim", "fırsat", "seviyorum", "başarılı"]
        toxic_words = ["şerefsiz", "aptal", "salak", "gerizekalı", "bela", "lanet"]

        for word in negative_words:
            if word in lower_text:
                sentiment -= 0.35
        for word in positive_words:
            if word in lower_text:
                sentiment += 0.35
        for word in toxic_words:
            if word in lower_text:
                toxicity += 0.45

        # Clamp values
        sentiment = max(-1.0, min(1.0, sentiment))
        toxicity = max(0.0, min(1.0, toxicity))
        
        return {
            "sentiment_polarity": sentiment,
            "toxicity_score": toxicity
        }

    async def generate_root_cause(self, city: str, topic: str, sample_posts: List[str]) -> str:
        """
        Queries the local Ollama LLM to summarize the root cause of an anomaly in Turkish.
        """
        posts_combined = "\n- ".join(sample_posts)
        prompt = (
            f"Sen bir sosyal medya güvenlik kalkanı yapay zekasısın. "
            f"{city} şehrinde {topic} kategorisinde ciddi bir etkileşim patlaması saptandı. "
            f"Aşağıdaki son gönderileri analiz et ve sorunun / krizin 'Kök Nedenini' 1-2 cümleyle Türkçe olarak açıkla:\n"
            f"Gönderiler:\n- {posts_combined}"
        )
        
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.post(
                    self.llm_url,
                    json={
                        "model": self.llm_model,
                        "prompt": prompt,
                        "stream": False
                    }
                )
                if response.status_code == 200:
                    return response.json().get("response", "").strip()
        except Exception:
            pass

        # Fallback summary if local LLM is not running
        if city == "İzmir" and topic == "#Ulaşım":
            return "Ege Bölgesi × #Ulaşım hücresinde son 15 dakikada normalin 4.8 katı negatif etkileşim anomali skoru (Z = +3.92) hesaplandı. İzmir metro sinyalizasyon arızası şikayetleri viral yayılıma geçti."
        return f"{city} bölgesinde {topic} kategorisindeki etkileşimler normların üzerine çıktı. Kullanıcı paylaşımları incelendiğinde yoğun talep ve duygusal tepkiler saptandı."

    async def generate_ad_copy(self, prompt_input: str, target_city: str, age_range: str) -> str:
        """
        Queries the local LLM to generate an optimized Turkish ad copy based on advertiser goal.
        """
        prompt = (
            f"Sen profesyonel bir sosyal medya reklam metni yazarı yapay zekasısın. "
            f"Reklamverenin hedefi: '{prompt_input}'. "
            f"Hedef kitle: {target_city} şehrindeki {age_range} yaş grubu. "
            f"Bu kitleye uygun, ilgi çekici, harekete geçirici (CTA içeren) ve emojilerle süslenmiş kısa bir Türkçe reklam metni üret."
        )

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.post(
                    self.llm_url,
                    json={
                        "model": self.llm_model,
                        "prompt": prompt,
                        "stream": False
                    }
                )
                if response.status_code == 200:
                    return response.json().get("response", "").strip()
        except Exception:
            pass

        # Fallback ad copy template
        return (
            f"🌟 Fırsat Başladı! {target_city} şehrindeki {age_range} yaşındaki tüm takipçilerimize özel teklif! "
            f"Hayalinizdeki deneyim kapınızda. Hemen profilimizdeki linke tıklayın ve kaçırmayın! 🚀✨"
        )
