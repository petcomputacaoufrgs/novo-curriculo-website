import { useEffect, useState } from 'react';
import api from '../../api';
import { Card, DataCell, DropdownButton, DropdownContent, Explicacao, HeaderCell, SmallInfo, Tabela, Wrapper } from './styles';
import { ChevronDown, ChevronUp } from 'lucide-react';


const regraExplicacoes = {
  'temporalidade': 'Regras baseadas no tempo de curso. É contada a partir do semestre em que a primeira cadeira foi completada. Ex: no semestre 2026/01, uma pessoa que completou a primeira cadeira em 2023/01 terá temporalidade 7 (Temp-7).',
  'mapeamento não direto': 'Disciplinas que mudam com a mudança de currículo e precisam de equivalência específica. Ex: disciplinas que mudam de caráter (obrigatória para eletiva e vice-versa)',
  'mapeamento direto': 'Disciplinas que permanecem as mesmas após a mudança curricular.',
};

type Regra = {
  tipo_regra: string;
  nome_fez: string;
  carater_fez: string;
  creditos_fez: number;
  nome_obtem: string;
  carater_obtem: string;
  creditos_obtem: number;
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
                  <HeaderCell>Fez</HeaderCell>
                  <HeaderCell>Obtém</HeaderCell>
                </tr>
              </thead>
              <tbody>
                {(regrasPorTipo[tipo] || []).map((regra, index) => (
                  <tr key={index}>
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



