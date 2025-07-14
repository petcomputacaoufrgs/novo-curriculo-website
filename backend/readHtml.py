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
    semestres, nomeDisciplinas, codigos = extraiDados(parsed_html)
    dados = [[semestres[i], nomeDisciplinas[i], codigos[i]] for i in range(len(semestres)) if codigos[i] != "Not Found"]

    return dados
    #criaHistoricoCSV(semestres, nomeDisciplinas, codDisciplinas)

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

def leHistoricoCurso(parsed_html):
    # Encontra a tabela com o histórico do aluno.
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

    return semestres, nomeDisciplinas, codigos

def leHistoricoEscolar(parsed_html):
    # Encontra a tabela com o histórico do aluno.
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

    codDisciplinas = getCodCadeiras(nomeDisciplinas)
    return semestres, nomeDisciplinas, codDisciplinas

def getCodCadeiras(nomeDisciplinas):
    # Carrega CSV com nome e códigos de disciplinas
    pathArqCsv = os.path.join(os.path.dirname(__file__), 'disciplinas.csv')
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

def criaHistoricoCSV(dados, filePath):
    # Cria um DataFrame com os dados lidos do HTML de histórico. Código de matrícula não é necessário.
    #df = pd.DataFrame({'cartao': 12345678, 'ingresso': semestres, 'codigo': codDisciplinas, 'titulo': ]#nomeDisciplinas, 'situacao': 'Aprovado'})

    df = pd.DataFrame(dados, columns=['ingresso', 'titulo', 'codigo'])
    
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