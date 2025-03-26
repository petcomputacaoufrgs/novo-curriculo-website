import { useReducer, useEffect } from "react";
import { Select, MenuItem, Button } from "@mui/material";
import axios from "axios";

const OPTIONS = ["A", "B", "C", "D", "E"]; // Opções disponíveis

type Action =
  | { type: "SELECT"; index: number; value: string }
  | { type: "ADD_INPUT" }
  | { type: "REMOVE_INPUT"; index: number }
  | { type: "SUBMIT" };

type State = {
  inputs: string[]; // Guarda os valores selecionados nos inputs
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SELECT":

      const newInputs = [...state.inputs];
      console.log("----");
      console.log(action.value);
      console.log("----");

      newInputs[action.index] = action.value;
      return { inputs: newInputs };

    case "ADD_INPUT":
      return state.inputs.length < OPTIONS.length
        ? { inputs: [...state.inputs, ""] }
        : state;

    case "REMOVE_INPUT":
      return {
        inputs: state.inputs.filter((_, i) => i !== action.index),
      };

    case "SUBMIT":
      console.log("Enviando:", state.inputs.filter((val) => val !== ""));
      return state;

    default:
      return state;
  }
};

export default function DropdownSelection() {
  const [state, dispatch] = useReducer(reducer, { inputs: [""] });

  useEffect(() => {
    if (
      state.inputs.length < OPTIONS.length &&
      state.inputs.every((val) => val !== "")
    ) {
      dispatch({ type: "ADD_INPUT" });
    }
  }, [state.inputs]);

  const selectedOptions = new Set(state.inputs); // Opções já escolhidas

  const handleSubmit = async () => {
    const data = state.inputs.filter((val) => val !== "");
    await axios.post("http://127.0.0.1:8000/submit", { selections: data });
  };

  console.log(state.inputs);
  return (
    <div className="flex flex-col gap-3">
      {state.inputs.map((selected, index) => (

        <div key={index} className="flex items-center gap-2">
          <Select
            value={selected}
            onChange={(val : any) => dispatch({ type: "SELECT", index, value: val.target.value })}
          >
            {OPTIONS.filter((opt) => !selectedOptions.has(opt) || opt === selected).map(
              (opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              )
            )}
          </Select>

          {index > 0 && (
            <Button
              onClick={() => dispatch({ type: "REMOVE_INPUT", index })}
            >
              ❌
            </Button>
          )}
        </div>
      ))}

      <Button onClick={handleSubmit} className="mt-2">
        Enviar
      </Button>
    </div>
  );
}
