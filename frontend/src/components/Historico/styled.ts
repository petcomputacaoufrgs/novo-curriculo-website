import styled from 'styled-components';

export const Wrapper = styled.div`
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
`;

export const DropdownCell = styled.td`
  font-size: 3rem;
  padding: 0;
  border: none;
`;

export const DropdownButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  padding: 1rem;
  background-color: rgba(32, 42, 67, 1);
  color: white;
  border: none;
  text-align: left;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  margin: 0;
  margin-top: 0.8rem;

  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(50, 62, 100, 1);
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const HeaderRow = styled.tr<{$isDarkTheme: boolean;}>`
  background-color: ${({ $isDarkTheme }) => ($isDarkTheme ? "#25334dff" : "#47668dff")};
`;

export const HeaderCell = styled.th`
  padding: 0.5rem;
  border-bottom: 1px solid #ccc;
  text-align: center;
  color: white;
`;

export const DataCell = styled.td`
  padding: 0.5rem;
  padding-left: 3.3rem;
  border-bottom: 1px solid #eee;
  font-size: 0.9rem;
  text-align: left;
`;

export const DataRow = styled.tr<{
  $isClickable: boolean;
  $isHighlighted: boolean;
  $isDarkTheme: boolean;
}>`
  background-color: ${({ $isHighlighted, $isDarkTheme }) =>
    $isHighlighted ? ($isDarkTheme ? "#304162ff" : "#94b3edff") : "transparent"};
  cursor: ${({ $isClickable }) => ($isClickable ? "pointer" : "default")};
  
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${({ $isClickable, $isHighlighted, $isDarkTheme }) => {
      if ($isClickable) {
        return $isDarkTheme ? "#25334dff" : "#94b3edff";
      }
      if ($isHighlighted) {
        return $isDarkTheme ? "#304162ff" : "#94b3edff";
      }
      return "transparent";
    }};
  }
`;

export const CheckmarkContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30px;
`;

export const CheckmarkIcon = styled.span<{ $isVisible: boolean; $isDarkTheme: boolean; }>`
  font-size: 20px;
  color: ${({ $isDarkTheme }) => ($isDarkTheme ? "#ffffffff" : "#000000ff")};
  font-weight: bold;
  visibility: ${({ $isVisible }) => ($isVisible ? "visible" : "hidden")};
  
  &::before {
    content: "✓";
  }
`;

