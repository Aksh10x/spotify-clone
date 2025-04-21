import { createContext, useState } from "react";

export const PlaylistContext = createContext()

export const PlaylistProvider = ({children}) => {
    const [deleted, setDeleted] = useState(false)

    return (
        <PlaylistContext.Provider value={{ deleted, setDeleted}}>
            {children}
        </PlaylistContext.Provider>
    )
}