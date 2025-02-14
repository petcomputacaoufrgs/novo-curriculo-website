import { useState } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";


const UploadForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [charset, setCharset] = useState("");

  const navigate = useNavigate();
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


      navigate(`results/${response.data.filename}`)

      //setMessage(response.data.message);
      //setCharset(response.data.charset);

    } catch (error) {
      setMessage("Erro no upload");
      setCharset("");
    }
  };

  return (
    <div>
      <input type="file" accept=".html" onChange={handleFileChange} />
      <button onClick={handleUpload}>Enviar</button>
      <p>{message}</p>
      <p>{charset}</p>
    </div>
  );
};

export default UploadForm;
