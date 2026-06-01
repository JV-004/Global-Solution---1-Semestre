"""
Módulo de modelo de predição de risco de colisão orbital
Usa RandomForest para classificar o risco entre pares de objetos espaciais
"""

import numpy as np
from itertools import combinations
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, confusion_matrix

# Mapeamento de índice numérico para rótulo de risco
LABELS = {0: "baixo", 1: "médio", 2: "alto"}


def calculate_minimum_distance(obj1: dict, obj2: dict) -> float:
    """
    Calcula a distância euclidiana entre dois objetos orbitais.

    Args:
        obj1: Dicionário com coordenadas x, y, z (em km)
        obj2: Dicionário com coordenadas x, y, z (em km)

    Retorna:
        Distância em km como float
    """
    dx = obj1["x"] - obj2["x"]
    dy = obj1["y"] - obj2["y"]
    dz = obj1["z"] - obj2["z"]
    return float((dx**2 + dy**2 + dz**2) ** 0.5)


def calculate_relative_velocity(obj1: dict, obj2: dict) -> float:
    """
    Calcula a velocidade relativa entre dois objetos orbitais.

    Args:
        obj1: Dicionário com velocidades vx, vy, vz (em km/s)
        obj2: Dicionário com velocidades vx, vy, vz (em km/s)

    Retorna:
        Velocidade relativa em km/s como float
    """
    dvx = obj1["vx"] - obj2["vx"]
    dvy = obj1["vy"] - obj2["vy"]
    dvz = obj1["vz"] - obj2["vz"]
    return float((dvx**2 + dvy**2 + dvz**2) ** 0.5)


def generate_training_data(n_samples: int = 1000) -> tuple[np.ndarray, np.ndarray]:
    """
    Gera dataset simulado para treinar o modelo de risco de colisão.

    Regras de classificação:
        - distância < 5 km       → alto risco (2)
        - distância entre 5-50 km → médio risco (1)
        - distância > 50 km      → baixo risco (0)

    Args:
        n_samples: Número de amostras a gerar

    Retorna:
        X: array de features (distância_km, velocidade_relativa_km_s)
        y: array de labels (0=baixo, 1=médio, 2=alto)
    """
    np.random.seed(42)

    # Gera distâncias com distribuição que cobre os três intervalos de risco
    distancias = np.concatenate([
        np.random.uniform(0.1, 4.9, n_samples // 3),       # alto risco
        np.random.uniform(5.0, 49.9, n_samples // 3),      # médio risco
        np.random.uniform(50.0, 500.0, n_samples - 2 *
                          (n_samples // 3))  # baixo risco
    ])

    # Velocidades relativas típicas em órbita (1–15 km/s) com ruído gaussiano
    velocidades = np.abs(np.random.normal(loc=7.5, scale=3.0, size=n_samples))

    # Adiciona ruído gaussiano às distâncias para maior realismo
    distancias += np.random.normal(0, 0.5, n_samples)
    distancias = np.clip(distancias, 0.01, None)  # garante valores positivos

    # Classifica com base nas regras de negócio
    labels = np.where(distancias < 5, 2,
                      np.where(distancias < 50, 1, 0))

    X = np.column_stack([distancias, velocidades])
    y = labels

    return X, y


def train_model() -> RandomForestClassifier:
    """
    Treina o modelo RandomForest com dados simulados e exibe métricas de avaliação.

    Retorna:
        Modelo RandomForestClassifier treinado
    """
    print("[Modelo] Gerando dados de treinamento...")
    X, y = generate_training_data(n_samples=1000)

    # Divide em treino e teste (80/20)
    X_treino, X_teste, y_treino, y_teste = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    print("[Modelo] Treinando RandomForestClassifier...")
    modelo = RandomForestClassifier(n_estimators=100, random_state=42)
    modelo.fit(X_treino, y_treino)

    # Avalia o modelo no conjunto de teste
    y_pred = modelo.predict(X_teste)

    acuracia = accuracy_score(y_teste, y_pred)
    precisao = precision_score(
        y_teste, y_pred, average="weighted", zero_division=0)
    recall = recall_score(y_teste, y_pred, average="weighted", zero_division=0)
    matriz = confusion_matrix(y_teste, y_pred)

    print(f"\n[Modelo] === Métricas de Avaliação ===")
    print(f"  Acurácia : {acuracia:.4f}")
    print(f"  Precisão : {precisao:.4f}")
    print(f"  Recall   : {recall:.4f}")
    print(f"\n[Modelo] Matriz de Confusão:")
    print(matriz)

    return modelo


# ── Inicialização do módulo ──────────────────────────────────────────────────
# O modelo é treinado uma única vez ao importar o módulo
print("[Modelo] Inicializando modelo de risco de colisão...")
_modelo_global = train_model()
print("[Modelo] Modelo pronto para uso.")
# ─────────────────────────────────────────────────────────────────────────────


def predict_collision_risk(distance_km: float, relative_velocity: float) -> str:
    """
    Prediz o nível de risco de colisão para um par de objetos.

    Args:
        distance_km: Distância entre os objetos em km
        relative_velocity: Velocidade relativa em km/s

    Retorna:
        String com o nível de risco: 'baixo', 'médio' ou 'alto'
    """
    try:
        features = np.array([[distance_km, relative_velocity]])
        predicao = _modelo_global.predict(features)[0]
        return LABELS[int(predicao)]
    except Exception as erro:
        print(f"[Modelo] Erro na predição: {erro}")
        return "desconhecido"


def get_top_conjunctions(objects_list: list[dict], top_n: int = 10) -> list[dict]:
    """
    Identifica os pares de objetos com maior risco de conjunção orbital.

    Args:
        objects_list: Lista de objetos com coordenadas XYZ e velocidades
        top_n: Número de pares de maior risco a retornar

    Retorna:
        Lista dos top_n pares ordenados por distância crescente,
        cada um contendo: obj1_name, obj2_name, distance_km,
        relative_velocity, risk_level
    """
    conjuncoes = []

    # Calcula todas as combinações de pares possíveis
    for obj1, obj2 in combinations(objects_list, 2):
        try:
            distancia = calculate_minimum_distance(obj1, obj2)
            velocidade_relativa = calculate_relative_velocity(obj1, obj2)
            risco = predict_collision_risk(distancia, velocidade_relativa)

            conjuncoes.append({
                "obj1_name": obj1["name"],
                "obj2_name": obj2["name"],
                "distance_km": round(distancia, 4),
                "relative_velocity": round(velocidade_relativa, 4),
                "risk_level": risco,
            })
        except Exception as erro:
            print(f"[Modelo] Erro ao calcular conjunção entre "
                  f"'{obj1.get('name')}' e '{obj2.get('name')}': {erro}")

    # Ordena por distância crescente (menor distância = maior risco)
    conjuncoes.sort(key=lambda c: c["distance_km"])

    print(
        f"[Modelo] {len(conjuncoes)} pares calculados. Retornando top {top_n}.")
    return conjuncoes[:top_n]
