import React from 'react'


import './Navbar.css'

import inflogo from '../../assets/inf_logo_provisoria.png'
import petlogo from '../../assets/logoPet_branco.png'

const Navbar = () => {
  return (
    <nav>
        <div id='logos'>
            <a>
                <img src={inflogo} alt='Logo do INF' id='logoINF'></img>
            </a>
            <a>
                <img src={petlogo} alt='Logo do PET' id='logoPET'></img>
            </a>
        </div>

        <ul>
            <li>
                <a href='#'>Tutorial</a>
            </li>
            <li>
                <a href='#'>Regras de Transição</a>
            </li>
            <li>
                 <a href='#'>Conversor de Histórico (Git)</a>
            </li>
        </ul>
    </nav>
  )
}

export default Navbar