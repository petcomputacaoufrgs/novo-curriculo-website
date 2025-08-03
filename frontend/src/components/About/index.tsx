
import './About.css'

interface IAbout {
  title: string;
  text: string;
}
const About = ({title, text} : IAbout) => {

  return (
    <div className='About'>
        <h1>{title}</h1>
        <br></br>
        <p>{text}</p>
        <p><strong>ATENÇÃO:</strong> As simulações computadas por este sistema podem conter erros   ou podem estar desatualizadas, podendo divergir do que será   efetivado no sistema da UFRGS. O documento que consolida as   alterações curriculares do curso de Ciência da Computação, a   saber, <a href='https://www.inf.ufrgs.br/~eslgastal/gt-cic/COMGRAD-CIC-Res-01-2025-final.pdf' target='_blank'>Resolução COMGRAD-CIC 01/2025</a>, estará em tramitação nas   instâncias superiores da universidade durante o segundo   semestre de 2025, e poderá sofrer alterações com base em   eventuais diligências apontadas durante este processo. Ademais,   conforme parágrafo segundo do 22º artigo da referida resolução,   a COMGRAD-CIC estará consolidando uma lista de liberações   adicionais, a seu critério para resolver questões pontuais, e   estas liberações podem não estar refletidas nos resultados aqui   apresentados.</p>
    </div>
  )
}

export default About