import './assets/main.css'
import Dropzone from './components/Dropzone'
import FilesDropped from './components/FilesDropped'



function App() {

  return (
    <>
      <main className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div id='main-container'>
          <div>
             <h1 id='title'> <span id='text-image'>Image</span> <br/> <span id='text-converter'>Converter</span></h1>
             <p className='mt-2'>Compress and convert your images.<br/><span className="font-bold">JPEG / PNG / WEBP  </span></p>
          </div>
          <div className="justify-center items-center gap-4">
          <div id='dropzone-container'>
            <Dropzone/>
          </div>
        </div>
        </div>
    
        <div className='mt-8'>
          <FilesDropped/>
        </div>
      </main>
    </>
  )
}

export default App
