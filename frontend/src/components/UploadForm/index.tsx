import { useState } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";


const UploadForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [charset, setCharset] = useState("");

  const [state, setState] = useState({});

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
      setMessage(response.data.message);
      setCharset(response.data.charset);
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
    </div>
  );
};

export default UploadForm;
