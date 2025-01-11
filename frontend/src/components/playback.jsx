import { useContext } from "react";
import { SongContext } from "../utils/songContext";

const Playback = () => {
    const {
        songName, setSongName,
        songThumbnail, setSongThumbnail,
        songTrack,setSongTrack,
        isPlaying, setIsPlaying,
        artist, setArtist,
    } = useContext(SongContext)

    return (
        <div className="h-[75px] bg-black w-full absolute bottom-0 text-white">
            {songName}
        </div>
    );
}
 
export default Playback;