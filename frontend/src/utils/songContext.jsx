import { createContext, useState } from "react";

export const SongContext = createContext()

export const SongProvider = ({children}) => {

    const [searchQuery, setSearchQuery] = useState("")

    const [songName, setSongName] = useState("")

    const [songThumbnail, setSongThumbnail] = useState("")

    const [songTrack,setSongTrack] = useState("")

    const [isPlaying, setIsPlaying] = useState(false)

    const [artist, setArtist] = useState("")

    return (
        <SongContext.Provider value={{
            searchQuery, setSearchQuery,
            songName, setSongName,
            songThumbnail, setSongThumbnail,
            songTrack,setSongTrack,
            isPlaying, setIsPlaying,
            artist, setArtist,
        }}>
            {children}
        </SongContext.Provider>
    )
}