import styled from 'styled-components';

// Interface para a prop
interface ThemeProps {
  $isDarkTheme: boolean;
}

export const Wrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

// Container principal que segura Sidebar (esq) e Conteúdo (dir)
export const LayoutContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: flex-start; 

  @media (max-width: 900px) {
    flex-direction: column;
    align-items: center;
  }
`;

// A navegação lateral
export const Sidebar = styled.div<ThemeProps>`
  width: 220px; 
  flex-shrink: 0; 
  position: sticky;
  top: 2rem;
  
  padding: 0 0 0 2rem; 
  
  border-right: 1px solid ${({ $isDarkTheme }) => $isDarkTheme ? '#444' : '#eee'};
  
  max-height: calc(100vh - 4rem);
  overflow-y: auto;

  @media (max-width: 900px) {
    width: 90%;
    max-width: 600px;
    position: static;
    border-right: none;
    border-bottom: 1px solid ${({ $isDarkTheme }) => $isDarkTheme ? '#444' : '#eee'};
    margin-bottom: 2rem;
    padding: 0 1rem 1rem 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

export const SidebarLink = styled.button<ThemeProps>`
  display: block;
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 0.6rem 0.5rem;
  cursor: pointer;
  font-size: 0.95rem;
  border-radius: 4px;
  
  color: ${({ $isDarkTheme }) => $isDarkTheme ? '#ccc' : '#555'};
  transition: all 0.2s ease;

  &:hover {
    color: ${({ $isDarkTheme }) => $isDarkTheme ? '#fff' : '#000'};
    background-color: ${({ $isDarkTheme }) => $isDarkTheme ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'};
    padding-left: 10px; 
    font-weight: 500;
  }
`;

// Área que segura os Cards
export const ContentArea = styled.div`
  flex-grow: 1; /* Ocupa todo o espaço que sobra ao lado da sidebar */
  display: flex;
  justify-content: center;
  padding: 0 2rem; /* Margem lateral para não colar na sidebar nem na borda direita */
  flex-direction: column;
  @media (max-width: 900px) {
    width: 90%;
    padding: 0;
  }
`;

// O container dos Cards propriamente dito
export const Cards = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 1rem;
  padding-bottom: 3rem; /* Espaço no final da página */
`;

export const CategoryTitle = styled.h3<ThemeProps>`
  margin-bottom: 1.5rem;
  margin-top: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid ${({ $isDarkTheme }) => $isDarkTheme ? 'rgba(122, 142, 167, 0.5)' : '#eee'};
  color: ${({ $isDarkTheme }) => $isDarkTheme ? '#fff' : '#2d2d2d'};
  font-size: 1.5rem;


`;

export const Card = styled.div`
  margin-bottom: 0; 
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
`;

export const DropdownButton = styled.button<ThemeProps>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 1.2rem;
  
  background-color: rgba(32, 42, 67, 1);
  color: white; 
  
  border: none;
  text-align: left;
  font-weight: bold;
  cursor: pointer;
  font-size: 1rem;

  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(50, 62, 100, 1);
  }
`;

export const DropdownContent = styled.div<ThemeProps>`
  padding: 1.5rem;
  background-color: ${({ $isDarkTheme }) => $isDarkTheme ? '#2a2a2a' : '#fff'};
  border-top: none;
`;

export const AnswerText = styled.div<ThemeProps>`
  color: ${({ $isDarkTheme }) => $isDarkTheme ? '#e0e0e0' : '#333333'};
  line-height: 1.6;
  font-size: 1rem;
  margin: 0;
  
    a {
        color: ${props => props.$isDarkTheme ? '#66b2ff' : '#0056b3'};
        text-decoration: underline;
        font-weight: bold;

        &:hover {
        text-decoration: none;
        opacity: 0.8;
        }
    }

    p {
        margin: 0;
    }
`;