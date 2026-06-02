from src.ai.tle_processor import process_all_objects
from src.ai.collision_model import get_top_conjunctions


def get_all_debris():
    """
    Retorna todos os objetos orbitais processados.
    """
    return process_all_objects()


def get_high_risk_conjunctions():
    """
    Retorna os pares com maior risco de colisão.
    """
    objetos = process_all_objects()

    return get_top_conjunctions(
        objects_list=objetos,
        top_n=10
    )
