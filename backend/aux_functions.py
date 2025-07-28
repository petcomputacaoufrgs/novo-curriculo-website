import base64
import hashlib
import io
import time
from matplotlib import pyplot as plt
import pandas as pd

alternativas_cic = {
    # Empreendimentos ou Introdução ao Empreendedorismo: considerando código de Empreendimentos como o principal para o grupo
    "EMPREENDIMENTO EM INFORMÁTICA": "INF01032",
    "INTRODUÇÃO AO EMPREENDEDORISMO E INOVAÇÃO": "INF01032"
}

alternativas_ecp = {
    "PROBABILIDADE E ESTATÍSTICA": "MAT02219",
    "PROBABILIDADE E ESTATÍSTICA - EAD": "MAT02219"
}



ANO_ATUAL = 2026
BARRA_ATUAL = 1


def get_alternative_discipline(discipline_name, curso_nome):
    if curso_nome == "CIC":
        return alternativas_cic.get(discipline_name, "Not Found")
    elif curso_nome == "ECP":
        return alternativas_ecp.get(discipline_name, "Not Found")
    
def correct_alternative_disciplines(cadeiras, curso):
    """
    Ajusta as cadeiras alternativas de cada curso. Se o usuário tiver feito uma das cadeiras do grupo de alternativas, entrega pra ele o grupo de alternativas completo
    """
    if curso == "CIC":
        for dados_cadeira in cadeiras:
            if dados_cadeira[2] in ("INF01032", "QUI99009"):
                dados_cadeira[1] = "EMPREENDIMENTO EM INFORMÁTICA OU INTRODUÇÃO AO EMPREENDEDORISMO E INOVAÇÃO"
                dados_cadeira[2] = "INF01032"
    elif curso == "ECP":
        for dados_cadeira in cadeiras:
            if dados_cadeira[2] in ("MAT02219", "MAT02050"):
                dados_cadeira[1] = "PROBABILIDADE E ESTATÍSTICA"
                dados_cadeira[2] = "MAT02219"


    return cadeiras




def calculate_temporality(semestre_ingresso: str) -> int:
    """
    Calcula a 'temporalidade' de um aluno com base no semestre de ingresso,
    assumindo que cada ano tem duas barras (semestres).

    Args:
        semestre_ingresso (str): Semestre de ingresso no formato "AAAA/B", 
                                 onde B é 1 ou 2.

    Returns:
        int: Número de semestres (barras) desde o ingresso até o semestre atual.
    """
    ano_ingresso, barra_ingresso = semestre_ingresso.split("/")
    diff_anos = ANO_ATUAL - int(ano_ingresso)
    diff_barra = BARRA_ATUAL - int(barra_ingresso)

    return diff_anos * 2 + diff_barra + 1




def traduzir_path(path_col: pd.Series, df_nomes: pd.DataFrame) -> pd.Series:
    """
    Traduz os códigos de um caminho hierárquico para seus nomes descritivos.

    Exemplo: "MAT01353>MAT01354" → "Cálculo I > Cálculo II"

    Args:
        path_col (pd.Series): Coluna contendo strings com códigos separados por '>'.
        df_nomes (pd.DataFrame): DataFrame com colunas 'codigo' e 'nome' para mapeamento.

    Returns:
        pd.Series: Coluna com os nomes traduzidos e concatenados com ' > '.
    """
    mapa = df_nomes.set_index('codigo')['nome'].to_dict()
    
    return (
        path_col
        .str.split('>')
        .apply(lambda cods: [mapa.get(c, c) for c in cods])
        .str.join(' > ')
    )



def plot_function(summarised_metrics, remaining_index, total_credits, title):
    """
    Gera um gráfico de pizza (formato donut) que mostra a proporção de créditos 
    completos e restantes, e retorna a imagem em base64.

    Args:
        summarised_metrics (pd.DataFrame): DataFrame com colunas que incluem um valor
                                           de créditos (acessado via .value).
        remaining_index (int): Índice no DataFrame onde está o valor de créditos restantes.
        total_credits (int): Total de créditos exigidos.
        title (str): Título a ser exibido no gráfico.

    Returns:
        tuple[str, list[int]]: 
            - String em base64 da imagem PNG do gráfico.
            - Lista contendo [total_credits, completed_credits].
    """

    # Extrai a quantidade de créditos faltantes e calcula os créditos completados
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

    # Criação do gráfico de pizza
    fig, ax = plt.subplots(figsize=(8, 6), dpi=100)
    plt.style.use('fivethirtyeight')

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

    ax.set_title(title)

    # Mostra a porcentagem de créditos obtidos no centro do gráfico
    percent_credits_done = completed_credits / total_credits * 100
    ax.text(0, 0, f"{percent_credits_done:.1f}%", dict(size=30, ha='center', va='center'))

    # Ajusta o layout para evitar cortes
    plt.tight_layout()

    # Salva o gráfico em um buffer de memória e em seguida como uma imagem PNG
    buf = io.BytesIO()
    fig.savefig(buf, format='png')
    buf.seek(0)

    # Converte a imagem para base64
    img_base64 = base64.b64encode(buf.read()).decode('utf-8')
    buf.close()

    return img_base64, [total_credits, completed_credits]


def generate_unique_filename(filename):
    """
    Gera um nome de arquivo único baseado no timestamp atual e em um hash do nome original.

    Parâmetros:
    - filename (str): Nome original do arquivo.

    Retorna:
    - str: Nome de arquivo único no formato `<timestamp>_<hash>_<filename>`.
    
    Exemplo:
    >>> generate_unique_filename("dados.csv")
    '1721689945_a2b5c3..._dados.csv'
    """
    timestamp = str(int(time.time()))  # Gera um timestamp único
    hash_str = hashlib.md5(filename.encode()).hexdigest()  # Gera um hash do nome do arquivo
    return f"{timestamp}_{hash_str}_{filename}"




