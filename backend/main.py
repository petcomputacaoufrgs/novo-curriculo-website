import re
import shutil
import subprocess
from fastapi import Depends, FastAPI, File, HTTPException, Request, UploadFile


# Middleware do FastAPI para controlar as permissões de CORS (Cross-Origin Resource Sharing). Isso permite configurar DE QUAIS domínios ou portas o servidor pode receber requisições
from fastapi.middleware.cors import CORSMiddleware

# Utilizado para manipulação dos diretórios
import os 

import time

import numpy as np
from pydantic import BaseModel
from typing import List

from readHtml import LeHtml, criaHistoricoCSV
from aux_functions import calculate_temporality, correct_alternative_disciplines, correct_other_known_issues, traduzir_path, plot_function, generate_unique_filename

import pandas as pd

from contextlib import asynccontextmanager


from dotenv import load_dotenv
load_dotenv()
FRONTEND_HOST = os.getenv("APP_HOST_IP")
FRONTEND_PORT = os.getenv("FRONT_PORT")

ANO_ATUAL = 2025
BARRA_ATUAL = 2




@asynccontextmanager
async def lifespan(app: FastAPI):
    # Carrega os arquivos uma única vez
    app.state.dados = {
        "disciplinas_CIC": pd.read_csv("ClassHistoryConverter/scripts/INF_UFRGS_DATA/CIC/disciplinas.csv"),
        "disciplinas_ECP": pd.read_csv("ClassHistoryConverter/scripts/INF_UFRGS_DATA/ECP/disciplinas.csv"),
    }
    print("Arquivos carregados com sucesso!")

    yield  # Aqui a aplicação é executada
    # (opcional) Qualquer código após o yield será executado no shutdown
    print("Encerrando a aplicação")



app = FastAPI(lifespan=lifespan)


# Define as origens de onde pode receber requisições
origins = [
    "*"
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_dados(request: Request):
    return request.app.state.dados


@app.get(path="/get_old_history")
async def get_old_history(dados = Depends(get_dados)):

    # Pega as disciplinas da CIC
    cic_history : pd.DataFrame = dados["disciplinas_CIC"]

    # Trata o histórico
    cic_history = cic_history[cic_history['cv'] == 'velho'][["etapa", "codigo", "creditos", "nome"]]
    cic_history["etapa"] = cic_history["etapa"].fillna(0).astype(int)

    cic_history = cic_history[cic_history['creditos'] > 0] # Remove "disciplinas" que não são cadeiras, como "Ingresso até Temp-4" e "Vínculo Acadêmico"
    # Tranforma o historico da CIC em uma lista de etapas, onde cada etapa contém listas com os dados de cada cadeira
    cic_history = [
        cic_history[cic_history['etapa'] == i].drop('etapa', axis=1).to_dict(orient="list")
        for i in range(int(cic_history['etapa'].max()) + 1)
    ]


    # Pega o historico da ECP
    ecp_history : pd.DataFrame = dados["disciplinas_ECP"]
    
    # Trata o histórico
    ecp_history["etapa"] = np.where(
        ecp_history["carater"].str.lower() == "eletiva",
        0,                                             
        ecp_history["etapa"]                            
    )

    ecp_history = ecp_history[ecp_history["carater"] != "Adicional"]  # Remove disciplinas de caráter "Adicional", que apenas dão créditos complementares
    ecp_history = ecp_history[ecp_history['cv'] == 'velho'][["etapa", "codigo", "creditos", "nome"]]
    ecp_history["etapa"] = ecp_history["etapa"].fillna(0).astype(int)

    # Tranforma o historico da ECP em uma lista de etapas, onde cada etapa contém listas com os dados de cada cadeira
    ecp_history = [
        ecp_history[ecp_history['etapa'] == i].drop('etapa', axis=1).to_dict(orient="list")
        for i in range(int(ecp_history['etapa'].max()) + 1)
    ]


    # Retorna os dois históricos em um dicionário, onde a chave é o nome do curso e o valor é a lista de etapas
    return {"CIC": cic_history, "ECP": ecp_history}


# a palavra-chave async nas funções de endpoint permite que a função seja executada de maneira assíncrona, sem bloquear outras requisições.
# Essa é uma das vantagens da FastAPI, que já suporta programação assíncrona nativamente
@app.post(path="/upload/")
async def upload_html(file: UploadFile = File(...)):
    """Recebe um arquivo HTML e salva no servidor"""
    
    # processa o conteúdo do arquivo para retornar os dados dele
    conteudo_arquivo = file.file.read() 

    try:
        dados_extraidos = LeHtml(conteudo_arquivo)
    except:
        raise HTTPException(status_code=400, detail = "Tipo de HTML não identificado. Verifique se é o historico escolar ou histórico do curso disponibilizado no Portal do Aluno.")
        
    dados_extraidos["dados"] = correct_alternative_disciplines(dados_extraidos["dados"], dados_extraidos["curso"])
    dados_extraidos["dados"] = correct_other_known_issues(dados_extraidos["dados"], dados_extraidos["curso"])
    return dados_extraidos



@app.get(path="/api/regrasEquivalencia/{curso}")
async def get_regras_equivalencia(curso: str):
    regras = pd.read_csv(f"ClassHistoryConverter/scripts/INF_UFRGS_DATA/{curso}/equivalencias_completas_final.csv")
    regras = regras.sort_values(by=["nome_fez"])

    regras = regras.fillna("")

    return regras.to_dict(orient="records")



class CalculateRequest(BaseModel):
    tabela: List[List[str]]
    semestre_ingresso: str
    curso: str



    
@app.post(path="/calculate/")
async def calculate(dados: CalculateRequest, cached_disciplines=Depends(get_dados)):
    """
    Processa um histórico enviado via POST e retorna diversas análises e visualizações.

    Este endpoint executa:
    1. Validação do histórico e do curso
    2. Geração de CSV do histórico baseado nos dados enviados (histórico do currículo antigo)
    3. Execução de scripts externos que processam o histórico e geram os dados da conversão para o novo currículo
    4. Geração de gráficos de progresso em créditos (gráficos de donut)
    5. Construção de um histórico no novo currículo organizado por etapas
    6. Tradução dos maiores caminhos para completar todas as disciplinas obrigatórias (no currículo antigo e no novo)
    7. Edição de arquivos HTML dos diagramas de disciplinas obrigatórias para destacar o que já foi cursado

    Retorna um dicionário com:
    - Gráficos donut do progresso em créditos em base64
    - Métricas sobre o progresso em créditos resumidas
    - Histórico no novo currículo estruturado por etapa
    - Maiores caminhos no currículo (antigo e novo)
    - HTMLs dos diagramas (antigo e novo)

    """

    tabela = dados.tabela
    semestre_ingresso = dados.semestre_ingresso
    curso = dados.curso

    if(curso != "CIC" and curso != "ECP"):
        raise HTTPException(status_code=400, detail=f"Curso deve ser Ciência da Computação ou Engenharia da Computação. Curso inserido: {curso}")


    # Testa se a tabela está vazia. Se estiver, encerra
    if len(tabela) == 0:
        raise HTTPException(status_code=400, detail="Histórico Vazio. Insira alguma cadeira para continuar")

    temporalidade = calculate_temporality(semestre_ingresso)


    if temporalidade <= 0:
        raise HTTPException(status_code=400, detail=f"Semestre de ingresso inserido inválido. Insira um semestre anterior ou igual ao atual: {ANO_ATUAL}/{BARRA_ATUAL}")


    # Cria um diretório temporário para salvar os arquivos gerados
    nome_unico = generate_unique_filename(str(int(time.time())))
    os.mkdir(nome_unico)
    file_path = os.path.join(os.path.dirname(__file__), nome_unico)


    
    # Salva o CSV com o histórico enviado

    try:
        criaHistoricoCSV(tabela, os.path.join(file_path, "historico.csv"), temporalidade)
    except:
        shutil.rmtree(file_path)
        raise HTTPException(status_code=400, detail="Erro ao criar o histórico.") 

    # Executa os scripts
    try:
        
        result = subprocess.run(
        ["ClassHistoryConverter/scripts/update.sh", file_path, curso], capture_output=True, text=True, check=True)
    except Exception as e:
        shutil.rmtree(file_path)
        raise HTTPException(status_code=400, detail=f"Erro no script: {e}")


    # Inicializa o dicionário de retorno
    return_value = {}

    # Carrega os dados gerados pelos scripts
    summarised_metrics = pd.read_csv(os.path.join(file_path, "summarised_metrics_from_novo_historico_flexivel.csv"))
    new_history = pd.read_csv(os.path.join(file_path,"novo_historico_flexivel.csv")).drop('cartao', axis=1)
    new_demand = pd.read_csv(os.path.join(file_path,"new_class_demand_from_novo_historico_flexivel.csv"))
    disciplines = cached_disciplines["disciplinas_" + curso]

    HTML_PATH_NEW_DIAGRAM = f"ClassHistoryConverter/scripts/INF_UFRGS_DATA/{curso}/Diagrama.html"
    HTML_PATH_OLD_DIAGRAM = f"ClassHistoryConverter/scripts/INF_UFRGS_DATA/{curso}/DiagramaAntigo.html"

    # Processa esses dados e vai guardando eles no dicionário de retorno
    gerar_graficos_creditos(curso, summarised_metrics, return_value)
    gerar_maiores_caminhos(disciplines, file_path, return_value)
    history_table = gerar_novo_historico(disciplines, new_history, new_demand)
    marcar_disciplinas_feitas_em_html(HTML_PATH_NEW_DIAGRAM, HTML_PATH_OLD_DIAGRAM, history_table, tabela, curso, return_value)

    # Organiza o novo histórico em uma lista de dicionários, separando por etapa
    new_history_table_separated_by_semester = [
            history_table[history_table['etapa'] == i].drop('etapa', axis=1).to_dict(orient="list")
            for i in range(int(history_table['etapa'].max()) + 1)
        ]
    

    return_value["historico"] = new_history_table_separated_by_semester

    # Remove o diretório temporário
    shutil.rmtree(file_path)

    return return_value


def gerar_graficos_creditos(curso, summarised_metrics, return_value):
    """
    Descrição:
        Gera gráficos do tipo donut representando o progresso em créditos obrigatórios, eletivos e totais, tanto no currículo antigo quanto no novo. Os gráficos são convertidos para imagens base64 e adicionados ao dicionário return_value.

    Parâmetros:

        curso (str): Código do curso ("CIC" ou "ECP").
        summarised_metrics (pd.DataFrame): Métricas resumidas contendo informações sobre os créditos.
        return_value (dict): Dicionário onde os gráficos e métricas serão adicionados.

    Modifica:

        Adiciona imagens em base64 na chave return_value["images"].
        Adiciona métricas numéricas em return_value["summarized_metrics"].

    """

    # Define os totais de créditos exigidos para o currículo novo e antigo
    if(curso == "CIC"):
        old_obligatory_credit_demand = 152
        old_elective_credit_demand = 24
        new_obligatory_credit_demand = 166
        new_elective_credit_demand = 16
    elif(curso == "ECP"):
        old_obligatory_credit_demand = 158
        old_elective_credit_demand = 36
        new_obligatory_credit_demand = 148
        new_elective_credit_demand = 36

    # Lista de imagens dos gráficos
    return_value["images"] = {}
    return_value["summarized_metrics"] = {}

    # Geração dos gráficos de créditos completados
    return_value["images"]["obrigatorios_antigos"], return_value["summarized_metrics"]["obrigatorios_antigos"] = plot_function(summarised_metrics, 0, old_obligatory_credit_demand, 'Créditos obrigatórios adquiridos (antigo)')
    return_value["images"]["obrigatorios_novos"], return_value["summarized_metrics"]["obrigatorios_novos"] = plot_function(summarised_metrics, 1, new_obligatory_credit_demand, 'Créditos obrigatórios adquiridos (novo)')
    return_value["images"]["eletivos_antigos"], return_value["summarized_metrics"]["eletivos_antigos"] = plot_function(summarised_metrics, 3, old_elective_credit_demand, 'Créditos eletivos adquiridos (antigo)')
    return_value["images"]["eletivos_novos"], return_value["summarized_metrics"]["eletivos_novos"] = plot_function(summarised_metrics, 4, new_elective_credit_demand, 'Créditos eletivos adquiridos (novo)')
    return_value["images"]["total_antigos"], return_value["summarized_metrics"]["total_antigos"] = plot_function(summarised_metrics, 6, old_obligatory_credit_demand + old_elective_credit_demand, 'Créditos totais adquiridos (antigo)')
    return_value["images"]["total_novos"], return_value["summarized_metrics"]["total_novos"] = plot_function(summarised_metrics, 7, new_obligatory_credit_demand + new_elective_credit_demand, 'Créditos totais adquiridos (novo)')



def gerar_novo_historico(disciplines, new_history, new_demand):
    """
    Constrói uma tabela contendo todas as disciplinas já cumpridas e pendentes, com informações completas sobre nome, etapa, créditos e regras de cumprimento.

    Parâmetros:
        - disciplines (pd.DataFrame): Base de dados com as disciplinas do novo currículo.
        - new_history (pd.DataFrame): Disciplinas já liberadas no novo currículo.
        - new_demand (pd.DataFrame): Disciplinas ainda pendentes.

    Retorno:
        history_table (pd.DataFrame): Tabela unificada com disciplinas já cursadas e a demanda restante.
    
    """

    new_demand = new_demand[new_demand['qt_students_needing_it'] == 1]  # Filtra apenas as que ainda precisam ser feitas

    # Coloca informações das disciplinas nas tabelas de novo histórico e nova demanda (merge no campo codigo)
    new_history = new_history.merge(disciplines[['codigo', 'etapa', 'nome', 'creditos']], on="codigo", how="left")

    new_history = new_history.fillna(0)

    new_demand = new_demand.merge(disciplines[['codigo', 'creditos']], on="codigo", how="left")

    # Cria coluna vazia para regra associada a cada disciplina pendente
    new_demand['rule_name'] = None
    
    # Junta o histórico (cadeiras liberadas) e a demanda (cadeiras pendentes) em uma única tabela
    history_table = pd.concat([new_demand, new_history], ignore_index=True)
    history_table["qt_students_needing_it"] = history_table["qt_students_needing_it"].fillna(0)
    history_table["rule_name"] = history_table["rule_name"].fillna("")

    return history_table



def gerar_maiores_caminhos(disciplines, file_path, return_value):
    """
    Traduz os maiores caminhos curriculares (sequências de disciplinas obrigatórias restantes) nos currículos antigo e novo, usando nomes legíveis.

    Parâmetros:
        - disciplines (pd.DataFrame): DataFrame contendo a tabela de disciplinas com códigos e nomes.
        - file_path (str): Caminho para o diretório onde os arquivos de caminho estão armazenados.
        - return_value (dict): Dicionário que será modificado para incluir os caminhos traduzidos.

    Modifica:

        Adiciona return_value["caminho_antigo"]: string com a sequência de disciplinas obrigatórias restantes (antigo).
        Adiciona return_value["caminho_novo"]: string com a sequência de disciplinas obrigatórias restantes (novo).


    """
    # Maiores Caminhos
    df_paths = pd.read_csv(os.path.join(file_path, "semesters_remaining_by_student_comparison_from_novo_historico_flexivel.csv"))

    df_paths["new_path"] = df_paths["new_path"].fillna("")
    df_paths["old_path"] = df_paths["old_path"].fillna("")

    return_value["caminho_antigo"] = traduzir_path(df_paths['old_path'], disciplines).loc[0]
    return_value["caminho_novo"] = traduzir_path(df_paths['new_path'], disciplines).loc[0]



def marcar_disciplinas_feitas_em_html(html_path_new_diagram, html_path_old_diagram, history_table, tabela, curso, return_value):
    """
    Edita os arquivos HTML dos diagramas curriculares, destacando em vermelho as disciplinas que já foram concluídas.
    Versão Otimizada com Regex Callback.
    """

    # Filtra disciplinas obrigatórias feitas
    obligatoryClasses = history_table[history_table["etapa"] != 0]
    alreadyDoneClasses = obligatoryClasses[obligatoryClasses["qt_students_needing_it"] == 0]["nome"]
    
    # Remove duplicatas
    alreadyDoneClasses = alreadyDoneClasses.drop_duplicates()

    # Verifica créditos obrigatórios (Lógica de CIC)
    numAlreadyDoneNewCredits = return_value["summarized_metrics"]["obrigatorios_novos"][1]
    numAlreadyDoneOldCredits = return_value["summarized_metrics"]["obrigatorios_antigos"][1]

    if curso == "CIC":
        if numAlreadyDoneNewCredits >= 130:
            # Adiciona à Series do Pandas
            alreadyDoneClasses = pd.concat([alreadyDoneClasses, pd.Series(["130 Créditos Obrigatórios"])])
        
        if numAlreadyDoneOldCredits >= 100:
            # Adiciona à lista bruta 'tabela' que será usada no diagrama antigo
            tabela.append(["", "100 Créditos Obrigatórios", ""])

    
    def aplicar_destaque(html_content, lista_disciplinas, cor_nova):
        """
        Função interna que varre o HTML e aplica a cor nas células encontradas na lista.
        """
        
        # Converte para set para busca O(1)
        set_disciplinas = set(lista_disciplinas)

        def processar_celula(match):
            tag_inteira = match.group(0)
            
            # Verifica se alguma disciplina da lista está presente nesta tag
            # Iteramos sobre o set, mas como a tag é uma string longa, verificamos a presença da substring
            for disciplina in set_disciplinas:
                if disciplina in tag_inteira:
                    # Substitui o fillColor existente pela NOVA_COR
                    # Regex: procura 'fillColor=' e vai até encontrar aspas, ponto-e-vírgula ou fim da string
                    return re.sub(r'fillColor=[^;"]+', cor_nova, tag_inteira)
            
            return tag_inteira

        padrao_celula = r'&lt;mxCell\s.*?/&gt;'
        
        return re.sub(padrao_celula, processar_celula, html_content, flags=re.DOTALL)


    
    with open(html_path_new_diagram, "r", encoding="utf-8") as f:
        html_texto_novo = f.read()

    COR_NOVO = 'fillColor=light-dark(#ffcccc,#ffcccc)'
    html_final_novo = aplicar_destaque(html_texto_novo, alreadyDoneClasses.tolist(), COR_NOVO)
    
    return_value["html"] = html_final_novo


    
    with open(html_path_old_diagram, "r", encoding="utf-8") as f:
        html_texto_antigo = f.read()
    
    lista_disciplinas_antigas = [linha[1] for linha in tabela]
    
    COR_ANTIGO = 'fillColor=light-dark(#ffcccc,#ffcccc)'
    html_final_antigo = aplicar_destaque(html_texto_antigo, lista_disciplinas_antigas, COR_ANTIGO)

    return_value["html_old_diagram"] = html_final_antigo
