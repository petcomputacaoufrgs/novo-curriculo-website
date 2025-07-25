import { useState } from "react";
import api from "../../api";
import Butterfly from "../Butterfly";
import { FrontData } from "../../types";
import './UploadForm.css'
import { isAxiosError } from "axios";

type ConvertbProps = {
  state: string[][];
  semester: string;
  curso: string;
  setFrontData: (frontData: FrontData) => void;
  setOldBlobUrl: (url: string) => void;
  setNewBlobUrl: (url: string) => void;
};


function Convertb({state, semester, curso, setFrontData, setOldBlobUrl, setNewBlobUrl}: ConvertbProps){
  const [isCalculating, setIsCalculating] = useState(false);
  const [message, setMessage] = useState("");

      const handleError = (e: unknown) => {
      if (isAxiosError(e)) {
  
        if (e.response) {
          // erro com resposta do backend
          const detail = e.response.data.detail;
          setMessage(`Erro: ${detail}`);
        } 
        
        else {
          setMessage("Erro: Não foi possível conectar ao servidor.");
        }
      } 
      
      else {
        setMessage("Erro inesperado.");
      }
  
  }

  


  const calculate = async () => {
    setIsCalculating(true);
    try {
      const response = await api.post("/calculate/", { tabela: state, semestre_ingresso: semester, curso: curso });
      
      setFrontData(response.data);
      
      console.log(response.data);

      // Criar um Blob e carregar no iframe
      const oldBlob = new Blob([response.data["html_old_diagram"]], { type: "text/html" });
      const oldUrlBlob = URL.createObjectURL(oldBlob);

      const newBlob = new Blob([response.data["html"]], { type: "text/html" });
      const newUrlBlob = URL.createObjectURL(newBlob);

      setOldBlobUrl(oldUrlBlob);
      setNewBlobUrl(newUrlBlob);

      setMessage("");


    } catch (error) {
      handleError(error);
    }finally{
      setIsCalculating(false);
    }
  }

  return(
    <div>
      {isCalculating && <Butterfly />}
        <div className = "center-converter">
            <button className = "convert-button" onClick={calculate}>Converter</button>
        </div>
        <p>{message}</p>

    </div>  
  )

}

export default Convertb;