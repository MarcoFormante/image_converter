import React, { useContext, useState} from "react";
import { Context } from "../context/Context";


const Dropzone:React.FC = () => {
  const [isLoading,setIsLoading] = useState(false)
  const {droppedFiles,setDroppedFiles,setTypeOfDefaultValue} = useContext(Context)

    const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setTypeOfDefaultValue("")
        if (droppedFiles.length + e.dataTransfer.files.length > 10) {
          return alert('You can upload a maximum of 10 files at once. Please reduce the number of files and try again.');
        }
       
        const fileTypes = ['jpg', 'jpeg', 'png', 'webp'];

        droppedFiles.forEach(file => {
          if (!fileTypes.includes(file.type)) {
            return alert("Unsupported file type. Please upload a JPG, JPEG, PNG, or WEBP file.");
          }
        });
        
        if (e?.dataTransfer?.files) {
          setIsLoading(true)
            const files = Array.from(e.dataTransfer.files)
                          .filter(file => file !== null && file.type.includes('image'));
          if (files.length) {
              const startIndex = !droppedFiles.length ? 0 : droppedFiles[droppedFiles.length-1].index + 1;
              Promise.all(files.map(async (file,index) => ({
                file,
                size: file.size,
                type: file.type,
                name: file.name,
                quality: '100',
                index:startIndex + index,
                dimensions:{width: '', height: ''},
                realDimensions:await new Promise<{ width: string; height: string }>((resolve) => {
                  const img = new Image();
                  img.src = URL.createObjectURL(file);
                  img.onload = () => {
                    resolve({ width: img.width.toString(), height: img.height.toString() });
                  };
                })
              }))).then( resolvedFiles => {
                setIsLoading(false)
                setDroppedFiles((prev) => [...prev, ...resolvedFiles]);
              }).catch(()=>{
                  console.error("Error during loading images")
                  setIsLoading(false)
              })
            }else{
                console.error('No images found');
                setIsLoading(false)
            }
        }else{
          setIsLoading(false)
        }
    }

    const onInputChange = (files:File[]  )=>{
      if (files) {
        if (droppedFiles.length + files.length <= 10) {
          setIsLoading(true)
            const startIndex = !droppedFiles.length ? 0 : droppedFiles[droppedFiles.length-1].index + 1;
            Promise.all(files.map(async (file,index) => ({
              file,
              size: file.size,
              type: file.type,
              name: file.name,
              quality: '100',
              index: startIndex + index,
              dimensions:{width: '', height: ''},
              realDimensions:await new Promise<{ width: string; height: string }>((resolve) => {
                const img = new Image();
                img.src = URL.createObjectURL(file);
                img.onload = () => {
                  resolve({ width: img.width.toString(), height: img.height.toString() });
                };
              })
            }))).then( resolvedFiles => {
              setIsLoading(false)
              setDroppedFiles((prev) => [...prev, ...resolvedFiles]);
            }).catch(()=>{
              setIsLoading(false)
            })
            window.scroll({top: window.innerHeight , behavior: 'smooth'});
            }else {
              setIsLoading(false)
              alert('You can only upload 10 files at a time');
        }
    }else{
      setIsLoading(false)
      console.error("Error during loading images")
    }
}


  return (
    <div className='dropzone'
      
      onDrop={(e) =>
      {
        onDrop(e)
        e.currentTarget.classList.remove('dragover')
      }}
      onDragOver={(e) => {
        e.preventDefault()
        e.currentTarget.classList.add('dragover')
      }}
    >
    <p id="text-drop">Drop here or</p> 

      <input
        hidden
        type="file"
        name="inpt-files"
        id="inpt-files"
        multiple
        accept='.jpg, .jpeg, .png, .webp'
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onInputChange(e.target.files ? Array.from(e.target.files) : [])}
        />
        <label htmlFor='inpt-files' className='cursor-pointer '>
            <div className='flex justify-center items-center h-full '>
                <button className='fileInput'>Choose Files</button>
            </div>
        </label>

        {isLoading && 
        <div id="loading-container">
          <div>L<span id="loading-circle"></span>ADING</div>
        </div>
      }
  </div>
  )
}


export default Dropzone

