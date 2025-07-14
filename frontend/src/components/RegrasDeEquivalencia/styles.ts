import styled from 'styled-components';

export const Wrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
`;

export const Card = styled.div`
  margin-bottom: 1rem;
  border-radius: 5px;
`;

export const DropdownButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 1rem;
  background-color: rgba(32, 42, 67, 1);
  color: white;
  border: none;
  text-align: left;
  font-weight: bold;
  cursor: pointer;

  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(50, 62, 100, 1);
  }

`;

export const DropdownContent = styled.div`
  padding: 1rem;
`;

export const Explicacao = styled.p`
  margin-bottom: 1rem;
  font-style: italic;
`;

export const Tabela = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const HeaderCell = styled.th`
  padding: 0.5rem;
  border-bottom: 1px solid #ccc;
`;

export const DataCell = styled.td`
  padding: 0.5rem;
  border-bottom: 1px solid #eee;
`;

export const SmallInfo = styled.small`
  color: #555;
`;
