import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: 10px;
  padding: 35px 10%;
  gap: 64px;
  background-color: ${({ theme }) => theme.background};

  @media(max-width: 1430px){
    width: 100%;
    padding: 35px 5%;
  }

    
`;

export const ToggleGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
`;

export const ToggleButton = styled.button<{ $active: boolean }>`
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  background-color: ${({ $active }) => ($active ? "#007bff" : "#ddd")};
  color: ${({ $active }) => ($active ? "white" : "#333333")};;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background-color: ${({ $active }) => ($active ? "#007bff" : "#ccc")};
  }
`;

export const Section = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  @media(max-width: 1430px){
     justify-content: space-between;
  }

  @media(max-width: 1220px){
    flex-direction: column;
    gap: 32px;
    justify-content: center;
    align-items: center;
  }

`;

export const ImagePreview = styled.img`
  max-width: 333.3px;
  max-height: 250px;
  height: auto;
  border-radius: 8px;
  border: 1px solid #ccc;
`;

export const TableContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 55%;
  gap: 16px;

  @media(max-width: 1220px){
    width: 100%;
    align-items: center;
  }


`


export const Table = styled.table<{ $isDarkTheme: boolean }>`
  border-collapse: collapse;

  td,
  th {
    border: 1px solid #aaa;
    padding: 8px 12px;
    text-align: center;
    font-size: 20px;

    @media(max-width: 750px){
        font-size: 16px;
    }

    @media(max-width: 640px){
        font-size: 12px;
    }
  }

  th {
    background-color: ${({ $isDarkTheme }) => $isDarkTheme ? '#4c4c4cff' : '#dfdfdfff'};
    color: ${({ $isDarkTheme }) => $isDarkTheme ? '#ffffff' : '#000000'};
    padding: 12px;
  }

`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 40%;
  gap: 16px;
`;

export const SectionTitle = styled.h2`
  margin: 0;
  text-align: left;
`;

export const WarningText = styled.p`
  text-align: left;

`;

