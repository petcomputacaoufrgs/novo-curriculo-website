import { FrontData } from '../../types';
import { CheckboxContainer, StyledCheckbox, DataCell, DropdownButton, HeaderCell, Tabela, Wrapper } from './styled';
import { useState } from 'react';
import React, { Fragment } from 'react';

interface Props {
    novo_historico: FrontData['historico'];
    isOld: boolean;
}

const NovoHistorico: React.FC<Props> = ({ novo_historico, isOld}) => {
    const [expandedEtapas, setExpandedEtapas] = useState<Set<number>>(new Set());

   const [checkedStates, setCheckedStates] = useState<{[key: string]: boolean}>({});

    const handleOnChange = (etapaIndex: number, disciplinaIndex: number) => {
        const key = `${etapaIndex}-${disciplinaIndex}`;
        setCheckedStates(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const CheckBox = ({ etapaIndex, disciplinaIndex }: { etapaIndex: number, disciplinaIndex: number }) => {
        const key = `${etapaIndex}-${disciplinaIndex}`;
        const isChecked = checkedStates[key] || false;
        
        return(
            <CheckboxContainer>
                <StyledCheckbox
                    id={`concluded-checkbox-${key}`}
                    name="Concluded"
                    checked={isChecked}
                    onChange={() => handleOnChange(etapaIndex, disciplinaIndex)}
                />
            </CheckboxContainer>
        )
    }

    if(!novo_historico) {
        return (<p> Histórico novo não foi encontrado </p>);
    }

    const toggleEtapa = (indiceEtapa: number) => {
        const newExpanded = new Set(expandedEtapas);
        if (newExpanded.has(indiceEtapa)) {
            newExpanded.delete(indiceEtapa);
        } else {
            newExpanded.add(indiceEtapa);
        }
        setExpandedEtapas(newExpanded);
    };

    return (
    <Wrapper>
    <Tabela>
        <tbody>
            {novo_historico
                .map((etapa, indiceEtapa) => ({ etapa, indiceEtapa }))
                .filter(({ indiceEtapa }) => indiceEtapa !== 0)
                .concat(
                    // Depois adiciona a etapa 0 no final
                    novo_historico
                        .map((etapa, indiceEtapa) => ({ etapa, indiceEtapa }))
                        .filter(({ indiceEtapa }) => indiceEtapa === 0)
                )
                .map(({ etapa, indiceEtapa }) => (
                <Fragment key={indiceEtapa}>
                {/* Cabeçalho da etapa com botão dropdown */}
                <tr>
                    <DataCell colSpan={3}>
                        <DropdownButton 
                            onClick={() => toggleEtapa(indiceEtapa)}
                            style={{ width: '100%' }}
                        >
                            {expandedEtapas.has(indiceEtapa) ? '▼' : '▶'} 
                            {indiceEtapa === 0 ? 'Eletivas' : 'Etapa ' + indiceEtapa}
                        </DropdownButton>
                    </DataCell>
                </tr>
                
                {/* Conteúdo expandido - disciplinas da etapa */}
                {expandedEtapas.has(indiceEtapa) && (
                    <>
                        <tr>
                            <HeaderCell>Sigla</HeaderCell>
                            <HeaderCell>Título</HeaderCell>
                            <HeaderCell>{isOld ? 'Situação' : 'Motivo' + indiceEtapa}</HeaderCell>
                        </tr>
                        {etapa.codigo && etapa.codigo.map((codigo, indiceDisciplina) => (
                            <tr key={`${indiceEtapa}-${indiceDisciplina}`}>
                                <DataCell>{codigo}</DataCell>
                                <DataCell>{etapa.nome?.[indiceDisciplina] || 'N/A'}</DataCell>
                                {!isOld &&
                                <DataCell>{etapa.rule_name?.[indiceDisciplina] || 'N/A'}</DataCell>
                                }
                                {isOld &&
                                <DataCell>
                                    <CheckBox 
                                        etapaIndex={indiceEtapa} 
                                        disciplinaIndex={indiceDisciplina} 
                                    />
                                </DataCell>
                                }
                            
                            </tr> 
                        ))}
                    </>
                )}
            </Fragment>
            ))}
        </tbody>
    </Tabela>
    </Wrapper>
    );
};

export default NovoHistorico;