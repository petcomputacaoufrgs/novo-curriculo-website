import styled from 'styled-components';

export const Container = styled.div`
  position: relative;
  display: inline-block;
  width: min(200px, 100%);
`;

export const InputButton = styled.div<{$alreadyOpened: boolean, $backgroundColor: string, $borderRadius: string, $fontWeight: string}>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5em 1em;
  border: 1px solid #ccc;
  border-radius: ${(props) => props.$borderRadius};

  cursor: pointer;
  background-color: ${(props) => props.$backgroundColor};
  font-weight: ${(props) => props.$fontWeight};
  font-size: 1rem;
  color: ${(props) => props.$alreadyOpened? "black" : "gray"};
`;

export const Dropdown = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: white;
  border: 1px solid #ccc;
  border-top: none;
  list-style: none;
  padding: 0;
  margin: 0;
  z-index: 1000;
  max-height: 200px;
  overflow-y: auto;
`;

export const Option = styled.li`
  padding: 0.5em 1em;
  cursor: pointer;
  &:hover {
    background-color: #ccc;
  }

  color: black;
`;