import { useContext } from "react";
import { SongContext } from "../utils/songContext";

const Playback = () => {
    const {name,setName,thumbnail,setThumbnail,track,setTrack,isPlaying,setIsplaying,artist,setArtist} = useContext(SongContext)
    return (
        <div className="h-[75px] bg-black w-full absolute bottom-0 text-white">
            
        </div>
    );
}
 
export default Playback;