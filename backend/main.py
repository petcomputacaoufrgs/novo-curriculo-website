import re
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


# a palavra-chave async nas funções de endpoint permite que a função seja executada de maneira assíncrona, sem bloquear outras requisições.
# Essa é uma das vantagens da FastAPI, que já suporta programação assíncrona nativamente

@app.post(path="/upload/")
async def upload_html(file: UploadFile = File(...)):
    """Recebe um arquivo HTML e salva no servidor"""
    
    # Garante que o diretório de uploads existe
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    os.makedirs(os.path.join(UPLOAD_DIR, "0"), exist_ok=True)
    os.makedirs(os.path.join(UPLOAD_DIR, "1"), exist_ok=True)

    unique_file_name = generate_unique_filename(file.filename)

    # Caminho para salvar o arquivo
    file_path = os.path.join(UPLOAD_DIR, unique_file_name)
    
    # Salva o arquivo no servidor
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    

    # PROCESSA O ARQUIVO
    with open(file_path, "r", encoding="utf-8") as html_file:
        1


    # GERANDO GRÁFICOS DE EXEMPLO

    x = [1, 2, 3, 4, 5]
    y = [10, 20, 15, 25, 30]


    fig = Figure()
    ax = fig.subplots()

    ax.plot(x, y)

    img_path = os.path.join(UPLOAD_DIR, "0", f"{unique_file_name}.png")
    print(img_path)

    fig.savefig(img_path)

    fig = Figure()
    ax = fig.subplots()
    x = [1, 2, 3, 4, 5]
    y = [30, 25, 15, 20, 10]

    ax.plot(x, y)

    img_path = os.path.join(UPLOAD_DIR, "1", f"{unique_file_name}.png")
    fig.savefig(img_path)


    charset = "utf-8"
    RESULTS[unique_file_name] = {"filename": unique_file_name, "charset" : charset}




    return {"filename": unique_file_name, "charset": charset,  "message": "Upload realizado com sucesso"}


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
    
    



