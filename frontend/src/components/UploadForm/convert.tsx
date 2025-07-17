import { useEffect, useRef, useState } from "react";
import api from "../../api";

import { FrontData } from "../../types";
import Tabs from "../Tabs";
import './UploadForm.css'

const ConvertButton = () => {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [charset, setCharset] = useState("");

  const [state, setState] = useState<string[][]>([]);

  const [frontData, setFrontData] = useState<null | FrontData>(null);

  const [blobUrl, setBlobUrl] = useState("");


  const [windowSize, setWindowSize] = useState(window.innerWidth);


  const getWhichGraphShow = () => {
    if(window.innerWidth >= 1500)
      return 1;
    if(window.innerWidth >= 1000)
      return 2;
    if(window.innerWidth >= 500)
      return 3;
    if(window.innerWidth >= 300)
      return 4;
  }
  const [show, setShow] = useState(getWhichGraphShow())


    useEffect(() => {
      const handleResize = () => {
        setWindowSize(window.innerWidth);
      };
  
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

      useEffect(() => {
        setShow(getWhichGraphShow());
        return () => {};
      }, [windowSize]);

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

  const handleConvert = async () => {
    await handleUpload();
    await calculate();
  };

  console.log(blobUrl);

  return (
    <div>
        <div className = "center-converter">
            <button className = "convert-button" onClick={handleConvert}>Converter</button>
        </div>
        <p>{message}</p>
    </div>  
  );
};

export default ConvertButton;