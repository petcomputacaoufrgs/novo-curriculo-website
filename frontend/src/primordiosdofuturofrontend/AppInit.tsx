import Navbar from "./components/Navbar/Navbar"
import About from "./components/About/About"
import Transcript from "./components/Transcript/Transcript"
import Divider from "./components/Divider"
import Footer from "./components/Footer/Footer"


const AppInit = () => {


  return (
    <>
      <Navbar />
      <About 
        title="Bacharelado em Ciência da Computação" 
        text="O currículo da CIC está para ser reformulado, então o grupo PET Computação fez um esforço conjunto com o GT da troca de currículo e 
              especialmente junto com o Professor Henrique Becker (responsável pelo código em Julia que faz a conversão) de fazer um site onde seja rápido e fácil ver as mudanças de transição."/>
      
      <Transcript />
      <Divider />
      <Footer />
    </>
  )
}

export default AppInit