"""
Módulo do agente RAG (Retrieval-Augmented Generation) para debris espaciais
Responde perguntas em português usando base de conhecimento embutida + LangChain + FAISS
"""

import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_community.vectorstores import FAISS
try:
    from langchain.chains import RetrievalQA
    from langchain.prompts import ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate
except ModuleNotFoundError:
    from langchain_classic.chains import RetrievalQA
    from langchain_core.prompts import ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate

# Carrega variáveis de ambiente (chave OpenAI)
load_dotenv()


def get_knowledge_base() -> list[str]:
    """
    Retorna a base de conhecimento embutida sobre debris espaciais.
    Não depende de arquivos externos — todo o conteúdo está no código.

    Retorna:
        Lista de strings com textos sobre o domínio espacial
    """
    return [
        # ── O que são debris espaciais ──────────────────────────────────────
        """
        Debris espaciais, também chamados de lixo espacial ou detritos orbitais,
        são objetos artificiais em órbita terrestre que não têm mais função operacional.
        Incluem satélites desativados, estágios de foguetes abandonados, fragmentos de
        explosões ou colisões, e até pequenas partículas de tinta ou metal.
        Estima-se que existam mais de 27.000 objetos rastreáveis acima de 10 cm e
        milhões de fragmentos menores que não podem ser monitorados individualmente.
        A velocidade orbital típica é de 7 a 8 km/s na LEO, tornando qualquer colisão
        extremamente destrutiva — mesmo um fragmento de 1 cm pode causar danos severos.
        """,

        # ── Síndrome de Kessler ─────────────────────────────────────────────
        """
        A Síndrome de Kessler foi proposta pelo cientista da NASA Donald J. Kessler em 1978.
        Descreve um cenário em cascata onde a densidade de objetos em órbita baixa terrestre
        (LEO) se torna tão alta que colisões entre objetos geram novos fragmentos, que por
        sua vez causam mais colisões, criando um ciclo autossustentável de destruição.
        Se atingida, a Síndrome de Kessler tornaria certas faixas orbitais inutilizáveis
        por décadas ou séculos, inviabilizando lançamentos espaciais e satélites de
        comunicação, GPS, meteorologia e observação da Terra.
        A prevenção exige desorbitar satélites ao fim da vida útil e evitar explosões
        acidentais de propelentes residuais em foguetes abandonados.
        """,

        # ── Rastreamento orbital: TLE e SGP4 ────────────────────────────────
        """
        O rastreamento orbital de debris utiliza o formato TLE (Two-Line Element Set),
        um padrão criado pela NORAD para descrever a órbita de um objeto com duas linhas
        de dados codificados. O TLE contém informações como inclinação orbital,
        excentricidade, argumento do perigeu, anomalia média e movimento médio.
        O modelo SGP4 (Simplified General Perturbations 4) é o algoritmo padrão para
        propagar TLEs no tempo e calcular a posição e velocidade de um objeto em qualquer
        instante. Ele considera perturbações atmosféricas, achatamento terrestre e
        pressão de radiação solar. O CelesTrak é o principal repositório público de TLEs,
        mantido por Dr. T.S. Kelso, e disponibiliza dados atualizados diariamente.
        """,

        # ── Conjunções orbitais ─────────────────────────────────────────────
        """
        Uma conjunção orbital ocorre quando dois objetos em órbita se aproximam a uma
        distância considerada perigosa. A análise de conjunção (CA) calcula a probabilidade
        de colisão com base na distância mínima de aproximação (Miss Distance),
        incertezas posicionais (covariâncias) e velocidade relativa entre os objetos.
        O sistema SOCRATES (Satellite Orbital Conjunction Reports Assessing Threatening
        Encounters in Space) do CelesTrak identifica automaticamente as conjunções mais
        críticas nas próximas 72 horas. Operadores de satélites recebem alertas e podem
        executar manobras de desvio quando a probabilidade de colisão supera 1 em 10.000.
        Distâncias abaixo de 5 km são consideradas de alto risco; entre 5 e 50 km, médio.
        """,

        # ── Eventos históricos de colisão ───────────────────────────────────
        """
        Os maiores eventos de colisão e geração de debris da história orbital:

        1. Teste antisatélite chinês (Fengyun-1C, 2007): A China destruiu seu próprio
        satélite meteorológico com um míssil, gerando mais de 3.000 fragmentos rastreáveis
        e aproximadamente 150.000 partículas menores. Foi o maior evento isolado de
        geração de debris da história.

        2. Colisão Iridium 33 × Cosmos 2251 (2009): Primeira colisão acidental entre dois
        satélites inteiros. O satélite comercial americano Iridium 33 colidiu com o satélite
        militar russo desativado Cosmos 2251 a 789 km de altitude, gerando mais de 2.000
        fragmentos rastreáveis. O evento demonstrou o risco real da Síndrome de Kessler.

        3. Explosão do foguete Pegasus (1994): Tanque de propelente residual explodiu,
        gerando centenas de fragmentos que ainda orbitam a Terra décadas depois.
        """,

        # ── Programa ESA Space Debris Office ────────────────────────────────
        """
        O Space Debris Office da ESA (Agência Espacial Europeia), sediado no ESOC em
        Darmstadt, Alemanha, é o principal centro europeu de monitoramento de debris.
        Suas atividades incluem: modelagem da população de debris, análise de conjunções
        para missões ESA, desenvolvimento de tecnologias de remoção ativa de debris (ADR),
        e publicação do relatório anual "ESA Space Environment Report".
        A ESA lidera o projeto ClearSpace-1, previsto para remover fisicamente um objeto
        de debris da órbita usando um veículo robótico com braços de captura.
        O programa Space Situational Awareness (SSA) da ESA integra dados de radar e
        telescópios para manter catálogos atualizados de objetos orbitais.
        """,

        # ── Níveis de risco e critérios de alerta ───────────────────────────
        """
        Os critérios internacionais de alerta para conjunções orbitais são:

        Nível ALTO (vermelho): Distância de aproximação menor que 5 km OU probabilidade
        de colisão acima de 1:1.000. Requer avaliação imediata e possível manobra de desvio.

        Nível MÉDIO (amarelo): Distância entre 5 e 50 km OU probabilidade entre 1:10.000
        e 1:1.000. Monitoramento intensificado e preparação de manobra contingencial.

        Nível BAIXO (verde): Distância acima de 50 km e probabilidade abaixo de 1:10.000.
        Monitoramento de rotina sem ação imediata necessária.

        A velocidade relativa também é fator crítico: colisões em LEO ocorrem tipicamente
        entre 10 e 15 km/s, liberando energia equivalente a explosivos convencionais.
        Objetos em órbitas polares têm maior probabilidade de conjunções de alto ângulo.
        """,
    ]


def build_vector_store(texts: list[str]) -> FAISS:
    """
    Cria e indexa embeddings dos textos usando OpenAI + FAISS.

    Args:
        texts: Lista de textos a serem indexados

    Retorna:
        Vector store FAISS pronto para consultas
    """
    print("[RAG] Criando embeddings e indexando base de conhecimento...")
    embeddings = OpenAIEmbeddings()
    vector_store = FAISS.from_texts(texts, embeddings)
    print(f"[RAG] {len(texts)} documentos indexados com sucesso.")
    return vector_store


def build_rag_chain(vector_store: FAISS) -> RetrievalQA:
    """
    Constrói a chain de RAG com LangChain usando GPT-3.5-turbo.

    Args:
        vector_store: Vector store FAISS já indexado

    Retorna:
        Chain RetrievalQA pronta para responder perguntas
    """
    # System message em português — instrui o modelo a responder apenas com base no contexto
    system_template = (
        "Você é um especialista em debris espaciais e monitoramento orbital. "
        "Responda sempre em português, de forma clara e técnica. "
        "Use apenas as informações fornecidas pelo contexto abaixo. "
        "Se a informação não estiver no contexto, diga que não possui essa informação.\n\n"
        "Contexto:\n{context}"
    )

    # Monta o ChatPromptTemplate com system message separada da pergunta do usuário
    prompt = ChatPromptTemplate.from_messages([
        SystemMessagePromptTemplate.from_template(system_template),
        HumanMessagePromptTemplate.from_template("{question}"),
    ])

    # Modelo de linguagem GPT-3.5-turbo
    llm = ChatOpenAI(
        model_name="gpt-3.5-turbo",
        temperature=0.2,  # baixa temperatura para respostas mais precisas e técnicas
    )

    # Retriever que busca os 3 trechos mais relevantes
    retriever = vector_store.as_retriever(search_kwargs={"k": 3})

    chain = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=retriever,
        chain_type_kwargs={"prompt": prompt},
        return_source_documents=False,
    )

    print("[RAG] Chain RAG construída com sucesso.")
    return chain


# ── Inicialização do módulo ──────────────────────────────────────────────────
# Vector store e chain são criados uma única vez ao importar o módulo
print("[RAG] Inicializando agente RAG...")
try:
    _textos = get_knowledge_base()
    _vector_store = build_vector_store(_textos)
    _rag_chain = build_rag_chain(_vector_store)
    print("[RAG] Agente pronto para responder perguntas.")
except Exception as _erro_init:
    print(f"[RAG] Aviso: falha na inicialização ({_erro_init}). "
          "Verifique a chave OPENAI_API_KEY no arquivo .env")
    _rag_chain = None
# ─────────────────────────────────────────────────────────────────────────────


def answer_question(question: str) -> str:
    """
    Responde uma pergunta em português usando o agente RAG.

    Args:
        question: Pergunta em linguagem natural (português)

    Retorna:
        Resposta como string em português
    """
    if _rag_chain is None:
        return ("Desculpe, o agente RAG não está disponível no momento. "
                "Verifique se a chave OPENAI_API_KEY está configurada corretamente no .env")
    try:
        resultado = _rag_chain.invoke({"query": question})
        return resultado.get("result", "Não foi possível gerar uma resposta.")
    except Exception as erro:
        print(f"[RAG] Erro ao responder pergunta: {erro}")
        return ("Desculpe, ocorreu um erro ao processar sua pergunta. "
                "Tente novamente em instantes.")
