# Base: Python + Julia
FROM python:3.10-slim

# Instala dependências básicas e Julia
RUN apt-get update && apt-get install -y \
    wget \
    tar \
    curl \
    ca-certificates \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Baixa e instala Julia
ENV JULIA_VERSION=1.11.3

RUN wget https://julialang-s3.julialang.org/bin/linux/x64/1.11/julia-${JULIA_VERSION}-linux-x86_64.tar.gz \
    && tar -xvzf julia-${JULIA_VERSION}-linux-x86_64.tar.gz \
    && mv julia-${JULIA_VERSION} /opt/julia \
    && ln -s /opt/julia/bin/julia /usr/local/bin/julia \
    && rm julia-${JULIA_VERSION}-linux-x86_64.tar.gz

# Instala pacotes Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt



# Copia os arquivos do projeto
COPY . /app
WORKDIR /app

# Limpa o Manifest.toml se necessário
RUN rm -f ClassHistoryConverter/Manifest.toml

# Instala dependências Julia do projeto principal
RUN julia --project=./ClassHistoryConverter -e 'using Pkg; Pkg.instantiate()'

# Instala o PackageCompiler e gera a sysimage
RUN julia --project=./ClassHistoryConverter -e 'using Pkg; Pkg.add("PackageCompiler")'
RUN chmod +x ClassHistoryConverter/scripts/create_sysimage.jl
RUN julia --startup-file=no --project=./ClassHistoryConverter ClassHistoryConverter/scripts/create_sysimage.jl


RUN chmod +x ClassHistoryConverter/scripts/update.sh

# Expõe a porta usada pelo Uvicorn
EXPOSE 10000

# Comando para iniciar o FastAPI
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "10000"]
