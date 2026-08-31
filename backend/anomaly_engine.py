import math
from typing import List, Dict, Any, Tuple, Optional

class AnomalyEngine:
    def __init__(self, epsilon: float = 1e-5, z_threshold: float = 3.0):
        self.epsilon = epsilon
        self.z_threshold = z_threshold

    def calculate_rolling_stats(self, historical_volumes: List[float]) -> Tuple[float, float]:
        """
        Calculate rolling mean (mu) and sample standard deviation (sigma) for a window.
        Uses formula:
        mu = 1/|W| * sum(X_t)
        sigma = sqrt( 1/(|W|-1) * sum((X_t - mu)^2) )
        """
        w_size = len(historical_volumes)
        if w_size == 0:
            return 0.0, 0.0
        
        # Calculate mean
        mean = sum(historical_volumes) / w_size
        
        if w_size <= 1:
            return mean, 0.0

        # Calculate standard deviation
        variance_sum = sum((x - mean) ** 2 for x in historical_volumes)
        std_dev = math.sqrt(variance_sum / (w_size - 1))
        
        return mean, std_dev

    def calculate_z_score(self, current_val: float, mean: float, std_dev: float) -> float:
        """
        Calculate Z-Score using standard formula with epsilon safety factor:
        Z = (X_t - mu) / (sigma + epsilon)
        """
        return (current_val - mean) / (std_dev + self.epsilon)

    def is_anomalous(self, z_score: float) -> bool:
        """
        Anomalous status returns True if absolute Z-Score matches or exceeds threshold (3.0).
        """
        return abs(z_score) >= self.z_threshold

    def project_tensor_cell(self, interactions: List[Dict[str, Any]]) -> float:
        """
        Computes the Multi-Axis Coordinator projection formula:
        M_i,j(t) = sum_{k=1}^{N(t)} w_k * I(x_k=i, y_k=j) * sentiment_polarity(e_k)
        
        Where:
        - w_k is user trust score (0 <= w_k <= 1)
        - sentiment_polarity is sentiment scope [-1, +1]
        """
        weighted_sum = 0.0
        for item in interactions:
            trust_weight = item.get("user_trust_score", 1.0)  # w_k
            sentiment = item.get("sentiment_polarity", 0.0)   # Phi(e_k)
            
            # w_k * Phi(e_k)
            weighted_sum += trust_weight * sentiment
            
        return weighted_sum

    def dbscan_density_clustering(
        self, 
        anomaly_points: List[Tuple[float, float]], 
        eps: float = 1.5, 
        min_samples: int = 2
    ) -> List[List[Tuple[float, float]]]:
        """
        Simple pure Python implementation of DBSCAN to isolate real crisis groups from bot noise.
        Matches coordinates to cluster nodes. Returns list of clusters.
        """
        def get_neighbors(p_idx: int) -> List[int]:
            neighbors = []
            p = anomaly_points[p_idx]
            for idx, q in enumerate(anomaly_points):
                # Euclidean distance
                dist = math.sqrt((p[0] - q[0])**2 + (p[1] - q[1])**2)
                if dist <= eps:
                    neighbors.append(idx)
            return neighbors

        n_points = len(anomaly_points)
        visited = [False] * n_points
        labels = [-1] * n_points  # -1 = Noise
        cluster_id = 0

        for i in range(n_points):
            if visited[i]:
                continue
            
            visited[i] = True
            neighbors = get_neighbors(i)
            
            if len(neighbors) < min_samples:
                labels[i] = -1  # Noise / Bot activity
            else:
                # Expand cluster
                labels[i] = cluster_id
                queue = list(neighbors)
                if i in queue:
                    queue.remove(i)
                
                idx = 0
                while idx < len(queue):
                    neighbor_idx = queue[idx]
                    if not visited[neighbor_idx]:
                        visited[neighbor_idx] = True
                        n_neighbors = get_neighbors(neighbor_idx)
                        if len(n_neighbors) >= min_samples:
                            queue.extend([n for n in n_neighbors if n not in queue])
                    
                    if labels[neighbor_idx] == -1:
                        labels[neighbor_idx] = cluster_id
                    
                    idx += 1
                cluster_id += 1

        # Group by cluster labels (excluding noise)
        clusters: Dict[int, List[Tuple[float, float]]] = {}
        for idx, label in enumerate(labels):
            if label == -1:
                continue
            if label not in clusters:
                clusters[label] = []
            clusters[label].append(anomaly_points[idx])
            
        return list(clusters.values())
