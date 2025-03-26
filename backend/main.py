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
    os.mkdir("1000")
    file_path = os.path.join(os.path.dirname(__file__), "1000", 'historico.csv')
    criaHistoricoCSV(tabela, file_path)

    # result = subprocess.run(["ClassHistoryConverter/scripts/update.sh", file_path], capture_output=True, text=True, check=True)
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
    
    



