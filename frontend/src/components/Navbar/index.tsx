import inflogo from '../../assets/inf_logo_provisoria.png'
import petlogo from '../../assets/logoPet_branco.png'
import { useEffect, useState } from 'react';
import { CompactMenu, LogoINF, LogoPET, Logos, MenuButton, MenuIcon, MenuItem, MenuLink, MenuList, Nav } from './styled';

type Link = {
    label: string;
    link: string;
    target: string;
}

interface INavBar {
    links: Link[];
}

const Navbar = ({links} : INavBar) => {

  const [windowSize, setWindowSize] = useState(window.innerWidth);
  const [showCompactMenu, setShowCompactMenu] = useState(false);


  useEffect(() => {
    const handleResize = () => {
      setWindowSize(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  useEffect(() => {
    if(showCompactMenu && windowSize > 500)
        setShowCompactMenu(false);
    
  }, [windowSize])

  return (
    <>
      <Nav>
        <Logos>
          <a>
            <LogoINF src={inflogo} alt="Logo do INF" />
          </a>
          <a>
            <LogoPET src={petlogo} alt="Logo do PET" />
          </a>
        </Logos>

        {windowSize > 500 ? (
          <MenuList>
            {links.map((link) => (
              <MenuItem key={link.label}>
                <MenuLink href={link.link} target={link.target}>
                  {link.label}
                </MenuLink>
              </MenuItem>
            ))}
          </MenuList>
        ) : (
          <MenuButton $highlighted={showCompactMenu} onClick={() => setShowCompactMenu(!showCompactMenu)}>
            <MenuIcon
              width="17"
              height="24"
              viewBox="0 0 17 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M2 13.5H15H2ZM2 7.5H15H2ZM2 1.5H15H2Z" />
              <path
                d="M2 13.5H15M2 7.5H15M2 1.5H15"
                strokeWidth="2.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </MenuIcon>
          </MenuButton>
        )}
      </Nav>

      <CompactMenu $visible={showCompactMenu}>
        {showCompactMenu &&
          <ul>
            {links.map((link) => (
              <li key={link.label}>
                <a href={link.link} target={link.target}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        }
      </CompactMenu>
    </>
  );
}

export default Navbar