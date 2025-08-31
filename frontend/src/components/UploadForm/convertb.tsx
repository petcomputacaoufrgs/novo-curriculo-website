import { useState } from "react";
import api from "../../api";
import Butterfly from "../Butterfly";
import { FrontData } from "../../types";
import './UploadForm.css'
import { isAxiosError } from "axios";

type ConvertbProps = {
  history: string[][];
  semester: string;
  curso: string;
  getModifiedHistory?: (() => string[][]) | null;
  setFrontData: (frontData: FrontData) => void;
  setOldBlobUrl: (url: string) => void;
  setNewBlobUrl: (url: string) => void;
  setMessage: (message: string) => void;
};

function Convertb({history, semester, curso, getModifiedHistory, setFrontData, setOldBlobUrl, setNewBlobUrl, setMessage}: ConvertbProps){
  const [isCalculating, setIsCalculating] = useState(false);

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
    document.body.style.overflow = 'hidden';
    try {
      // Determina qual histórico usar: modificado (se disponível) ou original
      const historyToUse = getModifiedHistory ? getModifiedHistory() : history;
      

      
      const response = await api.post("/calculate/", { 
        tabela: historyToUse, 
        semestre_ingresso: semester, 
        curso: curso 
      });
      
      setFrontData(response.data);


      // Criar um Blob e carregar no iframe
      const oldBlob = new Blob([response.data["html_old_diagram"]], { type: "text/html" });
      const oldUrlBlob = URL.createObjectURL(oldBlob);

      const newBlob = new Blob([response.data["html"]], { type: "text/html" });
      const newUrlBlob = URL.createObjectURL(newBlob);

      setOldBlobUrl(oldUrlBlob);
      setNewBlobUrl(newUrlBlob);

      setMessage("Conversão Concluída!");

    } catch (error) {
      handleError(error);
    }finally{
      setIsCalculating(false);
      document.body.style.overflow = 'auto';
    }
  }

  return(
    <div>
      {isCalculating && <Butterfly />}
      <button className = "convert-button" onClick={calculate} style={{height: "100%"}}>Converter</button>
    </div>  
  )
}

export default Convertb;
