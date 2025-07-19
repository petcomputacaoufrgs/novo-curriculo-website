export interface OverViewImages {
    eletivos_antigos: string;
    eletivos_novos: string;
    obrigatorios_antigos: string;
    obrigatorios_novos: string;
    total_antigos: string;
    total_novos: string;
}

export interface SummarizedMetrics {
    eletivos_antigos: number[];
    eletivos_novos: number[];
    obrigatorios_antigos: number[];
    obrigatorios_novos: number[];
    total_antigos: number[];
    total_novos: number[];

}

export interface LinhaHistorico {
    codigo: string[];
    creditos: number[];
    nome: string[];
    qt_students_needing_it: number[];
    rule_name: string[]
}


export interface FrontData {
  html: string;
  historico: LinhaHistorico[];
  images: OverViewImages;
  summarized_metrics: SummarizedMetrics;
  caminho_antigo: string;
  caminho_novo: string;
}



