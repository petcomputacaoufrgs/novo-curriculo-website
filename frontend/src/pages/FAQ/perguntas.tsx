import { JSX } from "react";

export type FAQItem = {
  question: string;
  answer: string | JSX.Element; 
};

export type FAQCategory = {
  title: string;
  id: string; 
  items: FAQItem[];
};

export type FAQData = Record<string, FAQCategory[]>;


export const faqData: FAQData = {
  "CIC": [
    {
      title: "Sobre Datas",
      id: "cic-datas",
      items: [
        { 
          question: "Quando o novo currículo entrará em vigor?", 
          answer: "O novo currículo entrará em vigor no próximo semestre, ou seja, no semestre de 2026/1." 
        },
        { 
          question: "Quando a atualização das informações do aluno no portal com a entrada do novo currículo deve ocorrer?", 
          answer: <>A atualização dos históricos no portal do aluno deve ocorrer <strong>após 08/01/2026</strong>, que é a data do processamento final do semestre de 2025/2. Mas algumas mudanças podem não entrar automaticamente, pois devem ser realizadas manualmente pela COMGRAD. Um exemplo de mudança manual é a liberação das novas disciplinas pelas disciplinas piloto que foram ministradas em 2025/2, como a disciplina <em>INF01060 - TÓPICOS ESPECIAIS EM COMPUTAÇÃO XVIII (Projeto Integrador em Computação)</em>, piloto da disciplina obrigatória <em>Projeto Integrador em Computação.</em></> 
        }
      ]
    },
    {
      title: "Sobre a Estrutura do Currículo",
      id: "cic-estrutura",
      items: [
        { 
          question: "Onde posso ver informações sobre o novo currículo com mais detalhes?", 
          answer: (
            <>
            <p>
              Você pode consultar a página com as informações centralizadas da Alteração Curricular da CIC
              <a href="https://www.inf.ufrgs.br/~eslgastal/gt-cic/novo-curriculo-cic-consolidado.html" target="_blank"> clicando aqui</a>.
            </p>
            <p>
              Você também pode acessar a resolução principal da COMGRAD sobre a Alteração Curricular <a href="https://www.inf.ufrgs.br/~eslgastal/gt-cic/COMGRAD_CIC_Res_01_2025_final_v2_consolidada.pdf" target="_blank" rel="noopener noreferrer"> aqui</a>.
            </p>
            <p>
              E ainda pode ter uma visão mais direta das regras de equivalência na nossa página de Regras de Equivalência, <a href="/regras" target="_blank" rel="noopener noreferrer">aqui</a>.
            </p>
            </>
          )
        },
        { 
          question: "Onde posso ver as cadeiras do novo currículo?", 
          answer: (
            <>
              Além de outras informações, a grade curricular completa do novo currículo pode ser visualizada
              <a href="https://www.inf.ufrgs.br/~eslgastal/gt-cic/novo-curriculo-cic-consolidado.html#grade" target="_blank" rel="noopener noreferrer"> neste link</a>.
            </>
          )
        },
        { 
          question: "Onde posso ver os créditos necessários para graduação no novo currículo?", 
          answer: (
            <>
              Além de outras informações, os créditos necessários para graduação no novo currículo podem ser consultados
              <a href="https://www.inf.ufrgs.br/~eslgastal/gt-cic/novo-curriculo-cic-consolidado.html#ch" target="_blank" rel="noopener noreferrer"> aqui</a>.
            </>
          )
        },
        { 
          question: "Onde posso ver a súmula e o plano de ensino das disciplinas do novo currículo?", 
          answer: (
            <>
            <p>
              As súmulas das disciplinas estão disponíveis no catálogo de disciplinas 
              <a href="https://www.inf.ufrgs.br/~eslgastal/gt-cic/novo-curriculo-cic-consolidado.html#disciplinas" target="_blank" rel="noopener noreferrer"> na página centralizada de informações do currículo da CIC</a>.
            </p>
            <p>
              Já os planos de ensino detalhados das disciplinas que você pode cursar já podem ser encontrados no portal do aluno, na seção Informações do Aluno -&gt; Possibilidade de Matrícula
            </p>
            </>

          )
        },
        { 
          question: "Onde posso ver diagramas que ilustram o novo currículo?", 
          answer: (
            <>
            <p>
              Ao fazer a conversão do seu histórico pelo nosso site, você terá acesso a diagramas personalizáveis que ilustram como seu histórico se encaixa no novo currículo, bem como o diagrama do seu currículo atual para comparação.

            </p>
            <p>
              Além disso, há também um diagrama geral do novo currículo disponível na <a href="https://www.inf.ufrgs.br/~eslgastal/gt-cic/novo-curriculo-cic-consolidado.html#grafo" target="_blank" rel="noopener noreferrer">página que centraliza as informações da alteração curricular da CIC</a>.
            </p>
            <p>
              E um diagrama interativo desenvolvido pelo professor Comba disponível <a href="https://www.inf.ufrgs.br/~comba/curriculo-cic.html" target="_blank" rel="noopener noreferrer">aqui</a>.
            </p>
            </>
          )
        }
      ]
    },
    {
      title: "Sobre Regras de Equivalência e Liberações",
      id: "cic-regras",
      items: [
        { 
          question: "O que é a Regra de Temporalidade?", 
          answer: "É uma regra para liberação das novas cadeiras que entrarão no currículo, baseada no semestre de ingresso do aluno no curso. Nos documentos oficiais, esse termo não existe, sendo usado diretamente o semestre de ingresso do aluno para fins de liberações. Só é usado assim nesse site pois o script original do professor Henrique, desenvolvido em um período em que não se tinha certeza do momento em que o currículo novo entraria, trata as liberações não por datas fixas, mas pelo número de semestres passados desde o ingresso. A temporalidade aqui então é contada a partir da quantidade de semestres desde seu ingresso no curso até o semestre atual. Ex: durante o processo de matrícula em 2026/1, uma pessoa que ingressou em 2023/1 terá temporalidade 6 (Temp-6), pois se passaram 6 semestres desde que ela ingressou: 2023/1, 2023/2, 2024/1, 2024/2, 2025/1, 2025/2" 
        },
        { 
          question: "O que são 'disciplinas espelho'?", 
          answer: 
          <>
          <p>
          São disciplinas cópias das disciplinas obrigatórias novas que serão criadas temporariamente para alunos que foram liberados dessas novas disciplinas terem ainda a chance de fazê-las. As disciplinas espelhos serão eletivas e contarão como créditos eletivos para os alunos que as cursarem.
          </p>
          <p>As seguintes disciplinas serão oferecidas como disciplinas espelho:</p>
          <ul>
            <li>INF01079 - TÓPICOS ESPECIAIS EM COMPUTAÇÃO XL (PLN)</li>
            <li>INF01078 - TÓPICOS ESPECIAIS EM COMPUTAÇÃO XXXIX (Cibersegurança)</li>
            <li>INF01077 - TÓPICOS ESPECIAIS EM COMPUTAÇÃO XXXVIII (Programação Paralela)</li>
            <li>INF01076 - TÓPICOS ESPECIAIS EM COMPUTAÇÃO XXXVII (Aprendizado de Máquina)</li>
            <li>INF05033 - TÓPICOS ESPECIAIS EM COMPUTAÇÃO XLV (Projeto em Ciência e Inovação)</li>
            <li>INF01060 - TÓPICOS ESPECIAIS EM COMPUTAÇÃO XVIII (Projeto Integrador em Computação)</li>
          </ul>
          </>
        }
      ]
    },
    {
      title: "Sobre Situações de Alunos",
      id: "cic-situacoes",
      items: [
        { 
          question: "A carga horária de extensão vai aumentar, preciso cumprir as horas adicionais se já cumpri todas as horas atuais?", 
          answer: <>Se você já cumpriu todas as horas de extensão exigidas pelo currículo atual, não será necessário cumprir as 10 horas adicionais exigidas pelo novo currículo, conforme consta no Artigo 21 da <a href="https://www.inf.ufrgs.br/~eslgastal/gt-cic/COMGRAD_CIC_Res_01_2025_final_v2_consolidada.pdf" target="_blank" rel="noopener noreferrer">Resolução COMGRAD-CIC 01/2025.</a></>
        },
        { 
          question: "Se eu fiz uma eletiva que vai virar obrigatória, eu mantenho os créditos eletivos?", 
          answer: "A PRINCÍPIO NÃO. A disciplina passará a constar como obrigatória. A ideia é que no fim das contas o ganho e a perda de créditos eletivos fiquem balanceados. Mas casos como esse talvez sejam melhor de ser vistos com a COMGRAD." 
        },
        { 
          question: "Serei liberado de uma disciplina que gostaria de fazer. Eu vou poder fazer assim mesmo?", 
          answer: "Sim, para isso serão criadas as \"disciplinas espelho\", que são cópias das disciplinas obrigatórias novas justamente feitas para essa situação." 
        },
        { 
          question: "Se eu cursar uma 'disciplina espelho', ganharei créditos eletivos?", 
          answer: "Sim! As disciplinas espelho serão disciplinas eletivas e contarão como créditos eletivos para os alunos que as cursarem." 
        },
        { 
          question: "Se com a conversão do currículo eu ganhar mais créditos eletivos do que preciso, o que acontece?", 
          answer: "Os créditos eletivos excedentes constarão no seu histórico e podem ser contabilizados como créditos complementares. Você pode fazer isso pelo Portal do Aluno, na seção Matrícula -&gt; Créditos Complementares. Porém não se pode concluir todos os créditos complementares apenas com esse tipo de atividade, ou seja, apenas com créditos eletivos excedentes." 
        },
        { 
          question: "Algumas disciplinas trocarão de etapa. Como ficará o ordenamento dos alunos (índice I1)?", 
          answer: <>Segundo o artigo 12 da <a href="https://www.ufrgs.br/comgrad-cca/wp-content/uploads/Matr%C3%ADcula/cepe-resolucao-09-2003.pdf" target="_blank" rel="noopener noreferrer">Resolução sobre o Ordenamento da UFRGS</a>: "Para fins de cálculo de ordenamento de matrícula, o índice I1 do discente não poderá diminuir, mesmo que ocorram alterações curriculares. Concluídas todas as disciplinas de uma determinada etapa, o discente será deslocado automaticamente para a etapa seguinte." </> 
        }
      ]
    }
  ],
  "ECP": [
    {
      title: "Sobre Datas",
      id: "ecp-datas",
      items: [
        { 
          question: "Quando o novo currículo entrará em vigor?", 
          answer: "O novo currículo entrará em vigor no próximo semestre, ou seja, no semestre de 2026/1." 
        },
        { 
          question: "Quando a atualização das informações do aluno no portal com a entrada do novo currículo deve ocorrer?", 
          answer: <>A atualização dos históricos no portal do aluno deve ocorrer <strong>após 08/01/2026</strong>, que é a data do processamento final do semestre de 2025/2.</>
        }
      ]
    },
    {
      title: "Sobre a Estrutura do Currículo",
      id: "ecp-estrutura",
      items: [
        { 
          question: "Onde posso ver informações sobre o novo currículo com mais detalhes?", 
          answer: (
            <>
              Pela resolução oficial da COMGRAD-ECP sobre a Alteração Curricular,  
              <a href="https://www.inf.ufrgs.br/~pet/ECP_Resolucao_de_Alteracoes_Curriculares.pdf" target="_blank" rel="noopener noreferrer">disponível aqui</a>.
            </>
          )
        }
      ]
    },
    {
      title: "Sobre Situações de Alunos",
      id: "ecp-situacoes",
      items: [
        { 
          question: "Se com a conversão do currículo eu ganhar mais créditos eletivos do que preciso, o que acontece?", 
          answer: "Os créditos eletivos excedentes constarão no seu histórico e podem ser contabilizados como créditos complementares. Você pode fazer isso pelo Portal do Aluno, na seção Matrícula -&gt; Créditos Complementares. Porém não se pode concluir todos os créditos complementares apenas com esse tipo de atividade, ou seja, apenas com créditos eletivos excedentes." 
        }
      ]
    }
  ]
};