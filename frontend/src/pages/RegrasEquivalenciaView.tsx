import Navbar from "../components/Navbar"
import About from "../components/About"
import Divider from "../components/Divider"
import Footer from "../components/Footer"
import RegrasEquivalencia from "../components/RegrasDeEquivalencia"



const RegrasEquivalenciaView = () => {


  return (
    <>
      <Navbar />
      
      <About 
        title="Regras de Equivalência" 
        text="A seguir estão as regras de equivalência categorizadas por tipo de regra. Note que o processo de conversão não é exatamente 100% automático"/>
      
      <RegrasEquivalencia />
      <Divider />
      <Footer />
      
    </>
  )
}

export default RegrasEquivalenciaView