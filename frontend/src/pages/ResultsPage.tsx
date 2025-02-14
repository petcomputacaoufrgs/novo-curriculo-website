import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import ViewSelection from "../components/SelectionView";

function ResultsPage() {
  const { filename } = useParams(); // Pega o nome do arquivo da URL
  const navigate = useNavigate();
  const [results, setResults] = useState<{ filename: string; charset: string, image_url: string } | null>(null);

  const [selectionView, setSelectionView] = useState<boolean>(true);


  useEffect(() => {

    let resultId;
    if(selectionView)
      resultId = 1
    else 
      resultId = 0

    const fetchResults = async () => {
      try {
        const response = await api.get(`/results/${resultId}/${filename}`);
        setResults(response.data);
      } catch (error) {
        console.error("Erro ao buscar resultados:", error);
      }
    };

    fetchResults();
  }, [filename, selectionView]);


  return (
    <div>
      <h1>Resultados do Arquivo</h1>
      {results ? (
        <div>
          <p>Arquivo: {results.filename}</p>
          <p>Charset Detectado:{results.charset}</p>

          <ViewSelection selectionView={selectionView} onChangeSelectionView={setSelectionView}/>
          

          
          <img src={results.image_url}></img>
        </div>
      ) : (
        <p>Carregando resultados...</p>
      )}
      <button onClick={() => navigate("/")}>Voltar</button>
    </div>
  );
}

export default ResultsPage;