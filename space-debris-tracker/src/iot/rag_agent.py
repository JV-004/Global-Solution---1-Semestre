"""
Agente RAG simplificado para responder perguntas sobre debris espaciais.
Versão sem dependência externa para manter a API funcionando.
"""


def answer_question(question: str) -> str:
    question_lower = question.lower()

    if "kessler" in question_lower:
        return (
            "A Síndrome de Kessler é um efeito em cascata em que colisões entre objetos "
            "em órbita geram novos fragmentos, aumentando o risco de novas colisões. "
            "Esse fenômeno pode tornar determinadas regiões orbitais perigosas ou inutilizáveis."
        )

    if "tle" in question_lower:
        return (
            "TLE significa Two-Line Element Set. É um formato usado para representar "
            "dados orbitais de satélites e debris. Esses dados podem ser processados pelo "
            "modelo SGP4 para estimar posição e velocidade orbital."
        )

    if "debris" in question_lower or "lixo espacial" in question_lower:
        return (
            "Debris orbital, ou lixo espacial, são objetos artificiais sem função ativa "
            "em órbita, como satélites desativados, partes de foguetes e fragmentos gerados "
            "por colisões ou explosões."
        )

    if "colisão" in question_lower or "risco" in question_lower:
        return (
            "O risco de colisão orbital pode ser estimado usando fatores como distância "
            "entre objetos, velocidade relativa e trajetória orbital. No projeto, essa análise "
            "é integrada ao modelo de Machine Learning."
        )

    return (
        "Sou o agente especialista do Space Debris Tracker. Posso responder perguntas sobre "
        "debris orbitais, Síndrome de Kessler, TLE, SGP4 e risco de colisão espacial."
    )
