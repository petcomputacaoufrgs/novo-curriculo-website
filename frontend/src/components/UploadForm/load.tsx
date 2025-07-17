import { useEffect, useRef, useState } from "react";
import api from "../../api";

import { FrontData } from "../../types";
import Tabs from "../Tabs";
import './UploadForm.css'
import uploadIcon from '../../assets/upload_icon.png'

const LoadButton = () => {
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


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {

    const files = event.target.files;
    if (files && files.length > 0) {
      setFile(files[0]);
      setMessage("Arquivo selecionado com sucesso!");
    }
    else{
        setMessage("Nenhum arquivo selecionado!")
    }
  };

  console.log(blobUrl);

  return (
    <div className = 'center-button'>
      <label className = "load-history">
        <input type="file" accept=".html" onChange={handleFileChange} style = {{display: "none"}} />
        Carregar Histórico
        <img src={uploadIcon} alt="ícone de upload" className="upload-icon" />
      </label>
      <p>{message}</p>
    </div >
  );
};

export default LoadButton;