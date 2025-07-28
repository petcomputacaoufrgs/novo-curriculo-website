import { FrontData, HistoryType } from '../../types';
import { CheckboxContainer, StyledCheckbox, DataCell, DropdownButton, HeaderCell, Tabela, Wrapper } from './styled';
import { useState, useEffect, useCallback } from 'react';
import React, { Fragment } from 'react';

interface Props {
    history?: FrontData['historico'];
    historyType: HistoryType;

    // Array onde cada elemento é um array de strings representando dados da disciplina: semestre, nome, código. É usado apenas para o histórico carregado pelo usuário.
    uploadedHistory?: string[][]; 

    onHistoryChange?: (getHistoryFn: () => string[][]) => void;
}

const Historico: React.FC<Props> = ({ history, historyType, uploadedHistory, onHistoryChange}) => {
    const [expandedEtapas, setExpandedEtapas] = useState<Set<number>>(new Set());
    const [checkedStates, setCheckedStates] = useState<{[key: string]: boolean}>({});
    // Estado para armazenar a referência do histórico padrão antigo
    const [oldHistoryReference, setOldHistoryReference] = useState<FrontData['historico'] | null>(null);

    const isDarkTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;


    // useEffect para capturar e armazenar o histórico antigo como referência
    useEffect(() => {
        if (historyType === HistoryType.OLD && history) {
            console.log('Salvando histórico antigo como referência:', history);
            setOldHistoryReference(history);
        }
    }, [history, historyType]);

    // useEffect para inicializar o estado dos checkboxes quando um histórico é carregado
    useEffect(() => {
        if (oldHistoryReference && uploadedHistory) {
            const initialCheckedStates: {[key: string]: boolean} = {};
            
            // Cria um mapa das disciplinas cursadas pelo aluno (do histórico carregado)
            const disciplinasCursadas = new Set<string>();
            uploadedHistory.forEach(disciplina => {
                if (disciplina && disciplina.length > 2) {
                    const [, , codigo] = disciplina;
                    disciplinasCursadas.add(codigo);
                }
            });
            
            // Percorre o histórico antigo (referência completa) e marca as que foram cursadas
            oldHistoryReference.forEach((etapa, etapaIndex) => {
                if (etapa.codigo) {
                    etapa.codigo.forEach((codigo, disciplinaIndex) => {
                        const key = `${etapaIndex}-${disciplinaIndex}`;
                        // Marca como true apenas se a disciplina foi cursada pelo aluno
                        initialCheckedStates[key] = disciplinasCursadas.has(codigo);
                    });
                }
            });
            
            console.log('Setting initial checked states for UPLOADED:', initialCheckedStates);
            setCheckedStates(initialCheckedStates);
        } else {
            // Para outros tipos de histórico, limpa o estado
            setCheckedStates({});
        }
    }, [history, historyType, uploadedHistory, oldHistoryReference]);

    const handleOnChange = (etapaIndex: number, disciplinaIndex: number) => {
        const key = `${etapaIndex}-${disciplinaIndex}`;
        setCheckedStates(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    // Função para obter o histórico modificado baseado nos checkboxes
    const getModifiedHistory = useCallback((): string[][] => {
        if (!oldHistoryReference || !uploadedHistory) return [];
        
        const modifiedHistory: string[][] = [];
        
        oldHistoryReference.forEach((etapa, etapaIndex) => {
            if (etapa.codigo) {
                etapa.codigo.forEach((codigo, disciplinaIndex) => {
                    const key = `${etapaIndex}-${disciplinaIndex}`;
                    const isChecked = checkedStates[key] || false;
                    
                    if (isChecked) {
                        // Encontra a disciplina correspondente no histórico carregado
                        const disciplinaOriginal = uploadedHistory.find(d => d[2] === codigo);
                        if (disciplinaOriginal) {
                            modifiedHistory.push([...disciplinaOriginal]);
                        } else {
                            // Se não existe no histórico original, cria uma entrada padrão
                            modifiedHistory.push([
                                "2024/1", // semestre padrão
                                etapa.nome?.[disciplinaIndex] || codigo,
                                codigo
                            ]);
                        }
                    }
                });
            }
        });
        
        return modifiedHistory;
    }, [oldHistoryReference, uploadedHistory, checkedStates]);

    // Passa a função para o componente pai apenas quando necessário
    useEffect(() => {
        if (onHistoryChange) {
            onHistoryChange(getModifiedHistory);
        }
    }, [getModifiedHistory, onHistoryChange]);

/*
    const CheckBox = ({ etapaIndex, disciplinaIndex }: { etapaIndex: number, disciplinaIndex: number }) => {
        const key = `${etapaIndex}-${disciplinaIndex}`;
        const isChecked = checkedStates[key] || false;
        
        return(
            <CheckboxContainer>
                <StyledCheckbox
                    id={`concluded-checkbox-${key}`}
                    name="Concluded"
                    checked={isChecked}
                    
                />
            </CheckboxContainer>
        )
    }

*/

    if(!history && !oldHistoryReference) {
        return (<p> Erro: histórico de referência e histórico novo ou carregado não foram encontrados </p>);
    }

    // Para o histórico carregado, usa o histórico antigo como base se disponível
    const shownHistory = !history ? oldHistoryReference : history;

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
            {(shownHistory ?? []) // Verifica se o histórico existe
                .map((etapa, indiceEtapa) => ({ etapa, indiceEtapa }))
                .filter(({ indiceEtapa }) => indiceEtapa !== 0)
                .concat(
                    // Depois adiciona a etapa 0 no final
                    (shownHistory ?? [])
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
                            {expandedEtapas.has(indiceEtapa) ? ' ▼' : ' ▶'} 
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
                            {historyType == HistoryType.NEW &&
                            <HeaderCell>Motivo</HeaderCell>
                            }

                        </tr>
                        {etapa.codigo && etapa.codigo.map((codigo, indiceDisciplina) => (
                            <tr key={`${indiceEtapa}-${indiceDisciplina}`} 
                                onClick={historyType == HistoryType.OLD ? () => handleOnChange(indiceEtapa, indiceDisciplina) : undefined} 
                                style={{backgroundColor: (historyType == HistoryType.OLD && checkedStates[`${indiceEtapa}-${indiceDisciplina}`])? (isDarkTheme? "#1b5e20" : "#a5d6a7") : 
                                                         (historyType == HistoryType.NEW && etapa.rule_name[indiceDisciplina])? (isDarkTheme? "#1b5e20" : "#a5d6a7") : "",
                                        cursor: "pointer"}}>

                                <DataCell>{codigo}</DataCell>
                                <DataCell>{etapa.nome?.[indiceDisciplina] || 'N/A'}</DataCell>
                                {historyType === HistoryType.NEW &&
                                <DataCell>{etapa.rule_name?.[indiceDisciplina] || 'N/A'}</DataCell>
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

export default Historico;