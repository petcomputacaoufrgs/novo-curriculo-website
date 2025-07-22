import styled from 'styled-components';


export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 85%;
  align-items: flex-start;
  padding: 30px 0 30px 0;
  gap: 16px;
`;

export const IframeWrapper = styled.div`
  width: 100%;
  border-radius: 15px;
`;

export const StyledIframe = styled.iframe`
  width: 100%;
  height: 38vw;
  border-radius: 15px;
`;

export const TextoIntro = styled.p`
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  font-weight: bold;
  font-size: 18px;
  text-align: left;
`;

export const Topico = styled.li`
  margin-left: 1.25rem;
  text-align: left;
`;

export const Lista = styled.ul`
  padding-left: 1rem;
`;


export const ToggleWrapper = styled.div`
  display: flex;
  gap: 12px;
`;

export const ToggleButton = styled.button<{ $active: boolean }>`
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  background-color: ${({ $active }) => ($active ? '#007bff' : '#ddd')};
  color: ${({ $active }) => ($active ? 'white' : '#333333')};
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background-color: ${({ $active }) => ($active ? '#007bff' : '#ccc')};
  }
`;