export type DroppedFile = {
    file: File
    name: string
    size: number
    type: string
    quality: string
    index: number
    dimensions: {
      width: string
      height: string
    }
    realDimensions: {
      width: string
      height: string
    }
  }



 export  interface FileProps {
    file: DroppedFile
    index: number
    defaultType: string
    defaultQuality: string
    defaultMaxWidth: string
    isDownloadingAll: boolean,
    resetDefaultValues:()=>void
  }