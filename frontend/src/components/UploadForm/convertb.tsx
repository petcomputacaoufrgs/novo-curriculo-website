import { useState } from "react";
import api from "../../api";

import { FrontData } from "../../types";
import './UploadForm.css'

type ConvertbProps = {
  state: string[][];
  semester: string;
  curso: string;
  setFrontData: (frontData: FrontData) => void;
  setBlobUrl: (url: string) => void;
};


function Convertb({state, semester, curso, setFrontData, setBlobUrl}: ConvertbProps){

  const [message, setMessage] = useState("");
  const [charset, setCharset] = useState("");



  const calculate = async () => {
    try {
      const response = await api.post("/calculate/", { tabela: state, semestre_ingresso: semester, curso: curso });
      
      setFrontData(response.data);
      
      console.log(response.data);

      // Criar um Blob e carregar no iframe
      const blob = new Blob([response.data["html"]], { type: "text/html" });
      const urlBlob = URL.createObjectURL(blob);

      const iframe = document.getElementById("meuIframe");
            if (iframe) {
                (iframe as HTMLIFrameElement).src = urlBlob;
            }

      setBlobUrl(urlBlob);


    } catch (error) {
      setMessage("Erro no cálculo");
      setCharset("");
    }
  }

  return(
    <div>
        <div className = "center-converter">
            <button className = "convert-button" onClick={calculate}>Converter</button>
        </div>
        <p>{message}</p>
        <p>{charset}</p>

    </div>  
  )

}

export default Convertb;