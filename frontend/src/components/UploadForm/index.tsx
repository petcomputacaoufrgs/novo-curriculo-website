import { useRef, useState } from "react";
import api from "../../api";


const UploadForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [charset, setCharset] = useState("");

  const [state, setState] = useState({});

  const [image, setImage] = useState<string | null>(null);  

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

      setState(response.data);
      console.log(response.data);

      //setMessage(response.data.message);
      //setCharset(response.data.charset);

    } catch (error) {
      setMessage("Erro no upload");
      setCharset("");
    }
  };

  const calculate = async () => {
    try {
      const response = await api.post("/calculate/", state);
      
      setImage(response.data["Créditos Obrigatórios (antigo)"]);
      console.log(response.data);

      // Criar um Blob e carregar no iframe
      const blob = new Blob([response.data["html"]], { type: "text/html" });
      const urlBlob = URL.createObjectURL(blob);

      const iframe = document.getElementById("meuIframe");
            if (iframe) {
                (iframe as HTMLIFrameElement).src = urlBlob;
            }


    } catch (error) {
      setMessage("Erro no cálculo");
      setCharset("");
    }
  }




  return (
    <div>
      <input type="file" accept=".html" onChange={handleFileChange} />
      <button onClick={handleUpload}>Enviar</button>
      <button onClick={calculate}>Calcular</button>
      <p>{message}</p>
      <p>{charset}</p>

      <iframe style={{width: "100vw", height: "60vh"}} id="meuIframe"></iframe>


      {(image ? <img src={`data:image/png;base64,${image}`}></img> : null)}
    </div >
  );
};

export default UploadForm;
