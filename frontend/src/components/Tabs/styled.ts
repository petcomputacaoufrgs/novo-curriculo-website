import styled from 'styled-components'

export const AbaContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: flex-end;
`

export const Aba = styled.button<{ $ativo: boolean }>`
  font-size: 16px;
  background-color: ${({ $ativo, theme }) => ($ativo ? theme.abaAtiva : theme.abaInativa)};
  color: ${({ $ativo, theme }) => ($ativo ? '#e7ecf7' : theme.textoInativo)};
  border: none;
  padding: ${({ $ativo }) => ($ativo ? '14px 20px' : '8px 20px')};
  border-radius: 6px 6px 0 0;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${({ $ativo }) => !$ativo && '#9dacc3ff'};
  }

  &:active {
    background-color: ${({ theme }) => theme.abaAtiva};
    color: #e7ecf7;
  }
`

export const Conteudo = styled.div`
  padding: 10px;
  border-top-right-radius: 15px;
  border-bottom-right-radius: 15px;
  border-bottom-left-radius: 15px;
  background-color: rgba(122, 142, 167, 1);
  color: ${({ theme }) => theme.text};
  transition: background-color 0.3s ease, color 0.3s ease;

  display: flex;
  align-items: center;
  justify-content: center;


`
