import React, { useEffect, useState } from 'react'
import Navbar from "../components/Navbar"
import About from "../components/About"
import Transcript from "../components/Transcript"
import Divider from "../components/Divider"
import Footer from "../components/Footer"
import Tabs from "../components/Tabs"
import { ThemeProvider } from 'styled-components'
import { lightTheme, darkTheme } from '../themes'
import UploadForm2 from '../components/UploadForm/index2.tsx'
import LoadButton from '../components/UploadForm/load.tsx'
import ConvertButton from '../components/UploadForm/convert.tsx'

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

  return (
    <>
      <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
        <Navbar />
        <About 
          title="Bacharelado em Ciência da Computação" 
          text="O currículo da CIC está para ser reformulado, então o grupo PET Computação fez um esforço conjunto com o GT da troca de currículo e 
                especialmente junto com o Professor Henrique Becker (responsável pelo código em Julia que faz a conversão) de fazer um site onde seja rápido e fácil ver as mudanças de transição."/>

        <UploadForm2 />
        <Transcript />
        <Divider />
        <Tabs />
        <Footer />
      </ThemeProvider>

    </>
  )
}

export default HomePage