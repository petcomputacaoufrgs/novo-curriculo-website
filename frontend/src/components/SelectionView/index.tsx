interface ISelectionView{
    selectionView: boolean, 
    onChangeSelectionView: React.Dispatch<boolean>
}


const ViewSelection = ({selectionView, onChangeSelectionView}: ISelectionView) => {

    return (
    <div style={{display: "flex", justifyContent: "center"}}>
            <button onClick={() => onChangeSelectionView(true)} disabled={selectionView}>View 1</button>
            <button onClick={() => onChangeSelectionView(false)} disabled={!selectionView}>View 2</button>
        </div>
    )

}

export default ViewSelection;


