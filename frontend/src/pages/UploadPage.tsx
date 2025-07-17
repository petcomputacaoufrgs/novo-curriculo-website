import UploadForm from '../components/UploadForm'
import UploadForm2 from '../components/UploadForm/index2'
import './App.css'
import LoadButton from '../components/UploadForm/load.tsx'
import ConvertButton from '../components/UploadForm/convert.tsx'

export function UploadPage() {

  return (
    
    <div className="card">
      <UploadForm2 />
    </div>
    
  )
}

export default UploadPage;