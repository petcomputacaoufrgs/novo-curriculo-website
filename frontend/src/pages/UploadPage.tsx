import UploadForm from '../components/UploadForm'
import UploadForm2 from '../components/UploadForm/index2'
import './App.css'
import Loadb from '../components/UploadForm/loadb.tsx'
import Convertb from '../components/UploadForm/convertb.tsx'
import { useScrollTrigger } from '@mui/material'
import { useEffect, useRef, useState } from "react";

export function UploadPage() {

const [file, setFile] = useState<File | null>(null)

  return (
    
    <div className="card">
      <Loadb setFile = {setFile}/>
      <Convertb file = {file} />
    </div>
    
  )
}

export default UploadPage;