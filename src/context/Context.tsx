import { createContext, useState } from "react";
import { DroppedFile } from "../types";



interface AppContextProps {
    droppedFiles:DroppedFile[] 
    typeOfDefaultValue:"QUALITY" | "TYPE" | "WIDTH" | "",
    setDroppedFiles:React.Dispatch<React.SetStateAction<DroppedFile[]>>,
    setTypeOfDefaultValue:React.Dispatch<React.SetStateAction<"QUALITY" | "TYPE" | "WIDTH" | "">>
}

const initialValues:AppContextProps = {
    droppedFiles:[],
    typeOfDefaultValue:"",
    setDroppedFiles: () => {},
    setTypeOfDefaultValue: () => {}
}

export const Context = createContext(initialValues)

export default function AppContext({children}:{children:React.ReactNode}){
    const [droppedFiles,setDroppedFiles] = useState<DroppedFile[]>([])
    const [typeOfDefaultValue,setTypeOfDefaultValue] = useState<"QUALITY" | "TYPE" | "WIDTH" | "">("")

    return (
            <Context value={{droppedFiles,typeOfDefaultValue,setDroppedFiles,setTypeOfDefaultValue}}>
                {children}
            </Context>
    )
}