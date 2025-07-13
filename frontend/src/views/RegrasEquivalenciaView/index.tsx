import Navbar from "../../primordiosdofuturofrontend/components/Navbar/Navbar"
import About from "../../primordiosdofuturofrontend/components/About/About"
import Divider from "../../primordiosdofuturofrontend/components/Divider"
import Footer from "../../primordiosdofuturofrontend/components/Footer/Footer"
import RegrasEquivalencia from "../../components/RegrasDeEquivalencia"



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