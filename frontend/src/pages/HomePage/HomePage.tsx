import { useEffect, useState, useCallback, useRef } from 'react'
import Navbar from "../../components/Navbar/index.tsx"
import About from "../../components/About/index.tsx"
import Transcript from "../../components/Transcript/index.tsx"
import Divider from "../../components/Divider/index.tsx"
import Footer from "../../components/Footer/index.tsx"
import Tabs from "../../components/Tabs/index.tsx"
import { ThemeProvider } from 'styled-components'
import { lightTheme, darkTheme } from '../../themes.ts'
import Loadb from '../../components/UploadForm/loadb.tsx'
import Convertb from '../../components/UploadForm/convertb.tsx'

import { FrontData } from '../../types.ts'
import api from '../../api.ts'
import { ButtonsStyledContainer } from './styled.ts'

const HomePage = () => {
  const [isDark, setIsDark] = useState(false)
  const [old_history, setOldHistory] = useState();
  const [history, setHistory] = useState<string[][]>([]);

  // Histórico modificado é usado para obter mudanças manuais do usuário, é usado para atualizar o histórico que será enviado para o backend.
  const [getModifiedHistory, setGetModifiedHistory] = useState<(() => string[][]) | null>(null);

  // Recebe a função para obter histórico modificado
    const handleHistoryChange = useCallback((getHistoryFn: () => string[][]) => {
        setGetModifiedHistory(() => getHistoryFn);
    }, []);

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    setIsDark(media.matches)

    const listener = (e: MediaQueryListEvent) => setIsDark(e.matches)
    media.addEventListener('change', listener)

    return () => media.removeEventListener('change', listener)
  }, [])

  useEffect(() => {
    let isFinished = false;

    const fetchOldHistory = async () => {
      try {
        const response = await api.get("/get_old_history");
        
        if (!isFinished) {
          console.log(response.data);
          setOldHistory(response.data);
        }

      } catch (error) {
        if (!isFinished) {
          console.error("Erro ao buscar dados:", error);
        }
      }
    };

    fetchOldHistory();

    // Cleanup function
    return () => {
      isFinished = true;
    };
  }, []);



  const [semester, setSemester] = useState("2025/2");
  const [curso, setCurso] = useState("CIC");
  const [etapas, setEtapas] = useState<number[]>([]);

  const [frontData, setFrontData] = useState<FrontData | undefined>();
  const [oldUrl, setOldBlobUrl] = useState<string | undefined>();
  const [newUrl, setNewBlobUrl] = useState<string | undefined>();

  const [message, setMessage] = useState<string>("");


  const min_year = 1990;
  const current_year = 2026;
  const current_semester: number = 1;


  let options = [];

  console.log(etapas);

  
  for(var i = min_year; i < current_year; i++){
    options.unshift(`${i}/1`);
    options.unshift(`${i}/2`);
  }

  options.unshift(`${current_year}/1`);

  if(current_semester == 2)
    options.unshift(`${current_year}/2`);


  const links = [
    {link: "https://www.inf.ufrgs.br/~eslgastal/gt-cic/novo-curriculo-cic-consolidado.html", label: "Informações Oficiais (CIC)", target: "_blank"},
    {link: "/regras", label: "Regras de Equivalência", target: "_self"},
    {link: "https://codeberg.org/hbecker/ClassHistoryConverter", label: "Conversor de Histórico (Repositório)", target: "_blank"}
  ]

  const tabsRef = useRef<HTMLDivElement>(null);

  // useEffect para rolar para os Tabs quando os dados estiverem prontos
  useEffect(() => {
    if (frontData && oldUrl && newUrl && tabsRef.current) {
      // Pequeno delay para garantir que o componente foi renderizado
      setTimeout(() => {
        tabsRef.current?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    }
  }, [frontData, oldUrl, newUrl]);

  console.log("Home Page Renderizada");
  return (
    <>
      <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
        <Navbar links={links}/>
        <About 
          title="Conversor de Histórico" 
          text="Para converter seu currículo, você pode selecionar as cadeiras que completou na tabela abaixo e clicar em 'Converter'.
                Se preferir, ao invés disso, você também pode carregar direto o seu histórico de curso. Para isso, basta acessar o portal do aluno e, uma vez dentro da página 'Histórico de Curso' (ou 'Histórico Escolar', já que para ambas o conversor funciona), 
                pressionar o botão direito do mouse e selecionar 'salvar como'. Tendo baixado o arquivo HTML, direcione-se para o Conversor de currículo e clique no botão 'Carregar Histórico'. Selecione o arquivo
                HTML baixado e clique em 'Converter'."/>
        
        <ButtonsStyledContainer>
                <Loadb 
                    setCurso={setCurso} 
                    setSemester={setSemester} 
                    setHistory={setHistory} 
                    setEtapas={setEtapas} 
                    setMessage={setMessage}
                />
                <Convertb 
                    curso={curso} 
                    semester={semester} 
                    history={history} // Histórico original
                    getModifiedHistory={getModifiedHistory}
                    setFrontData={setFrontData} 
                    setNewBlobUrl={setNewBlobUrl} 
                    setOldBlobUrl={setOldBlobUrl} 
                    setMessage={setMessage}
                />
            </ButtonsStyledContainer>

        <p>{message}</p>
        
        {old_history && (
          <Transcript 
            semester={semester} 
            onSelectSemester={(value: string) => setSemester(value)} 
            curso={curso} 
            onSelectCurso={(value: string) => setCurso(value)} 
            optionsToSemesterButton={options}
            old_history={{CIC: old_history['CIC'], ECP: old_history['ECP']}}
            uploaded_history={history}
            onHistoryChange={handleHistoryChange}
          />
        )}
        
        <Divider />
        
        {frontData && oldUrl && newUrl && (
          <div ref={tabsRef}>
            <Tabs 
              frontData={frontData} 
              oldUrl={oldUrl} 
              newUrl={newUrl}
              oldHistory={old_history?.[curso as 'CIC' | 'ECP']}
            />
          </div>
        )}
        
        <Footer />
      </ThemeProvider>
    </>
  )
}

export default HomePage