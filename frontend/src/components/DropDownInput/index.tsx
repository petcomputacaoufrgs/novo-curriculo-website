// DropdownInput.tsx
import { ChevronDown, ChevronUp } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";

const Container = styled.div`
  position: relative;
  display: inline-block;
  width: min(200px, 100%);
`;

const InputButton = styled.div<{$alreadyOpened: boolean, $backgroundColor: string, $borderRadius: string, $fontWeight: string}>`
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

const Dropdown = styled.ul`
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

const Option = styled.li`
  padding: 0.5em 1em;
  cursor: pointer;
  &:hover {
    background-color: #ccc;
  }

  color: black;
`;

type Props = {
  options: string[];
  value: string;
  onSelect: (value: string) => void;

  backgroundColor?: string;
  fontWeight?: string;
  borderRadius?: string;
};

export const DropdownInput: React.FC<Props> = ({ options, value, onSelect, backgroundColor = "white", fontWeight = "normal", borderRadius = "4px"}) => {

  const [open, setOpen] = useState(false);
  const validOption = options.includes(value);

  const ref = useRef<HTMLDivElement>(null);

  const handleSelect = (value: string) => {
    onSelect(value);
    setOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const chevronSize = "20px";

  return (
    <Container ref={ref}>
      <InputButton onClick={() => setOpen(!open)} $alreadyOpened={validOption} $backgroundColor={backgroundColor} $borderRadius={borderRadius} $fontWeight={fontWeight}>
        {value}
        {open ? <ChevronDown size={chevronSize} color='black' /> : <ChevronUp size={chevronSize} color='black' />}
      </InputButton>
      {open && (
        <Dropdown>
          {options.map((opt) => (
            <Option key={opt} onClick={() => handleSelect(opt)}>
              {opt}
            </Option>
          ))}
        </Dropdown>
      )}
    </Container>
  );
};
