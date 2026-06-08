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

## 👩‍🏫 Professores:
### Tutor(a) 
- <a href="https://linkedin.com/in/caique-nonato">CAIQUE NONATO DA SILVA BEZERRA</a>
### Coordenador(a)
- <a href="https://www.linkedin.com/in/andregodoichiovato/">ANDRÉ GODOI CHIOVATO</a>

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

- Python 3.10+
- Node.js 18+
- Docker e Docker Compose (opcional)
- Chave de API OpenAI (para o agente RAG)
- Aplicativo **Expo Go** instalado no celular (Android ou iOS)

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

Editar o arquivo `.env` com suas credenciais:

```env
# Chave da API OpenAI (obrigatória para o agente RAG)
OPENAI_API_KEY=sk-...

# URL de dados TLE do CelesTrak (padrão já definido em tle_processor.py)
# CELESTRAK_URL=https://celestrak.org/SOCRATES/query.php?...

# Configuração do servidor FastAPI
API_HOST=0.0.0.0
API_PORT=8000

# Broker MQTT para telemetria IoT
MQTT_BROKER=broker.hivemq.com
MQTT_PORT=1883
MQTT_TOPIC=space_debris_tracker/telemetry
```

---

### 3. Executar o Backend

#### Opção A — Ambiente Virtual Python (recomendado para desenvolvimento)

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python -m venv venv
source venv/bin/activate

# Instalar dependências
pip install -r requirements.txt

# Iniciar o servidor FastAPI
uvicorn src.api.main:app --host 0.0.0.0 --port 8000 --reload
```

#### Opção B — Docker Compose

```bash
docker-compose up --build
```

O backend estará disponível em `http://localhost:8000`.
Documentação interativa: `http://localhost:8000/docs`

---

### 4. Executar o Publisher IoT (opcional)

Em um terminal separado (com o ambiente virtual ativado):

```bash
cd src/iot
python mqtt_publisher.py
```

O publisher enviará telemetria simulada ao broker HiveMQ a cada 5 segundos.

---

### 5. Executar o Frontend Mobile

```bash
cd frontend
```

#### Windows — liberar execução de scripts PowerShell

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

#### Configurar variável de ambiente do frontend

Editar (ou criar) o arquivo `frontend/.env`:

```env
# Usar o IP da sua rede local — NÃO usar localhost ao testar no celular físico
EXPO_PUBLIC_API_URL=http://192.168.X.X:8000
```

> Para descobrir seu IP local: `ipconfig` (Windows) ou `ifconfig` (Linux/Mac).
> O celular e o computador devem estar na **mesma rede Wi-Fi**.

#### Instalar dependências e iniciar

<details>
<summary>💻 Como executar localmente no Notebook (Windows / Mac)</summary>

### Passo 1 — Iniciar o Backend

```bash
cd space-debris-tracker
python -m uvicorn src.api.main:app --host 0.0.0.0 --port 8000
```

### Passo 2 — Iniciar o Frontend

```bash
cd frontend
npx expo start
```

</details>


<details>
<summary>📱 Como executar o app pelo Expo Go (Celular Físico)</summary>

O **Expo Go** é um aplicativo gratuito que permite visualizar e testar o Space Debris Tracker
diretamente no seu celular físico, sem precisar de emulador ou Android Studio.
O celular exibe o app em tempo real — qualquer alteração feita no código aparece
automaticamente na tela.

> 📖 Guia completo: [Expo Go — Documentação](docs/readme_expo_go.md)

---

### Pré-requisito

Celular e notebook conectados na **mesma rede Wi-Fi**.

---

### Passo 1 — Instalar o Expo Go no Celular

| Plataforma | Link |
|------------|------|
| Android | [Play Store — Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent) |
| iOS | App Store → buscar por **"Expo Go"** |

---

### Passo 2 — Configurar o IP do Notebook no Frontend

Descubra o IP local do notebook:

```bash
# Windows
ipconfig

# Mac / Linux
ifconfig
```

Procure pelo endereço em **"Endereço IPv4"** (ex: `192.168.1.10`).

Edite o arquivo `frontend/.env` substituindo `localhost` pelo IP encontrado:

```env
EXPO_PUBLIC_API_URL=http://192.168.1.10:8000
```

> ⚠️ **Nunca usar `localhost`** quando o acesso é feito pelo celular físico.
> O celular não conhece o `localhost` do notebook — precisa do IP real da rede.

---

### Passo 3 — Iniciar o Backend

Abra o primeiro terminal:

```bash
cd C:\FIAP_TRABALHOS\Global-Solution---1-Semestre-main\space-debris-tracker
python -m uvicorn src.api.main:app --host 0.0.0.0 --port 8000
```

> Deixe este terminal aberto e rodando.

---

### Passo 4 — Iniciar o Expo

Abra um segundo terminal:

```bash
# Windows — liberar execução de scripts PowerShell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

cd C:\FIAP_TRABALHOS\Global-Solution---1-Semestre-main\space-debris-tracker\frontend
npx expo start
```

Aguarde o QR Code aparecer no terminal.

---

### Passo 5 — Conectar o Celular

**Android:**
1. Abrir o app **Expo Go**
2. Tocar em **"Scan QR Code"**
3. Apontar para o QR Code no terminal

**iOS:**
1. Abrir o app de **Câmera** nativo
2. Apontar para o QR Code no terminal
3. Tocar na notificação que aparecer na tela

O Space Debris Tracker abrirá automaticamente no celular em poucos segundos. ✅

---

### Comandos úteis durante o uso

| Tecla no terminal | Ação |
|-------------------|------|
| `r` | Recarregar o app |
| `m` | Abrir menu de desenvolvedor |
| `w` | Abrir no navegador do notebook |
| `Ctrl + C` | Encerrar o servidor Expo |

---

### Solução de Problemas

| Problema | Solução |
|----------|---------|
| `Project is incompatible with this version of Expo Go` | Atualizar o projeto para o SDK compatível: `npx expo install expo@^54 --fix` |
| App abre mas não carrega os dados | Verificar se o backend está rodando e se o IP no `.env` está correto |
| QR Code não escaneia | Garantir que celular e notebook estão na mesma rede Wi-Fi |
| `npm não é reconhecido` no PowerShell | Executar `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` antes do `npm` |

</details>
```bash
npm install
npm start
```


#### Abrir no navegador 

```bash
# Instalar suporte web (apenas na primeira vez)
npx expo install react-native-web react-dom
#### 📱 Abrir no Celular

1. Instale o **Expo Go** no seu dispositivo
   - Android: [Play Store — Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - iOS: App Store → buscar por **"Expo Go"**
   - 📖 Guia completo: [Expo Go — Documentação](docs/readme_expo_go.md)

2. Escaneie o QR Code que aparece no terminal
   - **Android:** abrir o Expo Go → tocar em **"Scan QR Code"**
   - **iOS:** abrir o app de **Câmera** nativo → apontar para o QR Code
# No terminal do npm start, pressionar:
w
```

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

[▶️ Assistir Demonstração — Space Debris Tracker](docs/Space%20Debris%20Tracker.mp4)

> [Adicionar link do YouTube ao final do projeto]

---

## 📄 Licença

Projeto acadêmico desenvolvido para a **Global Solution 2026.1 — FIAP**
Curso de Inteligência Artificial — Fases 3 e 4

---

_FIAP | Inteligência Artificial — Fases 3 e 4 | Global Solution 2026.1_
