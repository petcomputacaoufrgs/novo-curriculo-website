
import React from 'react';
import './About.css'

interface IAbout {
  title: string;
  text: string;
  warning?: React.ReactNode;
  children?: React.ReactNode;
}
const About = ({title, text, warning, children} : IAbout) => {

  return (
    <div className='About'>
        <h1>{title}</h1>
        {children}
        <br></br>
        {text && <p>{text}</p>}
        {warning && warning}
   </div>
  )
}

export default About