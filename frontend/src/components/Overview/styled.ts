import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 85%;
  padding: 30px;
  gap: 64px;

  @media(max-width: 1430px){
    width: 100%;
  
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
  background-color: ${({ $active }) => ($active ? "#553525" : "#ccc")};
  color: white;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background-color: #8b6a50;
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


export const Table = styled.table`
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
    background-color: #f4f4f4;
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

