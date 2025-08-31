FROM julia:1.10-bullseye

# Instala Python e pip
RUN apt-get update && apt-get install -y \
    python3 python3-pip \
    && rm -rf /var/lib/apt/lists/*

# Instala dependencias Python
COPY requirements.txt .
RUN pip3 install --no-cache-dir -r requirements.txt

# Copia os arquivos do projeto
COPY . /app
WORKDIR /app

# Limpa o Manifest.toml se necessario
RUN rm -f ClassHistoryConverter/Manifest.toml

# Instala dependencias Julia do projeto principal
RUN julia --project=./ClassHistoryConverter -e 'using Pkg; Pkg.instantiate()'

# Instala o PackageCompiler e gera a sysimage
#RUN julia --project=./ClassHistoryConverter -e 'using Pkg; Pkg.add("PackageCompiler")'
#RUN chmod +x ClassHistoryConverter/scripts/create_sysimage.jl
#RUN julia --startup-file=no --project=./ClassHistoryConverter ClassHistoryConverter/scripts/create_sysimage.jl


RUN chmod +x ClassHistoryConverter/scripts/update.sh

# Expoe a porta usada pelo Uvicorn
EXPOSE 10000

# Comando para iniciar o FastAPI
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "10000"]
