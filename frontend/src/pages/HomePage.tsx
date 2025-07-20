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

const HomePage = () => {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    setIsDark(media.matches)

    const listener = (e: MediaQueryListEvent) => setIsDark(e.matches)
    media.addEventListener('change', listener)

    return () => media.removeEventListener('change', listener)
  }, [])



  const [semester, setSemester] = useState("Semestre");
  
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

  const [file, setFile] = useState<File | null>(null)

  return (
    <>
      <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
        <Navbar links={links}/>
        <About 
          title="Bacharelado em Ciência da Computação" 
          text="O currículo da CIC está para ser reformulado, então o grupo PET Computação fez um esforço conjunto com o GT da troca de currículo e 
                especialmente junto com o Professor Henrique Becker (responsável pelo código em Julia que faz a conversão) de fazer um site onde seja rápido e fácil ver as mudanças de transição."/>
        <Loadb setFile = {setFile}/>
        <Transcript semester={semester} onSelectSemester={(value: string) => setSemester(value)} optionsToSemesterButton={options}/>
          <Convertb file = {file} />
        <Divider />
        <Tabs />
        <Footer />
      </ThemeProvider>

    </>
  )
}

export default HomePage