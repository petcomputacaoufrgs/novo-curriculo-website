import { DropdownInput } from '../DropDownInput';
import { OuterTranscriptBox, InnerTranscriptBox } from './styled';


interface TranscriptProps {
  optionsToSemesterButton: string[];
  semester: string;
  onSelectSemester: (value: string) => void;
}

const Transcript = ({optionsToSemesterButton, semester, onSelectSemester} : TranscriptProps) => {
  return (

    <div style={{margin: "5%", display: "flex", flexDirection: "column", gap: "18px"}}>
    <div style={{display: "flex", width: "100%", gap: "18px", alignItems: "center"}}>
      <p style={{margin: "0"}}>Selecione o semestre de conclusão da sua 1º cadeira</p>
      <DropdownInput value={semester} onSelect={onSelectSemester} options={optionsToSemesterButton}/>
    </div>

    <OuterTranscriptBox>
      <InnerTranscriptBox>
        Histórico escolar
      </InnerTranscriptBox>
    </OuterTranscriptBox>

    </div>
  )
}

export default Transcript
