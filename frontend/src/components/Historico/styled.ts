import styled from 'styled-components';

export const Wrapper = styled.div`
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  padding: 1rem;
`;

export const DropdownButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 1rem;
  margin: 0.6rem;
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
  width: 100%;
  padding: 1rem;
`;

export const Tabela = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const HeaderCell = styled.th`
  padding: 0.5rem;
  border-bottom: 1px solid #ccc;
  text-align: center;
`;

export const DataCell = styled.td`
  padding: 0.5rem;
  border-bottom: 1px solid #eee;
  text-align: left;
`;

export const DropdownCell = styled.td`
  padding: 0;
  border: none;
`;

export const CheckboxContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const StyledCheckbox = styled.input.attrs({ type: 'checkbox' })`
  width: 30px;
  height: 30px;
  cursor: pointer;
  accent-color: rgba(32, 42, 67, 1);
  
  /* Para navegadores que não suportam accent-color */
  &:checked {
    background-color: rgba(32, 42, 67, 1);
  }
`;

