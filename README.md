# Website para Visualização das Mudanças com o Novo Currículo CIC

#### Projeto: Borboleta

#### Ferramentas utilizada: FastAPI + React

#### Autor(es): [[Nomezinho](https://github.com/username-do-nomezinho)], [[Nomezinho](https://github.com/username-do-nomezinho)]

## Sobre o Projeto

Este projeto tem como objetivo encapsular a ferramenta desenvolvida pelo professor Henrique Becker para simular a equivalência de disciplinas da mudança de currículo do curso de Ciência da Computação da UFRGS em um website, com o intuito de melhorar a experiência geral do usuário. A versão web busca ampliar a portabilidade, facilitar o acesso e tornar a visualização das equivalências mais clara, intuitiva e interativa.

Ferramenta original do professor Henrique disponível [aqui](https://codeberg.org/hbecker/ClassHistoryConverter/src/branch/main)


## Como instalar e rodar o projeto

### 1) Configuração do Ambiente Linux

Primeiramente, você vai precisar de um ambiente Linux. Se você já está usando um sistema Linux, pule para o passo 2. 

Caso esteja usando Windows, você precsa rodar por meio do WSL.

Você pode ver o tutorial oficial de instalação do WSL [aqui](https://learn.microsoft.com/pt-br/windows/wsl/install
).

Você pode, por exemplo, instalar a distribuição Ubuntu do Linux rodando o comando:

```
wsl --install
wsl --install -d ubuntu
```

E então acessar o sistema rodando:

```
wsl
```

### 2) Interpretador Julia

Uma vez no sistema Linux, você vai precisar de um interpretador Julia paa rodar o backend da aplicação.

Recomendamos instalar a versão mais recente disponível no site [oficial](https://julialang.org/downloads/
).

Para isso, basta executar:

```
curl -fsSL https://install.julialang.org | sh
```

Após a instalação, recarregue as variáveis de ambiente no PATH executando um dos comandos abaixo, dependendo do shell que você está usando:

```
source ~/.bashrc
```

```
source ~/.profile
```

### 3) Clonando o repositório

Agora, você pode clonar esse repositório:

```
git clone https://github.com/petcomputacaoufrgs/novo-curriculo-website.git
```

4) Testando a instalação do Julia

Dentro do repositório, vá até a pasta:

```
cd backend/ClassHistoryConverter/scripts
```

Você pode testar se está tudo certo com a instalação do Julia rodando o script de conversão do histórico diretamente. 

Para isso, rode:

```
./update.sh INF_UFRGS_DATA
```

Se aparecer um erro de "Permissão negada", é porque você precisa dar permissão de execução ao script:

```
chmod +x update.sh
```

E então rodar novamente.

Isso deve rodar o script de conversão para um histórico de exemplo ```histórico.csv``` dentro da pasta ```INF_UFRGS_DATA``` e jogar os resultados da execução do script nessa pasta. Se a operação funcionar, então a instalação do Julia está correta.

### 5) Instalação das dependências do projeto

Agora, você precisa instalar as dependências do projeto.

#### 5.1) Backend

Indo para a pasta ```backend```:

##### I. Crie um ambiente virtual:

```
python3 -m venv <nome>
```

Por exemplo:

```
python3 -m venv myenv
```

Caso não tenha o pytohn3-venv, garanta a instalação:

```
apt install python3.12-venv
```

##### II. Ative o ambiente:

```
source <nome>/bin/activate
```

##### III. Baixe as dependências

```
pip install -r requirements.txt
```

Caso não tenha o pip, você pode instalar rodando:

```
sudo apt-get update
sudo apt install python3-pip
```

##### IV. Rodar a API

A partir desse momento, você pode rodar a API com:

```
uvicorn main:app --host 127.0.0.1 --port 8000
```

Nesse caso, é importante que a porta seja a 8000 porque é para essa porta que as requisições estão sendo feitas (definido em ```frotend/api.ts```)

##### V. Sair do ambiente virtual

Para sair do ambiente virtual:

```
deactivate
```

#### 5.2) Frontend

Indo para a pasta ```frontend```:

##### I. Certifique-se de ter o nodejs e o npm

```
sudo apt update
sudo apt install nodejs
sudo apt install npm
```

##### II. Reinicie o terminal

Certifique-se de reiniciar o ambiente (fechar e abrir de novo o terminal) para que as configurações sejam atualizadas e não haja conflitos.

##### III) Instale as dependências

Basta ir novamente a pasta frontend e rodar:

```
npm install
```

##### IV) Rodar o front

Para isso, basta rodar:

```
npm run dev
```

### 6) Pronto! Aplicação rodando!
Agora você pode rodar o back e o front ao mesmo tempo e a aplicação deverá estar funcionando.

