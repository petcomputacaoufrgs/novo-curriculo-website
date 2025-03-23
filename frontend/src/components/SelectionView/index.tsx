import api from "../../api";


interface ISelectionView{
    selectionView: boolean, 
    onChangeSelectionView: React.Dispatch<boolean>
}


const ViewSelection = ({selectionView, onChangeSelectionView}: ISelectionView) => {


    async function carregarHtmlModificado() {
        try {
            const response = await api.post("/modificar_html", ["ED"]);
    
            const htmlTexto = response.data;  // Pega a resposta do FastAPI
    
            console.log(htmlTexto);

            // Criar um Blob e carregar no iframe
            const blob = new Blob([htmlTexto], { type: "text/html" });
            const urlBlob = URL.createObjectURL(blob);

            const iframe = document.getElementById("meuIframe");
            if (iframe) {
                (iframe as HTMLIFrameElement).src = urlBlob;
            }
    
        } catch (error) {
            console.error("Erro ao carregar HTML modificado:", error);
        }
    }



    return (
    <div style={{display: "flex", justifyContent: "center"}}>
            <button onClick={() => onChangeSelectionView(true)} disabled={selectionView}>View 1</button>
            <button onClick={() => onChangeSelectionView(false)} disabled={!selectionView}>View 2</button>

            <button onClick={carregarHtmlModificado}></button>

            <iframe id="meuIframe"></iframe>
        </div>
    )

}

export default ViewSelection;


