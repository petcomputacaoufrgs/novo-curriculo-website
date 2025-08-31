import { FrontData, HistoryType } from '../../types';
import { CheckmarkContainer, CheckmarkIcon, DataCell, DropdownButton, HeaderRow, HeaderCell, Table, Wrapper, DataRow, DropdownCell } from './styled';
import { useState, useEffect, useCallback } from 'react';
import React, { Fragment } from 'react';

interface Props {
    history?: FrontData['historico'];
    historyType: HistoryType;

    // Array onde cada elemento é um array de strings representando dados da disciplina: semestre, nome, código. É usado apenas para o histórico carregado pelo usuário.
    uploadedHistory?: string[][]; 
    onHistoryChange?: (getHistoryFn: () => string[][]) => void;
    oldHistoryReference?: FrontData['historico']; // Nova prop opcional
}

const Historico: React.FC<Props> = ({ history, historyType, uploadedHistory, onHistoryChange, oldHistoryReference: propOldHistoryReference}) => {
        const [expandedEtapas, setExpandedEtapas] = useState<Set<number>>(history? ((historyType == HistoryType.NEW)? new Set(Array.from({length : history.length}, (_, i) => i)) : new Set(Array.from({length : history.length}, (_, i) => 1 + i))) : new Set());
    const [checkedStates, setCheckedStates] = useState<{[key: string]: boolean}>({});
    // Estado para armazenar a referência do histórico padrão antigo
    const [oldHistoryReference, setOldHistoryReference] = useState<FrontData['historico'] | null>(null);

    const isDarkTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;

    // useEffect para capturar e armazenar o histórico antigo como referência
    useEffect(() => {
        if (historyType === HistoryType.OLD && history) {

            setOldHistoryReference(history);
        } else if (propOldHistoryReference) {
            // Se foi passado como prop, usa essa referência

            setOldHistoryReference(propOldHistoryReference);
        }
    }, [history, historyType, propOldHistoryReference]);

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
            
            const newToggleEtapas = new Set(Array.from({ length: uploadedHistory.length }, (_, i) => i))

            setCheckedStates(initialCheckedStates);
            setExpandedEtapas(newToggleEtapas);
            
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

    // Passa a função de mudança de histórico para o componente pai apenas quando necessário
    useEffect(() => {
        if (onHistoryChange) {
            onHistoryChange(getModifiedHistory);
        }
    }, [getModifiedHistory, onHistoryChange]);

    const CheckMark = ({ etapaIndex, disciplinaIndex }: { etapaIndex: number, disciplinaIndex: number }) => {
        const key = `${etapaIndex}-${disciplinaIndex}`;
        const isChecked = checkedStates[key] || false;
        
        return(
            <CheckmarkContainer>
                <CheckmarkIcon $isVisible={isChecked} $isDarkTheme={isDarkTheme} />
            </CheckmarkContainer>
        )
    }

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

    // Método para criar um mapa de código para nome das disciplinas
    const createCodeToNameMap = useCallback(() => {
        const codeToNameMap: { [codigo: string]: string } = {};
        
        // Mapeia códigos do histórico antigo (oldHistoryReference)
        if (oldHistoryReference) {
            oldHistoryReference.forEach(etapa => {
                if (etapa.codigo && etapa.nome) {
                    etapa.codigo.forEach((codigo, index) => {
                        const nome = etapa.nome?.[index];
                        if (nome) {
                            codeToNameMap[codigo] = nome;
                        }
                    });
                }
            });
        }

        // Mapeia códigos do histórico novo (history atual)
        if (history) {
            history.forEach(etapa => {
                if (etapa.codigo && etapa.nome) {
                    etapa.codigo.forEach((codigo, index) => {
                        const nome = etapa.nome?.[index];
                        if (nome) {
                            codeToNameMap[codigo] = nome;
                        }
                    });
                }
            });
        }

        if (!oldHistoryReference && !history) {
            console.warn("Nenhum histórico disponível para criar o mapa de códigos.");
        }
        
        return codeToNameMap;
    }, [oldHistoryReference, history]);

    // Função helper para formatar nomes como título
    const formatName = useCallback((name: string): string => {
        if (!name) return name;
        
        // Remove tudo após o hífen (incluso)
        const nameWithoutHyphen = name.split('-')[0].trim();

        return nameWithoutHyphen
            .toLowerCase()
            .split(' ')
            .map((word, index) => {
                // Primeira palavra sempre é capitalizada
                if (index === 0) {
                    return word.charAt(0).toUpperCase() + word.slice(1);
                }

                // Se for número romano é mantido em maiúsculas
                if (/^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/.test(word.toUpperCase())) {
                    return word.toUpperCase();
                }

                // Palavras pequenas permanecem minúsculas
                if (word.length <= 4) {
                    return word;
                }

                // Outras palavras são capitalizadas
                return word.charAt(0).toUpperCase() + word.slice(1);
            })
            .join(' ');
    }, []);

    // Método para converter rule_name em formato legível
    const formatRuleName = useCallback((ruleName: string) => {
        if (!ruleName || ruleName === 'N/A') return 'N/A';
        
        const codeToNameMap = createCodeToNameMap();
        
        // Verifica se contém o símbolo "="
        if (ruleName.includes('=')) {
            const [leftCode, rightCode] = ruleName.split('=');
            // leftCode = código do currículo antigo
            // rightCode = código do currículo novo
            const leftName = formatName(codeToNameMap[leftCode]) || leftCode;
            const rightName = formatName(codeToNameMap[rightCode]) || rightCode;
            if (leftName === rightName) {
                return 'Concluída';
            }
            return `${leftName} ⇒ ${rightName}`;
        }
        
        // Se não contém "=", verifica se é um código simples
        const name = codeToNameMap[ruleName];
        return name ? formatName(name) : ruleName;
    }, [createCodeToNameMap, formatName]);

    return (
    <Wrapper>
        <Table>
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
                        <DropdownCell colSpan={4}>
                            <DropdownButton onClick={() => toggleEtapa(indiceEtapa)}>
                                {expandedEtapas.has(indiceEtapa) ? ' ▼ ' : ' ▶ '} 
                                {indiceEtapa === 0 ? 'Eletivas' : 'Etapa ' + indiceEtapa}
                            </DropdownButton>
                        </DropdownCell>
                    </tr>

                    {/* Conteúdo expandido - disciplinas da etapa */}
                    {expandedEtapas.has(indiceEtapa) && (
                        <>
                            <HeaderRow $isDarkTheme={isDarkTheme}>
                                <HeaderCell>Sigla</HeaderCell>
                                <HeaderCell>Título</HeaderCell>
                                <HeaderCell>Cred</HeaderCell>
                                {historyType == HistoryType.NEW &&
                                <HeaderCell>Motivo</HeaderCell>}
                                {historyType == HistoryType.OLD &&
                                <HeaderCell></HeaderCell>}

                            </HeaderRow>
                            {etapa.codigo && etapa.codigo.map((codigo, indiceDisciplina) => (
                                
                                <DataRow

                                    key={`${indiceEtapa}-${indiceDisciplina}`}
                                    onClick={historyType == HistoryType.OLD ? () => handleOnChange(indiceEtapa, indiceDisciplina) : undefined}
                                    $isClickable={historyType === HistoryType.OLD}
                                    $isHighlighted={
                                        (historyType === HistoryType.OLD && checkedStates[`${indiceEtapa}-${indiceDisciplina}`]) ||
                                        (historyType === HistoryType.NEW && etapa.rule_name[indiceDisciplina] != '')
                                    }
                                    $isDarkTheme={isDarkTheme}
                                >
                                    <DataCell style={{width: "1%"}}>{codigo}</DataCell>
                                    <DataCell>{etapa.nome?.[indiceDisciplina] || 'N/A'}</DataCell>
                                    <DataCell>{etapa.creditos?.[indiceDisciplina] || 'N/A'}</DataCell>
                                    {historyType === HistoryType.NEW &&
                                    <DataCell>{formatRuleName(etapa.rule_name?.[indiceDisciplina] || 'N/A')}</DataCell>
                                    }
                                    {historyType === HistoryType.OLD &&
                                    <DataCell>
                                        <CheckMark 
                                            etapaIndex={indiceEtapa} 
                                            disciplinaIndex={indiceDisciplina}
                                        />
                                    </DataCell>
                                    }
                                </DataRow> 
                            ))}
                        </>
                    )}
                </Fragment>
                ))}
            </tbody>
        </Table>
    </Wrapper>
    );
};

export default Historico;
