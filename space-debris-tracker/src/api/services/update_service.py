from src.ai.tle_processor import fetch_tle_data


def update_tle_data():

    dados = fetch_tle_data()

    return {
        "status": "success",
        "message": "Dados TLE atualizados com sucesso",
        "objects_updated": len(dados)
    }
