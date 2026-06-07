# 🌌 Space Debris Tracker
## Global Solution 2026.1 - Economia Espacial — Desafio Tecnológico | FIAP

### 🚀 Visão Geral do Projeto
O **Space Debris Tracker** é uma solução tecnológica focada no monitoramento, análise preditiva e mitigação dos riscos associados aos detritos espaciais (space debris). Desenvolvido como parte do desafio *Economia Espacial*, o sistema integra algoritmos de Inteligência Artificial, simulação de IoT (telemetria em tempo real) e um aplicativo mobile fluido para oferecer um painel de controle orbital completo nas palmas das mãos.

---

### 🏗️ Arquitetura e Componentes

A arquitetura do sistema engloba tecnologias avançadas de ponta a ponta:

#### 1. Frontend (Mobile App React Native)
Desenvolvido sobre o framework **Expo Router**, focado em entregar uma experiência nativa de altíssimo nível:
- **Painel de Controle (Dashboard):** Visão executiva contendo gráficos em rosca para distribuição do nível de risco dos detritos e um gráfico de barras destacando o **Top 5 objetos mais perigosos** detectados nas órbitas, além de alertas dinâmicos.
- **Home de Monitoramento:** Lista contínua de rastreamento de debris com filtros avançados de níveis (Baixo, Médio, Alto e Crítico).
- **Agente Orbital IA (RAG Chat):** Interface conversacional de Inteligência Artificial usando RAG (Retrieval-Augmented Generation). Permite aos usuários realizarem perguntas avançadas sobre trajetórias, modelos de detritos espaciais e prevenção.
- **UX/UI Aprimorado:** Interface construída com base nos preceitos de modernidade espacial, usando a família tipográfica *Space Mono* e *Rajdhani*, suportado por paletas de cores orientadas a status crítico.

#### 2. Backend Analítico e de API (Python)
Motor matemático e servidor de IA, construído para ser escalável e seguro:
- **RAG & LangChain / LLM:** Serviço rodando em backend protegendo a API Key. Consome dados do banco de vetores para informar o agente (`rag_agent.py` e rotas `/rag/query`).
- **Cálculo Orbital (TLE Processor):** Motor de ingestão de dados em formato padrão *Two-Line Element* (`tle_processor.py`) e simulação da mecânica orbital via modelo de predição de colisão (`collision_model.py`).
- **Serviço de Risco API:** Expõe rotas como `/debris`, `/risk/{id}` de forma veloz para que a tela mobile consuma os alertas de forma imediata.

#### 3. IoT e Telemetria por Filas
Para simular as antenas de radar terrestres rastreando milhares de pequenos fragmentos em alta velocidade:
- Implementação baseada no **Protocolo MQTT** (`mqtt_publisher.py`, `mqtt_subscriber.py`).
- Módulos geradores (`sensor_simulator.py` e `telemetry_generator.py`) emitem pulsações de coordenadas simulando sensores IoT ao redor da terra mandando dados em tempo real.

---

### ⚙️ Execuções e Implementações Recentes

Abaixo o detalhamento das últimas *sprints* de implementação ativas no repositório no momento:

1. **Integração Real do AgentService (RAG):**
   - Substituição total de protótipos em *mock* pela ponte real via rede (Axios) para conectar com a API RAG. 
   - A configuração inclui tratamento do **timeout de 10s**, vital para requisições de geração de IA.
   - Retorno amigável em `Promise<string>` resolvendo e abstraindo a estrutura `response.data.answer` da API para a interface `agent.tsx`.

2. **Sistema Global de Navegação Intuitiva:**
   - Adicionada manipulação de navegação do *Stack* de Telas através do arquivo mestre `app/_layout.tsx`.
   - Implementação da seta universal **"⬅ VOLTAR"** renderizada no cabeçalho (*HeaderLeft*) avaliando instâncias de navegação ativas com `canGoBack`.
   - Adicionado o botão raiz **"🏠"** (*HeaderRight*) disparando atalho para o reset de rotas no menu inicial do aplicativo.

3. **Mecanismo de Saída (Exit App Safe Control):**
   - Inserção na barra inicial (`app/index.tsx`) de um ícone de energia (Power) para permitir fechamento do aplicativo nativamente e com segurança.
   - Desenvolvimento atrelado ao `BackHandler.exitApp()` com interrupção por diálogo (Alerta) exigindo confirmação de intenção do usuário antes da saída.

4. **Versionamento e Infraestrutura Git:**
   - O repositório local foi oficializado rodando `git init`.
   - A estruturação foi salva pelo commit base de feature `feat: Integrar AgentService RAG API e adicionar navegação global (Voltar/Home/Sair)`, englobando todas as 65 modificações ativas dos recursos da Global Solution.

---

### 💻 Como Executar o Projeto

**1. Configurando o Backend (Python)**
1. No seu terminal, garanta ter o Python mais recente. Navegue até `space-debris-tracker`.
2. Instale os requerimentos: `pip install -r requirements.txt`.
3. Inicie o backend: `uvicorn src.api.main:app --host 0.0.0.0 --port 8000`.

**2. Executando o Frontend Mobile (React Native + Expo)**
1. Mova-se para a camada de visualização: `cd space-debris-tracker/frontend`.
2. Instale as bibliotecas JavaScript: `npm install`.
3. Configure as variáveis de ambiente base: Edite o arquivo `.env` para inserir o IP de servidor local da máquina que está rodando o Backend:
   ```env
   EXPO_PUBLIC_API_URL=http://<SEU_IP_LOCAL>:8000
   ```
4. Execute o App: `npx expo start`.
5. Com o app **Expo Go** aberto no celular físico (ou em um emulador simulando smartphone), leia o QR Code no terminal.

---

### 👥 Equipe
*Projeto desenvolvido e submetido para a fase de testes e avaliações tecnológicas — Global Solution 2026.1 (FIAP)*
- **Desenvolvimento de Interface, Integração de IA & Git Flow:** Carlos Souza / RM: 566487
- *(Complete com o nome e RM dos demais membros do grupo para a entrega final)*
