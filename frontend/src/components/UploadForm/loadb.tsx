import api from "../../api";

import './UploadForm.css'
import uploadIcon from '../../assets/upload_icon.png'
import { isAxiosError } from "axios";

type LoadbProps = {
    setHistory: (history: string[][]) => void;
    setCurso: (curso: string) => void;
    setSemester: (semester: string) => void;
    setEtapas: (etapas: number[]) => void;
    setMessage: (message: string) => void;
};


const Loadb = ({ setHistory, setCurso, setSemester, setEtapas, setMessage }: LoadbProps) =>{

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


  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {

    const files = event.target.files;

    if (files && files.length > 0) {
      const formData = new FormData();

    formData.append("file", files[0]);  // Nome do campo deve ser "file", igual no backend

    try {

      const response = await api.post("/upload/", formData);

      console.log(response.data)

      setHistory(response.data.dados);
      setSemester(response.data.semestre_ingresso);
      setCurso(response.data.curso);
      setEtapas(response.data.etapas);
      console.log("dados", response.data.dados);
      
      setMessage("");

    } catch (error) {
      handleError(error);
    }
      
    }
    else{
        setMessage("Nenhum arquivo selecionado!")
    }

    // Limpa o valor do input para permitir carregar o mesmo arquivo novamente
    // Adicionado pois o usuário pode querer resetar para o seu histórico carregado após fazer mudanças manuais.
    event.target.value = '';
  };

  return (
    <div className = 'center-button'>
      <label className = "load-history">
        <input type="file" accept=".html" onChange={handleFileChange} style = {{display: "none"}} />
        Carregar Histórico
        <img src={uploadIcon} alt="ícone de upload" className="upload-icon" />
      </label>
    </div >
  );
}

export default Loadb;