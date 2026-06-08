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
Evolução do Projeto
Fase Inicial — Definição do Problema

O projeto nasceu da necessidade de monitorar objetos orbitais e detritos espaciais que representam riscos para satélites ativos, missões espaciais e futuras operações em órbita terrestre.

Segundo dados da NASA e da ESA, milhares de objetos orbitais são monitorados constantemente devido ao risco de colisões, podendo gerar novos fragmentos e aumentar ainda mais o problema conhecido como Síndrome de Kessler, onde colisões sucessivas tornam determinadas órbitas inutilizáveis.

Diante desse cenário, foi proposta a criação do Space Debris Tracker, uma plataforma capaz de monitorar objetos orbitais, avaliar riscos de colisão e fornecer informações inteligentes para análise.

Arquitetura da Solução

A solução foi dividida em cinco camadas principais:

1. Coleta de Dados Orbitais

Responsável pela obtenção das informações dos objetos espaciais.

Foram utilizados:

Dados TLE (Two-Line Element)
Bibliotecas de propagação orbital
Consultas a bases públicas de rastreamento espacial

Essa camada fornece informações como:

Altitude
Inclinação orbital
Velocidade
Período orbital
Identificação NORAD
2. Processamento Orbital

Após a coleta, os dados são processados para gerar métricas úteis ao sistema.

Entre os cálculos realizados:

Distâncias entre objetos
Velocidades relativas
Identificação de aproximações críticas
Características orbitais relevantes

Essa etapa transforma dados brutos em informações utilizáveis para análise de risco.

3. Inteligência Artificial

Com os dados processados, foi desenvolvido um modelo de Machine Learning responsável pela classificação automática dos riscos.

O sistema analisa características orbitais e produz uma classificação em diferentes níveis:

Baixo
Médio
Alto
Crítico

Durante os testes, o modelo apresentou excelente desempenho:

Acurácia: 100%
Precisão: 100%
Recall: 100%

A integração da IA permitiu automatizar a análise dos objetos monitorados.

4. API Inteligente

Para disponibilizar as informações para outras camadas do sistema, foi construída uma API utilizando FastAPI.

Principais funcionalidades:

Health Check

Verificação do estado da aplicação.

Objetos Monitorados

Consulta da lista de debris monitorados.

Conjunções Críticas

Identificação de aproximações perigosas.

Telemetria

Recebimento de informações simuladas para avaliação automática.

Atualização Orbital

Atualização dos dados utilizados pelo sistema.

Assistente Inteligente

Consulta em linguagem natural através do agente RAG.

Integração do Agente Inteligente (RAG)

Uma das evoluções mais relevantes do projeto foi a implementação de um sistema baseado em:

LangChain
OpenAI
FAISS

O agente foi treinado para responder perguntas relacionadas ao domínio espacial.

Exemplos:

Pergunta

O que são debris espaciais?

Resposta

Debris espaciais são fragmentos artificiais que permanecem em órbita sem função operacional, incluindo satélites desativados, estágios de foguetes e fragmentos resultantes de colisões.

Essa funcionalidade permite transformar dados técnicos em informações acessíveis para usuários não especialistas.

Sistema de Atualização Orbital

Durante o desenvolvimento, foi criada uma camada responsável pela atualização dos dados orbitais.

Objetivos:

Buscar informações atualizadas dos objetos monitorados.
Atualizar periodicamente os registros.
Garantir consistência das análises realizadas pela IA.

Essa funcionalidade prepara o sistema para futuras integrações com fontes de dados em tempo real.

Dashboard de Monitoramento

A evolução do projeto culminou na criação de uma interface visual para análise dos dados.

O dashboard permite:

Visualizar objetos monitorados.
Identificar níveis de risco.
Consultar detalhes orbitais.
Visualizar gráficos de distribuição de risco.
Destacar objetos críticos.
Consultar o agente inteligente.

A interface foi desenvolvida com foco em visualização rápida de ameaças orbitais e apoio à tomada de decisão.

Principais Desafios Enfrentados

Durante o desenvolvimento foram enfrentados diversos desafios técnicos:

Integração entre módulos

Garantir a comunicação entre:

Backend
Modelo de IA
Sistema RAG
Dashboard
Gerenciamento de dependências

Correção de incompatibilidades entre bibliotecas de IA e framework da API.

Estruturação do projeto

Organização em módulos independentes:

src/
 ├── ai/
 ├── api/
 ├── iot/
 ├── tests/

Facilitando manutenção e escalabilidade.

Validação dos serviços

Todos os endpoints foram testados através do Swagger e da execução local da aplicação.

Resultado Final

Ao final do desenvolvimento, o projeto entregou:

✅ Sistema de monitoramento orbital

✅ Classificação automática de risco com IA

✅ API REST funcional

✅ Atualização de dados orbitais

✅ Assistente inteligente baseado em RAG

✅ Dashboard para visualização dos dados

✅ Estrutura modular preparada para expansão futura

✅ Integração entre análise orbital, Machine Learning e IA Generativa
```

## Link do Vídeo

> [Adicionar link do YouTube ao final do projeto]

---

_FIAP — Global Solution 2026.1_
