import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  padding: 30px;
  border-radius: 10px;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  justify-content: center;
  align-items: center;

`;