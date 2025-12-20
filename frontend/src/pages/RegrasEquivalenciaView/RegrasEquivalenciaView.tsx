import Navbar from "../../components/Navbar"
import About from "../../components/About"
import Divider from "../../components/Divider"
import Footer from "../../components/Footer"
import RegrasEquivalencia from "../../components/RegrasDeEquivalencia"
import { DropdownInput } from "../../components/DropDownInput"
import { JSX, useState } from "react"



const RegrasEquivalenciaView = () => {

  const [curso, setCurso] = useState<string>("CIC");

  const links = [
    {link: "/", label: "Conversor", target: "_self"},
    {link: "/faq", label: "Perguntas Frequentes", target: "_self"},
    {link: "https://www.inf.ufrgs.br/~eslgastal/gt-cic/novo-curriculo-cic-consolidado.html", label: "Informações Oficiais (CIC)", target: "_blank"},
    {link: "https://www.inf.ufrgs.br/~pet/ECP_Resolucao_de_Alteracoes_Curriculares.pdf", label: "Informações Oficiais (ECP)", target: "_blank"},
    {link: "https://codeberg.org/hbecker/ClassHistoryConverter", label: "Conversor de Histórico (Repositório)", target: "_blank"}
  ]


  const warnings: Record<string, JSX.Element> = {
    "CIC": <p><strong>ATENÇÃO:</strong> As simulações computadas por este sistema podem conter erros   
    ou podem estar desatualizadas, podendo divergir do que será   efetivado no sistema da UFRGS. O documento que consolida as   
    alterações curriculares do curso de Ciência da Computação, a   saber, 
    <a href='https://www.inf.ufrgs.br/~eslgastal/gt-cic/COMGRAD-CIC-Res-01-2025-final.pdf' target='_blank'>Resolução COMGRAD-CIC 01/2025</a>, 
    estará em tramitação nas   instâncias superiores da universidade durante o segundo   semestre de 2025, e poderá sofrer alterações com base em   
    eventuais diligências apontadas durante este processo. Ademais,   conforme parágrafo segundo do 22º artigo da referida resolução,   
    a COMGRAD-CIC estará consolidando uma lista de liberações   adicionais, a seu critério para resolver questões pontuais, e   
    estas liberações podem não estar refletidas nos resultados aqui apresentados.</p>,

    "ECP": <p><strong>ATENÇÃO:</strong> As simulações computadas por este sistema podem conter erros   
    ou podem estar desatualizadas, podendo divergir do que será   efetivado no sistema da UFRGS. O documento que consolida as 
    alterações curriculares do curso de Engenharia de Computação, a saber, 
    <a href='https://www.inf.ufrgs.br/~pet/ECP_Resolucao_de_Alteracoes_Curriculares.pdf' target='_blank'>Resolução COMGRAD-ECP 01/2025</a>,
    estará em tramitação nas   instâncias superiores da universidade durante o segundo   semestre de 2025, e poderá sofrer alterações com base em   
    eventuais diligências apontadas durante este processo. Consulte sempre as informações oficiais disponibilizadas pela coordenação do curso de Engenharia de Computação 
    para verificar a validade das regras de equivalência apresentadas aqui.</p>
  }

  return (
    <>
      <Navbar links={links}/>
    


      <About 
        title={`Regras de Equivalência - ${curso}`} 
        text=""
        warning={warnings[curso]}>
        
        <label style={{marginBottom: "5px"}}>Selecione o curso</label>
        <DropdownInput value={curso} onSelect={setCurso} options={["CIC", "ECP"]}/>

      </About>
      

      <RegrasEquivalencia curso={curso} />
      <Divider />
      <Footer />
      
    </>
  )
}

export default RegrasEquivalenciaView