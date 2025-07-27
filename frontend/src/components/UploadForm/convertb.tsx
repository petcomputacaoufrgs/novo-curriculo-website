import api from "../../api";

import { FrontData } from "../../types";
import './UploadForm.css'
import { isAxiosError } from "axios";

type ConvertbProps = {
  history: string[][];
  semester: string;
  curso: string;
  setFrontData: (frontData: FrontData) => void;
  setOldBlobUrl: (url: string) => void;
  setNewBlobUrl: (url: string) => void;
  setMessage: (message: string) => void;
};

function Convertb({history, semester, curso, setFrontData, setOldBlobUrl, setNewBlobUrl, setMessage}: ConvertbProps){


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
    try {
      const response = await api.post("/calculate/", { tabela: history, semestre_ingresso: semester, curso: curso });
      
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
    }
  }

  return(
    <div>

      <button className = "convert-button" onClick={calculate} style={{height: "100%"}}>Converter</button>


    </div>  
  )

}

export default Convertb;