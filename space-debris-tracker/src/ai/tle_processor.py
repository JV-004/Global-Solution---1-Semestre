"""
Módulo de processamento de dados TLE (Two-Line Element)
Responsável por buscar, converter e processar dados orbitais do CelesTrak
"""

import json
import os
import requests
from datetime import datetime, timezone
from sgp4.api import Satrec, jday
from dotenv import load_dotenv

# Carrega variáveis de ambiente do arquivo .env
load_dotenv()

# Caminho para o cache local de dados TLE
CACHE_PATH = os.path.join(os.path.dirname(
    __file__), "../../data/tle_cache.json")

# Raio médio da Terra em km
EARTH_RADIUS_KM = 6371.0


def fetch_tle_data() -> list[dict]:
    """
    Busca dados TLE do CelesTrak via requisição HTTP GET.
    Em caso de falha, utiliza o cache local como fallback.

    Retorna:
        Lista de dicionários com 'name', 'tle_line1' e 'tle_line2'
    """
    # URL base do CelesTrak — pode ser sobrescrita pelo .env
    url = os.getenv(
        "CELESTRAK_URL",
        "https://celestrak.org/SOCRATES/query.php?CATNR=25544&DAYS=3&MAX=10&LIMIT=10&FORMAT=tle"
    )

    print(f"[TLE] Buscando dados em: {url}")

    try:
        resposta = requests.get(url, timeout=15)
        resposta.raise_for_status()

        linhas = [l.strip()
                  for l in resposta.text.strip().splitlines() if l.strip()]

        objetos = []
        # Cada objeto TLE ocupa 3 linhas: nome, linha1, linha2
        for i in range(0, len(linhas) - 2, 3):
            objetos.append({
                "name": linhas[i],
                "tle_line1": linhas[i + 1],
                "tle_line2": linhas[i + 2],
            })

        print(f"[TLE] {len(objetos)} objetos obtidos do CelesTrak.")

        # Salva cache local com timestamp
        _salvar_cache(objetos)

        return objetos

    except Exception as erro:
        print(f"[TLE] Falha na requisição: {erro}. Carregando cache local...")
        return _carregar_cache()


def _salvar_cache(objetos: list[dict]) -> None:
    """
    Salva os dados TLE em cache local com timestamp.

    Args:
        objetos: Lista de objetos TLE a serem salvos
    """
    try:
        os.makedirs(os.path.dirname(CACHE_PATH), exist_ok=True)
        payload = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "objects": objetos
        }
        with open(CACHE_PATH, "w", encoding="utf-8") as arquivo:
            json.dump(payload, arquivo, ensure_ascii=False, indent=2)
        print(f"[TLE] Cache salvo em: {CACHE_PATH}")
    except Exception as erro:
        print(f"[TLE] Erro ao salvar cache: {erro}")


def _carregar_cache() -> list[dict]:
    """
    Carrega dados TLE do cache local.

    Retorna:
        Lista de objetos TLE ou lista vazia se o cache não existir
    """
    try:
        with open(CACHE_PATH, "r", encoding="utf-8") as arquivo:
            dados = json.load(arquivo)
        objetos = dados.get("objects", [])
        print(f"[TLE] {len(objetos)} objetos carregados do cache local.")
        return objetos
    except Exception as erro:
        print(f"[TLE] Erro ao carregar cache: {erro}. Retornando lista vazia.")
        return []


def convert_to_xyz(tle_line1: str, tle_line2: str) -> dict:
    """
    Converte um TLE em coordenadas cartesianas XYZ usando a biblioteca sgp4.

    Args:
        tle_line1: Primeira linha do TLE
        tle_line2: Segunda linha do TLE

    Retorna:
        Dicionário com posição (x, y, z em km), velocidade (vx, vy, vz em km/s),
        altitude_km e timestamp do cálculo
    """
    # Cria o satélite a partir das linhas TLE
    satelite = Satrec.twoline2rv(tle_line1, tle_line2)

    # Obtém o momento atual em formato Julian Date
    agora = datetime.now(timezone.utc)
    jd, fr = jday(agora.year, agora.month, agora.day,
                  agora.hour, agora.minute, agora.second + agora.microsecond / 1e6)

    # Propaga a órbita para o instante atual
    erro, posicao, velocidade = satelite.sgp4(jd, fr)

    if erro != 0:
        raise ValueError(f"Erro na propagação SGP4 (código {erro})")

    x, y, z = posicao
    vx, vy, vz = velocidade

    # Calcula altitude subtraindo o raio terrestre da distância ao centro
    distancia_ao_centro = (x**2 + y**2 + z**2) ** 0.5
    altitude_km = distancia_ao_centro - EARTH_RADIUS_KM

    return {
        "x": x,
        "y": y,
        "z": z,
        "vx": vx,
        "vy": vy,
        "vz": vz,
        "altitude_km": altitude_km,
        "timestamp": agora.isoformat(),
    }


def process_all_objects() -> list[dict]:
    """
    Busca todos os objetos TLE e converte cada um para coordenadas XYZ.

    Retorna:
        Lista de dicionários com nome do objeto + coordenadas XYZ completas
    """
    objetos_tle = fetch_tle_data()

    resultados = []
    sucessos = 0
    falhas = 0

    for obj in objetos_tle:
        try:
            coordenadas = convert_to_xyz(obj["tle_line1"], obj["tle_line2"])
            resultados.append({
                "name": obj["name"],
                **coordenadas
            })
            sucessos += 1
        except Exception as erro:
            print(
                f"[TLE] Falha ao processar '{obj.get('name', 'desconhecido')}': {erro}")
            falhas += 1

    print(
        f"[TLE] Processamento concluído: {sucessos} sucessos, {falhas} falhas.")
    return resultados
