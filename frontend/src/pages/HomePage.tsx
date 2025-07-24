import { useEffect, useState } from 'react'
import Navbar from "../components/Navbar"
import About from "../components/About"
import Transcript from "../components/Transcript"
import Divider from "../components/Divider"
import Footer from "../components/Footer"
import Tabs from "../components/Tabs"
import { ThemeProvider } from 'styled-components'
import { lightTheme, darkTheme } from '../themes'
import Loadb from '../components/UploadForm/loadb.tsx'
import Convertb from '../components/UploadForm/convertb.tsx'

import './App.css'
import { FrontData } from '../types.ts'
import api from '../api.ts'

const HomePage = () => {
  const [isDark, setIsDark] = useState(false)
  const [old_history, setOldHistory] = useState();

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



  const [semester, setSemester] = useState("Semestre");
  const [curso, setCurso] = useState("CIC");
  const [state, setState] = useState<string[][]>([]);
  const [etapas, setEtapas] = useState<number[]>([]);

  const [frontData, setFrontData] = useState<FrontData | undefined>();
  const [oldUrl, setOldBlobUrl] = useState<string | undefined>();
  const [newUrl, setNewBlobUrl] = useState<string | undefined>();


  const min_year = 1990;
  const current_year = 2026;
  const current_semester: number = 1;


  let options = [];

  for(var i = min_year; i < current_year; i++){
    options.unshift(`${i}/1`);
    options.unshift(`${i}/2`);
  }

  options.unshift(`${current_year}/1`);

  if(current_semester == 2)
    options.unshift(`${current_year}/2`);


  const links = [
    {link: "https://www.inf.ufrgs.br/~eslgastal/gt-cic/novo-curriculo-cic-consolidado.html", label: "Informações Oficiais (CIC)", target: "_blank"},
    {link: "#", label: "Tutorial", target: "_self"},
    {link: "/regras", label: "Regras de Equivalência", target: "_self"},
    {link: "https://codeberg.org/hbecker/ClassHistoryConverter", label: "Conversor de Histórico (Repositório)", target: "_blank"}
  ]

  

  return (
    <>
      <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
        <Navbar links={links}/>
        <About 
          title="Bacharelado em Ciência da Computação" 
          text="O currículo da CIC está para ser reformulado, então o grupo PET Computação fez um esforço conjunto com o GT da troca de currículo e 
                especialmente junto com o Professor Henrique Becker (responsável pelo código em Julia que faz a conversão) de fazer um site onde seja rápido e fácil ver as mudanças de transição."/>
        
        <Loadb setCurso={setCurso} setSemester={setSemester} setState={setState} setEtapas={setEtapas}/>
        
        {old_history && (
          <Transcript 
            semester={semester} 
            onSelectSemester={(value: string) => setSemester(value)} 
            curso={curso} 
            onSelectCurso={(value: string) => setCurso(value)} 
            optionsToSemesterButton={options}
            old_history={{CIC: old_history['CIC'], ECP: old_history['ECP']}}
          />
        )}
        
        <Convertb curso={curso} semester={semester} state={state} setFrontData={setFrontData} setNewBlobUrl={setNewBlobUrl} setOldBlobUrl={setOldBlobUrl} />
        
        <Divider />
        
        {frontData && oldUrl && newUrl &&<Tabs frontData={frontData} oldUrl={oldUrl} newUrl={newUrl}/>}
        
        <Footer />
      </ThemeProvider>

    </>
  )
}

export default HomePage