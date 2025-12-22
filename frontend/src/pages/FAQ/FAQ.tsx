import { JSX, useEffect, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { 
  Wrapper, 
  Card, 
  DropdownButton, 
  DropdownContent, 
  AnswerText, 
  Cards,
  LayoutContainer,
  Sidebar,
  ContentArea,
  SidebarLink,
  CategoryTitle
} from './styled';
import Navbar from '../../components/Navbar';
import { DropdownInput } from '../../components/DropDownInput';
import About from '../../components/About';
import { faqData } from './perguntas';
import Footer from '../../components/Footer';


export default function FAQ() {
  const [abertos, setAbertos] = useState<Record<string, boolean>>({});
  
  const [isDarkTheme, setIsDarkTheme] = useState(
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  const [curso, setCurso] = useState<string>("CIC");

  const links = [
    {link: "/", label: "Conversor", target: "_self"},
    {link: "/regras", label: "Regras de Equivalência", target: "_self"},
    {link: "https://www.inf.ufrgs.br/~eslgastal/gt-cic/novo-curriculo-cic-consolidado.html", label: "Informações Oficiais (CIC)", target: "_blank"},
    {link: "https://www.inf.ufrgs.br/~pet/ECP_Resolucao_de_Alteracoes_Curriculares.pdf", label: "Informações Oficiais (ECP)", target: "_blank"},
    {link: "https://codeberg.org/hbecker/ClassHistoryConverter", label: "Conversor de Histórico (Repositório)", target: "_blank"}
  ];

  const chevronSize = "20px";

    const warningTexts: Record<string, JSX.Element> = {

        "CIC": <p><strong>ATENÇÃO:</strong> As perguntas frequentes aqui apresentadas podem não cobrir todas as dúvidas e pode conter imprecisões.

                                            Para questões específicas ou não abordadas, recomendamos entrar em contato diretamente com a Comissão de Graduação (COMGRAD) da CIC,

                                            que pode ser realizado pelo <a href='https://www.inf.ufrgs.br/portal/apps/chamaINF' target='_blank'>sistema ChamaINF</a>.</p>,

        "ECP": <p><strong>ATENÇÃO:</strong> As perguntas frequentes aqui apresentadas podem não cobrir todas as dúvidas e pode conter imprecisões. Para questões específicas ou não abordadas, recomendamos entrar em contato diretamente com a Comissão de Graduação (COMGRAD) da ECP, que pode ser realizado pelo e-mail: comgrad-ecp@ufrgs.br</p>    

    };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => setIsDarkTheme(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Função helper para gerar ID único para o dropdown
  const getDropdownId = (catIndex: number, itemIndex: number) => `${catIndex}-${itemIndex}`;

  const toggleDropdown = (id: string) => {
    setAbertos(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Função para scroll suave até a categoria
  const scrollToCategory = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const currentFAQ = faqData[curso] || [];

  return (
    <>
      <Navbar links={links}/>
      
      <Wrapper>
        <About 
          title={`Perguntas Frequentes - ${curso}`} 
          text=""
          warning={warningTexts[curso]}>
          <label style={{marginBottom: "5px"}}>Selecione o curso</label>
          <DropdownInput value={curso} onSelect={setCurso} options={["CIC", "ECP"]}/>
        </About>

        <LayoutContainer>
          {/* MENU LATERAL (Sidebar) */}
          <Sidebar $isDarkTheme={isDarkTheme}>
            <p style={{ fontWeight: 'bold', marginBottom: '1rem' }}>Navegação</p>
            {currentFAQ.map((category) => (
              <SidebarLink 
                key={category.id} 
                onClick={() => scrollToCategory(category.id)}
                $isDarkTheme={isDarkTheme}
              >
                {category.title}
              </SidebarLink>
            ))}
          </Sidebar>

          {/* ÁREA DE CONTEÚDO */}
          <ContentArea>
            {currentFAQ.map((category, catIndex) => (
              <div key={category.id} id={category.id} style={{ scrollMarginTop: '20px' }}>
                <CategoryTitle $isDarkTheme={isDarkTheme}>{category.title}</CategoryTitle>
                
                <Cards>
                  {category.items.map((item, itemIndex) => {
                    const uniqueId = getDropdownId(catIndex, itemIndex);
                    return (
                      <Card key={uniqueId}>
                        <DropdownButton 
                          onClick={() => toggleDropdown(uniqueId)}
                          $isDarkTheme={isDarkTheme}
                        >
                          {item.question}
                          {abertos[uniqueId] ? (
                            <ChevronUp size={chevronSize} color='white' />
                          ) : (
                            <ChevronDown size={chevronSize} color='white' />
                          )}
                        </DropdownButton>
                        
                        {abertos[uniqueId] && (
                          <DropdownContent $isDarkTheme={isDarkTheme}>
                            <AnswerText $isDarkTheme={isDarkTheme}>
                              {item.answer}
                            </AnswerText>
                          </DropdownContent>
                        )}
                      </Card>
                    );
                  })}
                </Cards>

              </div>
            ))}
          </ContentArea>
        </LayoutContainer>

      </Wrapper>

      <Footer />
    </>
  );
}