import React, { type SetStateAction } from "react";
import { DroppedFile } from '../App';



interface DropzoneProps {
    droppedFiles: DroppedFile[];
  setDroppedFiles: React.Dispatch<React.SetStateAction<DroppedFile[]>>;
  setTypeOfValue: React.Dispatch<SetStateAction<string>>
  }



const Dropzone:React.FC<DropzoneProps> = ({droppedFiles,setDroppedFiles,setTypeOfValue}) => {

    const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
       setTypeOfValue("")
        if (droppedFiles.length + e.dataTransfer.files.length > 10) {
            return alert('You can only upload 10 files at a time');
        }
        if (e?.dataTransfer?.files) {
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
                setDroppedFiles((prev) => [...prev, ...resolvedFiles]);
              });
                // window.scroll({top: window.innerHeight , behavior: 'smooth'});
            }else{
                console.log('No images found');
            }
        }
    }

    const onInputChange = (files:File[]  )=>{
      if (files) {
        if (droppedFiles.length + files.length <= 10) {
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
              setDroppedFiles((prev) => [...prev, ...resolvedFiles]);
            });

            window.scroll({top: window.innerHeight , behavior: 'smooth'});
            } else {
              alert('You can only upload 10 files at a time');
        }
    }
}


  return (
    <div className='dropzone '
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
      <input
        hidden
        type="file"
        name="inpt-files"
        id="inpt-files"
         multiple
        accept='.jpg, .jpeg, .png, .webp'
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onInputChange(e.target.files ? Array.from(e.target.files) : [])}
        />
        <label htmlFor='inpt-files' className=' cursor-pointer '>
            <div className='flex justify-center items-center h-full '>
                <p className='fileInput'>Choose Files</p>
            </div>
        </label>
  </div>
  )
}


export default Dropzone

