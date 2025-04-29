import { createContext, useState } from "react";

export const SongContext = createContext()

export const SongProvider = ({children}) => {

    const [searchQuery, setSearchQuery] = useState("")

    const [songName, setSongName] = useState("")

    const [songThumbnail, setSongThumbnail] = useState("")

    const [songTrack,setSongTrack] = useState("")

    const [isPlaying, setIsPlaying] = useState(false)

    const [artist, setArtist] = useState("")

    const [queue, setQueue] = useState([])

    const [currentIndex, setCurrentIndex] = useState(0)

    return (
        <SongContext.Provider value={{
            searchQuery, setSearchQuery,
            songName, setSongName,
            songThumbnail, setSongThumbnail,
            songTrack,setSongTrack,
            isPlaying, setIsPlaying,
            artist, setArtist,
            queue, setQueue,
            currentIndex, setCurrentIndex
        }}>
            {children}
        </SongContext.Provider>
    )
}