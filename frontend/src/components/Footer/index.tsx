import instagram from '../../assets/Instagram_logo.png'
import { FooterContainer, LeftColumn, RightColumn } from './styled';


const Footer = () => {
  return (
    <FooterContainer>
      <LeftColumn>
        <h5>Em caso de dúvidas ou problemas com o site, contate</h5>
        <ul className="emails">
          <li>pet@inf.ufrgs.br</li>
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
          <li>Eduarda Post Michels</li>
          <li>Eduardo Fonseca da Silva</li>
          <li>Guilherme D'Ávila Pinheiro</li>
          <li>João Luís Scheffel Koller</li>
        </ul>

        <br />

        <h5>Scripts de conversão</h5>
        <p>Henrique Becker</p>
      </RightColumn>
    </FooterContainer>
  );
}

export default Footer