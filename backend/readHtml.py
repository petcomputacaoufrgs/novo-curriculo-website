from bs4 import BeautifulSoup   # Biblioteca para fazer parsing do html.
import pandas as pd             # Biblioteca para manipulação de dados csv.
import os
import sys

def LeHtml(conteudo_html):
    
    # Lê o conteúdo do arquivo HTML.
    #pathArqHtml = os.path.join(os.path.dirname(__file__), 'historico.html')
    #try:
    #    with open(pathArqHtml, 'r', encoding='latin-1') as file:
    #        conteudo_html = file.read()
    #except FileNotFoundError:
    #    print(f"Arquivo HTML não encontrado no caminho esperado: \n{pathArqHtml}")
    #    sys.exit(1)

    parsed_html = BeautifulSoup(conteudo_html, 'html.parser')
    print("Arquivo HTML lido com sucesso.")
    semestres, nomeDisciplinas, codigos, semestre_ingresso, curso_nome = extraiDados(parsed_html)

    disciplinas = pd.read_csv(f'ClassHistoryConverter/scripts/INF_UFRGS_DATA/{curso_nome}/disciplinas.csv')

    disciplinas["etapa"] = disciplinas["etapa"].fillna(0)
    
    mapa = disciplinas.set_index('codigo')['etapa'].to_dict()
    
    # Associa etapas mantendo a ordem da lista original
    lista_etapas = [mapa.get(cod, None) for cod in codigos]

    dados = {"dados": [[semestres[i], nomeDisciplinas[i], codigos[i]] for i in range(len(semestres)) if codigos[i] != "Not Found"], "etapas": lista_etapas, "semestre_ingresso": semestre_ingresso, "curso": curso_nome}

    return dados

def extraiDados(parsed_html):
    historicoCurso = verificaTipoHistorico(parsed_html)
    if historicoCurso:
        return leHistoricoCurso(parsed_html)
    else:
        return leHistoricoEscolar(parsed_html)

def verificaTipoHistorico(parsed_html):
    # Verifica se o histórico é do tipo "Histórico Escolar" ou "Histórico do Curso".
    titulo_elemento = parsed_html.select_one('head title')
    if not titulo_elemento:
        raise Exception("Tipo de HTML não identificado. Verifique se o arquivo HTML é o historico escolar ou histórico de curso.")
    
    if "Histórico do Curso" in titulo_elemento.text.strip():
        print("Histórico do Curso identificado.")
        return True
    else: 
        if "Histórico Escolar" in titulo_elemento.text.strip():
            print("Histórico Escolar identificado.")
            return False

def calculaSemestreIngresso(semestres: list[str]):
    # Para garantir que vai pegar o semestre correto caso sejam inseridos zeros à esquerda, como em "2024/01" em comparação com "2024/2"
    def parse(sem: str) -> tuple[int, int]:
        ano, semestre = sem.split("/")
        return (int(ano), int(semestre))

    return min(semestres, key=parse)

def leHistoricoCurso(parsed_html):

    # === 1. Recupera o nome do curso ===
    div_moldura = parsed_html.select_one('div.moldura')
    curso_nome = None
    if div_moldura:
        texto_moldura = div_moldura.get_text(separator="\n").upper()
        if "CIÊNCIA DA COMPUTAÇÃO" in texto_moldura:
            curso_nome = "CIC"
        elif "ENGENHARIA DE COMPUTAÇÃO" in texto_moldura:
            curso_nome = "ECP"
        else:
            print("Curso não identificado.")


    # === 2. Encontra a tabela com o histórico do aluno. ===
    tabela = parsed_html.select_one('fieldset.moldura > table.modelo1')
    
    semestres = []
    nomeDisciplinas = []
    codigos = []
    # Verifica se a tabela foi encontrada.
    if tabela:
        # Itera sobre cada linha da tabela.
        for linha in tabela.find_all('tr')[1:]:
            colunas = linha.find_all('td')
            situacao = colunas[6].text.strip()
            if situacao == "Aprovado":
                semestres.append(colunas[0].text.strip())
                nomeCodigo = colunas[1].text.strip()
                # Separa o código da disciplina do nome da disciplina.
                codigo, nome = nomeCodigo.split(']', 1)
                codigos.append(codigo.strip('[]'))
                nomeDisciplinas.append(nome.strip())

                # DEBUG: Imprime o semestre, código e nome da disciplina.
                #print(f"Semestre: {semestres[-1]}, Código: {codigos[-1]}, Nome: {nomeDisciplinas[-1]}")
    else:
        print("Tabela do histórico não encontrada.")

    semestre_ingresso = calculaSemestreIngresso(semestres)

    return semestres, nomeDisciplinas, codigos, semestre_ingresso, curso_nome

def leHistoricoEscolar(parsed_html):

    # === 1. Recupera o nome do curso ===
    div_moldura = parsed_html.select_one('div.moldura')

    curso_nome = None
    if div_moldura:
        texto_moldura = div_moldura.get_text(separator="\n").upper()
        if "CIÊNCIA DA COMPUTAÇÃO" in texto_moldura:
            curso_nome = "CIC"
        elif "ENGENHARIA DE COMPUTAÇÃO" in texto_moldura:
            curso_nome = "ECP"
        else:
            print("Curso não identificado.")

    
    # === 2. Encontra a tabela com o histórico do aluno. ===
    tabela = parsed_html.select_one('fieldset.moldura > table.modelo1')
    
    semestres = []
    nomeDisciplinas = []
    # Verifica se a tabela foi encontrada.
    if tabela:
        # Itera sobre cada linha da tabela (ignorando o cabeçalho).
        for linha in tabela.find_all('tr')[1:]:
            colunas = linha.find_all('td')
            if len(colunas) >= 5:
                situacao = colunas[4].text.strip()
                if situacao == "Aprovado":
                    semestres.append(colunas[0].text.strip())
                    nomeDisciplinas.append(colunas[1].text.strip())

                    # DEBUG: Imprime o semestre e o nome da disciplina. Índice -1 é o último elemento da lista.
                    #print(f"Semestre: {semestres[-1]}, Nome: {nomeDisciplinas[-1]}")
    else:
        print("Tabela do histórico não encontrada.")

    codDisciplinas = getCodCadeiras(nomeDisciplinas, curso_nome)

    semestre_ingresso = calculaSemestreIngresso(semestres)

    return semestres, nomeDisciplinas, codDisciplinas, semestre_ingresso, curso_nome

def getCodCadeiras(nomeDisciplinas, curso_nome):
    # Carrega CSV com nome e códigos de disciplinas
    pathArqCsv = os.path.join(os.path.dirname(__file__), 'ClassHistoryConverter', 'scripts', 'INF_UFRGS_DATA', curso_nome, 'disciplinas.csv')

    df = pd.read_csv(pathArqCsv, encoding="utf-8")

    if df.empty:
        print("Arquivo disciplinas.csv não encontrado.")
        return

    # Remove as disciplinas do novo currículo
    df = df[df["cv"] != "novo"]

    # Converte para dicionário
    nomeToCod = dict(zip(df["nome"], df["codigo"]))

    # Lookup de códigos de disciplinas
    codDisciplinas = []
    for discipline_name in nomeDisciplinas:
        codDisciplinas.append(nomeToCod.get(discipline_name, "Not Found"))
        if codDisciplinas[-1] == "Not Found":
            print(f"Disciplina {discipline_name} não encontrada.")

        # DEBUG: Imprime o nome e código da disciplina.
        #print(f"Disciplina: {discipline_name}\n Código: {codDisciplinas[-1]}")
    return codDisciplinas

def criaHistoricoCSV(dados, filePath, temporalidade):
    # Cria um DataFrame com os dados lidos do HTML de histórico. Código de matrícula não é necessário.
    #df = pd.DataFrame({'cartao': 12345678, 'ingresso': semestres, 'codigo': codDisciplinas, 'titulo': ]#nomeDisciplinas, 'situacao': 'Aprovado'})

    df = pd.DataFrame(dados, columns=['ingresso', 'titulo', 'codigo'])
    

    # Adiciona as regras de temporalidade
    limite_inferior_regras_temporalidade = 4
    limite_superior_regras_temporalidade = 7
    
    if temporalidade > limite_superior_regras_temporalidade:
        temporalidade = limite_superior_regras_temporalidade


    while temporalidade >= limite_inferior_regras_temporalidade:
        df.loc[len(df)] = ['2026/1', f'Ingresso até Temp-{temporalidade}', f'Temp-{temporalidade}']
        temporalidade = temporalidade - 1



    # Adiciona as colunas fixas.
    df['cartao'] = 12345678
    df['situacao'] = 'Aprovado'

    # Reorganiza a ordem das colunas.
    df = df[['cartao', 'ingresso', 'codigo', 'titulo', 'situacao']]

    # Salva o DataFrame em um arquivo CSV.
    df.to_csv(filePath, index=False)

    print("historico.csv criado com sucesso!")

def printHistorico():
    # Carrega o novo histórico e imprime.
    pathCsv = os.path.join(os.path.dirname(__file__), 'historico.csv')
    df = pd.read_csv(pathCsv)
    print("-------------------------------")
    print(" Histórico do aluno:")
    print(" Semestre, Nome, Código")
    while True:
        for i in range(len(df)):
            print(f" {df['ingresso'][i]}, {df['titulo'][i]}, {df['codigo'][i]}")
        break
    print("-------------------------------")

#------------------------------------------------------------
# Main
#soup = LeHtml()
#semestres, nomeDisciplinas, codDisciplinas = extraiDados(soup)
#criaHistoricoCSV(semestres, nomeDisciplinas, codDisciplinas)
# DEBUG: Imprime
#printHistorico()