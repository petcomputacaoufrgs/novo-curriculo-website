// Representa as URLs (ou strings base64) dos gráficos do tipo donut
// Cada campo corresponde a uma categoria e um currículo (antigo ou novo)
export interface OverViewImages {
  /** Gráfico de créditos eletivos no currículo antigo */
  eletivos_antigos: string;

  /** Gráfico de créditos eletivos no currículo novo */
  eletivos_novos: string;

  /** Gráfico de créditos obrigatórios no currículo antigo */
  obrigatorios_antigos: string;

  /** Gráfico de créditos obrigatórios no currículo novo */
  obrigatorios_novos: string;

  /** Gráfico de créditos totais no currículo antigo */
  total_antigos: string;

  /** Gráfico de créditos totais no currículo novo */
  total_novos: string;
}

// Representa os valores numéricos dos créditos obtidos e totais por categoria
// Cada lista geralmente tem dois elementos: [obtidos, totais]
export interface SummarizedMetrics {
  /** Créditos eletivos no currículo antigo */
  eletivos_antigos: number[];

  /** Créditos eletivos no currículo novo */
  eletivos_novos: number[];

  /** Créditos obrigatórios no currículo antigo */
  obrigatorios_antigos: number[];

  /** Créditos obrigatórios no currículo novo */
  obrigatorios_novos: number[];

  /** Créditos totais no currículo antigo */
  total_antigos: number[];

  /** Créditos totais no currículo novo */
  total_novos: number[];
}

// Dados de todas as cadeiras pertencentes a uma etapa do histórico
// O índice i de qualquer lista representa o valor da disciplina i
export interface EtapaHistorico {
  /** Códigos das disciplinas (ex: INF01001) */
  codigo: string[];

  /** Créditos de cada disciplina */
  creditos: number[];

  /** Nomes das disciplinas */
  nome: string[];

  /** Quantidade de alunos que ainda precisam cursar essa disciplina */
  qt_students_needing_it: number[];

  /** Nome da regra que justificou a alocação da disciplina nessa etapa */
  rule_name: string[];
}

// Estrutura completa dos dados retornados pelo backend para a interface
export interface FrontData {
  /** HTML gerado com o histórico do aluno (versão atual) */
  html: string;

  /** HTML com o histórico anterior à adaptação curricular */
  html_old_diagram: string;

  /** Lista de etapas do histórico. O índice i contém os dados das cadeiras da etapa i. O índice 0 contém as cadeiras eletivas */
  historico: EtapaHistorico[];

  /** Imagens dos gráficos do tipo donut */
  images: OverViewImages;

  /** Métricas numéricas resumidas por categoria */
  summarized_metrics: SummarizedMetrics;

  /** Caminho das disciplinas no currículo antigo (ex: percurso ideal) */
  caminho_antigo: string;

  /** Caminho das disciplinas no currículo novo */
  caminho_novo: string;
}

export enum HistoryType {
  /** Histórico antigo, antes da adaptação curricular */
  OLD = "old",

  /** Histórico atual, após a adaptação curricular */
  NEW = "new",
}
