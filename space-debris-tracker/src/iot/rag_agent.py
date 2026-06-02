"""
Agente RAG simplificado para responder perguntas sobre debris espaciais.
Versão sem LangChain/OpenAI para manter a API funcionando localmente.
"""


def answer_question(question: str) -> str:
    question_lower = question.lower()

    if "kessler" in question_lower:
        return (
            "A Síndrome de Kessler é um efeito em cascata em que colisões entre objetos "
            "em órbita geram novos fragmentos, aumentando o risco de novas colisões."
        )

    if "tle" in question_lower:
        return (
            "TLE significa Two-Line Element Set. É um formato usado para representar "
            "dados orbitais de satélites e debris, podendo ser processado pelo modelo SGP4."
        )

    if "debris" in question_lower or "lixo espacial" in question_lower:
        return (
            "Debris orbital, ou lixo espacial, são objetos artificiais sem função ativa "
            "em órbita, como satélites desativados, partes de foguetes e fragmentos."
        )

    if "colisão" in question_lower or "risco" in question_lower:
        return (
            "O risco de colisão orbital pode ser estimado usando distância entre objetos, "
            "velocidade relativa e trajetória orbital."
        )

    return (
        "Sou o agente especialista do Space Debris Tracker. Posso responder perguntas "
        "sobre debris orbitais, TLE, SGP4, risco de colisão e Síndrome de Kessler."
    )
