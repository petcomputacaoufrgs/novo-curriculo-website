import { DropdownInput } from '../DropDownInput';
import { OuterTranscriptBox, InnerTranscriptBox, InputsBox } from './styled';
import Historico from '../Historico';
import { FrontData, HistoryType } from '../../types';


interface TranscriptProps {
  optionsToSemesterButton: string[];
  semester: string;
  curso: string;
  onSelectCurso: (value: string) => void;
  onSelectSemester: (value: string) => void;
  old_history: {
    CIC: FrontData['historico'];
    ECP: FrontData['historico'];
  };
  uploaded_history?: string[][];
  onHistoryChange?: (getHistoryFn: () => string[][]) => void;
}

const Transcript = ({optionsToSemesterButton, semester, onSelectSemester, curso, onSelectCurso, old_history, uploaded_history, onHistoryChange} : TranscriptProps) => {
  return (

    <div style={{margin: "5%", display: "flex", flexDirection: "column", gap: "18px"}}>

    <InputsBox>

      <p style={{margin: "0"}}>Selecione o semestre de conclusão da sua 1º cadeira</p>
      <DropdownInput value={semester} onSelect={onSelectSemester} options={optionsToSemesterButton}/>

      <p style={{margin: "0"}}>Selecione o curso</p>
      <DropdownInput value={curso} onSelect={onSelectCurso} options={["CIC", "ECP"]}/>

    </InputsBox>

    <OuterTranscriptBox>
      <InnerTranscriptBox>
        <Historico history={old_history[curso === "CIC" ? 'CIC' : 'ECP']} historyType={HistoryType.OLD} uploadedHistory={uploaded_history} onHistoryChange={onHistoryChange} />
      </InnerTranscriptBox>
    </OuterTranscriptBox>

    </div>
  )
}

export default Transcript
