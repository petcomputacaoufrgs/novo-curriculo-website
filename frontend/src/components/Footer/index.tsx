import instagram from '../../assets/Instagram_logo.png'
import { FooterContainer, LeftColumn, RightColumn } from './styled';


const Footer = () => {
  return (
    <FooterContainer>
      <LeftColumn>
        <h5>Em caso de dúvida sobre o currículo, contate</h5>
        <ul className="emails">
          <li>emailimportante@ufrgs.br</li>
          <li>outroemailimportante@ufrgs.br</li>
        </ul>

        <br />
        <br />
        <br />

        <ul className="social">
          {[1, 2, 3].map((i) => (
            <li key={i}>
              <a href="#">
                <img src={instagram} alt={`Instagram ${i}`} />
              </a>
            </li>
          ))}
        </ul>
      </LeftColumn>

      <RightColumn>
        <h5>Aplicação Web desenvolvida por PET - Computação</h5>
        <ul>
          <li>Nome Sobrenome</li>
          <li>Nome Nome Sobrenome Sobrenome</li>
          <li>Nome Sobrenome Sobrenome</li>
          <li>Nome Sobrenome</li>
          <li>Nome Nome Sobrenome</li>
        </ul>

        <br />

        <h5>Scripts de conversão</h5>
        <p>Henrique Becker</p>
      </RightColumn>
    </FooterContainer>
  );
}

export default Footer