import styled from "styled-components";


export const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(32, 42, 67, 1);
  padding: 10px 20px;

`;

export const Logos = styled.div`
  display: flex;
  align-items: center;
`;

export const LogoINF = styled.img`
  height: 30px;
  width: auto;
`;

export const LogoPET = styled.img`
  height: 48px;
  width: auto;
`;

export const MenuList = styled.ul`
  display: flex;
  align-items: center;
`;

export const MenuItem = styled.li`
  list-style: none;
`;

export const MenuLink = styled.a`
 transition: background-color 0.3s ease, color 0.3s ease;
  text-decoration: none;
  color: white;
  display: block;
  padding: 10px 15px;
  border-radius: 5px;

  &:hover {
    background-color: rgb(21, 28, 46);
  }
`;

export const MenuButton = styled.button<{$highlighted: boolean}>`
  background: none;
  background-color: ${(props) => props.$highlighted? "rgb(21, 28, 46);" : "transparent"};
  width: 50px;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 10px;
  transition: background-color 0.3s ease, color 0.3s ease;

  &:hover {
  transition: background-color 0.3s ease, color 0.3s ease;

    background-color: rgb(21, 28, 46);
  }
`;


export const MenuIcon = styled.svg`
  stroke: white;
`;


export const CompactMenu = styled.div<{ $visible: boolean }>`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  background-color: rgba(32, 42, 67, 1);

  transition: max-height 0.4s ease, opacity 0.4s ease;

  max-height: ${(props) => (props.$visible ? "500px" : "0")};
  opacity: ${(props) => (props.$visible ? 1 : 0)};

  ul {
    width: 100%;
    list-style: none;
    padding: 0;
    margin: 0;

    a {
      text-decoration: none;
      color: white;
      display: block;
      padding: 10px 15px;
      border-radius: 5px;

      &:hover {
        background-color: rgb(21, 28, 46);
      }
    }
  }
`;
