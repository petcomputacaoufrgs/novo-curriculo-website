import styled from 'styled-components';

export const OverlayContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5); /* fundo branco translúcido */
  backdrop-filter: blur(4px); /* efeito blur */
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const OverlayContent = styled.div<{ $isDarkTheme: boolean }>`
  text-align: center;
  color:  rgba(32, 42, 67, 1);
  font-family: 'Nunito Sans', sans-serif;
  font-weight: bold;
  font-size: 18px;
  p{
    color: ${({ $isDarkTheme }) => ($isDarkTheme ? 'white' : 'black')};
  }
`;

export const SpinnerImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: contain;
  margin-bottom: 20px;
  animation: fade 0.3s ease-in-out;

  @keyframes fade {
    from {
      opacity: 0.3;
    }
    to {
      opacity: 1;
    }
  }
`;
