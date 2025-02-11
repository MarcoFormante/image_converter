import { useState } from 'react'
import './assets/main.css'
import Dropzone from './components/Dropzone';
import FilesDropped from './components/FilesDropped';



export type DroppedFile = {
  file: File,
  name: string,
  size: number,
  type: string,
  quality: string,
  index:number
  dimensions:{
    width: string,
    height: string
  },
  realDimensions:{
    width: string,
    height: string
  }
};

function App() {
  const [droppedFiles, setDroppedFiles] = useState<DroppedFile[]>([]);
  const [typeOfValue,setTypeOfValue] = useState("")


  return (
    <>
     <main className='mx-auto max-w-7xl px-2 sm:px-6 lg:px-8'>

      <div className='justify-center items-center gap-4'>
        <div>
            <Dropzone droppedFiles={droppedFiles} setDroppedFiles={setDroppedFiles} setTypeOfValue={setTypeOfValue} />
        </div>
      </div>

      <div>
        <p className='mt-4 mb-2 text-center text-2xl'>Total Files : <span className="font-bold">{droppedFiles.length}/10</span></p>
        <FilesDropped  droppedFiles={droppedFiles} setDroppedFiles={setDroppedFiles} typeOfValue={typeOfValue} setTypeOfValue={setTypeOfValue}  />
      </div>
     </main>
    </>
  )
}

export default App
