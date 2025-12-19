import pandas as pd

historico_completo = pd.read_csv('historico_completo.csv')

historico = historico_completo[historico_completo["cv"] == "velho"]

historico["cartao"] = "577262"
historico["ingresso"] = "2023/01"
historico["situacao"] = "Aprovado"

historico = historico[["cartao", "ingresso", "codigo", "nome", "situacao"]]
historico.columns = ["cartao", "ingresso", "codigo", "titulo", "situacao"]

print(historico)

historico.to_csv("historico.csv", index=False)