
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
    </div>
  )
}

export default About