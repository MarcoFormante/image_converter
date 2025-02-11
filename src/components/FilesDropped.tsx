import { useState } from 'react'
import File from './File'
import { imageQualities, imageTypes } from './utils'
import Resizer from 'react-image-file-resizer'
import { DroppedFile } from '../App'
import { saveAs } from 'file-saver'
import JSZip from 'jszip'

interface FilesDroppedProps {
  droppedFiles: DroppedFile[]
  setDroppedFiles: React.Dispatch<React.SetStateAction<DroppedFile[]>>
  typeOfValue: string
  setTypeOfValue: React.Dispatch<React.SetStateAction<string>>
}

const FilesDropped: React.FC<FilesDroppedProps> = ({
  droppedFiles,
  setDroppedFiles,
  typeOfValue,
  setTypeOfValue,
}) => {
  const [defaultQuality, setDefaultQuality] = useState('')
  const [defaultType, setDefaultType] = useState('')
  const [defaultMaxWidth, setDefaultMaxWidth] = useState('')
  const [isDownloadingAll, setIsDownloadingAll] = useState(false)

  const removeFile = (index: number) => {
    const filteredFiles = droppedFiles.filter((file) => {
      return index !== file.index
    })


    setDroppedFiles(filteredFiles)
    if (filteredFiles.length === 0) {
      resetDefaultValues()
    }
  }



  const removeAllFiles = () => {
    setDroppedFiles([])
    resetDefaultValues()
  }



  const resetDefaultValues = () => {
    setDefaultMaxWidth('')
    setDefaultQuality('')
    setDefaultType('')
  }



  const downloadAll = () => {
    if (isDownloadingAll) return
    setIsDownloadingAll(true)
    if (droppedFiles.length > 0) {
      const filesToDownload = droppedFiles.map(
        async (file: DroppedFile) =>
          await resizeFile(
            file.file,
            file.quality,
            file.type.toUpperCase(),
            file.realDimensions
          )
      )
      Promise.all(filesToDownload).then(async (res) => {
        setIsDownloadingAll(false)
        await zipFiles(res as File[])
      })
    }
  }



  const zipFiles = async (files: File[]) => {
    const zip = new JSZip()
    files.forEach((file, i) => {
      zip.file(`ima-${i}-${file.name}`, file)
    })
    const content = await zip.generateAsync({ type: 'blob' })
    saveAs(content, 'images.zip')
    setIsDownloadingAll(false)
  }



  const resizeFile = (
    file: File,
    quality: number | string,
    type: string,
    realDimensions: { width: string; height: string }
  ) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        +realDimensions.width,
        +realDimensions.height,
        type,
        +quality,
        0,
        (uri) => {
          resolve(uri)
        },
        'file'
      )
    })



  return (
    <div>
      <div>
        {droppedFiles.map((file, index) => (
          <div key={index} className="file-container">
            <File
              defaultQuality={defaultQuality}
              defaultType={defaultType}
              file={file}
              index={index}
              removeFile={removeFile}
              setDroppedFiles={setDroppedFiles}
              defaultMaxWidth={defaultMaxWidth}
              typeOfValue={typeOfValue}
              setTypeOfValue={setTypeOfValue}
              isDownloadingAll={isDownloadingAll}
            />
          </div>
        ))}
      </div>

      {droppedFiles.length > 0 && (
        <div className="defaultValues-container">
          <h2>DEFAULT VALUES</h2>
          <div className="mt-2 mb-2 flex flex-row justify-between items-center  p-3 align-middle ">
            <div className="flex flex-col gap-2 text-center file-btn">
              <label>Default Quality</label>
              <select
                name="defaultQuality"
                value={defaultQuality}
                className="block  p-1 w-24 text-center"
                onChange={(e) => {
                  setDefaultQuality(e.target.value)
                  setTypeOfValue('QUALITY')
                }}
              >
                <option value="" style={{ color: 'grey' }}>
                  ----
                </option>
                {imageQualities.map((num) => (
                  <option className=" text-black" key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2 text-center file-btn align-middle">
              <label>Default Output</label>
              <select
                value={defaultType}
                className="block  p-1 w-24 text-center  "
                onChange={(e) => {
                  setDefaultType(e.target.value)
                  setTypeOfValue('TYPE')
                }}
              >
                <option value="">----</option>
                {imageTypes.map((type: string) => (
                  <option key={type} value={type}>
                    {type.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2 text-center file-btn align-middle">
              <label>Default Max Width</label>
              <input
                type="number"
                className="p-1 text-center border-2 border-black"
                min={1}
                maxLength={4}
                value={defaultMaxWidth}
                placeholder="----"
                onChange={(e) => {
                  setDefaultMaxWidth(e.target.value.slice(0, 5))
                  setTypeOfValue('WIDTH')
                }}
              />
            </div>

            <div style={{ gap: 30 }} className="flex file-btn">
              <button
                onClick={downloadAll}
                disabled={isDownloadingAll}
                className="btn btn-donwload  border-2 border-black  px-4 py-2 rounded  text-white  transition "
              >
                Download All
              </button>
              <button
                onClick={removeAllFiles}
                className="btn border-2 px-4 py-2 rounded bg-red-500 text-white transition hover:bg-red-200 hover:text-red-500"
              >
                Remove All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FilesDropped
