import React from 'react'

import './Footer.css'

import instagram from '../../assets/Instagram_logo.png'




const Footer = () => {
  return (
    <footer>
        <div className='ColunaEsquerda'>
            <h5>Em caso de dúvida sobre o currículo, contate</h5>
            <ul id='Emails'>
                <li>emailimportante@ufrgs.br</li>
                <li>outroemailimportante@ufrgs.br</li>
            </ul>
            <br></br>
            <br></br>
            <br></br>
            <ul className='RedesSociais'>
                <li><a href='#'><img src={instagram}></img></a></li>
                <li><a href='#'><img src={instagram}></img></a></li>
                <li><a href='#'><img src={instagram}></img></a></li>
            </ul>
        </div>
        <div className='ColunaDireita'>
            <h5>Aplicação Web desenvolvida por PET - Computação</h5>
            <ul>
                <li>
                    Nome Sobrenome
                </li>
                <li>
                    Nome Nome Sobrenome Sobrenome
                </li> 
                <li>
                    Nome Sobrenome Sobrenome
                </li> 
                <li>
                    Nome Sobrenome
                </li>
                <li>
                    Nome Nome Sobrenome
                </li>
            </ul>
            <br></br>
            <h5>
                Scripts de conversão 
            </h5>
            <p>
                Henrique Becker
            </p>
        </div>
    </footer>
  )
}

export default Footer