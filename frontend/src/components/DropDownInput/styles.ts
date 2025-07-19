import styled from 'styled-components';

interface ContainerProps {
  width: string;
}

interface DropDownWrapperProps {
  width: string;
}

export const Container = styled.div<ContainerProps>`
  width: ${({ width }) => width};
  position: relative;
`;

export const ToggleButton = styled.button`
  position: absolute;
  right: 0;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #553525;
  padding: 8px 24px 8px 12px;
  display: flex;
  align-items: center;
`;

export const DropDownWrapper = styled.div<DropDownWrapperProps>`
  position: relative;
  width: ${({ width }) => width};
  
  & > div {
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
  }
`;


export const StyledInput = styled.div<{$fontSize: string}>`
  width: 100%;
  padding-right: 3.5em;
  font-size: ${(props) => props.$fontSize};

`