import { useEffect, useRef, useState } from "react";
import api from "../../api";

import {isAxiosError} from "axios";

import { FrontData } from "../../types";
import Tabs from "../Tabs";
import { DropdownInput } from "../DropDownInput";


const UploadForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  const [state, setState] = useState<string[][]>([]);

  const [frontData, setFrontData] = useState<null | FrontData>(null);

  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  const [curso, setCurso] = useState("CIC");


  const [semester, setSemester] = useState("Semestre");


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


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {

    const files = event.target.files;
    if (files && files.length > 0) {
      setFile(files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Selecione um arquivo primeiro!");
      return;
    }

    const formData = new FormData();

    formData.append("file", file);  // Nome do campo deve ser "file", igual no backend

    try {

      const response = await api.post("/upload/", formData);

      console.log(response.data)

      setState(response.data.dados);
      setSemester(response.data.semestre_ingresso);
      setCurso(response.data.curso);

      setMessage("");

    } catch (error) {
      handleError(error);
    }
  };

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
      setMessage("");



    } catch (error) {
      handleError(error);
    }
  }


  const min_year = 1990;
  const current_year = 2026;
  const current_semester: number = 1;


  let options = [];

  for(var i = min_year; i < current_year; i++){
    options.unshift(`${i}/1`);
    options.unshift(`${i}/2`);
  }

  options.unshift(`${current_year}/1`);

  if(current_semester == 2)
    options.unshift(`${current_year}/2`);


  return (
    <div>
      <input type="file" accept=".html" onChange={handleFileChange} />
      <button onClick={handleUpload}>Enviar</button>
      <button onClick={calculate}>Calcular</button>
      <p>{message}</p>
        
      {frontData && blobUrl && <Tabs frontData={frontData} blobUrl={blobUrl}></Tabs>}

      <div style={{display: "flex"}}>
        <p>Selecione o semestre de conclusão da sua primeira cadeira</p>
        <DropdownInput value={semester} onSelect={(value: string) => setSemester(value)} options={options}/>
      </div>

    </div >
  );
};

export default UploadForm;
