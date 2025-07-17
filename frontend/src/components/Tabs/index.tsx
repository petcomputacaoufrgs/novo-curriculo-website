import React, { useState } from 'react'
import { AbaContainer, Aba, Conteudo } from './styled'
import { FrontData } from '../../types'
import Overview from '../Overview';

interface ITabs {
  frontData?: FrontData;
}

const Tabs: React.FC<ITabs> = ({frontData}: ITabs) => {
  const [abaAtiva, setAbaAtiva] = useState<'overview' | 'diagramas' | 'historico' | 'regras'>('overview')

  return (
    <div style={{ margin: '5%', width: 'auto', padding: '10px', maxHeight: '800px' }}>
      <AbaContainer>
        <Aba $ativo={abaAtiva === 'overview'} onClick={() => setAbaAtiva('overview')}>Overview</Aba>
        <Aba $ativo={abaAtiva === 'diagramas'} onClick={() => setAbaAtiva('diagramas')}>Diagramas</Aba>
        <Aba $ativo={abaAtiva === 'historico'} onClick={() => setAbaAtiva('historico')}>Histórico Novo</Aba>
        <Aba $ativo={abaAtiva === 'regras'} onClick={() => setAbaAtiva('regras')}>Regras de Transição</Aba>
      </AbaContainer>

      <Conteudo>
        {abaAtiva === 'overview' && frontData && <Overview images={frontData.images} metrics={frontData.summarized_metrics}/>}
        {abaAtiva === 'diagramas' && <div>Conteúdo da aba "Diagramas"</div>}
        {abaAtiva === 'historico' && <div>Conteúdo da aba "Histórico Novo"</div>}
        {abaAtiva === 'regras' && <div>Conteúdo da aba "Regras de Transição"</div>}
      </Conteudo>
    </div>
  )
}

export default Tabs
