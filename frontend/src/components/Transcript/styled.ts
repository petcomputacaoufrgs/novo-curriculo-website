import styled from 'styled-components'
export const OuterTranscriptBox = styled.div`
  border-radius: 15px;
  background-color: rgba(122, 142, 167, 1);
  padding: 10px;
  width: 100%;
  max-width: 900px;
  align-self: center;
  box-sizing: border-box;
`

export const InnerTranscriptBox = styled.div`
  border-radius: 10px;
  padding: 20px;
  padding-top: 0px;
  max-height: 75vh; /* 75% da altura da viewport */
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  box-sizing: border-box;
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  transition: background-color 0.3s ease, color 0.3s ease;
  overflow-y: auto;
  overflow-x: hidden;
  overscroll-behavior: contain; /* Impede que o scroll "escape" para o parent */
  scroll-behavior: smooth; /* Torna o scroll mais suave */

  /* Força o elemento a ser um contexto de scroll */
  position: relative;
  z-index: 1;

  /* Estilização da scrollbar para melhor aparência */
  &::-webkit-scrollbar {
    width: 16px; /* Aumenta a largura da scrollbar */
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 8px; /* Ajusta o border-radius proporcionalmente */
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(48, 65, 98, 1);
    border-radius: 8px; /* Ajusta o border-radius proporcionalmente */
    border: 2px solid transparent; /* Adiciona uma borda transparente para dar mais espaço visual */
    background-clip: content-box; /* Faz a cor de fundo não cobrir a borda */
  }
`


export const InputsBox = styled.div`
  display: flex;
  width: 100%;
  gap: 18px;
  align-items: center;
  justify-content: center;

  @media(max-width: 470px){
    flex-direction: column;
  }
`

