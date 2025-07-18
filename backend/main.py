import base64
import io
import re
import subprocess
from fastapi import FastAPI, File, HTTPException, UploadFile


# Middleware do FastAPI para controlar as permissões de CORS (Cross-Origin Resource Sharing). Isso permite configurar DE QUAIS domínios ou portas o servidor pode receber requisições
from fastapi.middleware.cors import CORSMiddleware

# Utilizado para manipulação dos diretórios
import os 

# Módulo para manipulação de arquivos. Aqui está sendo utilizado para copiar o arquivo recebido, salvando-o
import shutil

# Para processar o html
from bs4 import BeautifulSoup


from matplotlib import pyplot as plt
from matplotlib.figure import Figure


import time
import hashlib

from pydantic import BaseModel
from typing import List

from readHtml import LeHtml, criaHistoricoCSV

import pandas as pd



def generate_unique_filename(filename):
    timestamp = str(int(time.time()))  # Gera um timestamp único
    hash_str = hashlib.md5(filename.encode()).hexdigest()  # Gera um hash do nome do arquivo
    return f"{timestamp}_{hash_str}_{filename}"



app = FastAPI()


# Define as origens de onde pode receber requisições
origins = [
    "http://localhost:5173"
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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
        
    return dados_extraidos


def plot_function(summarised_metrics, remaining_index, total_credits, title):
    """
    Gera e salva um gráfico de pizza (donut) mostrando a proporção de créditos completados
    em relação ao total necessário.

    Parâmetros:
    - summarised_metrics: DataFrame contendo os valores de créditos completos por categoria.
    - remaining_index: índice no DataFrame para pegar o valor de créditos ainda necessários.
    - total_credits: total de créditos que precisam ser cumpridos.
    - title: título do gráfico.
    - file_name: nome do arquivo em que o gráfico será salvo (formato .png).
    """

    # Extrai a quantidade de créditos completos e calcula os restantes
    remaining_credits = summarised_metrics.value.iloc[remaining_index]
    completed_credits = total_credits - remaining_credits 

    # Cores do gráfico: azul claro (restantes), azul escuro (completos)
    colors = ['#C6DCF1', '#202A44']

    # Fatias e legendas do gráfico
    slices = [remaining_credits, completed_credits]
    legendas = [
        f"Créditos restantes: {remaining_credits:.0f}",
        f"Créditos obtidos: {completed_credits:.0f}"
    ]

    # Criação da figura
    fig, ax = plt.subplots(figsize=(8, 6), dpi=100)
    plt.style.use('fivethirtyeight')  # Estilo visual do gráfico

    # Desenha o gráfico de pizza com buraco no meio (donut chart)
    ax.pie(slices, shadow=True, wedgeprops=dict(width=0.3), startangle=0, colors=colors)

    # Adiciona a legenda centralizada abaixo do gráfico
    ax.legend(
        legendas,
        loc='upper center',
        bbox_to_anchor=(0.5, -0.1),
        frameon=False,
        ncol=2,
        fontsize=18
    )

    # Título do gráfico
    ax.set_title(title)

    # Ajusta o layout para evitar cortes
    plt.tight_layout()

    # Mostra a porcentagem de créditos obtidos no centro do gráfico
    percent_credits_done = completed_credits / total_credits * 100

    ax.text(0, 0, f"{percent_credits_done:.1f}%",
            dict(size=30, ha='center', va='center'))

    # Salva o gráfico em um buffer de memória
    buf = io.BytesIO()

    # Salva o gráfico como imagem
    fig.savefig(buf, format='png')

    buf.seek(0) 

    # Converte a imagem para base64
    img_base64 = base64.b64encode(buf.read()).decode('utf-8')

    buf.close()  # Fecha o buffer de memória

    return img_base64, [total_credits, completed_credits]


@app.get(path="/api/regrasEquivalencia")
async def get_regras_equivalencia():
    regras = pd.read_csv("ClassHistoryConverter/scripts/INF_UFRGS_DATA/equivalencias_completas_final.csv")

    regras = regras.sort_values(by=["nome_fez"])

    print(regras)
    return regras.to_dict(orient="records")



ANO_ATUAL = 2026
BARRA_ATUAL = 1

def calculate_temporality(semestre_ingresso: str):
    ano_ingresso, barra_ingresso = semestre_ingresso.split("/")
    

    diff_anos = ANO_ATUAL - int(ano_ingresso)
    diff_barra = BARRA_ATUAL - int(barra_ingresso)

    return diff_anos * 2 + diff_barra + 1




class CalculateRequest(BaseModel):
    tabela: List[List[str]]
    semestre_ingresso: str

@app.post(path="/calculate/")
async def calculate(dados: CalculateRequest):
    """
    Recebe uma tabela de histórico via POST, processa os dados,
    gera gráficos e retorna um histórico organizado por etapas.
    
    """

    tabela = dados.tabela
    semestre_ingresso = dados.semestre_ingresso



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
        raise HTTPException(status_code=400, detail="Erro ao criar o histórico.") 


    # Executa os scripts
    try:
        result = subprocess.run(
        ["ClassHistoryConverter/scripts/update.sh", file_path], capture_output=True, text=True, check=True)
    except subprocess.CalledProcessError as e:
        print("STDOUT:", e.stdout)
        print("STDERR:", e.stderr)
        raise HTTPException(status_code=500, detail=f"Erro no script: {e.stderr}")

    # Carrega os dados resumidos gerados pelo script
    summarised_metrics = pd.read_csv(os.path.join(file_path, "summarised_metrics_from_novo_historico_ortodoxo.csv"))

    # Define os totais de créditos exigidos para o currículo novo e antigo
    old_obligatory_credit_demand = 152
    old_elective_credit_demand = 24
    new_obligatory_credit_demand = 166
    new_elective_credit_demand = 20


    # Lista de imagens dos gráficos
    return_value = {}

    return_value["images"] = {}
    return_value["summarized_metrics"] = {}

    # Geração dos gráficos de créditos completados
    return_value["images"]["obrigatorios_antigos"], return_value["summarized_metrics"]["obrigatorios_antigos"] = plot_function(summarised_metrics, 0, old_obligatory_credit_demand, 'Créditos obrigatórios adquiridos (antigo)')
    return_value["images"]["obrigatorios_novos"], return_value["summarized_metrics"]["obrigatorios_novos"] = plot_function(summarised_metrics, 1, new_obligatory_credit_demand, 'Créditos obrigatórios adquiridos (novo)')
    return_value["images"]["eletivos_antigos"], return_value["summarized_metrics"]["eletivos_antigos"] = plot_function(summarised_metrics, 3, old_elective_credit_demand, 'Créditos eletivos adquiridos (antigo)')
    return_value["images"]["eletivos_novos"], return_value["summarized_metrics"]["eletivos_novos"] = plot_function(summarised_metrics, 4, new_elective_credit_demand, 'Créditos eletivos adquiridos (novo)')
    return_value["images"]["total_antigos"], return_value["summarized_metrics"]["total_antigos"] = plot_function(summarised_metrics, 6, old_obligatory_credit_demand + old_elective_credit_demand, 'Créditos totais adquiridos (antigo)')
    return_value["images"]["total_novos"], return_value["summarized_metrics"]["total_novos"] = plot_function(summarised_metrics, 7, new_obligatory_credit_demand + new_elective_credit_demand, 'Créditos totais adquiridos (novo)')




    # Carrega as tabelas necessárias para fazer o histórico novo (novo histórico, com as cadeiras já liberadas, e nova demanda de cadeiras, com as cadeiras pendentes, e o dicionário de disciplinas)
    new_history = pd.read_csv(os.path.join(file_path,"novo_historico_flexivel.csv")).drop('cartao', axis=1)

    new_demand = pd.read_csv(os.path.join(file_path,"new_class_demand_from_novo_historico_flexivel.csv"))
    new_demand = new_demand[new_demand['qt_students_needing_it'] == 1]  # Filtra apenas as que ainda precisam ser feitas



    disciplines = pd.read_csv("disciplinas.csv")

    # Coloca informações das disciplinas nas tabelas de novo histórico e nova demanda (merge no campo codigo)
    new_history = new_history.merge(disciplines[['codigo', 'etapa', 'nome', 'creditos']], on="codigo", how="left")
    new_demand = new_demand.merge(disciplines[['codigo', 'creditos']], on="codigo", how="left")

    # Cria coluna vazia para regra associada a cada disciplina pendente
    new_demand['rule_name'] = None

    # Junta o histórico (cadeiras liberadas) e a demanda (cadeiras pendentes) em uma única tabela
    history_table = pd.concat([new_demand, new_history], ignore_index=True)
    history_table["qt_students_needing_it"] = history_table["qt_students_needing_it"].fillna(0)
    history_table["rule_name"] = history_table["rule_name"].fillna("")


    # Organiza o histórico em uma lista de dicionários, separando por etapa
    history_table_separated = [
        history_table[history_table['etapa'] == i].to_dict()
        for i in range(int(history_table['etapa'].max()) + 1)
    ]

    for line in history_table_separated:
        line.pop('etapa', None)


    return_value["historico"] = history_table_separated

    # TODO: editar diagrama

    HTML_FILE_PATH = "DiagramaFinalBrabuleta.html"
    
    obligatoryClasses = history_table[history_table["etapa"] != 0]
    alreadyDoneClasses = obligatoryClasses[obligatoryClasses["qt_students_needing_it"] == 0]["nome"]


    # Remove duplicatas (porque se uma mesma cadeira é obtida por mais de 1 regra diferente, ela vai aparecer múltiplas vezes)    
    alreadyDoneClasses = alreadyDoneClasses.drop_duplicates()

    # Adiciona 130 créditos obrigatórios e 166 créditos obrigatórios à lista se a pessoa já os fez
    numAlreadyDoneCredits = return_value["summarized_metrics"]["obrigatorios_novos"][1]

    if numAlreadyDoneCredits >= 130:
        alreadyDoneClasses = pd.concat([alreadyDoneClasses, pd.Series(["130 Créditos Obrigatórios"])])
    if numAlreadyDoneCredits >= 166:
        alreadyDoneClasses = pd.concat([alreadyDoneClasses, pd.Series(["166 Créditos Obrigatórios"])])

    
    try:
        # Ler o arquivo HTML
        with open(HTML_FILE_PATH, "r") as f:
            html_texto = f.read()
                
        # Modificar o conteúdo do HTML
        for disciplina in alreadyDoneClasses:
            nome_escapado = re.escape(disciplina)
            teste = re.findall(rf"{nome_escapado}(?=[\\&]).*?style=.*?fillColor=#FFFFFA", html_texto)
            
            if len(teste) > 0:
                substituido = re.sub(r"fillColor=#\w{6}", "fillColor=red", teste[0])
                html_texto = html_texto.replace(teste[0], substituido)
                
                

    
        with open("HTML_MODIFICADO.html", "w") as f:
            f.write(html_texto)    

        # Retornar o HTML modificado como resposta
        return_value["html"] = html_texto

    except Exception as e:
        return {"erro": str(e)}
    

    # Remove o diretório temporário
    #shutil.rmtree(file_path)

    return return_value


    



# Gera um gráfico qualquer e converte sua imagem usando base64
def generate_plot():
    fig, ax = plt.subplots()
    ax.plot([0, 1, 2], [0, 1, 4])
    buf = io.BytesIO()
    plt.savefig(buf, format="png")
    buf.seek(0)
    return base64.b64encode(buf.read()).decode('utf-8')

    
    



