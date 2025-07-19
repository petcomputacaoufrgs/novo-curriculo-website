import React, { useEffect, useState } from 'react'
import { AbaContainer, Aba, Conteudo } from './styled'
import { FrontData } from '../../types'
import Overview from '../Overview';
import { DropdownInput } from '../DropDownInput';

interface ITabs {
  frontData?: FrontData;
}

const Tabs: React.FC<ITabs> = ({frontData}: ITabs) => {
  const abas = ['Overview', 'Diagramas', 'Histórico Novo', 'Regras de Transição'] as const;
  type Aba = typeof abas[number];


  const [abaAtiva, setAbaAtiva] = useState<Aba>('Overview');
  const [windowSize, setWindowSize] = useState(window.innerWidth);



  useEffect(() => {
      const handleResize = () => {
        setWindowSize(window.innerWidth);
      };
  
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);



  return (
    <div style={{ margin: '5%', width: 'auto', padding: '10px', maxHeight: '800px', display: "flex", flexDirection: "column" }}>

      {windowSize > 730?

      <AbaContainer>
        <Aba $ativo={abaAtiva === 'Overview'} onClick={() => setAbaAtiva('Overview')}>Overview</Aba>
        <Aba $ativo={abaAtiva === 'Diagramas'} onClick={() => setAbaAtiva('Diagramas')}>Diagramas</Aba>
        <Aba $ativo={abaAtiva === 'Histórico Novo'} onClick={() => setAbaAtiva('Histórico Novo')}>Histórico Novo</Aba>
        <Aba $ativo={abaAtiva === 'Regras de Transição'} onClick={() => setAbaAtiva('Regras de Transição')}>Regras de Transição</Aba>
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
        {abaAtiva === 'Overview' && frontData && <Overview images={frontData.images} metrics={frontData.summarized_metrics}/>}
        {abaAtiva === 'Diagramas' && <div>Conteúdo da aba "Diagramas"</div>}
        {abaAtiva === 'Histórico Novo' && <div>Conteúdo da aba "Histórico Novo"</div>}
        {abaAtiva === 'Regras de Transição' && <div>Conteúdo da aba "Regras de Transição"</div>}
      </Conteudo>
    </div>

  )
}

export default Tabs
