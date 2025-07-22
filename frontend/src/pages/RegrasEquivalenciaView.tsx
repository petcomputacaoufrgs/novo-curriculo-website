import Navbar from "../components/Navbar"
import About from "../components/About"
import Divider from "../components/Divider"
import Footer from "../components/Footer"
import RegrasEquivalencia from "../components/RegrasDeEquivalencia"



const RegrasEquivalenciaView = () => {

  const links = [
    {link: "https://www.inf.ufrgs.br/~eslgastal/gt-cic/novo-curriculo-cic-consolidado.html", label: "Informações Oficiais (CIC)", target: "_blank"},
    {link: "#", label: "Tutorial", target: "_self"},
    {link: "/", label: "Conversor CIC", target: "_self"},
    {link: "https://codeberg.org/hbecker/ClassHistoryConverter", label: "Conversor de Histórico (Repositório)", target: "_blank"}
  ]


  return (
    <>
      <Navbar links={links}/>
      
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