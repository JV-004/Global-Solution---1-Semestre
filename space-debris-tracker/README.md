# 🚀 Space Debris Tracker — Global Solution 2026.1 | FIAP | IA Fases 3 e 4

## Proposta

Sistema de monitoramento de debris orbitais que consome dados TLE reais do CelesTrak,
converte posições com SGP4, classifica risco de colisão com Machine Learning e responde
perguntas em português via agente RAG com base de conhecimento espacial.

## Tecnologias Utilizadas

- Python 3.10+
- sgp4 — propagação orbital
- scikit-learn — modelo RandomForest de risco de colisão
- LangChain + FAISS + OpenAI — agente RAG
- FastAPI — backend / API REST
- React Native — aplicativo mobile
- ESP32 / MQTT — camada IoT e Edge Computing
- Docker / Docker Compose — containerização

## Integrantes

| Nome     | RM   | Função                       |
| -------- | ---- | ---------------------------- |
| [Nome 1] | [RM] | Cientista de Dados & IA      |
| [Nome 2] | [RM] | Engenheiro de Sistemas & IoT |
| [Nome 3] | [RM] | Desenvolvedor de Interface   |
| [Nome 4] | [RM] | Documentador & Apresentador  |

## Estrutura do Projeto

```
space-debris-tracker/
├── data/               # Datasets e cache de dados TLE
├── docs/               # Documentação, diagramas, fluxogramas
├── frontend/           # Aplicativo mobile React Native
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       └── services/
├── notebooks/          # Jupyter Notebooks de análise exploratória
├── src/
│   ├── ai/             # TLE processor, collision model, RAG agent
│   ├── api/            # Backend FastAPI
│   │   ├── routes/
│   │   ├── models/
│   │   └── services/
│   └── iot/            # Código ESP32, MQTT, Edge Computing
├── tests/              # Testes automatizados
├── .env.example        # Variáveis de ambiente (template)
├── .gitignore
├── docker-compose.yml
└── requirements.txt
```

## Como Executar

### Pré-requisitos

- Python 3.10+
- Docker e Docker Compose (opcional)
- Chave de API OpenAI (para o agente RAG)

### Instalação

```bash
# Clonar o repositório
git clone https://github.com/JV-004/Global-Solution---1-Semestre.git
cd Global-Solution---1-Semestre/space-debris-tracker

# Criar e ativar ambiente virtual
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python -m venv venv
source venv/bin/activate

# Instalar dependências
pip install -r requirements.txt

# Configurar variáveis de ambiente
copy .env.example .env
# Editar .env com suas chaves
```

### Execução

```bash
# [Instruções de execução serão adicionadas pelo Integrante 2]
```

## Link do Vídeo

> [Adicionar link do YouTube ao final do projeto]

---

_FIAP — Global Solution 2026.1_
