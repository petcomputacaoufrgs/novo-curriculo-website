import { useEffect, useState } from 'react';
import api from '../../api';
import { Card, DataCell, DropdownButton, DropdownContent, Explicacao, HeaderCell, SmallInfo, Tabela, Wrapper } from './styled';
import { ChevronDown, ChevronUp } from 'lucide-react';


const regraExplicacoes = {
  'temporalidade': 'Regras baseadas no tempo de curso. A temporalidade é contada a partir do semestre em que a primeira cadeira do curso foi completada até o semestre atual. Ex: durante o processo de matrícula em 2026/1, uma pessoa que completou a primeira cadeira em 2023/1 terá temporalidade 6 (Temp-6), pois se passaram 6 semestres desde que ela completou a primeira cadeira: 2023/1, 2023/2, 2024/1, 2024/2, 2025/1, 2025/2',
  'mudança de caráter': 'Disciplinas obrigatórias que serão convertidas em eletivas ou disciplinas eeletivas que liberarão obrigatórias.',
  'mudança no número de créditos': 'Disciplinas que permanecem com o mesmo nome e caráter, mas que tiveram seu número de créditos alterado',
  'mapeamento não direto': 'Regras não imediatas, de disciplinas que mapeiam para outras de nomes diferentes.',
  'mapeamento direto': 'Disciplinas que permanecem com o mesmo nome, caráter e quantidade de créditos após a mudança curricular.'

};

type Regra = {
  codigo_fez: string;
  carater_fez: string;
  creditos_fez: number;
  codigo_obtem: string;
  carater_obtem: string;
  creditos_obtem: number;
  nome_regra: string;
  nome_fez: string;
  nome_obtem: string;
  tipo_regra: string;
};



export default function RegrasEquivalencia() {
  const [regras, setRegras] = useState<Regra[]>([]);
  const [abertos, setAbertos] = useState<Record<string, boolean>>({});


  const chevronSize = "20px";

  useEffect(() => {
    const fetchRegras = async () => {
      const response = await api.get("/api/regrasEquivalencia");
      console.log(response.data);
      setRegras(response.data);
    };

    fetchRegras();
  }, []);

  const regrasPorTipo = regras.reduce((acc, regra) => {
    const tipo = regra.tipo_regra.toLowerCase();
    if (!acc[tipo]) acc[tipo] = [];
    acc[tipo].push(regra);
    return acc;
  }, {} as Record<string, typeof regras>);

  const toggleDropdown = (tipo: string) => {
    setAbertos(prev => ({ ...prev, [tipo]: !prev[tipo] }));
  };

return (
  <Wrapper>
    {Object.entries(regraExplicacoes).map(([tipo, explicacao]) => (
      <Card key={tipo}>
        <DropdownButton onClick={() => toggleDropdown(tipo)}>
          {"Regras de " + tipo[0].toUpperCase() + tipo.slice(1)}
          {abertos[tipo] ? <ChevronDown size={chevronSize} color='white' /> : <ChevronUp size={chevronSize} color='white' />}
        </DropdownButton>
        {abertos[tipo] && (
          <DropdownContent>
            <Explicacao>{explicacao}</Explicacao>
            <Tabela>
              <thead>
                <tr>
                  <HeaderCell>Código</HeaderCell>
                  <HeaderCell>Fez</HeaderCell>
                  <HeaderCell>Obtém</HeaderCell>
                </tr>
              </thead>
              <tbody>
                {(regrasPorTipo[tipo] || []).map((regra, index) => (
                  <tr key={index}>
                    <DataCell>
                      <div>{regra.nome_regra}</div>
                    </DataCell>
                    <DataCell>
                      <div>{regra.nome_fez}</div>
                      <SmallInfo>
                        {regra.carater_fez} — {regra.creditos_fez} créditos
                      </SmallInfo>
                    </DataCell>
                    <DataCell>
                      <div>{regra.nome_obtem}</div>
                      <SmallInfo>
                        {regra.carater_obtem} — {regra.creditos_obtem} créditos
                      </SmallInfo>
                    </DataCell>
                  </tr>
                ))}
              </tbody>
            </Tabela>
          </DropdownContent>
        )}
      </Card>
    ))}
  </Wrapper>
);

}



