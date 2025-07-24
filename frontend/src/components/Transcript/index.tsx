import { DropdownInput } from '../DropDownInput';
import { OuterTranscriptBox, InnerTranscriptBox, InputsBox } from './styled';
import NovoHistorico from '../NovoHistorico';
import { FrontData } from '../../types';


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
}

const Transcript = ({optionsToSemesterButton, semester, onSelectSemester, curso, onSelectCurso, old_history} : TranscriptProps) => {
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
        <NovoHistorico novo_historico={old_history[curso === "CIC" ? 'CIC' : 'ECP']} isOld = {true} />
      </InnerTranscriptBox>
    </OuterTranscriptBox>

    </div>
  )
}

export default Transcript
