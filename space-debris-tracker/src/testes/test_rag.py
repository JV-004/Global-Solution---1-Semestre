from src.api.services.rag_service import ask_rag


def test_rag_response():

    resposta = ask_rag(
        "O que é a síndrome de Kessler?"
    )

    assert isinstance(resposta, str)
