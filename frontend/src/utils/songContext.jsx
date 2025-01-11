import { createContext, useState } from "react";

export const SongContext = createContext()

export const SongProvider = ({children}) => {

    const [searchQuery, setSearchQuery] = useState("")

    const [name, setName] = useState("")

    const [thumbnail, setThumbnail] = useState("")

    const [track,setTrack] = useState("")

    const [isPlaying, setIsPlaying] = useState(false)

    const [artist, setArtist] = useState("")

    return (
        <SongContext.Provider value={{
            searchQuery, setSearchQuery,
            name, setName,
            thumbnail, setThumbnail,
            track,setTrack,
            isPlaying, setIsPlaying,
            artist, setArtist,
        }}>
            {children}
        </SongContext.Provider>
    )
}