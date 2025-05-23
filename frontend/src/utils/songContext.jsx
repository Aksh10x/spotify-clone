import { createContext, useState } from "react";

export const SongContext = createContext()

export const SongProvider = ({children}) => {

    const [searchQuery, setSearchQuery] = useState("")

    const [playingId, setPlayingId] = useState("")

    const [songName, setSongName] = useState("")

    const [songThumbnail, setSongThumbnail] = useState("")

    const [songTrack,setSongTrack] = useState("")

    const [isPlaying, setIsPlaying] = useState(false)

    const [artist, setArtist] = useState("")

    const [queue, setQueue] = useState([])

    const [currentIndex, setCurrentIndex] = useState(0)

    const [songHlsUrl, setSongHlsUrl] = useState("")

    return (
        <SongContext.Provider value={{
            playingId, setPlayingId,
            searchQuery, setSearchQuery,
            songName, setSongName,
            songThumbnail, setSongThumbnail,
            songTrack,setSongTrack,
            isPlaying, setIsPlaying,
            artist, setArtist,
            queue, setQueue,
            currentIndex, setCurrentIndex,
            songHlsUrl, setSongHlsUrl
        }}>
            {children}
        </SongContext.Provider>
    )
}