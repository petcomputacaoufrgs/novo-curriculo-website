// DropdownInput.tsx
import { ChevronDown, ChevronUp } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { Container, Dropdown, InputButton, Option } from "./styled";



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
