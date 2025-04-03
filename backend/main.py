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


from fastapi.responses import FileResponse, HTMLResponse
from matplotlib import pyplot as plt
from matplotlib.figure import Figure


import time
import hashlib

from pydantic import BaseModel

from readHtml import LeHtml, criaHistoricoCSV

import pandas as pd


class Linha(BaseModel):
    disciplina: str 
    codigo: str 
    semestre: str


def generate_unique_filename(filename):
    timestamp = str(int(time.time()))  # Gera um timestamp único
    hash_str = hashlib.md5(filename.encode()).hexdigest()  # Gera um hash do nome do arquivo
    return f"{timestamp}_{hash_str}_{filename}"



app = FastAPI()

UPLOAD_DIR = "uploads"


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

# Dicionario global para armazenar os resultados do processamento
RESULTS = {}


# a palavra-chave async nas funções de endpoint permite que a função seja executada de maneira assíncrona, sem bloquear outras requisições.
# Essa é uma das vantagens da FastAPI, que já suporta programação assíncrona nativamente

@app.post(path="/upload/")
async def upload_html(file: UploadFile = File(...)):
    """Recebe um arquivo HTML e salva no servidor"""
    
    print("1")
    # processa o conteúdo do arquivo para retornar os dados dele
    conteudo_arquivo = file.file.read() 
    print("2")
    dados_extraidos = LeHtml(conteudo_arquivo)
    print("3")
    return dados_extraidos

@app.post(path="/calculate/")
async def calculate(tabela: list[list[str]]):
    nome_unico = generate_unique_filename("1000")
    
    os.mkdir(nome_unico)
    file_path = os.path.join(os.path.dirname(__file__), nome_unico)
    criaHistoricoCSV(tabela, os.path.join(file_path, "historico.csv"))
    
    # Tratar casos de erro
    result = subprocess.run(["ClassHistoryConverter/scripts/update.sh", file_path], capture_output=True, text=True, check=True)
    print("Tudo certo!")
    return 1



@app.get(path="/results/{selectionView}/{filename}")
async def get_results(selectionView: str, filename: str):
    """Retorna os dados do arquivo e a url da imagem gerada para o frontend"""
    result = RESULTS.get(filename, None)

    if result:
        return {"filename": filename, "charset": result["charset"], "image_url":  f"http://localhost:8000/results/{selectionView}/{filename}/image"}
    else:
        return {"error": "Arquivo não encontrado"}


@app.get("/results/{selectionView}/{filename}/image")
async def get_image(selectionView: str, filename: str):
    """Retorna a imagem gerada para o frontend"""

    img_path = os.path.join(UPLOAD_DIR, selectionView, f"{filename}.png")


    if not os.path.exists(img_path):
        raise HTTPException(status_code=404, detail="Imagem não encontrada")

    return FileResponse(img_path, media_type="image/png")





HTML_FILE_PATH = "mais_teste.txt"

@app.post("/modificar_html")
async def modificar_html(disciplinas: list[str]):
    try:
        # Ler o arquivo HTML
        with open(HTML_FILE_PATH, "r") as f:
            html_texto = f.read()

        # Modificar o conteúdo do HTML
        for disciplina in disciplinas:
            teste = re.findall(rf"value=\\&quot;{disciplina}.*?style=.*?(?:(?!mxGeometry).)*?fillColor=.*?mxGeometry", html_texto)

            if len(teste) > 0:
                substituido = re.sub(r"fillColor=#\w{6}", "fillColor=#000000", teste[0])
                html_texto = html_texto.replace(teste[0], substituido)

            

        # Retornar o HTML modificado como resposta
        return HTMLResponse(content=html_texto)

    except Exception as e:
        return {"erro": str(e)}
    





# Gera um gráfico qualquer e converte sua imagem usando base64
def generate_plot():
    fig, ax = plt.subplots()
    ax.plot([0, 1, 2], [0, 1, 4])
    buf = io.BytesIO()
    plt.savefig(buf, format="png")
    buf.seek(0)
    return base64.b64encode(buf.read()).decode('utf-8')

# Envia para o front 2 imagens codificadas com base64 em formato de texto
@app.get("/plots")
async def get_plots():
    img1 = generate_plot()
    img2 = generate_plot()
    return {"image1": img1, "image2": img2}
    
    



