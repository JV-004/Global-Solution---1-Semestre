# 🛰️ Space Debris Tracker — Global Solution 2026.1 | FIAP | IA Fases 3 e 4

> Sistema de monitoramento de debris orbitais em tempo real com classificação de risco por Machine Learning,
> agente RAG para consultas em português e aplicativo mobile para visualização e interação.

---

## 👥 Integrantes

| Nome | RM | Função |
|------|----|--------|
| João | RM565999 | Integrante 1 — Cientista de Dados & IA |
| Tayná Esteves | RM562491 | Integrante 2 — Engenheiro de Sistemas & IoT |
| Carlos Eduardo | RM566487 | Integrante 3 — Desenvolvedor de Interface |
| Endrew Alves | RM563646 | Integrante 4 — Documentador & Apresentador |

---

## 📌 Proposta

O **Space Debris Tracker** é uma solução tecnológica desenvolvida para a **Global Solution 2026.1** da FIAP,
com o tema **Economia Espacial**. O sistema aborda o crescente problema dos debris orbitais — fragmentos de
satélites, foguetes e outros objetos artificiais que orbitam a Terra sem função operacional e representam
risco real para missões espaciais ativas.

A solução integra quatro camadas tecnológicas:

- **IA & Dados:** consumo de dados TLE reais do CelesTrak, propagação orbital via SGP4 e classificação
  de risco de colisão com modelo RandomForest
- **Agente RAG:** sistema de perguntas e respostas em português sobre debris orbitais usando LangChain,
  FAISS e OpenAI GPT
- **Backend:** API REST com FastAPI expondo todos os dados e serviços ao frontend
- **IoT / Edge Computing:** telemetria orbital simulada via ESP32 e MQTT publicada no broker HiveMQ
- **Frontend Mobile:** aplicativo React Native (Expo) com dashboard interativo, visualizações de risco
  em tempo real e chat com o agente RAG

---

## 🧠 Arquitetura Geral

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND MOBILE                          │
│              React Native + Expo (SDK 54)                   │
│   Home · Dashboard · Detalhe · Chat RAG                     │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP / Axios
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   BACKEND — FastAPI                         │
│  /debris  /debris/conjunctions  /rag/ask  /iot/telemetry   │
│                     /health                                 │
└────┬──────────────────┬───────────────────┬────────────────┘
     │                  │                   │
     ▼                  ▼                   ▼
┌─────────┐      ┌────────────┐     ┌──────────────┐
│ TLE     │      │  RAG Agent │     │  IoT Service │
│Processor│      │ LangChain  │     │ MQTT/HiveMQ  │
│ + SGP4  │      │ FAISS+GPT  │     │   ESP32 sim  │
└────┬────┘      └─────┬──────┘     └──────┬───────┘
     │                 │                   │
     ▼                 ▼                   ▼
┌──────────┐   ┌─────────────┐   ┌─────────────────┐
│CelesTrak │   │  OpenAI API │   │ broker.hivemq   │
│ TLE Data │   │    (GPT)    │   │   .com:1883     │
└──────────┘   └─────────────┘   └─────────────────┘
     │
     ▼
┌──────────────────────┐
│  RandomForest Model  │
│  Classificação de    │
│  Risco de Colisão    │
└──────────────────────┘
```

---

## 🗂️ Estrutura do Repositório

```
space-debris-tracker/
│
├── data/                          # Cache local de dados TLE (tle_cache.json)
│
├── docs/                          # Documentação, diagramas, fluxogramas
│
├── frontend/                      # App mobile React Native + Expo
│   ├── app/
│   │   ├── _layout.tsx            # Root layout — fontes e navegação global
│   │   ├── index.tsx              # Home — lista de debris com filtro de risco
│   │   ├── dashboard.tsx          # Dashboard — gráficos e alertas
│   │   ├── agent.tsx              # Chat com agente RAG
│   │   └── debris/
│   │       └── [id].tsx           # Detalhe de debris específico
│   ├── components/
│   │   ├── DebrisCard.tsx         # Card com indicador de risco colorido
│   │   ├── RiskBadge.tsx          # Badge: baixo / médio / alto (com pulso no crítico)
│   │   ├── RiskChart.tsx          # Gráfico donut — distribuição de riscos
│   │   ├── ChatBubble.tsx         # Bolha de mensagem do chat RAG
│   │   └── LoadingSpinner.tsx     # Indicador de carregamento temático
│   ├── services/
│   │   └── api.ts                 # Centralização de todas as chamadas à API
│   ├── hooks/
│   │   └── useDebris.ts           # Hook com polling automático a cada 30s
│   ├── types/
│   │   └── index.ts               # Interfaces TypeScript do domínio
│   ├── constants/
│   │   └── theme.ts               # Design tokens: cores, fontes, espaçamentos
│   └── .env                       # EXPO_PUBLIC_API_URL (não commitado)
│
├── notebooks/                     # Jupyter Notebooks de análise exploratória
│
├── src/
│   ├── ai/
│   │   ├── tle_processor.py       # Busca TLE do CelesTrak, propaga com SGP4
│   │   ├── collision_model.py     # RandomForest — classificação de risco orbital
│   │   └── rag_agent.py           # Agente RAG: LangChain + FAISS + OpenAI
│   │
│   ├── api/
│   │   ├── main.py                # Entrada FastAPI — rotas e middlewares
│   │   ├── routes/
│   │   │   ├── debris_routes.py   # GET /debris  GET /debris/conjunctions
│   │   │   ├── rag_routes.py      # POST /rag/ask
│   │   │   ├── iot_routes.py      # POST /iot/telemetry
│   │   │   ├── health_routes.py   # GET /health
│   │   │   └── update_routes.py   # Atualização de dados TLE
│   │   └── services/
│   │       ├── debris_service.py  # Orquestra TLE processor + collision model
│   │       ├── rag_service.py     # Delega ao rag_agent.answer_question()
│   │       └── iot_service.py     # Processa telemetria e classifica risco
│   │
│   └── iot/
│       ├── mqtt_publisher.py      # Publica telemetria no broker HiveMQ
│       └── telemetry_generator.py # Gera dados simulados de sensores orbitais
│
├── tests/                         # Testes automatizados
├── .env.example                   # Template de variáveis de ambiente
├── .gitignore
├── docker-compose.yml
└── requirements.txt
```

---

## ⚙️ Tecnologias Utilizadas

### Backend & IA
| Tecnologia | Versão | Uso |
|------------|--------|-----|
| Python | 3.10+ | Linguagem principal do backend |
| FastAPI | 0.111.0 | API REST — rotas e middlewares |
| Uvicorn | 0.29.0 | Servidor ASGI |
| sgp4 | 2.23 | Propagação orbital a partir de dados TLE |
| scikit-learn | 1.4.2 | Modelo RandomForest de risco de colisão |
| LangChain | 0.2.1 | Orquestração do agente RAG |
| FAISS (faiss-cpu) | 1.8.0 | Busca vetorial na base de conhecimento |
| OpenAI SDK | 1.30.1 | LLM GPT para respostas do agente |
| paho-mqtt | 1.6.1 | Publicação de telemetria IoT via MQTT |
| pandas | 2.2.2 | Manipulação de dados orbitais |
| numpy | 1.26.4 | Operações vetoriais e geração de dados |
| python-dotenv | 1.0.1 | Gestão de variáveis de ambiente |
| Pydantic | 2.7.1 | Validação de schemas da API |

### Frontend Mobile
| Tecnologia | Versão | Uso |
|------------|--------|-----|
| React Native | — | Framework mobile multiplataforma |
| Expo SDK | 54 | Plataforma de desenvolvimento mobile |
| Expo Router | — | Navegação file-based entre telas |
| TypeScript | ~5.3.3 | Tipagem estática em todo o frontend |
| Axios | — | Chamadas HTTP à API FastAPI |
| React Native Chart Kit | — | Gráficos de distribuição de risco |
| Expo Linear Gradient | — | Efeitos visuais e gradientes |
| @expo-google-fonts/space-mono | — | Fonte monospace para dados técnicos |
| @expo-google-fonts/rajdhani | — | Fonte sci-fi para textos e labels |

### Infraestrutura
| Tecnologia | Uso |
|------------|-----|
| Docker / Docker Compose | Containerização do backend |
| HiveMQ Cloud | Broker MQTT para telemetria IoT |
| CelesTrak | Fonte de dados TLE reais de debris orbitais |
| Expo Go | Cliente mobile para desenvolvimento e demonstração |

---

## 🔌 API REST — Endpoints

Base URL: `http://<HOST>:8000`

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/` | Status da API |
| `GET` | `/health` | Health check |
| `GET` | `/debris` | Lista todos os objetos orbitais com dados TLE processados |
| `GET` | `/debris/conjunctions` | Top 10 pares de debris com maior risco de colisão |
| `POST` | `/rag/ask` | Consulta ao agente RAG em português |
| `POST` | `/iot/telemetry` | Recebe telemetria de sensores orbitais simulados |

### Exemplos de uso

**Listar debris:**
```bash
curl http://localhost:8000/debris
```

**Consultar agente RAG:**
```bash
curl -X POST http://localhost:8000/rag/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "Quais são os debris mais perigosos atualmente?"}'
```

Resposta:
```json
{
  "question": "Quais são os debris mais perigosos atualmente?",
  "answer": "Os debris mais perigosos atualmente são aqueles em órbita baixa terrestre (LEO)..."
}
```

**Enviar telemetria IoT:**
```bash
curl -X POST http://localhost:8000/iot/telemetry \
  -H "Content-Type: application/json" \
  -d '{
    "object_id": "DEB-1042",
    "altitude_km": 412.5,
    "velocity_kms": 7.8,
    "distance_to_nearest_object_km": 1.2
  }'
```

---

## 🚀 Como Executar

### Pré-requisitos

| Ferramenta | Versão Mínima | Download |
|------------|---------------|---------|
| Python | 3.10+ | [python.org](https://www.python.org/downloads/) |
| Node.js | 18+ | [nodejs.org](https://nodejs.org/) |
| Git | qualquer | [git-scm.com](https://git-scm.com/) |
| Expo Go (celular) | — | [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent) / [App Store](https://apps.apple.com/app/expo-go/id982107779) |
| Chave OpenAI API | — | [platform.openai.com](https://platform.openai.com/) *(para o agente RAG)* |

---

### 1. Clonar o Repositório

```bash
git clone https://github.com/JV-004/Global-Solution---1-Semestre.git
cd Global-Solution---1-Semestre/space-debris-tracker
```

---

### 2. Configurar Variáveis de Ambiente (Backend)

```bash
# Windows
copy .env.example .env

# Linux/Mac
cp .env.example .env
```

Abra o arquivo `.env` em qualquer editor de texto e preencha:

```env
# Chave da API OpenAI (obrigatória para o agente RAG)
OPENAI_API_KEY=sk-...

# Configuração do servidor FastAPI
API_HOST=0.0.0.0
API_PORT=8000

# Broker MQTT para telemetria IoT
MQTT_BROKER=broker.hivemq.com
MQTT_PORT=1883
MQTT_TOPIC=space_debris_tracker/telemetry
```

> ⚠️ **NUNCA** commite o arquivo `.env` no repositório. Ele já está listado no `.gitignore`.

---

## 💻 Executando Diretamente no Notebook (Windows ou Mac)

Esta seção cobre **todo o processo de execução local** em um laptop/notebook,
incluindo as soluções para os problemas mais comuns encontrados em ambientes Windows.

O sistema é composto por **dois processos independentes** que devem rodar simultaneamente
em **dois terminais separados**:

```
Terminal 1 → Servidor Backend (Python/FastAPI)
Terminal 2 → Aplicativo Frontend (Node.js/Expo)
```

---

### 🖥️ Terminal 1 — Servidor Backend (Python)

Abra o **Prompt de Comando** ou o **PowerShell** e execute os passos abaixo:

#### Passo 1 — Navegar até a pasta do projeto

```bash
cd C:\FIAP_TRABALHOS\Global-Solution---1-Semestre-main\space-debris-tracker
```

#### Passo 2 — Instalar todas as dependências Python

> ⚠️ **Atenção (Python 3.12+):** O arquivo `requirements.txt` usa `>=` nas versões
> para garantir compatibilidade com Python moderno. Caso o pip tente compilar um
> pacote e falhe, use o comando abaixo com `--legacy-peer-deps`.

```bash
python -m pip install -r requirements.txt
```

Se aparecer erro de compilação do `scikit-learn` ou outro pacote, execute:
```bash
python -m pip install -r requirements.txt --only-binary=:all:
```

#### Passo 3 — Iniciar o servidor FastAPI

> ⚠️ **Atenção (Windows):** O comando `uvicorn` pode não ser reconhecido pelo PowerShell
> mesmo após instalado. Use sempre `python -m uvicorn` para evitar o erro
> *"O termo 'uvicorn' não é reconhecido"*.

```bash
python -m uvicorn src.api.main:app --host 0.0.0.0 --port 8000
```

✅ O servidor está pronto quando você ver no terminal:
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

Você pode confirmar abrindo no navegador: **http://localhost:8000/health**

> 📎 **Dados de demonstração:** O sistema tenta buscar dados TLE em tempo real do CelesTrak.
> Caso o serviço externo esteja indisponível (erro 404), ele carrega automaticamente o
> arquivo de cache local em `data/tle_cache.json`, que contém 6 objetos reais pré-configurados:
> ISS, Cosmos 1408, Fengyun 1C, Iridium 33, SL-16 e Envisat.

**Deixe este terminal aberto e rodando.**

---

### 📱 Terminal 2 — Aplicativo Frontend (Expo)

Abra um **novo terminal** (mantenha o Terminal 1 do servidor ativo) e execute:

#### Passo 1 — Navegar até a pasta do frontend

```bash
cd C:\FIAP_TRABALHOS\Global-Solution---1-Semestre-main\space-debris-tracker\frontend
```

#### Passo 2 — Configurar a URL da API

Crie ou edite o arquivo `frontend/.env`:

```env
# Para testar no MESMO computador (versão web no navegador):
EXPO_PUBLIC_API_URL=http://localhost:8000

# Para testar no CELULAR FÍSICO (substitua pelo IP do seu notebook):
# EXPO_PUBLIC_API_URL=http://192.168.1.XX:8000
```

> 💡 Para descobrir o IP do seu notebook na rede local:
> - **Windows:** abra o PowerShell e digite `ipconfig` → procure "Endereço IPv4"
> - **Mac/Linux:** abra o Terminal e digite `ifconfig` → procure `inet` em `en0` ou `wlan0`
> O celular e o notebook devem estar conectados na **mesma rede Wi-Fi**.

#### Passo 3 — Instalar as dependências Node.js

```bash
npm install
```

Se aparecer erro de conflito de dependências, use:
```bash
npm install --legacy-peer-deps
```

#### Passo 4 — Instalar suporte para versão Web (apenas uma vez)

```bash
npm install react-dom react-native-web @expo/metro-runtime --legacy-peer-deps
```

> ⚠️ **Atenção (PowerShell):** Se o comando `npx` falhar com erro de *"execução de scripts
> desabilitada"*, use a variante `.cmd` para contornar a política de segurança do Windows:
> ```bash
> npx.cmd expo install react-dom react-native-web @expo/metro-runtime
> ```

#### Passo 5 — Iniciar o Expo

```bash
npm start
```

Ou, caso o `npm` também falhe no PowerShell:
```bash
npm.cmd start
```

---

### 🌐 Visualizando o Aplicativo

Quando o Expo iniciar, você verá um menu no terminal com um grande QR Code.
Escolha a forma de visualização conforme sua necessidade:

#### Opção A — No Navegador do Notebook *(mais fácil — recomendado para apresentação)*

No terminal do Expo, pressione a tecla **`w`**.

O aplicativo abrirá automaticamente no seu navegador padrão (Chrome, Edge, etc.)
sem precisar de celular ou emulador.

#### Opção B — No Celular Android (Expo Go)

1. Instale o aplicativo **Expo Go** na Play Store
2. Abra o Expo Go → toque em **"Scan QR code"**
3. Escaneie o QR Code exibido no terminal

#### Opção C — No Celular iOS (Camera)

1. Abra o aplicativo **Câmera** nativo do iPhone
2. Aponte para o QR Code exibido no terminal
3. Toque na notificação que aparece para abrir no Expo Go

#### Opção D — No Emulador Android (Android Studio)

Se o Android Studio estiver instalado e um dispositivo virtual estiver aberto:
pressione a tecla **`a`** no terminal do Expo.

---

### ✅ Verificação — Tudo funcionando

Após subir os dois servidores, confirme que está tudo OK:

| Verificação | O que checar | Resultado Esperado |
|-------------|-------------|-------------------|
| Backend ativo | `http://localhost:8000/health` no navegador | `{"status": "ok"}` |
| API de debris | `http://localhost:8000/debris` no navegador | Lista com 6 objetos JSON |
| App exibindo dados | Tela Home do aplicativo | Cards dos 6 debris orbitais visíveis |
| Filtros funcionando | Botões BAIXO / MÉDIO / ALTO / CRÍTICO | Lista filtra por nível de risco |
| Chat RAG | Tela do Agente, digitar uma pergunta | Resposta em português do agente |

---

### ❌ Problemas Comuns e Soluções

| Problema | Causa | Solução |
|----------|-------|---------|
| `uvicorn: comando não reconhecido` | Scripts do Python não estão no PATH do Windows | Use `python -m uvicorn` no lugar de `uvicorn` |
| `npx: execução de scripts desabilitada` | Política de segurança do PowerShell | Use `npx.cmd` ou `npm.cmd` no lugar de `npx`/`npm` |
| `ModuleNotFoundError: No module named 'sgp4'` | A instalação do pip foi interrompida por outro erro anterior | Rode `python -m pip install -r requirements.txt` novamente |
| `faiss-cpu==X.X.X: no matching distribution` | Versão pinada incompatível com Python 3.12+ | As versões no `requirements.txt` já usam `>=` — rode `pip install -r requirements.txt` novamente |
| `Nenhum debris encontrado` | CelesTrak indisponível + cache local ausente | O arquivo `data/tle_cache.json` já está no repositório com 6 objetos de demonstração |
| `ERESOLVE could not resolve` no npm | Conflito de versões entre pacotes Node | Adicione `--legacy-peer-deps` ao comando `npm install` |
| App abre mas não carrega dados | URL da API incorreta no `.env` do frontend | Confirme que `EXPO_PUBLIC_API_URL` aponta para o IP correto e porta 8000 |
| Erro de TLE format ao iniciar servidor | TLEs malformados no cache | O cache `data/tle_cache.json` já está corrigido com TLEs válidos |

---

### 3. Executar o Backend (forma simplificada)

```bash
python -m uvicorn src.api.main:app --host 0.0.0.0 --port 8000 --reload
```

O backend estará disponível em `http://localhost:8000`.
Documentação interativa Swagger: `http://localhost:8000/docs`

---

### 4. Executar o Publisher IoT (opcional)

Em um terminal separado (com o ambiente virtual ativado):

```bash
cd src/iot
python mqtt_publisher.py
```

O publisher enviará telemetria simulada ao broker HiveMQ a cada 5 segundos.

---

## 📱 Telas do Aplicativo

| Tela | Rota | Descrição |
|------|------|-----------|
| **Home** | `/` | Lista de todos os debris com filtro por nível de risco e polling automático a cada 30s |
| **Detalhe** | `/debris/[id]` | Dados orbitais completos, TLE raw, score de risco e histórico |
| **Dashboard** | `/dashboard` | Gráfico donut de distribuição de riscos, top 5 debris críticos e alertas |
| **Agente RAG** | `/agent` | Chat em português com o agente especialista em debris orbitais |

---

## 🎨 Design System

O app utiliza uma estética **espacial / sci-fi sombria**, inspirada em painéis de controle de missão orbital.

| Token | Valor | Uso |
|-------|-------|-----|
| `background` | `#020B18` | Fundo principal — azul-preto espacial |
| `surface` | `#071829` | Cards e superfícies |
| `accent` | `#00D4FF` | Ciano elétrico — elemento de destaque |
| `riskLow` | `#00E676` | Verde néon — risco baixo |
| `riskMedium` | `#FFD600` | Amarelo âmbar — risco médio |
| `riskHigh` | `#FF6D00` | Laranja alerta — risco alto |
| `riskCritical` | `#FF1744` | Vermelho crítico — risco crítico |
| Fonte display | `Space Mono` | IDs, coordenadas e dados TLE |
| Fonte corpo | `Rajdhani` | Textos, labels e navegação |

---

## 🤖 Componentes de IA

### TLE Processor (`src/ai/tle_processor.py`)
Busca dados TLE reais do **CelesTrak** via HTTP GET e os propaga com a biblioteca **SGP4**,
convertendo os elementos orbitais em posições e velocidades cartesianas (x, y, z, vx, vy, vz).
Em caso de falha na requisição, utiliza cache local em `data/tle_cache.json`.

### Collision Model (`src/ai/collision_model.py`)
Modelo **RandomForest** treinado com dados simulados que classifica o risco de colisão entre
pares de objetos orbitais em três categorias:

| Distância entre objetos | Risco |
|------------------------|-------|
| < 5 km | Alto |
| 5 km – 50 km | Médio |
| > 50 km | Baixo |

Features utilizadas: distância mínima (km) e velocidade relativa (km/s).

### Agente RAG (`src/ai/rag_agent.py`)
Agente baseado em **LangChain + FAISS + OpenAI GPT** com base de conhecimento embutida
sobre debris orbitais, Síndrome de Kessler, formato TLE, propagação SGP4 e iniciativas
de mitigação. Responde perguntas em **português** via endpoint `POST /rag/ask`.

---

## 📡 Camada IoT

### MQTT Publisher (`src/iot/mqtt_publisher.py`)
Publica telemetria orbital simulada no broker público **HiveMQ** (`broker.hivemq.com:1883`)
no tópico `space_debris_tracker/telemetry` a cada 5 segundos.

### Telemetry Generator (`src/iot/telemetry_generator.py`)
Gera payloads simulados com:
- `object_id` — ID aleatório do objeto
- `altitude_km` — altitude entre 300 e 1200 km
- `velocity_kms` — velocidade entre 7.0 e 8.5 km/s
- `distance_to_nearest_object_km` — distância ao objeto mais próximo (0.5 – 50 km)

### IoT Service (`src/api/services/iot_service.py`)
Classifica o risco a partir da distância ao objeto mais próximo:

| Distância | Risco |
|-----------|-------|
| < 2 km | Alto |
| 2 km – 10 km | Médio |
| > 10 km | Baixo |

---

## 🔒 Segurança

- Chaves de API (OpenAI) armazenadas exclusivamente em variáveis de ambiente no servidor
- O frontend **nunca** chama APIs de LLM diretamente — todas as requisições passam pelo backend FastAPI
- Arquivo `.env` incluído no `.gitignore` — nunca commitado no repositório
- A variável `EXPO_PUBLIC_API_URL` usa o IP da rede local e não expõe credenciais

---

## 📦 Dependências — requirements.txt

```
# Processamento orbital
sgp4==2.23
requests==2.31.0

# IA / ML
numpy==1.26.4
pandas==2.2.2
scikit-learn==1.4.2

# IA Generativa / RAG
openai==1.30.1
langchain==0.2.1
langchain-openai==0.1.8
langchain-community==0.2.1
faiss-cpu==1.8.0

# Configuração e ambiente
python-dotenv==1.0.1

# Backend / API
fastapi==0.111.0
uvicorn==0.29.0
pydantic==2.7.1

# Visualização
matplotlib==3.9.0
seaborn==0.13.2
plotly==5.22.0

# IoT / Comunicação
paho-mqtt==1.6.1
```

---

## 🔗 Link do Vídeo

> [Adicionar link do YouTube ao final do projeto]

---

## 📄 Licença

Projeto acadêmico desenvolvido para a **Global Solution 2026.1 — FIAP**
Curso de Inteligência Artificial — Fases 3 e 4

---

_FIAP | Inteligência Artificial — Fases 3 e 4 | Global Solution 2026.1_
