import { DropdownInput } from '../DropDownInput';
import { OuterTranscriptBox, InnerTranscriptBox, InputsBox } from './styled';


interface TranscriptProps {
  optionsToSemesterButton: string[];
  semester: string;
  curso: string;
  onSelectCurso: (value: string) => void;
  onSelectSemester: (value: string) => void;
}

const Transcript = ({optionsToSemesterButton, semester, onSelectSemester, curso, onSelectCurso} : TranscriptProps) => {
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
        Histórico escolar
      </InnerTranscriptBox>
    </OuterTranscriptBox>

    </div>
  )
}

export default Transcript
