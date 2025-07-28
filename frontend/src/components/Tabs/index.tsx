import React, { useEffect, useState } from 'react'
import { AbaContainer, Aba, Conteudo } from './styled'
import { FrontData, HistoryType } from '../../types'
import Overview from '../Overview';
import { DropdownInput } from '../DropDownInput';
import DiagramaComResumo from '../DiagramaComResumo';
import Historico from '../Historico';

interface ITabs {
  frontData: FrontData;
  oldUrl: string;
  newUrl: string;
}

const Tabs: React.FC<ITabs> = ({frontData, oldUrl, newUrl}: ITabs) => {
  const abas = ['Overview', 'Diagramas', 'Histórico Novo'] as const;
  type Aba = typeof abas[number];


  const [abaAtiva, setAbaAtiva] = useState<Aba>('Overview');
  const [windowSize, setWindowSize] = useState(window.innerWidth);


useEffect(() => {
  let timeout: ReturnType<typeof setTimeout>;

  const handleResize = () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      setWindowSize(window.innerWidth);
    }, 300);
  };

  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);

  
  return (
    <div style={{ margin: '5%', width: 'auto', padding: '10px', display: "flex", flexDirection: "column" }}>

      {windowSize > 730?

      <AbaContainer>
        <Aba $ativo={abaAtiva === 'Overview'} onClick={() => setAbaAtiva('Overview')}>Overview</Aba>
        <Aba $ativo={abaAtiva === 'Diagramas'} onClick={() => setAbaAtiva('Diagramas')}>Diagramas</Aba>
        <Aba $ativo={abaAtiva === 'Histórico Novo'} onClick={() => setAbaAtiva('Histórico Novo')}>Histórico Novo</Aba>
      </AbaContainer>

      :

      <DropdownInput 
        value={abaAtiva} 
        options={['Overview', 'Diagramas', 'Histórico Novo', 'Regras de Transição']} 
        onSelect={(value: string) => setAbaAtiva(value as Aba)}
        backgroundColor={"#c2d2f0"}
        borderRadius='4px 4px 0 0'
        fontWeight='bold'
        
        />
      }

      <Conteudo>
        {abaAtiva === 'Overview' && <Overview images={frontData.images} metrics={frontData.summarized_metrics}/>}
        
        {abaAtiva === 'Diagramas' && <DiagramaComResumo oldUrl={oldUrl} newUrl={newUrl} windowSize={windowSize} frontData={frontData} />}
        
        {abaAtiva === 'Histórico Novo' && <Historico history={frontData.historico} historyType={HistoryType.NEW} />}
      </Conteudo>
    </div>

  )
}

export default Tabs
