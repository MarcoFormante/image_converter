import React, { SetStateAction, useEffect, useState } from 'react'
import { imageQualities, imageTypes } from './utils'
import { DroppedFile } from '../App'
import FileResizer from 'react-image-file-resizer'

interface FileProps {
  file: DroppedFile
  index: number
  removeFile: (index: number) => void
  defaultType: string
  defaultQuality: string
  setDroppedFiles: React.Dispatch<SetStateAction<DroppedFile[]>>
  defaultMaxWidth: string
  typeOfValue: string

  setTypeOfValue: React.Dispatch<SetStateAction<string>>
  isDownloadingAll: boolean
}



const File: React.FC<FileProps> = ({
  file,
  index,
  removeFile,
  defaultType,
  defaultQuality,
  defaultMaxWidth,
  setDroppedFiles,
  typeOfValue,
  setTypeOfValue,
  isDownloadingAll
}) => {
  const [quality, setQuality] = useState(defaultQuality || '100')
  const [type, setType] = useState(
    defaultType || file.type.replace('image/', '')
  )
  const [maxWidth, setMaxWidth] = useState('')
  const [isDownloading, setIsDownloading] = useState(false)
  const [realDimensions, setRealDimensions] = useState({
    width: '',
    height: '',
  })

  useEffect(() => {
    setRealDimensions(file.realDimensions)
    setMaxWidth(file.realDimensions.width)
  }, [])

  useEffect(() => {
    setIsDownloading(true)
    if (defaultQuality && typeOfValue === 'QUALITY') {
      setQuality(defaultQuality)
      editDroppedFiles('quality', defaultQuality)
    }
    if (defaultType && typeOfValue === 'TYPE') {
      setType(defaultType)
      editDroppedFiles('type', defaultType)
    }

    if (defaultMaxWidth && typeOfValue === 'WIDTH') {
      setMaxWidth(defaultMaxWidth)
      editDroppedFiles('dimensions', defaultMaxWidth)
    } else if (!defaultMaxWidth && typeOfValue === 'WIDTH') {
      setMaxWidth(realDimensions.width)
      editDroppedFiles('dimensions', realDimensions.width)
    }
    setIsDownloading(false)
  }, [defaultQuality, defaultType, defaultMaxWidth])



  useEffect(() => {
    setDroppedFiles((prev: DroppedFile[]) => {
      const { width, height } = file.dimensions
      const newFiles = [...prev]
      newFiles[index] = {
        ...newFiles[index],
        quality: quality,
        type: type,
        dimensions: {
          width: maxWidth
            ? maxWidth
            : width
            ? width
            : realDimensions.width,
          height: height,
        },
        realDimensions: {
          width: file.realDimensions.width,
          height: file.realDimensions.height,
        },
      }
      return newFiles
    })
  }, [])



  const editDroppedFiles = (key: string, value: string) => {
    setDroppedFiles((prev: DroppedFile[]) => {
      const newFiles = [...prev]
      if (key !== 'dimensions') {
        newFiles[index] = { ...newFiles[index], [key]: value }
      } else {
        newFiles[index].realDimensions.width = value
      }
      return newFiles
    })
    setIsDownloading(false)
  }


  const onChangeQuality = (value: string) => {
    setQuality(value)
    editDroppedFiles('quality', value)
    setTypeOfValue('')
  }


  const onChangeType = (value: string) => {
    setType(value)
    editDroppedFiles('type', value)
    setTypeOfValue('')
  }


  const onChangeWidth = (value: string) => {
    const width = value || realDimensions.width
    setMaxWidth(width)
    editDroppedFiles('dimensions', width)
    setTypeOfValue('')
  }


  const download = async () => {
    if (isDownloading || isDownloadingAll) return
    setIsDownloading(true)
    return new Promise((resolve) => {
      FileResizer.imageFileResizer(
        file.file,
        +maxWidth ? +maxWidth : +realDimensions.width,
        +realDimensions.height,
        type.toUpperCase(),
        +quality,
        0,
        (uri) => {
          resolve(uri)
        },
        'file'
      )
    })
      .then((uri) => {
        const link = document.createElement('a')
        link.href = URL.createObjectURL(uri as Blob)
        link.download = file.name.replace('.', '') + `.${type}`
        link.click()
        link.remove()
        setIsDownloading(false)
      })
      .catch((error) => {
        setIsDownloading(false)
        console.log(error)
      })
  }

  return (
    <div className={`file`} key={index}>
      <div className="file-img-container">
        <img
          src={URL.createObjectURL(file.file)}
          width={50}
          height={50}
          alt=""
        />
        <div>
          <p>{file.name}</p>
          <p className="size">{(file.size / (1024 * 1024)).toFixed(2)}MB</p>
        </div>
      </div>
      <div className="flex justify-center items-start gap-20">
        <div className="flex flex-col gap-2">
          <label htmlFor="img-quality">Quality</label>
          {
            <select
              style={{ color: 'black' }}
              value={quality}
              onChange={(e) => onChangeQuality(e.target.value)}
              className="block p-1 w-24 text-center"
              name="img-type"
              id="img-type"
            >
              {quality &&
                imageQualities.map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
            </select>
          }
        </div>

        <div className="text-center flex flex-col gap-2">
          <label htmlFor="img-type">Output</label>
          <select
            style={{ color: 'black' }}
            className="block  p-1 w-24 text-center"
            value={type}
            onChange={(e) => onChangeType(e.target.value)}
            name="img-type"
            id="img-type"
          >
            {imageTypes.map((type: string) => (
              <option key={type} value={type}>
                {type.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label>Max Width</label>
          <input
            style={{ color: 'black' }}
            type="number"
            className=" text-center p-1 border-2 border-black"
            min={1}
            maxLength={4}
            value={maxWidth}
            placeholder="Width"
            onChange={(e) => {
              onChangeWidth(e.target.value.slice(0, 5))
            }}
          />
        </div>

        <div className="file-btn">
          <button
            onClick={() => download()}
            disabled={isDownloading || isDownloadingAll}
            className={`btn btn-donwload border-2 px-4 py-2 rounded bg-green-500 text-white transition  disabled:bg-gray-400 disabled ${isDownloading || isDownloadingAll ? 'download-off' : ''}`}
          >
            Download
          </button>
        </div>

        <div className="file-btn">
          <button
            onClick={() => removeFile(file.index)}
            className="btn border-white  border-2 px-4 py-2 rounded bg-red-500 text-white transition hover:bg-red-200 hover:text-red-500"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  )
}

export default File
